from django.db import models
import uuid
from django.contrib.auth import get_user_model
from classroom.models import Classroom

User = get_user_model()

class Meeting(models.Model):
    meeting_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration = models.IntegerField(help_text="Duration in minutes")
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='meetings')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_meetings')
    is_one_to_one = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

class MeetingParticipant(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('meeting', 'user')

    def __str__(self):
        return f"{self.user.username} joined {self.meeting.title}"

