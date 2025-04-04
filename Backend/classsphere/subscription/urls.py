from django.urls import path
from .views import SubscriptionPlanListCreateView, SubscriptionPlanDetailView, SubscriptionPlanToggleActiveView,CheckUserSubscriptionView,CreatePaymentIntentView,ConfirmPaymentView

urlpatterns = [
    path('subscription/plans/', SubscriptionPlanListCreateView.as_view(), name='plan-list-create'),
    path('subscription/plans/<int:pk>/', SubscriptionPlanDetailView.as_view(), name='plan-detail'),
    path('subscription/plans/<int:pk>/toggle-active/', SubscriptionPlanToggleActiveView.as_view(), name='plan-toggle-active'),
    path('subscription/check-subscription/', CheckUserSubscriptionView.as_view(), name='check-subscription'),
    path('subscription/create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('subscription/confirm-payment/', ConfirmPaymentView.as_view(), name='confirm-payment'),
]