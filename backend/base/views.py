from decimal import Decimal, ROUND_HALF_UP

import stripe
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.files.storage import default_storage
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Order, Product, Review
from .serializers import (
    OrderSerializer,
    ProductSerializer,
    ReviewSerializer,
    UserSerializer,
    UserSerializerWithToken,
)

# ======================
# HELPERS
# ======================


def to_pence(amount):
    return int((Decimal(amount) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


# ======================
# AUTH / USERS
# ======================


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)
        self.fields['email'] = serializers.EmailField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not password:
            raise serializers.ValidationError({'password': 'This field is required.'})

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid email or password'})

        if not user.check_password(password):
            raise serializers.ValidationError({'detail': 'Invalid email or password'})

        data = super().validate({
            'username': user.username,
            'password': password,
        })

        user_data = UserSerializerWithToken(user).data
        for k, v in user_data.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return Response(
            {'detail': 'Name, email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'detail': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=name,
    )

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def loginUser(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return Response(
            {'detail': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    user = authenticate(username=user_obj.username, password=password)
    if user is None:
        return Response(
            {'detail': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()

        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()

        return Response(UserSerializerWithToken(user).data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = get_object_or_404(User, id=pk)
    user.delete()
    return Response('User deleted')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = get_object_or_404(User, id=pk)
    return Response(UserSerializer(user).data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = get_object_or_404(User, id=pk)

    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ======================
# PRODUCTS
# ======================


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    product = Product.objects.create(user=request.user)

    serializer = ProductSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)

    serializer = ProductSerializer(product, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getProducts(request):
    page = request.query_params.get('page', 1)
    category = request.query_params.get('category')
    product_type = request.query_params.get('type')

    products = Product.objects.all()

    if category:
        products = products.filter(category=category)

    if product_type:
        products = products.filter(productType=product_type)

    paginator = Paginator(products, 12)

    try:
        products_page = paginator.page(page)
    except PageNotAnInteger:
        products_page = paginator.page(1)
        page = 1
    except EmptyPage:
        products_page = paginator.page(paginator.num_pages) if paginator.num_pages else []
        page = paginator.num_pages or 1

    serializer = ProductSerializer(products_page, many=True)
    data = serializer.data

    for p in data:
        img = p.get('image', '')
        if img and img.startswith('/media/'):
            filename = img.split('/')[-1]
            p['image'] = f'/images/{filename}'

    return Response({
        'products': data,
        'page': int(page),
        'pages': paginator.num_pages,
    })


@api_view(['GET'])
def getProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    data = ProductSerializer(product).data

    img = data.get('image', '')
    if img and img.startswith('/media/'):
        filename = img.split('/')[-1]
        data['image'] = f'/images/{filename}'

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
@parser_classes([MultiPartParser, FormParser])
def uploadImage(request):
    file = request.FILES.get('image')

    if not file:
        return Response({'detail': 'No image provided'}, status=400)

    file_name = default_storage.save(f'products/{file.name}', file)
    return Response({'image': default_storage.url(file_name)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = get_object_or_404(Product, _id=pk)

    if product.review_set.filter(user=user).exists():
        return Response({'detail': 'Product already reviewed'}, status=400)

    serializer = ReviewSerializer(data={
        'user': user.id,
        'product': product._id,
        'name': user.first_name or user.username,
        'rating': request.data.get('rating'),
        'comment': request.data.get('comment', ''),
    })

    if serializer.is_valid():
        serializer.save()

        reviews = product.review_set.all()
        product.numReviews = reviews.count()
        product.rating = sum([r.rating for r in reviews]) / product.numReviews
        product.save()

        return Response({'detail': 'Review added'})

    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = get_object_or_404(Product, _id=pk)
    product.delete()
    return Response('Product deleted')


# ======================
# REVIEWS
# ======================


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteProductReview(request, pk, review_id):
    user = request.user
    product = get_object_or_404(Product, _id=pk)

    try:
        review = Review.objects.get(_id=review_id, product=product)
    except Review.DoesNotExist:
        return Response({'detail': 'Review not found'}, status=404)

    if review.user != user and not user.is_staff:
        return Response({'detail': 'Not authorised'}, status=401)

    review.delete()
    return Response({'detail': 'Review deleted'})


# ======================
# ORDERS
# ======================


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    return Response(OrderSerializer(orders, many=True).data)


# ======================
# ROUTES
# ======================


@api_view(['GET'])
def getRoutes(request):
    return Response([
        '/api/products/',
        '/api/products/<id>/',
        '/api/users/',
        '/api/users/profile/',
        '/api/users/login/',
    ])


# ======================
# STRIPE
# ======================


@api_view(['GET'])
def getStripeConfig(request):
    return Response({'publishableKey': settings.STRIPE_PUBLISHABLE_KEY})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPaymentIntent(request):
    if not settings.STRIPE_SECRET_KEY:
        return Response({'detail': 'Stripe not configured'}, status=500)

    stripe.api_key = settings.STRIPE_SECRET_KEY

    cart_items = request.data.get('cartItems', [])
    if not cart_items:
        return Response({'detail': 'Cart is empty'}, status=400)

    total = 0

    for item in cart_items:
        product = get_object_or_404(Product, _id=item.get('product'))
        qty = int(item.get('qty', 0))

        if qty <= 0:
            return Response({'detail': 'Invalid quantity'}, status=400)

        total += to_pence(product.price) * qty

    try:
        intent = stripe.PaymentIntent.create(
            amount=total,
            currency='gbp',
            automatic_payment_methods={'enabled': True},
            metadata={'user_id': request.user.id},
        )
    except stripe.error.StripeError as e:
        return Response({'detail': str(e)}, status=400)

    return Response({'clientSecret': intent['client_secret']})