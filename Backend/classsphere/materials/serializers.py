from rest_framework import serializers
from .models import Material

class MaterialSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file = serializers.FileField(required=False) 

    class Meta:
        model = Material
        fields = ['id', 'classroom', 'teacher', 'topic', 'file', 'file_url', 'material_type', 'created_at']
        read_only_fields = ['teacher', 'created_at', 'classroom']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

    def validate(self, data):
        if not data.get('topic'):
            raise serializers.ValidationError("Topic is required")
        return data

    def create(self, validated_data):
        file = self.context.get('file')  
        if not file and not self.instance:  
            raise serializers.ValidationError("File is required")

        material = Material.objects.create(**validated_data)

        if file:
            material.file = file
            material.save()

        return material

    def update(self, instance, validated_data):
        file = self.context.get('file')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if file:
            instance.file = file

        instance.save()
        return instance