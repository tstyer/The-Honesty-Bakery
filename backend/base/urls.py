from django.urls import path
from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    # ===== AUTH / USERS =====
    path('api/users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/profile/', views.getUserProfile, name='user-profile'),
    path('api/users/', views.registerUser, name='user-register'),
    path('api/users/admin/', views.getUsers, name='users'),


    # ===== PRODUCTS =====
    path('api/products/', views.getProducts, name='products'),
    path('api/products/<int:pk>/', views.getProduct, name='product'),

    # ===== ROUTES (DEV ONLY) =====
    path('api/', views.getRoutes, name='routes'),
]
