from django.urls import path
from .views import (
    SignupView,
    VerifyOTPView,
    ResendOTPView,
    SignInView,
    UserProfileView,
    AdminLoginView,
    StudentListView,
    TeacherListView,
    BlockUserView,
    UnblockUserView,
    RequestPasswordResetView,
    VerifyPasswordResetOTPView,
    ResetPasswordView,
    GoogleLoginView,
    LogoutView,
    VerifyTeacherView
)

urlpatterns = [
    path("signin/", SignInView.as_view(), name="signin"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify_otp"),
    path("resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("adminlogin/", AdminLoginView.as_view(), name="admin-login"),
    path("students/", StudentListView.as_view(), name="student-list"),
    path("teachers/", TeacherListView.as_view(), name="teacher-list"),
    path("block/<int:user_id>/", BlockUserView.as_view(), name="block-user"),
    path("unblock/<int:user_id>/", UnblockUserView.as_view(), name="unblock-user"),
    path('verify/<int:user_id>/', VerifyTeacherView.as_view(), name='verify-teacher'),
    path(
        "password-reset/request/",
        RequestPasswordResetView.as_view(),
        name="request-password-reset",
    ),
    path(
        "password-reset/verify-otp/",
        VerifyPasswordResetOTPView.as_view(),
        name="verify-password-reset-otp",
    ),
    path("password-reset/reset/", ResetPasswordView.as_view(), name="reset-password"),
    path("auth/social/google/", GoogleLoginView.as_view(), name="google-login"),
]
