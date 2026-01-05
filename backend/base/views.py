from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Product
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

import stripe
from django.conf import settings


# ======================
# AUTH / USERS
# ======================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # We will authenticate with username internally
    username_field = 'username'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Remove username field requirement from the request
        # TokenObtainPairSerializer defines it by default
        self.fields.pop('username', None)

        # Add email field to the request
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

        # Now authenticate via SimpleJWT using username + password
        data = super().validate({
            'username': user.username,
            'password': password,
        })

        # add extra user info
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
        username=email,     # you’re using email as username (fine)
        email=email,
        password=password,
        first_name=name,
    )

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# ======================
# PRODUCTS
# ======================

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# ======================
# ROUTES (DEV)
# ======================

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/<id>/',
        '/api/users/',
        '/api/users/profile/',
        '/api/users/login/',
    ]
    return Response(routes)


# ======================
# STRIPE PAYMENT
# ======================

@api_view(['GET'])
def getStripeConfig(request):
    return Response({'publishableKey': settings.STRIPE_PUBLISHABLE_KEY})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPaymentIntent(request):
    """
    Creates a Stripe PaymentIntent based on server-trusted product prices.
    Expects: { cartItems: [{ product: <id>, qty: <int> }, ...] }
    """
    stripe.api_key = settings.STRIPE_SECRET_KEY

    data = request.data
    cart_items = data.get('cartItems', [])

    if not cart_items:
        return Response({'detail': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    # Server-side total calculation (prevents price tampering)
    total = 0
    for item in cart_items:
        product_id = item.get('product')
        qty = int(item.get('qty', 0))

        if not product_id or qty <= 0:
            return Response({'detail': 'Invalid cart item'}, status=status.HTTP_400_BAD_REQUEST)

        product = Product.objects.get(_id=product_id)

        # Convert Decimal -> cents safely
        total += int(product.price * 100) * qty

    # Optional: use GBP for UK
    intent = stripe.PaymentIntent.create(
        amount=total,
        currency='gbp',
        automatic_payment_methods={'enabled': True},
        metadata={'user_id': request.user.id},
    )

    return Response({'clientSecret': intent['client_secret']})

