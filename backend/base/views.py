from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .products import products
from .serializers import ProductSerializer, UserSerializer

from .models import Product
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['username'] = self.user.username
        data['email'] = self.user.email

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
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getUserProfile(request, pk):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

