from django.urls import path
from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    # ===== AUTH / USERS =====
    path('api/users/login/', views.loginUser, name='user-login'),
    path('api/users/profile/', views.getUserProfile, name='user-profile'),
    path('api/users/', views.registerUser, name='user-register'),
    path('api/users/admin/', views.getUsers, name='users'),
    path('api/users/update/', views.updateUserProfile, name='user-update'),
    path('api/users/delete/<int:pk>/', views.deleteUser, name='user-delete'),
    path('api/users/<int:pk>/', views.getUserById, name='user'),
    path('api/users/update/<int:pk>/', views.updateUser, name='user-update'),

    # ===== PRODUCTS =====
    path('api/products/', views.getProducts, name='products'),
    path('api/products/<int:pk>/', views.getProduct, name='product'),
    path('api/upload/', views.uploadImage, name='image-upload'),
    path('api/products/<int:pk>/reviews/', views.createProductReview, name='create-product-review'),

    # ===== ROUTES (DEV ONLY) =====
    path('api/', views.getRoutes, name='routes'),

    # ===== STRIPE PAYMENT =====
    path('api/config/stripe/', views.getStripeConfig, name='stripe-config'),
    path('api/payments/create-payment-intent/', views.createPaymentIntent, name='create-payment-intent'),

]
