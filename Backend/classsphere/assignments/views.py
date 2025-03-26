from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from classroom.models import Classroom,Student
from django.utils import timezone
from notifications.utils import create_notification

class AssignmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_slug):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            assignments = Assignment.objects.filter(classroom=classroom)
            serializer = AssignmentSerializer(assignments, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, classroom_slug):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            if request.user != classroom.teacher:
                return Response({"error": "Only the teacher can add assignments"}, status=status.HTTP_403_FORBIDDEN)
            
            # Create a mutable copy of request.data and add classroom
            data = request.data.copy()
            data['classroom'] = classroom.id  # Add classroom ID to data
            
            serializer = AssignmentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                assignment = serializer.save(teacher=request.user, classroom=classroom)

                # Notify
                teacher_message = f"Assignment '{assignment.topic}' successfully added to {classroom.name}"
                create_notification(
                    user=request.user,
                    message=teacher_message,
                    notification_type='SUCCESS'
                )

                students = Student.objects.filter(joined_classes=classroom)
                student_message = f"New assignment '{assignment.topic}' added to {classroom.name}"
                for student in students:
                    create_notification(
                        user=student.user,
                        message=student_message,
                        notification_type='INFO'
                    )

                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)


class AssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, classroom_slug, pk):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            return Assignment.objects.get(classroom=classroom, pk=pk)
        except (Classroom.DoesNotExist, Assignment.DoesNotExist):
            return None

    def get(self, request, classroom_slug, pk):
        assignment = self.get_object(classroom_slug, pk)
        if assignment is None:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = AssignmentSerializer(assignment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, classroom_slug, pk):
        assignment = self.get_object(classroom_slug, pk)
        if assignment is None:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != assignment.teacher:
            return Response({"error": "Only the teacher can edit assignments"}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()
        data['classroom'] = assignment.classroom.id  # Ensure classroom is included
        serializer = AssignmentSerializer(assignment, data=data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, classroom_slug, pk):
        assignment = self.get_object(classroom_slug, pk)
        if assignment is None:
            return Response({"error": "Assignment not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != assignment.teacher:
            return Response({"error": "Only the teacher can delete assignments"}, status=status.HTTP_403_FORBIDDEN)
        
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SubmissionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, classroom_slug, assignment_id):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            assignment = Assignment.objects.get(classroom=classroom, pk=assignment_id)
            if timezone.now() > assignment.last_date:
                return Response({"error": "Submission deadline has expired"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = SubmissionSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(assignment=assignment, student=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except (Classroom.DoesNotExist, Assignment.DoesNotExist):
            return Response({"error": "Assignment or Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SubmissionUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, classroom_slug, assignment_id, submission_id):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            assignment = Assignment.objects.get(classroom=classroom, pk=assignment_id)
            return Submission.objects.get(assignment=assignment, pk=submission_id)
        except (Classroom.DoesNotExist, Assignment.DoesNotExist, Submission.DoesNotExist):
            return None

    def put(self, request, classroom_slug, assignment_id, submission_id):
        submission = self.get_object(classroom_slug, assignment_id, submission_id)
        if submission is None:
            return Response({"error": "Submission not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != submission.assignment.teacher:
            return Response({"error": "Only the teacher can update scores"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = SubmissionSerializer(submission, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)