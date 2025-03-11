from django.urls import path
from .views import ClassroomListCreateView, ClassroomDetailView,JoinClassView,JoinedClassesView

urlpatterns = [
    path('classrooms/', ClassroomListCreateView.as_view(), name='classroom-list-create'),
    path('classrooms/<slug:slug>/', ClassroomDetailView.as_view(), name='classroom-detail'),
    path('join-class/', JoinClassView.as_view(), name="join-class"),
    path("joined-classes/", JoinedClassesView.as_view(), name="joined-classes"),

]
