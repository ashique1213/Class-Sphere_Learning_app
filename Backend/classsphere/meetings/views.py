from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Meeting, MeetingParticipant
from .serializers import MeetingSerializer
from rest_framework.permissions import IsAuthenticated
from classroom.models import Classroom

class CreateMeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        classroom = get_object_or_404(Classroom, slug=slug)
        data = request.data.copy()
        data['classroom'] = classroom.pk
        data['host'] = request.user.id
        print(data)  
        serializer = MeetingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMeetingView(APIView):
    def get(self, request, meeting_id):
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id)
            serializer = MeetingSerializer(meeting)
            return Response(serializer.data)
        except Meeting.DoesNotExist:
            return Response({"error": "Meeting not found"}, status=status.HTTP_404_NOT_FOUND)

class MeetingListView(APIView):
    def get(self, request, slug):
        classroom = get_object_or_404(Classroom, slug=slug)
        meetings = Meeting.objects.filter(classroom=classroom)
        serializer = MeetingSerializer(meetings, many=True)
        return Response(serializer.data)

class JoinMeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, meeting_id):
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id, is_active=True)
            participant, created = MeetingParticipant.objects.get_or_create(
                meeting=meeting,
                user=request.user
            )
            serializer = MeetingSerializer(meeting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response({"error": "Meeting not found or inactive"}, status=status.HTTP_404_NOT_FOUND)

class EndMeetingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, meeting_id):
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id, host=request.user)
            meeting.is_active = False
            meeting.save()
            serializer = MeetingSerializer(meeting)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response({"error": "Meeting not found or you are not the host"}, status=status.HTTP_403_FORBIDDEN)