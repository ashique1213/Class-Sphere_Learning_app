from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from authentication.models import User
from authentication.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import OTP,PasswordResetOTP
from rest_framework import generics
from .utils import generate_otp
from .tasks import send_otp_email_task
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser
import cloudinary # type: ignore
import cloudinary.uploader # type: ignore
import re
from dj_rest_auth.registration.views import SocialLoginView # type: ignore
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter # type: ignore
import requests # type: ignore
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.exceptions import TokenError
from django.shortcuts import get_object_or_404
from notifications.utils import create_notification


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role")
        if not email or not password or not role:
            return Response({"success": False,"error": "Email, password, and role are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(email=email, password=password)
            if user is None:
                return Response({"success": False,"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
            
            if not user.is_active:
                return Response({"success": False,"error": "Your account has been blocked. Please contact support."}, status=status.HTTP_403_FORBIDDEN)

            # Verify user role
            if user.role.lower() != role.lower():
                return Response({"success": False,"error": "Invalid role for this account."}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            is_active= user.is_active
            return Response({"success": True,
                "message": "Login successful.",
                "access_token": str(access_token),
                "refresh_token": str(refresh),
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "is_active": is_active
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"success": False,"error": f"Something went wrong. Try again! {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required_fields = ['username', 'email', 'password', 'role']

        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return Response({"success": False,'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        email = data['email'].strip().lower()
        role = data['role'].strip().lower()
        username = data['username'].strip()
        password = data['password'].strip()

        if role not in ['student', 'teacher', 'staff']:
            return Response({"success": False,'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"success": False,'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        email_regex = r'^\S+@\S+\.\S+$'
        if not re.match(email_regex, email):
            return Response({"success": False,'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
            return Response({"success": False,'error': 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores.'}, status=status.HTTP_400_BAD_REQUEST)

        password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$'
        if not re.match(password_regex, password):
            return Response({"success": False,'error': 'Password must be at least 6 characters long and include an uppercase, lowercase, number, and special character.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")
            otp_record.delete()
        except OTP.DoesNotExist:
            pass  

        otp_code = generate_otp()

        OTP.objects.create(
            email=email,
            otp_code=otp_code,
            username=username,
            password=password,
            role=role
        )

        send_otp_email_task.delay(email, username, otp_code)

        return Response({"success": True,'message': 'OTP sent to your email. Please verify.'}, status=status.HTTP_201_CREATED)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            # Check for OTP expiration
            if otp_record.is_expired():
                return Response({"success": False,"error": "OTP expired. Request a new one."}, status=status.HTTP_400_BAD_REQUEST)

            if str(otp_record.otp_code) != str(otp_code):
                return Response({"success": False,"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            # OTP verified successfully, create the user
            user = User.objects.create_user(
                username=otp_record.username,
                email=otp_record.email,
                password=otp_record.password,
                role=otp_record.role,
            )

            otp_record.is_verified = True
            otp_record.save()

            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response({"success": True,
                "message": "Email verified successfully! Account created.",
                "access_token": str(access_token),
                "refresh_token": str(refresh),
            }, status=status.HTTP_201_CREATED)

        except OTP.DoesNotExist:
            return Response({"success": False,"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"success": False,"error": f"Something went wrong. Try again! {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            if otp_record.is_expired():
                otp_code = generate_otp()  
                otp_record.otp_code = otp_code
                otp_record.created_at = timezone.now()  # Reset the timestamp
                otp_record.save()

                send_otp_email_task.delay(email, otp_record.username, otp_code) 

                return Response({"success": True,"message": "OTP expired. New OTP sent to your email."}, status=status.HTTP_201_CREATED)

            return Response({"success": False,"error": "OTP already sent. Please check your email."}, status=status.HTTP_400_BAD_REQUEST)

        except OTP.DoesNotExist:
            otp_code = generate_otp()
            otp_record = OTP.objects.create(email=email, otp_code=otp_code)

            send_otp_email_task.delay(email, otp_record.username, otp_code) 

            return Response({"success": True,"message": "New OTP sent to your email."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"success": False,"error": "Something went wrong. Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    permission_classes = [AllowAny]  

    def post(self, request, *args, **kwargs):
        role = request.data.get('role')
        is_signup = request.data.get('is_signup', False)
        
        access_token = request.data.get('access_token')
        if access_token and is_signup and role:
            try:
                # Fetch user info from Google to get email
                user_info_response = requests.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                if user_info_response.status_code == 200:
                    user_info = user_info_response.json()
                    email = user_info.get('email')
                    
                    # Check if user already exists with a different role
                    if email:
                        existing_user = User.objects.filter(email=email).first()
                        if existing_user:
                            # Get the existing user's role
                            existing_role = None
                            if hasattr(existing_user, 'role'):
                                existing_role = existing_user.role
                            elif hasattr(existing_user, 'profile') and hasattr(existing_user.profile, 'role'):
                                existing_role = existing_user.profile.role
                            elif existing_user.groups.exists():
                                existing_role = existing_user.groups.first().name
                            
                            if existing_role and existing_role != role:
                                return Response(
                                    {"error": f"Please use a different email or sign in with the correct role."},
                                    status=400
                                )
            except Exception as e:
                # Log the error but continue with social auth
                print(f"Error validating user role: {str(e)}")
                return None
        
        # Proceed with social auth
        response = super().post(request, *args, **kwargs)

        if 'access' in response.data:
            user = self.user
            if user:
                # For sign up or login, ensure role consistency
                current_role = None
                if hasattr(user, 'role'):
                    current_role = user.role
                elif hasattr(user, 'profile') and hasattr(user.profile, 'role'):
                    current_role = user.profile.role
                elif user.groups.exists():
                    current_role = user.groups.first().name
                
                if role and (not current_role or current_role == role):
                    if not current_role and role in ['student', 'teacher', 'staff']:
                        if hasattr(user, 'role'):
                            user.role = role
                            user.save()
                        elif hasattr(user, 'profile') and hasattr(user.profile, 'role'):
                            user.profile.role = role
                            user.profile.save()
                        else:
                            from django.contrib.auth.models import Group
                            user.groups.clear()
                            role_group, _ = Group.objects.get_or_create(name=role)
                            user.groups.add(role_group)
                            user.save()
                elif role and current_role and current_role != role:
                    return Response(
                        {"error": f"Please use a different email or sign in with the correct role."},
                        status=400
                    )
                
                refresh = RefreshToken.for_user(user)
                response.data["refresh"] = str(refresh) 
                response.data["access"] = str(refresh.access_token)
                
                # Include user data and role in the response
                response.data["user"] = {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "role": current_role or role or 'student',
                    "is_active": getattr(user, 'is_active', False)
                }
            else:
                return Response({"error": "User not found"}, status=400)

        return response
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the provided refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Get the user from the request (authenticated via access token)
            user = request.user

            # Blacklist all outstanding tokens for this user
            outstanding_tokens = OutstandingToken.objects.filter(user=user)
            for outstanding_token in outstanding_tokens:
                if not BlacklistedToken.objects.filter(token=outstanding_token).exists():
                    BlacklistedToken.objects.create(token=outstanding_token)

            return Response({"message": "Logged out successfully, all tokens invalidated"}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"error": f"Invalid refresh token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        """Return user details including Cloudinary image URL."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Update user details including profile image."""
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            if "profile_image" in request.FILES:
                image = request.FILES["profile_image"]

                public_id = f"profile_images/user_{user.id}"
                
                try:
                    upload_result = cloudinary.uploader.upload(
                        image,
                        public_id=public_id,
                        overwrite=True
                    )
                    serializer.validated_data["profile_image"] = upload_result["secure_url"]
                except Exception as e:
                    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"success": False, "error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"success": False, "error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        try:
            otp_record = PasswordResetOTP.objects.filter(email=email, is_verified=False).latest("created_at")
            otp_record.delete()
        except PasswordResetOTP.DoesNotExist:
            pass  

        otp_code = generate_otp()

        PasswordResetOTP.objects.create(email=email, otp_code=otp_code)

        send_otp_email_task.delay(email, user.username, otp_code)

        return Response({"success": True, "message": "OTP sent to your email."}, status=status.HTTP_200_OK)


class VerifyPasswordResetOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        if not email or not otp_code:
            return Response({"success": False, "error": "Email and OTP are required."},status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_record = PasswordResetOTP.objects.filter(email=email, is_verified=False).latest("created_at")

            if otp_record.is_expired():
                return Response(
                    {"success": False, "error": "OTP expired. Request a new one."},status=status.HTTP_400_BAD_REQUEST)

            if str(otp_record.otp_code) != str(otp_code):
                return Response({"success": False, "error": "Invalid OTP"},status=status.HTTP_400_BAD_REQUEST)

            otp_record.is_verified = True
            otp_record.save()

            return Response(
                {"success": True, "message": "OTP verified. Proceed to reset password."},status=status.HTTP_200_OK)

        except PasswordResetOTP.DoesNotExist:
            return Response(
                {"success": False, "error": "Invalid or expired OTP"},status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response({"success": False, "error": "Email and new password are required."},status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the latest verified OTP record
            otp_record = PasswordResetOTP.objects.filter(email=email, is_verified=True).latest("created_at")

            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()

            # Delete all OTP records for this email to prevent duplicates
            PasswordResetOTP.objects.filter(email=email).delete()

            return Response({"success": True, "message": "Password reset successful."},status=status.HTTP_200_OK)

        except PasswordResetOTP.DoesNotExist:
            return Response({"success": False, "error": "Invalid request. Please verify OTP first."},status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"success": False, "error": "User with this email does not exist."},status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(email=email, password=password)
        
        if user is None:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)

        if user.role not in ["admin","staff"]:
            return Response({"error": "Unauthorized access."}, status=status.HTTP_403_FORBIDDEN)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        return Response({
            "message": "Login successful.",
            "access_token": str(access_token),
            "refresh_token": str(refresh),
            "user": {
                "username": user.username,
                "email": user.email,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)
    

class StudentListView(generics.ListAPIView):
    queryset = User.objects.filter(role='student')
    serializer_class = UserSerializer


class TeacherListView(generics.ListAPIView):
    queryset = User.objects.filter(role='teacher')
    serializer_class = UserSerializer


class BlockUserView(APIView):
    permission_classes = [IsAdminUser]  

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if user.is_active: 
                user.is_active = False  
                user.save()
                return Response({"message": f"User {user.username} has been blocked."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": f"User {user.username} is already blocked."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


class UnblockUserView(APIView):
    permission_classes = [IsAdminUser]  

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if not user.is_active:  
                user.is_active = True  
                user.save()
                return Response({"message": f"User {user.username} has been unblocked."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": f"User {user.username} is already unblocked."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)



class VerifyTeacherView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can verify teachers

    def post(self, request, user_id):
        """Toggle verification status for a teacher."""
        teacher = get_object_or_404(User, id=user_id)

        if teacher.role != 'teacher':
            return Response({"message": "User is not a teacher"}, status=400)

        teacher.is_verified = not teacher.is_verified
        teacher.save()

        # Prepare notification message
        status_message = "Teacher verified" if teacher.is_verified else "Teacher unverified"
        notification_message = (
            f"Your teacher verification status has been updated. You are now "
            f"{'verified' if teacher.is_verified else 'unverified'}."
        )

        create_notification(
            user=teacher,
            message=notification_message,
            notification_type='INFO' if teacher.is_verified else 'WARNING'
        )

        status_message = "Teacher verified" if teacher.is_verified else "Teacher unverified"
        return Response({"message": status_message, "is_verified": teacher.is_verified})
