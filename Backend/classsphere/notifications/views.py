from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Notification
from .serializers import NotificationSerializer
from .utils import create_notification

class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all notifications for the authenticated user"""
        notifications = Notification.objects.filter(user=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a test notification"""
        message = request.data.get('message', 'Test notification')
        notification = create_notification(
            user=request.user,
            message=message,
            notification_type='SUCCESS'
        )
        if notification:
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {'error': 'Failed to create notification'},
            status=status.HTTP_400_BAD_REQUEST
        )

class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Notification.objects.get(pk=pk, user=user)
        except Notification.DoesNotExist:
            return None

    def post(self, request, pk):
        """Mark a specific notification as read"""
        notification = self.get_object(pk, request.user)
        if not notification:
            return Response(
                {'error': 'Notification not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        notification.is_read = True
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

class NotificationClearView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Clear all notifications for the authenticated user"""
        notifications = Notification.objects.filter(user=request.user)
        notifications.delete()
        return Response(
            {'status': 'all notifications cleared'},
            status=status.HTTP_200_OK
        )