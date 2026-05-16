from django.urls import path

from .views import (
    CommentListCreateView,
    CommentDestroyView,
    CommentUpdateView
)

urlpatterns = [
    path(
        'posts/<int:post_pk>/',
        CommentListCreateView.as_view(),
        name='comment-list-create'
    ),

    path(
        '<int:pk>/',
        CommentDestroyView.as_view(),
        name='comment-destroy'
    ),

    path(
        '<int:pk>/edit/',
        CommentUpdateView.as_view(),
        name='comment-update'
    ),
]