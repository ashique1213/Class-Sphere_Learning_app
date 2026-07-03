# authentication/task.py
from celery import shared_task # type: ignore
from django.core.mail import send_mail
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task(bind=True, max_retries=3)
def send_otp_email_task(self, email, username, otp_code):
    """Sends OTP email with user details asynchronously."""
    subject = "Verify Your Email - OTP Code"
    message = f"Hello {username},\n\nYour OTP code is: {otp_code}. It will expire in 1 minutes.\n\nThank you!"
    
    try:
        send_mail(subject, message, "no-reply@classsphere.com", [email])
        logger.info(f"OTP email sent successfully to {email}")
    except Exception as exc:
        logger.error(f"Failed to send OTP email to {email}: {exc}")
        raise self.retry(exc=exc, countdown=60)