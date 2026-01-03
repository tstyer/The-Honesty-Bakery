from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .products import products
from .serializers import ProductSerializer    

from .models import Product
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.username
        token['message'] = 'Hello World'
        # ...

        return token

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
