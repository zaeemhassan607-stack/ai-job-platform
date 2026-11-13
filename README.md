# AI Job Application Platform

A full-stack job application platform built with **React, FastAPI, SQLAlchemy, PostgreSQL, and AI integration**. The platform connects job seekers and employers through job posting, job searching, application management, and AI-powered resume features.

## 🚀 Features

### 1. User Authentication & Profile
- User registration and login
- JWT-based authentication
- Secure password hashing
- Protected routes and API endpoints
- View and update user profile
- Change password
- Delete user account
- Logout functionality

### 2. Job Management
- Create job postings
- View all available jobs
- View individual job details
- Update and delete own job postings
- Search jobs by keywords
- Filter jobs by title, company, and location
- Sort jobs by newest, title, company, and location
- Ascending and descending sorting
- Pagination

**Public access:** Users can browse jobs and view job details without logging in.

**Authenticated access:** Users must log in to post jobs, apply for jobs, and access protected features.

### 3. Application Management
- Apply for jobs
- Prevent duplicate applications
- Prevent applying to own job
- View personal applications
- View applications for jobs posted by the employer
- Update application status
- Withdraw applications
- Delete applications
- Sort and paginate applications

Application statuses:
- Pending
- Accepted
- Rejected
- Withdrawn

### 4. AI-Powered Features

#### AI Resume Analyzer
- Upload a PDF resume
- Extract resume text
- Generate a professional summary
- Identify technical skills
- Analyze education and work experience
- Identify strengths and missing skills
- Provide improvement suggestions

#### AI Resume–Job Matching
- Upload a resume and select a job
- Compare resume skills with job requirements
- Generate an estimated matching percentage
- Identify matched and missing skills
- Analyze relevant experience
- Provide improvement suggestions and a recommendation

#### AI Job Recommendations
- Upload a resume
- Analyze the candidate's skills and experience
- Recommend relevant jobs from available job postings
- Display matching percentages
- Explain why each job matches the candidate
- Filter out low-relevance recommendations

AI features use the Groq API with the `openai/gpt-oss-20b` model.

### 5. Validation & Error Handling
- Pydantic request validation
- Authentication and authorization checks
- File type validation
- PDF file size limit of 5 MB
- Empty or unreadable PDF validation
- Invalid input handling
- Resource-not-found handling
- Duplicate application prevention
- Invalid sorting and pagination handling

---

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- React Markdown
- Remark GFM

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- python-jose
- pwdlib
- python-dotenv
- Uvicorn
- pypdf

### Database & AI
- PostgreSQL
- Neon Database
- Groq API
- `openai/gpt-oss-20b`

---

## 📁 Project Structure

```text
AI-Job-Application-Platform/
│
├── Backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

*Note: Local environment files, virtual environments, and sensitive credentials should not be committed to GitHub.*

---

## 🔐 Authentication

The backend uses JWT (JSON Web Token) authentication.

After successful login, the API returns an access token. The frontend stores the token and sends it with requests to protected endpoints.

Authorization header:

```text
Authorization: Bearer <access_token>
```

JWT configuration:
- HS256 algorithm
- Secret key stored in environment variables
- 30-minute token expiration

---

## 🗄️ Database

The project uses **PostgreSQL hosted on Neon**, with SQLAlchemy ORM.

Main database models:

### User
- ID
- Name
- Email
- Hashed password

### Job
- ID
- Title
- Company
- Description
- Location
- User ID (job owner)

### Application
- ID
- User ID
- Job ID
- Application status

Relationships connect users with their job postings and applications, and jobs with their applications.

---

## 📌 Important API Endpoints

### Authentication & Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register user |
| POST | `/login` | Login |
| GET | `/me` | Get current user |
| PUT | `/users/update` | Update profile |
| PUT | `/users/password` | Change password |
| DELETE | `/users/delete` | Delete account |

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/jobs` | Create job |
| GET | `/jobs` | List, filter, sort and paginate jobs |
| GET | `/jobs/{job_id}` | Get job details |
| GET | `/jobs/search/{keyword}` | Search jobs |
| PUT | `/jobs/{job_id}` | Update own job |
| DELETE | `/jobs/{job_id}` | Delete own job |
| GET | `/jobs/{job_id}/applications` | View applications for own job |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| POST | `/applications` | Apply for job |
| GET | `/applications/{application_id}` | Get application |
| GET | `/users/applications` | Get own applications |
| PUT | `/applications/{application_id}` | Update application |
| DELETE | `/applications/{application_id}` | Delete application |

### AI Features

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/analyze-resume` | Analyze PDF resume |
| POST | `/ai/match-resume/{job_id}` | Match resume with a job |
| POST | `/ai/recommend-jobs` | Recommend relevant jobs |

---

## ⚙️ Environment Variables

### Backend

Create a `.env` file inside the Backend folder:

```env
database_url="your_neon_postgresql_connection_string"
secret_key="your_secret_key"
GROQ_API_KEY="your_groq_api_key"
```

### Frontend

Create a `.env` file inside the Frontend folder:

```env
VITE_API_URL="http://127.0.0.1:8000"
```

For deployment, configure the frontend API URL and backend environment variables using your hosting providers' environment settings.

**Important:** Never upload `.env` files, database credentials, JWT secrets, or API keys to GitHub.

---

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Job-Application-Platform
```

### 2. Backend Setup

Open the Backend folder:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the backend `.env` file using the variables described above.

Run the backend:

```bash
python -m uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend `.env` file:

```env
VITE_API_URL="http://127.0.0.1:8000"
```

Run the frontend:

```bash
npm run dev
```

Open the local frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

---

## 📚 API Documentation

FastAPI automatically generates interactive API documentation.

**Swagger UI**

```text
http://127.0.0.1:8000/docs
```

**ReDoc**

```text
http://127.0.0.1:8000/redoc
```

Swagger UI can be used to test API endpoints, authentication, job management, applications, and AI functionality.

---

## 🧪 Testing

The project has been tested through API and frontend workflows.

Testing includes:
- User registration and login
- JWT authentication
- Profile updates
- Job creation and retrieval
- Public job browsing after logout
- Job filtering, searching, sorting, and pagination
- Job updates and deletion
- Job applications
- Duplicate application prevention
- Application status management
- Application authorization
- PDF resume upload
- Resume analysis
- Resume–job matching
- AI job recommendations
- Invalid and oversized PDF handling
- Empty and unreadable PDF handling
- Error and empty-result states

---

## 🚀 Deployment

The backend is deployed on **Vercel**:

[AI Job Platform Backend](https://ai-job-platform-backend-livid.vercel.app)

The database is hosted on Neon PostgreSQL.

Configure the following environment variables in the deployment settings:
- `database_url`
- `secret_key`
- `GROQ_API_KEY`
- `VITE_API_URL` (frontend)

---

## 🎯 Learning Outcomes

This project helped practice:
- Full-stack web development
- React component architecture
- REST API development
- FastAPI
- SQLAlchemy ORM
- PostgreSQL database integration
- JWT authentication and authorization
- CRUD operations
- Filtering, searching, sorting, and pagination
- PDF processing
- AI API integration
- Prompt engineering
- Frontend and backend integration
- Deployment and environment configuration

---

## 👨‍💻 Author

**Zaeem Hassan**

BS Computer Science Student  
University of Sargodha

**Interests**
- Artificial Intelligence
- Machine Learning
- Backend Development
- Full-Stack Development
- AI Automation

---

## ⭐ Project Status

**Completed — Full-Stack AI Job Application Platform**

The platform includes user authentication, job management, application tracking, PostgreSQL database integration, and three AI-powered resume and job features.
