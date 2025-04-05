from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import SubscriptionPlanSerializer,UserSubscriptionSerializer,TransactionSerializer
from .models import SubscriptionPlan, UserSubscription,Transaction
from django.utils import timezone
from datetime import timedelta
import stripe # type: ignore
from django.conf import settings
from django.db.models import Count, Sum

stripe.api_key = settings.STRIPE_SECRET_KEY

class SubscriptionPlanListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated and request.user.is_staff:
            plans = SubscriptionPlan.objects.all()
        else:
            plans = SubscriptionPlan.objects.filter(is_deleted=False, is_active=True).order_by("id")
        
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        if SubscriptionPlan.objects.filter(name=request.data.get("name")).exists():
            return Response({"error": "Subscription plan already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SubscriptionPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionPlanDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return SubscriptionPlan.objects.get(pk=pk)
        except SubscriptionPlan.DoesNotExist:
            return None

    def get(self, request, pk, *args, **kwargs):
        plan = self.get_object(pk)
        if plan is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = SubscriptionPlanSerializer(plan)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk, *args, **kwargs):
        plan = self.get_object(pk)
        if plan is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubscriptionPlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionPlanToggleActiveView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return SubscriptionPlan.objects.get(pk=pk)
        except SubscriptionPlan.DoesNotExist:
            return None

    def patch(self, request, pk, *args, **kwargs):
        plan = self.get_object(pk)
        if plan is None:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        plan.is_active = not plan.is_active
        plan.save()
        serializer = SubscriptionPlanSerializer(plan)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CheckUserSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        active_subscription = UserSubscription.objects.filter(
            user=request.user,
            is_active=True,
            end_date__gte=timezone.now()
        ).first()
        if active_subscription:
            serializer = UserSubscriptionSerializer(active_subscription)
            return Response({"subscribed": True, "subscription": serializer.data}, status=status.HTTP_200_OK)
        return Response({"subscribed": False}, status=status.HTTP_200_OK)

class CreatePaymentIntentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        plan_id = request.data.get('plan_id')

        try:
            plan = SubscriptionPlan.objects.get(id=plan_id, is_active=True, is_deleted=False)

            # Check for existing active subscription and deactivate it
            active_subscription = UserSubscription.objects.filter(
                user=request.user,
                is_active=True,
                end_date__gte=timezone.now()
            ).first()
            if active_subscription:
                active_subscription.is_active = False
                active_subscription.save()

            if plan.price == 0:
                # Create subscription directly without payment
                end_date = timezone.now() + timedelta(days=plan.duration_days)
                subscription = UserSubscription.objects.create(
                    user=request.user,
                    plan=plan,
                    end_date=end_date,
                    is_active=True
                )
                return Response({
                    'message': 'Free plan activated successfully!',
                    'subscription': UserSubscriptionSerializer(subscription).data
                }, status=status.HTTP_200_OK)

            # Handle paid plans with Stripe
            intent = stripe.PaymentIntent.create(
                amount=int(plan.price * 100),  # Convert to cents
                currency='inr',
                metadata={'plan_id': plan.id, 'user_id': request.user.id},
            )
            return Response({
                'client_secret': intent.client_secret,
                'plan': SubscriptionPlanSerializer(plan).data
            }, status=status.HTTP_200_OK)

        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan not found."}, status=status.HTTP_404_NOT_FOUND)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        payment_intent_id = request.data.get('payment_intent_id')
        plan_id = request.data.get('plan_id')
        print("chk-6")
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if intent.status == 'succeeded':
                plan = SubscriptionPlan.objects.get(id=plan_id)
                ttransaction = Transaction.objects.create(
                    user=request.user,
                    subscription_plan=plan,
                    transaction_id=payment_intent_id,
                    amount=plan.price,
                    currency=intent.currency.upper(),
                    status='succeeded',
                )

                end_date = timezone.now() + timedelta(days=plan.duration_days)
                UserSubscription.objects.create(
                    user=request.user,
                    plan=plan,
                    end_date=end_date
                )
                return Response({"message": "Payment successful, subscription activated!"}, status=status.HTTP_200_OK)
            return Response({"error": "Payment not completed."}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan not found."}, status=status.HTTP_404_NOT_FOUND)
        

class UserSubscriptionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        subscriptions = UserSubscription.objects.filter(user=request.user).order_by('-start_date')
        serializer = UserSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserTransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,*args,**kwargs):
        transactions=Transaction.objects.filter(user=request.user).order_by("-created_at")
        serializer = TransactionSerializer(transactions,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)


class FinanceOverviewView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        transactions = Transaction.objects.all()
        if start_date:
            transactions = transactions.filter(created_at__gte=start_date)
        if end_date:
            transactions = transactions.filter(created_at__lte=end_date)

        transaction_serializer = TransactionSerializer(transactions, many=True)

        current_subscriptions = UserSubscription.objects.filter(
            is_active=True,
            end_date__gte=timezone.now()
        ).select_related('user', 'plan')
        subscription_serializer = UserSubscriptionSerializer(current_subscriptions, many=True)

        total_balance = transactions.filter(status='succeeded').aggregate(
            total=Sum('amount')
        )['total'] or 0

        most_subscribed = UserSubscription.objects.values('plan__name').annotate(
            count=Count('plan')
        ).order_by('-count').first()
        most_subscribed_plan = most_subscribed['plan__name'] if most_subscribed else "None"

        return Response({
            'transactions': transaction_serializer.data,
            'current_subscriptions': subscription_serializer.data,
            'total_balance': total_balance,
            'most_subscribed_plan': most_subscribed_plan,
        }, status=status.HTTP_200_OK)