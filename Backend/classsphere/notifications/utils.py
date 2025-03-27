from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def create_notification(user, message, notification_type='INFO'):
    try:
        notification = Notification.objects.create(
            user=user,
            message=message,
            type=notification_type
        )

        # Send real-time notification via WebSocket
        channel_layer = get_channel_layer()
        group_name = f"user_{user.id}"
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',  # Matches the consumer method name
                'message': message,
                'notification_type': notification_type,
                'time_ago': 'just now',  # You can customize this
                'id': notification.id,  # Include the notification ID
                'is_read': notification.is_read  # Include is_read status
            }
        )

        return notification
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        return None