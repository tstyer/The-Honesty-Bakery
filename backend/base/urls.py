from django.urls import path
# Below sits in same folder, so .views
from .views import getRoutes

urlpatterns = [
    path('', getRoutes, name='get-routes'),
]