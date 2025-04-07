from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from authentication.models import User
from classroom.models import Classroom, Student
from subscription.models import SubscriptionPlan, UserSubscription, Transaction
from django.db.models import Count, Sum
from django.db.models import Q
from datetime import datetime, timedelta

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # User stats
        total_students = Student.objects.count()
        total_teachers = User.objects.filter(role='teacher').count()

        # Classroom stats
        total_classrooms = Classroom.objects.count()

        # Subscription stats
        total_subscriptions = UserSubscription.objects.count()
        active_subscriptions = UserSubscription.objects.filter(is_active=True).count()
        subscription_plans = SubscriptionPlan.objects.annotate(
            user_count=Count('usersubscription'),
            active_count=Count('usersubscription', filter=Q(usersubscription__is_active=True))
        ).values('name', 'price', 'user_count', 'active_count')

        # Transaction stats
        total_transactions = Transaction.objects.count()
        successful_transactions = Transaction.objects.filter(status='succeeded').count()
        failed_transactions = Transaction.objects.filter(status='failed').count()
        total_revenue = Transaction.objects.filter(status='succeeded').aggregate(total=Sum('amount'))['total'] or 0

        # Revenue by subscription plan
        revenue_by_plan = SubscriptionPlan.objects.annotate(
            total_earnings=Sum('transaction__amount', filter=Q(transaction__status='succeeded'))
        ).values('name', 'total_earnings')

        # Recent transactions (last 5)
        recent_transactions = Transaction.objects.order_by('-created_at')[:5].values(
            'transaction_id', 'amount', 'status', 'created_at', 'user__username'
        )

        # Subscription trend (last 30 days)
        last_30_days = datetime.now() - timedelta(days=30)
        subscription_trend = (
            UserSubscription.objects.filter(start_date__gte=last_30_days)
            .extra({'day': "date(start_date)"})
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        data = {
            'users': {
                'students': total_students,
                'teachers': total_teachers,
            },
            'classrooms': {
                'total': total_classrooms,
            },
            'subscriptions': {
                'total': total_subscriptions,
                'active': active_subscriptions,
                'plans': list(subscription_plans),
            },
            'transactions': {
                'total': total_transactions,
                'successful': successful_transactions,
                'failed': failed_transactions,
                'revenue': float(total_revenue),  # Convert Decimal to float for JSON
                'recent': list(recent_transactions),
                'revenue_by_plan': list(revenue_by_plan),  # New field
            },
            'subscription_trend': list(subscription_trend),
        }
        return Response(data)