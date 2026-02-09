from django.test import TestCase
from django.urls import reverse

class BaseUrlsTest(TestCase):
    def test_home_url_returns_200(self):
        url = reverse('routes')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)