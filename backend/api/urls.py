from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ItemListCreateView, ItemDetailView, me_view, RegisterView

urlpatterns = [
    # Auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User profile
    path("users/me/", me_view, name="me"),

    # Items
    path("items/", ItemListCreateView.as_view(), name="item_list_create"),
    path("items/<int:pk>/", ItemDetailView.as_view(), name="item_detail"),
]
