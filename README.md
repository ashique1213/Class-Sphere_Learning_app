# ClassSphere

ClassSphere is an advanced online learning management system designed to facilitate seamless interaction between teachers, students, and administrators. It provides a robust platform for managing classrooms, conducting meetings, handling assignments, exams, and enabling real-time communication through chat and video calls. The project leverages modern technologies to ensure scalability, security, and a user-friendly experience.

This is my second project, and I’m excited to build a comprehensive educational platform with features like JWT-based authentication, Cloudinary for media storage, Zego for video calls, and Stripe/PayPal for payments. Below is an overview of the project, its features, and setup instructions.

## Features

### Authentication & User Management
- **User Table & Authentication**:
  - Single user table with fields: `id`, `email`, `username`, `password`, `gender`, `dob`, `role` (teacher/student/admin).
  - JWT-based authentication for secure login, logout, and signup.
- **Forgot Password & Reset Password**:
  - Request password reset link via email.
  - OTP/token-based verification for secure password reset.
  - Change password with old password, new password, and confirmation.
- **User Profile Management**:
  - View and edit profile details (username, email, DOB, gender).
  - Admin CRUD operations for managing teachers and students.
  - Profile picture upload using Cloudinary.

### Classroom & Meeting System
- **Classroom Management (Teacher)**:
  - Create classes with fields: `name`, `subject`, `classroom code`, `start_date`, `end_date`, `max_participants`, `description`.
  - Invite students via shareable links.
  - List all created classrooms.
- **Student Classroom Management**:
  - Join classes using classroom code or link.
  - View class details (teacher, subject, assignments, materials, meetings).
  - List all joined classrooms.
- **Meetings & Auto Attendance**:
  - Create meetings with fields: `topic`, `description`, `date`, `time`.
  - Generate join links using Zego integration for video calls.
  - List past and upcoming meetings.
  - Auto attendance marking for students who join meetings.

### Study Materials, Assignments, Exams, Attendance
- **Study Materials Upload (Teacher)**:
  - Upload PDFs, DOCX, and videos, organized per class.
  - Students can view and download materials.
- **Assignments (CRUD for Teachers & Students)**:
  - Create assignments with `title`, `description`, `due_date`.
  - Students upload submissions in PDF format.
  - Teachers download and review submissions.
- **OMR-Based Exams**:
  - Teachers create MCQ-based OMR exams with timers.
  - Auto-grading with results showing correct/wrong answers.
  - Teachers view student performance.
- **Attendance Tracking**:
  - Manual attendance marking via checkboxes by teachers.
  - Auto attendance based on meeting presence.
  - Students view their attendance history.

### Payments, Chat, Reviews, Admin Panel
- **Chat System (Subscription-Based)**:
  - Real-time chat between teachers and students.
  - One-to-one video calls using Zego.
  - Restricted to paid users only.
- **Subscription Payment System**:
  - Teachers pay for premium features (e.g., chat access).
  - Students pay for messaging and video call access.
  - Stripe/PayPal integration for payments.
  - Transaction history with details: `Payment ID`, `User`, `Date`, `Amount`, `Status`.
- **Admin Panel**:
  - Manage users (enable/disable teachers and students).
  - View all transactions and subscription plans.
- **Teacher Reviews & Feedback**:
  - Teachers submit feedback about the platform.
  - Admin moderates and approves feedback.

## Tech Stack
- **Backend**: Django, Django REST Framework, PostgreSQL, Celery, Redis, Daphne (ASGI)
- **Frontend**: React, Tailwind CSS
- **Authentication**: JWT, Django Allauth (Google OAuth)
- **File Storage**: Cloudinary
- **Payments**: Stripe/PayPal
- **Video Calls**: Zego
- **Hosting**:
  - Backend: AWS
  - Database: PostgreSQL
  - Frontend: Vercel
- **Other Tools**: Docker, Gunicorn, Channels (for WebSockets)

## Prerequisites
- Python 3.13
- Node.js (for React frontend)
- Docker and Docker Compose
- PostgreSQL
- Redis
- Cloudinary, Stripe, Zego, and Google OAuth credentials
- AWS and Vercel accounts for deployment

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/classsphere.git
cd classsphere
```

### 2. Backend Setup
1. **Create and Activate Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the project root based on `.env.example`.
   - Add credentials for:
     - `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
     - Database: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
     - Email: `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
     - Cloudinary: `CLOUD_NAME`, `API_KEY`, `API_SECRET`
     - Stripe: `STRIPE_SECRET_KEY`
     - Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
     - Redis: `REDIS_HOST`, `REDIS_PORT`
     - Celery: `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`

4. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Start the Development Server**:
   ```bash
   python manage.py runserver
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory (e.g., `frontend/`):
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (e.g., `.env.local`):
   - Set API base URL and other frontend-specific configs.

4. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Docker Setup
1. Ensure Docker and Docker Compose are installed.
2. Build and run the services:
   ```bash
   docker-compose up --build
   ```
   - This starts the Django backend (Daphne), PostgreSQL, Redis, Celery, and Celery Beat.

### 5. Deployment
- **Backend (AWS)**:
  - Deploy Django API using Elastic Beanstalk or EC2.
  - Configure PostgreSQL on AWS RDS.
- **Frontend (Vercel)**:
  - Push the React app to a Git repository.
  - Connect to Vercel and deploy.
- **Database (PostgreSQL)**:
  - Host on AWS RDS or a managed PostgreSQL service.
- **Testing**:
  - Perform end-to-end testing for API and UI using tools like Postman and Cypress.

## Future Enhancements
- Add AI-powered analytics for student performance.
- Implement gamification for student engagement.
- Support multi-language content and accessibility features.

## License
This project is licensed under the MIT License.
