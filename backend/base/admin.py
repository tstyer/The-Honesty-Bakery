from django.contrib import admin
from .models import Product

# Register your models here.

# This will register the Product model created to the django admin
admin.site.register(Product)