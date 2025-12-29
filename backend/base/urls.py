from django.urls import path
# Below sits in same folder, so .views
from .views import getRoutes, getProducts

urlpatterns = [
    path('api/', getRoutes, name='routes'),
    path('api/products/', getProducts, name='products'),
]