from django.urls import path
from .views import (
    NotificationListView,
    NotificationDetailView,
    NotificationClearView
)

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-as-read/', NotificationDetailView.as_view(), name='notification-mark-read'),
    path('notifications/clear/', NotificationClearView.as_view(), name='notification-clear'),
]