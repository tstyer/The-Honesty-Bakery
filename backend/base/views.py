from django.shortcuts import render
from django.http import JsonResponse
from .products import products

# Create your views here.

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
    return JsonResponse(Routes, safe=False)

def getProducts(request):
    return JsonResponse(products, safe=False)   

