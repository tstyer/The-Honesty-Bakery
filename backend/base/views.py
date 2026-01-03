from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .products import products
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

from .models import Product
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data
 

@api_view(['GET'])
def getRoutes(request):
    Routes = [
        '/api/products/upload/',
        '/api/products/',
        'api/products/<id>/',
        'api/products/create/',
        'api/products/<id>/review/',
        'api/products/top/',
        'api/products/delete/<id>/',
        'api/products/update/<id>/',
    ]
    return Response(Routes)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True) # many=True because we want all users
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) # This makes sure only logged in users can access this route
def getUserProfile(request, pk):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

