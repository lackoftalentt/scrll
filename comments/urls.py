from django.urls import path
from .views import CommentListCreateView, CommentDestroyView

urlpatterns = [
    path('posts/<int:post_pk>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:pk>/', CommentDestroyView.as_view(), name='comment-destroy'),
]