FROM python:3.13-slim

# Create appuser and app directory
RUN useradd -m -r appuser && mkdir /app && chown -R appuser /app

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Use non-root user
USER appuser

EXPOSE 8000

# For Daphne container (in docker-compose) we override CMD anyway
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "classsphere.wsgi:application"]
