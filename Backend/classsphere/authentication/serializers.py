from rest_framework import serializers
from authentication.models import User
from cloudinary.models import CloudinaryField # type: ignore

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'gender', 'dob', 'phone', 'place', 'profile_image', 'is_active']

    def to_representation(self, instance):
        """Modify the response to return Cloudinary URL instead of the CloudinaryResource object."""
        data = super().to_representation(instance)
        
        if instance.profile_image:
            # If profile_image is a CloudinaryResource object, convert to its URL (secure_url)
            profile_image_url = instance.profile_image.url if hasattr(instance.profile_image, 'url') else instance.profile_image
            data["profile_image"] = profile_image_url
        
        return data
