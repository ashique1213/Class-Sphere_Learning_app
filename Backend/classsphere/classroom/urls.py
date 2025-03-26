from django.urls import path
from .views import ClassroomListCreateView, ClassroomDetailView,JoinClassView,JoinedClassesView,ClassroomUpdateView,ClassroomDeleteView,RemoveStudentView

urlpatterns = [
    path('classrooms/', ClassroomListCreateView.as_view(), name='classroom-list-create'),
    path('classrooms/<slug:slug>/', ClassroomDetailView.as_view(), name='classroom-detail'),
    path('classrooms/<int:pk>/update/', ClassroomUpdateView.as_view(), name='classroom-update'),
    path('classrooms/<int:pk>/delete/', ClassroomDeleteView.as_view(), name='classroom-delete'),
    path('join-class/', JoinClassView.as_view(), name="join-class"),
    path("joined-classes/", JoinedClassesView.as_view(), name="joined-classes"),
    path('classrooms/<slug:slug>/remove-student/', RemoveStudentView.as_view(), name='remove-student'),

]
 