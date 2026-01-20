from rest_framework import serializers
from .models import Movie


# English comments only
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ["id", "name", "description", "image", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
