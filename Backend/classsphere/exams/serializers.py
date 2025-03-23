from rest_framework import serializers
from .models import Exam, Question, ExamSubmission
from authentication.serializers import UserSerializer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_answer']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'classroom', 'topic', 'description', 'timeout', 'end_date', 'marks', 'created_by', 'created_at', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        exam = Exam.objects.create(**validated_data)
        for question_data in questions_data:
            Question.objects.create(exam=exam, **question_data)
        return exam

    def update(self, instance, validated_data):
        instance.topic = validated_data.get('topic', instance.topic)
        instance.description = validated_data.get('description', instance.description)
        instance.timeout = validated_data.get('timeout', instance.timeout)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.marks = validated_data.get('marks', instance.marks)
        instance.save()

        questions_data = validated_data.get('questions', [])
        existing_question_ids = set(instance.questions.values_list('id', flat=True))
        incoming_question_ids = {q.get('id') for q in questions_data if q.get('id')}

        questions_to_delete = existing_question_ids - incoming_question_ids
        Question.objects.filter(id__in=questions_to_delete).delete()

        for question_data in questions_data:
            question_id = question_data.get('id')
            if question_id:
                try:
                    question = Question.objects.get(id=question_id, exam=instance)
                    question.question_text = question_data.get('question_text', question.question_text)
                    question.options = question_data.get('options', question.options)
                    question.correct_answer = question_data.get('correct_answer', question.correct_answer)
                    question.save()
                except Question.DoesNotExist:
                    Question.objects.create(exam=instance, **question_data)
            else:
                Question.objects.create(exam=instance, **question_data)

        instance.refresh_from_db()
        return instance

class ExamSubmissionSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = ExamSubmission
        fields = ['id', 'student', 'exam', 'answers', 'submitted_at', 'score']