from django.urls import path
from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    # ===== AUTH / USERS =====
    path('users/login/', views.loginUser, name='user-login'),
    path('users/profile/', views.getUserProfile, name='user-profile'),
    path('users/', views.registerUser, name='user-register'),
    path('users/admin/', views.getUsers, name='users'),
    path('users/update/', views.updateUserProfile, name='user-update'),
    path('users/delete/<int:pk>/', views.deleteUser, name='user-delete'),
    path('users/<int:pk>/', views.getUserById, name='user'),
    path('users/update/<int:pk>/', views.updateUser, name='user-update'),

    # ===== PRODUCTS =====
    path('products/', views.getProducts, name='products'),
    path('products/<int:pk>/', views.getProduct, name='product'),
    path('upload/', views.uploadImage, name='image-upload'),
    path('products/<int:pk>/reviews/', views.createProductReview, name='create-product-review'),
    path('products/delete/<int:pk>/', views.deleteProduct, name='product-delete'),
    path('products/create/', views.createProduct, name='product-create'),
    path('products/update/<int:pk>/', views.updateProduct, name='product-update'),


    # ===== ORDERS =====
    path('orders/', views.getOrders, name='orders'),



    # ===== ROUTES (DEV ONLY) =====
    path('', views.getRoutes, name='routes'),

    # ===== STRIPE PAYMENT =====
    path('config/stripe/', views.getStripeConfig, name='stripe-config'),
    path('payments/create-payment-intent/', views.createPaymentIntent, name='create-payment-intent'),

]
