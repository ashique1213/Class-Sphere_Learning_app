from django.urls import path
from .views import SignupView, VerifyOTPView,ResendOTPView,SignInView,UserProfileView,AdminLoginView,StudentListView,TeacherListView,BlockUserView,UnblockUserView

urlpatterns = [
    path('signin/', SignInView.as_view(), name='signin'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path("adminlogin/", AdminLoginView.as_view(), name="admin-login"), 
    path('students/', StudentListView.as_view(), name='student-list'),
    path('teachers/', TeacherListView.as_view(), name='teacher-list'),

    path('block/<int:user_id>/', BlockUserView.as_view(), name='block-user'),
    path('unblock/<int:user_id>/', UnblockUserView.as_view(), name='unblock-user'),

]
