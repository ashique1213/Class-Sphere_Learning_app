from django.db import models
from classroom.models import Classroom
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField # type: ignore


User = get_user_model()

class Assignment(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='assignments')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments')
    topic = models.CharField(max_length=255)
    description = models.TextField()
    last_date = models.DateTimeField()
    total_marks = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.topic} - {self.classroom.name}"

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    file = CloudinaryField('submissions', resource_type='raw', folder="submissions")
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.username} - {self.assignment.topic}"