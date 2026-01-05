from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Product
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken


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

