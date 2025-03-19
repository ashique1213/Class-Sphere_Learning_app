from rest_framework import serializers
from .models import Meeting, MeetingParticipant
from classroom.models import Classroom
from django.contrib.auth import get_user_model

User = get_user_model()

class MeetingParticipantSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = MeetingParticipant
        fields = ['user', 'joined_at']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email,
            "role": obj.user.role
        }

class MeetingSerializer(serializers.ModelSerializer):
    participants = serializers.SerializerMethodField()
    host = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  
    host_details = serializers.SerializerMethodField(read_only=True)  
    classroom = serializers.PrimaryKeyRelatedField(queryset=Classroom.objects.all())

    class Meta:
        model = Meeting
        fields = [
            'meeting_id', 'title', 'description', 'duration', 
            'is_one_to_one', 'created_at', 'is_active', 
            'host', 'host_details', 'classroom', 'participants'
        ]

    def get_host_details(self, obj):
        return {
            "id": obj.host.id,
            "username": obj.host.username,
            "email": obj.host.email,
            "role": obj.host.role
        }

    def get_participants(self, obj):
        filtered_participants = obj.participants.exclude(user__role="teacher")
        return MeetingParticipantSerializer(filtered_participants, many=True).data

        