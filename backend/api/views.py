from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets

from .models import Movie
from .serializers import MovieSerializer


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by("-created_at")
    serializer_class = MovieSerializer
