from rest_framework.permissions import IsAuthenticated
from .models import Classroom
from .serializers import ClassroomSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Classroom, Student

class ClassroomListCreateView(generics.ListCreateAPIView):
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_username = self.request.query_params.get("teacher")
        if teacher_username:
            return Classroom.objects.filter(teacher__username=teacher_username)
        return Classroom.objects.all()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class ClassroomDetailView(generics.RetrieveAPIView):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer
    permission_classes = [IsAuthenticated]  
    lookup_field = "slug"


class JoinClassView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        class_slug = request.data.get("class_id")

        if not class_slug:
            return Response({"error": "Class slug is required"}, status=status.HTTP_400_BAD_REQUEST)

        classroom = get_object_or_404(Classroom, slug=class_slug)

        student, created = Student.objects.get_or_create(user=request.user)
        student.joined_classes.add(classroom)

        classroom_data = ClassroomSerializer(classroom).data  # Serialize classroom

        return Response({"classroom": classroom_data}, status=status.HTTP_200_OK)



from rest_framework.views import APIView
from .serializers import StudentSerializer

class JoinedClassesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student, created = Student.objects.get_or_create(user=request.user)
        serializer = StudentSerializer(student)
        return Response(serializer.data["joined_classes"])
