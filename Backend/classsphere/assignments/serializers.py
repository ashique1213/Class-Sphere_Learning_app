from rest_framework import serializers
from .models import Assignment, Submission

class SubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()  # Add file URL

    class Meta:
        model = Submission
        fields = ['id', 'student', 'student_name', 'file', 'file_url', 'submitted_at', 'score']
        read_only_fields = ['student', 'submitted_at']

    def get_student_name(self, obj):
        return obj.student.username

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url  # Ensure direct Cloudinary file URL
        return None


class AssignmentSerializer(serializers.ModelSerializer):
    submissions = SubmissionSerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()
    submission_score = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ['id', 'classroom', 'teacher', 'topic', 'description', 'last_date', 'total_marks', 'created_at', 'submissions', 'file_url', 'submission_score']
        read_only_fields = ['teacher', 'created_at', 'submissions']

    def get_file_url(self, obj):
        if obj.submissions.exists():
            latest_submission = obj.submissions.filter(student=self.context['request'].user).order_by('-submitted_at').first()
            if latest_submission and latest_submission.file:
                return latest_submission.file.url
        return None

    def get_submission_score(self, obj):
        latest_submission = obj.submissions.filter(student=self.context['request'].user).order_by('-submitted_at').first()
        return latest_submission.score if latest_submission else None
