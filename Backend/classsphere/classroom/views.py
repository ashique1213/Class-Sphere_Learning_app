from rest_framework.permissions import IsAuthenticated
from .models import Classroom, Student
from .serializers import ClassroomSerializer, StudentSerializer
from rest_framework import status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView


class ClassroomListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        teacher_username = request.query_params.get("teacher")
        if teacher_username:
            classrooms = Classroom.objects.filter(teacher__username=teacher_username)
        else:
            classrooms = Classroom.objects.all()
        
        serializer = ClassroomSerializer(classrooms, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ClassroomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(teacher=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClassroomDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, slug):
        return get_object_or_404(Classroom, slug=slug)
    
    def get(self, request, slug):
        classroom = self.get_object(slug)
        serializer = ClassroomSerializer(classroom)
        return Response(serializer.data)


class ClassroomUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        return get_object_or_404(Classroom, pk=pk, teacher=self.request.user)
    
    def put(self, request, pk):
        classroom = self.get_object(pk)
        serializer = ClassroomSerializer(classroom, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        classroom = self.get_object(pk)
        serializer = ClassroomSerializer(classroom, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClassroomDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        return get_object_or_404(Classroom, pk=pk, teacher=self.request.user)
    
    def delete(self, request, pk):
        classroom = self.get_object(pk)
        classroom.delete()
        return Response({"message": "Classroom deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class JoinClassView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        class_slug = request.data.get("class_id")
        
        if not class_slug:
            return Response({"error": "Class slug is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        classroom = get_object_or_404(Classroom, slug=class_slug)
        
        student, created = Student.objects.get_or_create(user=request.user)
        student.joined_classes.add(classroom)
        
        classroom_data = ClassroomSerializer(classroom).data
        
        return Response({"classroom": classroom_data}, status=status.HTTP_200_OK)


class JoinedClassesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        student, created = Student.objects.get_or_create(user=request.user)
        serializer = StudentSerializer(student)
        return Response(serializer.data["joined_classes"])
    
