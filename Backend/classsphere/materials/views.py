from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Material
from .serializers import MaterialSerializer
from classroom.models import Classroom

class MaterialListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, classroom_slug):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            materials = Material.objects.filter(classroom=classroom)
            serializer = MaterialSerializer(materials, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, classroom_slug):
        print("Entered POST method")
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            if request.user != classroom.teacher:
                return Response({"error": "Only the teacher can add materials"}, status=status.HTTP_403_FORBIDDEN)

            # Get the file from request.FILES
            file = request.FILES.get('file')
            material_type = 'video' if file and 'video' in file.content_type else 'pdf'

            # Create a new dictionary for the form data (excluding the file)
            data = {
                'topic': request.data.get('topic'),
                'material_type': material_type,
            }

            # Pass the file in the context
            serializer = MaterialSerializer(data=data, context={'request': request, 'file': file})
            print("Serializer initial data:", serializer.initial_data)

            if serializer.is_valid():
                # Save the serializer with the teacher and classroom
                serializer.save(teacher=request.user, classroom=classroom)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Classroom.DoesNotExist:
            return Response({"error": "Classroom not found"}, status=status.HTTP_404_NOT_FOUND)
    
class MaterialDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, classroom_slug, pk):
        try:
            classroom = Classroom.objects.get(slug=classroom_slug)
            return Material.objects.get(classroom=classroom, pk=pk)
        except (Classroom.DoesNotExist, Material.DoesNotExist):
            return None

    def get(self, request, classroom_slug, pk):
        material = self.get_object(classroom_slug, pk)
        if material is None:
            return Response({"error": "Material not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = MaterialSerializer(material, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, classroom_slug, pk):
        material = self.get_object(classroom_slug, pk)
        if material is None:
            return Response({"error": "Material not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != material.teacher:
            return Response({"error": "Only the teacher can edit materials"}, status=status.HTTP_403_FORBIDDEN)
        
        # Create a mutable copy of request.data
        data = request.data.copy()
        
        # If a new file is uploaded, determine the material_type
        file = request.FILES.get('file')
        if file:
            data['material_type'] = 'video' if 'video' in file.content_type else 'pdf'
        # If no new file, retain the existing material_type (it’s already in the instance)
        
        serializer = MaterialSerializer(material, data=data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print("Serializer errors:", serializer.errors)  # Debug if needed
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, classroom_slug, pk):
        material = self.get_object(classroom_slug, pk)
        if material is None:
            return Response({"error": "Material not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != material.teacher:
            return Response({"error": "Only the teacher can delete materials"}, status=status.HTTP_403_FORBIDDEN)
        
        material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)