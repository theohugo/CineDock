from rest_framework.test import APITestCase


# English comments only
class MovieApiTest(APITestCase):
    def test_movie_crud(self):
        # Create
        res = self.client.post(
            "/api/movies/",
            {"name": "Interstellar", "description": "Space"},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        movie_id = res.data["id"]

        # List
        res = self.client.get("/api/movies/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(len(res.data) >= 1)

        # Retrieve
        res = self.client.get(f"/api/movies/{movie_id}/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["name"], "Interstellar")

        # Update
        res = self.client.patch(
            f"/api/movies/{movie_id}/",
            {"name": "Interstellar (Updated)"},
            format="json",
        )
        self.assertEqual(res.status_code, 200)

        # Delete
        res = self.client.delete(f"/api/movies/{movie_id}/")
        self.assertEqual(res.status_code, 204)
