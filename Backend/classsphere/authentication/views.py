from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from authentication.models import User
from authentication.serializers import UserSerializer
from .models import OTP
from .utils import generate_otp, send_otp_email

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

        otp_code = generate_otp()

        OTP.objects.create(
            email=email,
            otp_code=otp_code,
            username=username,
            password=make_password(data['password']),
            role=role
        )

        send_otp_email(email, username, otp_code)

        return Response({'message': 'OTP sent to your email. Please verify to complete registration.'}, status=status.HTTP_201_CREATED)


class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        otp_code = request.data.get("otp")

        print("Received email:", email)
        print("Received OTP:", otp_code)

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            print("OTP found in DB:", otp_record.otp_code)
            print("OTP creation time:", otp_record.created_at)

            if str(otp_record.otp_code) != str(otp_code):
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

            if otp_record.is_expired():
                return Response({"error": "OTP expired. Request a new one."}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=otp_record.username,
                email=otp_record.email,
                password=make_password(otp_record.password),
                role=otp_record.role,
            )

            otp_record.is_verified = True
            otp_record.save()

            return Response({"message": "Email verified successfully! Account created."}, status=status.HTTP_201_CREATED)

        except OTP.DoesNotExist:
            return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Unexpected error:", str(e))
            return Response({"error": "Something went wrong. Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)