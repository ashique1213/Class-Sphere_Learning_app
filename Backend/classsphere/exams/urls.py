from django.urls import path
from .views import ExamListCreateView, ExamDetailView, ExamSubmissionView,StudentExamSubmissionsView,TeacherExamSubmissionsView

urlpatterns = [
    path('classrooms/<slug:slug>/exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:exam_id>/', ExamDetailView.as_view(), name='exam-detail'),
    path('exams/<int:exam_id>/submit/', ExamSubmissionView.as_view(), name='exam-submission'),
    path('classrooms/<slug:slug>/submissions/', StudentExamSubmissionsView.as_view(), name='student-submissions'),
    path('exams/<int:exam_id>/submissions/', TeacherExamSubmissionsView.as_view(), name='teacher-exam-submissions'),

]
