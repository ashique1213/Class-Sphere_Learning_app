# authentication/task.py
from celery import shared_task # type: ignore
from django.core.mail import send_mail

@shared_task
def send_otp_email_task(email, username, otp_code):
    """Sends OTP email with user details asynchronously."""
    subject = "Verify Your Email - OTP Code"
    message = f"Hello {username},\n\nYour OTP code is: {otp_code}. It will expire in 1 minutes.\n\nThank you!"
    
    send_mail(subject, message, "no-reply@classsphere.com", [email])