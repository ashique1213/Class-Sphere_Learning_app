import random

def generate_otp():
    """Generates a 6-digit numeric OTP."""
    return ''.join(random.choices("0123456789", k=6))