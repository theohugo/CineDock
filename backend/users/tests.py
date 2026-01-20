from rest_framework.test import APITestCase


# English comments only
class AuthApiTest(APITestCase):
    def setUp(self):
        self.register_payload = {
            "username": "doe",
            "email": "doe@example.com",
            "password": "VerySecure123",
            "first_name": "John",
            "last_name": "Doe",
        }

    def test_register_login_and_me(self):
        res = self.client.post(
            "/api/auth/register/", self.register_payload, format="json"
        )
        self.assertEqual(res.status_code, 201)
        token = res.data["token"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        res = self.client.get("/api/auth/me/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data["user"]["username"], self.register_payload["username"]
        )

        res = self.client.patch(
            "/api/auth/me/",
            {"first_name": "Johnny"},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["user"]["first_name"], "Johnny")

        self.client.credentials()
        res = self.client.post(
            "/api/auth/login/",
            {
                "username": self.register_payload["username"],
                "password": self.register_payload["password"],
            },
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn("token", res.data)
