from rest_framework import serializers

from .models import Movie, MovieReview


# English comments only
class MovieReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = MovieReview
        fields = [
            "id",
            "movie",
            "user",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "movie", "user", "created_at", "updated_at"]

    def get_user(self, obj):
        return {
            "id": obj.user_id,
            "username": obj.user.username,
        }


class MovieSerializer(serializers.ModelSerializer):
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Movie
        fields = [
            "id",
            "name",
            "description",
            "image",
            "average_rating",
            "reviews_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "average_rating",
            "reviews_count",
        ]
