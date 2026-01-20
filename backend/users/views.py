from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    AuthResponseSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserResponseSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(
        request=RegisterSerializer,
        responses={status.HTTP_201_CREATED: AuthResponseSerializer},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"user": UserSerializer(user).data, "token": token.key},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    @extend_schema(request=LoginSerializer, responses=AuthResponseSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
            )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"user": UserSerializer(user).data, "token": token.key})


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    @extend_schema(responses=UserResponseSerializer)
    def get(self, request):
        return Response({"user": UserSerializer(request.user).data})

    @extend_schema(request=UserSerializer, responses=UserResponseSerializer)
    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"user": serializer.data})
