from django.urls import path
# Below sits in same folder, so .views
from . import views
from .views import getRoutes, getProducts, getProduct
from .views import MyTokenObtainPairView


urlpatterns = [
    path('/users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfile, name='user-profile'),
    path('users/', views.getUsers, name='users'),
    path('api/', getRoutes, name='routes'),
    path('api/products/', getProducts, name='products'),
    path('api/product/<int:pk>/', getProduct, name='product'),
]