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

        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

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

            return Response({"message": "Email verified successfully! Account created."}, status=status.HTTP_201_CREATED)

        except OTP.DoesNotExist:
            return Response({"error": "OTP not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Something went wrong. Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.utils import timezone

class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")
        print(f"Request to resend OTP for: {email}")

        # Check if OTP already exists and if it has expired or not
        try:
            otp_record = OTP.objects.filter(email=email, is_verified=False).latest("created_at")

            if otp_record.is_expired():
                otp_code = generate_otp()  
                otp_record.otp_code = otp_code
                otp_record.created_at = timezone.now()  # Reset the timestamp
                otp_record.save()

                send_otp_email(email, otp_record.username, otp_code) 

                return Response({"message": "OTP expired. New OTP sent to your email."}, status=status.HTTP_201_CREATED)

            # If OTP exists and is not expired, notify the user
            return Response({"error": "OTP already sent. Please check your email."}, status=status.HTTP_400_BAD_REQUEST)

        except OTP.DoesNotExist:
            # If no OTP record exists, generate and send a new OTP
            otp_code = generate_otp()
            otp_record = OTP.objects.create(email=email, otp_code=otp_code)

            # Send the new OTP to the email
            send_otp_email(email, otp_record.username, otp_code) 

            return Response({"message": "New OTP sent to your email."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": "Something went wrong. Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
