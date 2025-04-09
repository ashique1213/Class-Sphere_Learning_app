# models.py
from django.db import models
from authentication.models import User
from cloudinary.models import CloudinaryField # type: ignore

class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name="chats")
    created_at = models.DateTimeField(auto_now_add=True)

    def get_other_participant(self, current_user):
        return self.participants.exclude(id=current_user.id).first()

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)  
    media = CloudinaryField('media', blank=True, null=True)
    media_type = models.CharField(max_length=20, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)