from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from authentication.models import User
from authentication.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import OTP
from .utils import generate_otp, send_otp_email
from django.utils import timezone

class SignInView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = authenticate(email=email, password=password)
            if user is None:
                return Response({"error": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            return Response({
                "message": "Login successful.",
                "access_token": str(access_token),
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"Something went wrong. Try again! {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class SignupView(APIView):
    def post(self, request):
        data = request.data
        required_fields = ['username', 'email', 'password', 'role']

        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

        email = data['email'].strip().lower()
        role = data['role'].strip().lower()
        username = data['username'].strip()

        if role not in ['student', 'teacher', 'staff']:
            return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

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
            password=data['password'],
            role=role
        )

        send_otp_email(email, username, otp_code)

        return Response({'message': 'OTP sent to your email. Please verify to complete registration.'}, status=status.HTTP_201_CREATED)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            # Check for OTP expiration
            if otp_record.is_expired():
                return Response({"error": "OTP expired. Request a new one."}, status=status.HTTP_400_BAD_REQUEST)

            if str(otp_record.otp_code) != str(otp_code):
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

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

            return Response({
                "message": "Email verified successfully! Account created.",
                "access_token": str(access_token),
            }, status=status.HTTP_201_CREATED)

        except OTP.DoesNotExist:
            return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Something went wrong. Try again! {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        print(f"Request to resend OTP for: {email}")

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            if otp_record.is_expired():
                otp_code = generate_otp()  
                otp_record.otp_code = otp_code
                otp_record.created_at = timezone.now()  # Reset the timestamp
                otp_record.save()

                send_otp_email(email, otp_record.username, otp_code) 

                return Response({"message": "OTP expired. New OTP sent to your email."}, status=status.HTTP_201_CREATED)

            return Response({"error": "OTP already sent. Please check your email."}, status=status.HTTP_400_BAD_REQUEST)

        except OTP.DoesNotExist:
            otp_code = generate_otp()
            otp_record = OTP.objects.create(email=email, otp_code=otp_code)

            send_otp_email(email, otp_record.username, otp_code) 

            return Response({"message": "New OTP sent to your email."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Something went wrong. Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
