from rest_framework import serializers
from .models import SubscriptionPlan,UserSubscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'price', 'duration_days', 'is_active', 'is_deleted', 'created_at', 'updated_at']
    
    def validate_name(self, value):
        request = self.context.get("request")  
        instance = self.instance 

        if instance and instance.name == value:
            return value 
        
        if SubscriptionPlan.objects.filter(name=value).exists():
            raise serializers.ValidationError("Subscription plan already exists.")
        
        return value
    
class UserSubscriptionSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'plan', 'start_date', 'end_date', 'is_active']