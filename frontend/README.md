# XYZ AI — Intelligent School Assistant

XYZ AI is an AI-powered school management and assistance platform designed to connect **students and parents** with academic information through a simple web application.

The platform provides role-based dashboards, attendance tracking, parent-child monitoring, and an AI assistant for attendance-related questions and study guidance.

## Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Student and parent role-based access
* Protected dashboard routes
* Automatic redirection based on user role
* Secure logout functionality

### 🎓 Student Dashboard

Students can:

* View their attendance percentage
* View total attendance days
* View present and absent days
* Track attendance progress
* Access the XYZ AI Assistant
* Ask questions about attendance and studies

### 👨‍👩‍👦 Parent Dashboard

Parents can:

* View their linked child
* View the child's attendance
* View attendance percentage
* View total, present, and absent days
* Track attendance progress
* Access the XYZ AI Assistant
* Ask questions about their child's attendance and studies

### 🤖 XYZ AI Assistant

The AI assistant supports:

* Attendance-related queries
* Study guidance
* General academic questions
* Student-specific responses
* Parent-specific responses
* Role-aware responses using authenticated user information
* LLM-powered responses through Groq

### 🎤 Voice Interaction

The AI Assistant also supports:

* Speech-to-text input using browser speech recognition
* Voice-controlled AI queries
* Text-to-speech AI responses

> Browser speech recognition may depend on browser support and network availability.

## Technology Stack

### Frontend

* React
* React Router
* Vite
* Axios
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT Authentication
* Pydantic

### AI

* Groq LLM
* Browser Speech Recognition
* Browser Speech Synthesis

## Project Structure

```text
xyz-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai.py
│   │   │   ├── auth.py
│   │   │   ├── relationships.py
│   │   │   ├── security_test.py
│   │   │   └── users.py
│   │   │
│   │   ├── security/
│   │   │   ├── auth.py
│   │   │   └── permissions.py
│   │   │
│   │   ├── ai_service.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ParentDashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Application Flow

```text
                    ┌──────────────┐
                    │    Login     │
                    └──────┬───────┘
                           │
                 ┌─────────┴─────────┐
                 │                   │
             Student               Parent
                 │                   │
                 ▼                   ▼
        Student Dashboard     Parent Dashboard
                 │                   │
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  XYZ AI      │
                    │  Assistant   │
                    └──────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         Attendance     Study Help    LLM
           Queries       Guidance    Responses
```

## Authentication

The application uses JWT-based authentication.

After successful login:

1. The backend generates an access token.
2. The frontend stores the access token.
3. User information and role are stored locally.
4. React Router redirects the user to the appropriate dashboard.
5. Protected routes require authentication.

Students are redirected to:

```text
/dashboard
```

Parents are redirected to:

```text
/parent-dashboard
```

The AI Assistant is available at:

```text
/ai
```

## AI Architecture

The AI Assistant combines application data with LLM functionality.

For example, attendance questions are handled using authenticated student or parent information and attendance records from the database.

General academic questions can be passed to the LLM service.

```text
User
 │
 ▼
React AI Assistant
 │
 ▼
FastAPI /ai/ask
 │
 ├── Identify authenticated user
 │
 ├── Check user role
 │
 ├── Retrieve relevant attendance data
 │
 └── Generate appropriate response
          │
          ├── Application-based response
          │
          └── Groq LLM response
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/madhumitha15-git/xyz-ai.git
cd xyz-ai
```

### 2. Backend Setup

Create and activate a virtual environment:

```bash
cd backend
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthcare_db
GROQ_API_KEY=your_groq_api_key
```

**Never commit your `.env` file or API keys to GitHub.**

### 4. Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The FastAPI server will run on:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

## API Highlights

### Authentication

```text
POST /auth/login
```

### Student Attendance

```text
GET /attendance/student/{student_id}
```

### Parent-Child Relationships

```text
GET /relationships/my-children
```

### Parent Attendance

```text
GET /attendance/parent/{parent_id}/child/{child_id}
```

### AI Assistant

```text
POST /ai/ask
```

## Security

The project includes:

* JWT authentication
* Protected API routes
* Role-based access control
* Parent-child relationship validation
* Environment-based API credentials
* Frontend route protection

Secrets such as API keys and database passwords should always be stored in environment variables.

## Current Limitations

* Groq LLM functionality requires internet connectivity and a valid API key.
* Browser speech recognition depends on browser support and network availability.
* The current parent dashboard displays the first linked child when multiple children are associated with an account.
* This project is currently configured primarily for local development.

## Future Improvements

Possible future enhancements include:

* Teacher dashboard
* Multiple-child selection for parents
* Attendance trend charts
* Subject-wise academic analytics
* Notifications and alerts
* Assignment tracking
* AI-powered personalized study plans
* AI-generated attendance predictions
* Production deployment
* More advanced role-based permissions

## Author

**Madhumitha Tangella**

B.Tech — Computer Science and Engineering

GitHub:

https://github.com/madhumitha15-git

---

## Project Status

**XYZ AI is a functional full-stack AI school assistant prototype with student and parent dashboards, attendance management, authentication, and AI assistant integration.**
