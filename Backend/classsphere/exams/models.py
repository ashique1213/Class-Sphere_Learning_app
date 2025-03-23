from django.db import models
from classroom.models import Classroom
from authentication.models import User

class Exam(models.Model):
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='exams')
    topic = models.CharField(max_length=255)
    description = models.TextField()
    timeout = models.CharField(max_length=50)
    end_date = models.DateField()
    marks = models.PositiveIntegerField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_exams')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.topic} - {self.classroom.name}"

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    options = models.JSONField()
    correct_answer = models.CharField(max_length=255)
    
    def __str__(self):
        return f"Question for {self.exam.topic}"
    

class ExamSubmission(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    answers = models.JSONField()  
    submitted_at = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ("student", "exam")