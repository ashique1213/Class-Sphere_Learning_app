# materials/serializers.py
from rest_framework import serializers
from .models import Material

class MaterialSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Material
        fields = ['id', 'classroom', 'teacher', 'topic', 'file', 'file_url', 'material_type', 'created_at']
        read_only_fields = ['teacher', 'created_at', 'classroom']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url 
        return None

    def validate(self, data):
        if not data.get('file') and not self.instance:  # Only require file for creation
            raise serializers.ValidationError("File is required")
        return data