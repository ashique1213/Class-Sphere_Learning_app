from rest_framework import serializers
from authentication.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'gender', 'dob', 'phone', 'profile_image', 'is_verified']
