from rest_framework.test import APITestCase
from django.urls import reverse


class HealthTest(APITestCase):
    def test_health_endpoint(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "ok")
