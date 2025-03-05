from django.core.mail import send_mail
import random

def generate_otp():
    """Generates a 6-digit numeric OTP."""
    return ''.join(random.choices("0123456789", k=6))

def send_otp_email(email, username, otp_code):
    """Sends OTP email with user details."""
    subject = "Verify Your Email - OTP Code"
    message = f"Hello {username},\n\nYour OTP code is: {otp_code}. It will expire in 1 minutes.\n\nThank you!"
    
    send_mail(subject, message, "no-reply@classsphere.com", [email])
