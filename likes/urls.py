from django.urls import path
from .views import LikeToggleView

urlpatterns = [
    path('posts/<int:post_pk>/toggle/', LikeToggleView.as_view(), name='like-toggle'),
]