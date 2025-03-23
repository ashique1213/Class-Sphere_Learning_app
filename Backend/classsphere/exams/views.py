from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Exam, Question, ExamSubmission
from .serializers import ExamSerializer, ExamSubmissionSerializer
from classroom.models import Classroom

class ExamListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug):
        try:
            exams = Exam.objects.filter(classroom__slug=slug)
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, slug):
        try:
            classroom = Classroom.objects.get(slug=slug)
            if request.user != classroom.teacher:
                return Response(
                    {"error": "Only the classroom teacher can create exams"},
                    status=status.HTTP_403_FORBIDDEN
                )
            data = request.data.copy()
            data['classroom'] = classroom.id
            data['created_by'] = request.user.id
            serializer = ExamSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

class ExamDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, exam_id):
        try:
            return Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return None

    def get(self, request, exam_id):
        exam = self.get_object(exam_id)
        if not exam:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ExamSerializer(exam)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, exam_id):
        exam = self.get_object(exam_id)
        if not exam:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != exam.created_by:
            return Response(
                {"error": "Only the exam creator can edit it"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = ExamSerializer(exam, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, exam_id):
        exam = self.get_object(exam_id)
        if not exam:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != exam.created_by:
            return Response(
                {"error": "Only the exam creator can delete it"},
                status=status.HTTP_403_FORBIDDEN
            )
        exam.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ExamSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if student already submitted
        if ExamSubmission.objects.filter(student=request.user, exam=exam).exists():
            return Response(
                {"error": "You have already submitted this exam"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data.copy()
        data['student'] = request.user.id
        data['exam'] = exam.id

        # Calculate score
        answers = data.get('answers', {})
        questions = {q.id: q.correct_answer for q in exam.questions.all()}
        score = 0
        total_questions = len(questions)
        marks_per_question = exam.marks / total_questions if total_questions > 0 else 0

        for q_index, student_answer in answers.items():
            if int(q_index) in questions and student_answer == questions[int(q_index)]:
                score += marks_per_question

        data['score'] = round(score)

        serializer = ExamSubmissionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StudentExamSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, slug):
        try:
            classroom = Classroom.objects.get(slug=slug)
            submissions = ExamSubmission.objects.filter(student=request.user, exam__classroom=classroom)
            serializer = ExamSubmissionSerializer(submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
        

class TeacherExamSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, exam_id):
        try:
            # Ensure the exam exists
            exam = Exam.objects.get(id=exam_id)
            # Check if the user is a teacher and owns the classroom
            if request.user.role != 'teacher' or exam.classroom.teacher != request.user:
                return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
            
            # Fetch all submissions for this exam
            submissions = ExamSubmission.objects.filter(exam=exam)
            serializer = ExamSubmissionSerializer(submissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:
            return Response({"error": "Exam not found"}, status=status.HTTP_404_NOT_FOUND)