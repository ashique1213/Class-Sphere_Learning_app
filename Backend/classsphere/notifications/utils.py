from .models import Notification

def create_notification(user, message, notification_type='INFO'):
    try:
        notification = Notification.objects.create(
            user=user,
            message=message,
            type=notification_type
        )
        return notification
    except Exception as e:
        print(f"Error creating notification: {str(e)}")
        return None