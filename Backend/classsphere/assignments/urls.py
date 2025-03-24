from django.urls import path
from .views import AssignmentListCreateView, AssignmentDetailView, SubmissionCreateView, SubmissionUpdateView

urlpatterns = [
    path('assignments/<slug:classroom_slug>/', AssignmentListCreateView.as_view(), name='assignment-list-create'),
    path('assignments/<slug:classroom_slug>/<int:pk>/', AssignmentDetailView.as_view(), name='assignment-detail'),
    path('assignments/<slug:classroom_slug>/<int:assignment_id>/submit/', SubmissionCreateView.as_view(), name='submission-create'),
    path('assignments/<slug:classroom_slug>/<int:assignment_id>/submissions/<int:submission_id>/', SubmissionUpdateView.as_view(), name='submission-update'),
]