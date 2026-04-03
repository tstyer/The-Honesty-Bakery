from rest_framework import serializers
from .models import Product, Order, OrderItem, Review
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

    def validate_rating(self, value):
        if value is None:
            raise serializers.ValidationError('Rating is required.')
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Product name is required.')
        return value.strip()

    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError('Price is required.')
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

    def validate_countInStock(self, value):
        if value is None:
            raise serializers.ValidationError('Stock count is required.')
        if value < 0:
            raise serializers.ValidationError('Stock count cannot be negative.')
        return value

    def validate_productType(self, value):
        valid_types = [choice[0] for choice in Product.PRODUCT_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError('Invalid product type.')
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

    def validate_qty(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError('Quantity must be greater than 0.')
        return value

    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError('Price is required.')
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        return OrderItemSerializer(items, many=True).data

    def get_user(self, obj):
        if obj.user is None:
            return None
        return {
            '_id': obj.user.id,
            'name': obj.user.first_name or obj.user.email,
            'email': obj.user.email,
        }


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    _id = serializers.SerializerMethodField()
    isAdmin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        return obj.first_name or obj.email or obj.username

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)