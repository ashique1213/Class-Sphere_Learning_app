# authentaiction/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField # type: ignore
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff')
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    gender = models.CharField(max_length=10, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    place = models.CharField(max_length=50, blank=True, null=True)
    profile_image = CloudinaryField('profile_image', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return f"{self.username} ({self.email}) - {self.role}"

    class Meta:
        ordering = ['-created_at']


class OTP(models.Model):
    email = models.EmailField(unique=True)
    otp_code = models.CharField(max_length=6)
    username = models.CharField(max_length=150)
    password = models.CharField(max_length=128)  
    role = models.CharField(max_length=10, choices=User.ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        return self.created_at + timezone.timedelta(minutes=1) < timezone.now()

    def __str__(self):
        return f"{self.email} - {self.otp_code}"


class PasswordResetOTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    def is_expired(self):
        return timezone.now() - self.created_at > timezone.timedelta(minutes=10)