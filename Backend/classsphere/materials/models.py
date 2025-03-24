# materials/models.py
from django.db import models
from classroom.models import Classroom
from django.contrib.auth import get_user_model

User = get_user_model()

class Material(models.Model):
    MATERIAL_TYPES = (
        ('pdf', 'PDF'),
        ('video', 'Video'),
    )
    
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='materials')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='materials')
    topic = models.CharField(max_length=255)
    file = models.FileField(upload_to='materials/%Y/%m/%d/')
    material_type = models.CharField(max_length=10, choices=MATERIAL_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.topic} - {self.classroom.name}"