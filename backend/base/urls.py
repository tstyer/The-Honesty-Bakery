from django.urls import path
# Below sits in same folder, so .views
from .views import getRoutes, getProducts, getProduct
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path('api/users/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', getRoutes, name='routes'),
    path('api/products/', getProducts, name='products'),
    path('api/product/<int:pk>/', getProduct, name='product'),
]