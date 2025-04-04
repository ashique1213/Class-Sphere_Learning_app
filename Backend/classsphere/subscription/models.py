from django.db import models
from authentication.models import User

class SubscriptionPlan(models.Model):
    PLAN_CHOICES = (
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('premium', 'Premium'),
    )
    
    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"
    

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=255, unique=True) 
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=50, choices=[("succeeded", "Succeeded"), ("failed", "Failed")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.transaction_id} - {self.status}"