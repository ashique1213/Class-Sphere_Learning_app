from django.urls import path
from .views import SignupView, VerifyOTPView,ResendOTPView,SignInView,UserProfileView

urlpatterns = [
    path('signin/', SignInView.as_view(), name='signin'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
