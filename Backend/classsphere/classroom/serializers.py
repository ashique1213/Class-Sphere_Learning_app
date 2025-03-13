from rest_framework import serializers
from .models import Classroom,Student

 
class ClassroomSerializer(serializers.ModelSerializer):
    students = serializers.SerializerMethodField()
    teacher = serializers.CharField(source="teacher.username", read_only=True)

    def get_students(self, obj):
        return [{"id": s.user.id, "username": s.user.username,"email": s.user.email} for s in obj.students.all()]

    class Meta:
        model = Classroom
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    joined_classes = ClassroomSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = ['user', 'joined_classes']