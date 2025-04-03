from django.urls import path
from .views import ReviewCreateView, UserReviewView,AllReviewsView,AdminAllReviewsView,ApproveReviewView,DeleteReviewView

urlpatterns = [
    path('reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('reviews/user-review/', UserReviewView.as_view(), name='user-review'),
    path('reviews/all/', AllReviewsView.as_view(), name='all-reviews'),
    path('admin/reviews/', AdminAllReviewsView.as_view(), name='admin-all-reviews'),
    path('admin/reviews/approve/<int:review_id>/', ApproveReviewView.as_view(), name='approve-review'),
    path('admin/reviews/delete/<int:review_id>/', DeleteReviewView.as_view(), name='delete-review'),
]
