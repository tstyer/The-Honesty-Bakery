from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User     

# This will turn it into json format to be sent to frontend
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    
    name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name']

    # self is seriliazer instance, obj is user instance
    def get_name(self, obj):
        name = obj.first_name
        # if no name set, use email
        if name == '':
            name = obj.email
        return name