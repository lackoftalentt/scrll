from django.urls import path

from .views import (
    MyPostsListView,
    PostListCreateView,
    PostRetrieveUpdateDestroyView
)

urlpatterns = [
    path(
        'me/',
        MyPostsListView.as_view()
    ),

    path(
        '',
        PostListCreateView.as_view()
    ),

    path(
        '<int:pk>/',
        PostRetrieveUpdateDestroyView.as_view()
    ),
]