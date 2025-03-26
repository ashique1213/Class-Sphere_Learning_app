from django.db import models
from authentication.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=50,
        choices=[
            ('INFO', 'Information'),
            ('WARNING', 'Warning'),
            ('ERROR', 'Error'),
            ('SUCCESS', 'Success')
        ],
        default='INFO'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.message}"