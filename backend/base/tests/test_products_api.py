from django.test import TestCase
from django.urls import reverse

class ProductsApiTest(TestCase):
    def test_products_endpoint_returns_200(self):
        url = reverse('products')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)