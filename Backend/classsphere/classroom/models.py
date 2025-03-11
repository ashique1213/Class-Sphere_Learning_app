from django.db import models
from django.utils.text import slugify
from authentication.models import User
import uuid  

class Classroom(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    max_participants = models.PositiveIntegerField()
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='classrooms')
    
    slug = models.SlugField(unique=True, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            unique_id = str(uuid.uuid4())[:8]  # Generate a short unique identifier
            self.slug = slugify(f"{self.name}-{unique_id}")  # Create slug from name + unique ID
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (Teacher: {self.teacher.username})"

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    joined_classes = models.ManyToManyField(Classroom, related_name="students")

    def __str__(self):
        return self.user.username