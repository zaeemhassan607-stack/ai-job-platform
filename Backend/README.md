# AI Job Application Platform

A backend REST API for a job application platform built with **FastAPI, SQLAlchemy, SQLite, JWT Authentication, and Pydantic**.

The platform allows users to register and log in, create and manage job postings, search and filter jobs, apply for jobs, manage applications, and update their profile and password.

## 🚀 Features

### User & Authentication

* User registration
* Secure password hashing with `pwdlib`
* User login
* JWT-based authentication
* Protected API endpoints
* Get current authenticated user
* Update user profile
* Change password
* Delete user account
* Duplicate email prevention

### Job Management

* Create job postings
* Get a job by ID
* Update own job
* Delete own job
* View jobs with pagination
* Filter jobs by:

  * Title
  * Company
  * Location
* Sort jobs by:

  * Newest
  * Title
  * Company
  * Location
* Ascending and descending order
* Keyword-based job search
* Location-based search

### Application Management

* Apply for jobs
* Prevent users from applying to their own jobs
* Prevent duplicate applications
* View individual applications
* Applicants can view their own applications
* Job owners can view applications for their jobs
* Application pagination
* Sort applications by newest/oldest
* Application status management:

  * Pending
  * Accepted
  * Rejected
  * Withdrawn
* Applicants can withdraw applications
* Applicants can delete their applications

### Validation & Error Handling

* Pydantic request validation
* Email validation
* Minimum field length validation
* Pagination validation
* Invalid sort/order handling
* Authentication errors
* Authorization checks
* Resource-not-found handling
* Duplicate resource prevention

---

## 🛠️ Technologies Used

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **SQLite**
* **Pydantic**
* **JWT**
* **python-jose**
* **pwdlib**
* **python-dotenv**
* **Uvicorn**

---

## 📁 Project Structure

```text
AI-Job-Application-Platform/
│
├── venv/
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── database.db
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

> `venv/`, `.env`, and `database.db` are excluded from Git using `.gitignore`.

---

## 🔐 Authentication

The API uses **JWT (JSON Web Token)** authentication.

After successful login, the API returns an access token.

The token is then sent in the request header:

```text
Authorization: Bearer <access_token>
```

Protected endpoints verify the token before allowing access.

JWT configuration uses:

* Secret key stored in `.env`
* `HS256` algorithm
* 30-minute token expiration

---

## 🗄️ Database

The project uses **SQLite** with **SQLAlchemy ORM**.

The main database models are:

### User

Stores:

* ID
* Name
* Email
* Hashed password

### Job

Stores:

* ID
* Title
* Company
* Description
* Location
* Job owner

### Application

Stores:

* ID
* User ID
* Job ID
* Application status

### Relationships

```text
User
 ├── Jobs
 └── Applications

Job
 └── Applications

Application
 ├── User
 └── Job
```

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint | Description                    |
| ------ | -------- | ------------------------------ |
| POST   | `/users` | Register a new user            |
| POST   | `/login` | Login and receive JWT token    |
| GET    | `/me`    | Get current authenticated user |

### Users

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/users`          | Get current user    |
| PUT    | `/users/update`   | Update user profile |
| PUT    | `/users/password` | Change password     |
| DELETE | `/users/delete`   | Delete user account |

### Jobs

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/jobs`                  | Create a job          |
| GET    | `/jobs/{job_id}`         | Get job by ID         |
| GET    | `/jobs`                  | List/filter/sort jobs |
| GET    | `/jobs/search/{keyword}` | Search jobs           |
| PUT    | `/jobs/{job_id}`         | Update own job        |
| DELETE | `/jobs/{job_id}`         | Delete own job        |

### Applications

| Method | Endpoint                         | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| POST   | `/applications`                  | Apply for a job                 |
| GET    | `/applications/{application_id}` | Get application                 |
| GET    | `/users/applications`            | Get current user's applications |
| GET    | `/jobs/{job_id}/applications`    | Get applications for own job    |
| PUT    | `/applications/{application_id}` | Update application status       |
| DELETE | `/applications/{application_id}` | Delete application              |

---

## 🔎 Job Filtering & Search

The `/jobs` endpoint supports multiple filters.

Example query parameters:

```text
/jobs?title=Python
/jobs?company=Tech
/jobs?location=Lahore
```

Multiple filters can also be combined:

```text
/jobs?title=Python&location=Lahore
```

Sorting is also supported:

```text
/jobs?sort_by=title&order=asc
```

Available sort fields:

```text
title
company
location
```

Default sorting:

```text
newest
```

---

## 📄 Pagination

Job and application listing endpoints support pagination.

Example:

```text
/jobs?page=1&limit=10
```

The response includes:

* Total records
* Current page
* Page limit
* Total pages
* Returned records

Maximum page limit:

```text
50
```

---

## 🔍 Job Search

Jobs can be searched using keywords.

The search checks:

* Job title
* Description
* Location
* Company

Example:

```text
/jobs/search/Python
```

Location can also be added:

```text
/jobs/search/Python?location=Lahore
```

Search results can be sorted:

```text
/jobs/search/Python?sort=oldest
```

---

## 📝 Application Workflow

A typical application workflow is:

```text
User Registration
       ↓
Login
       ↓
Receive JWT Token
       ↓
Create / Search Jobs
       ↓
Apply for Job
       ↓
Application Status = Pending
       ↓
Job Owner Reviews Application
       ↓
Accepted / Rejected
```

Applicants can also withdraw a pending application.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
database_url="sqlite:///./database.db"
secret_key="your-secret-key"
```

The secret key should be kept private and should **never be committed to GitHub**.

---

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

```bash
cd AI-Job-Application-Platform
```

### 3. Create a virtual environment

```bash
python -m venv venv
```

### 4. Activate the virtual environment

Windows:

```bash
venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Create `.env`

Add:

```env
database_url="sqlite:///./database.db"
secret_key="your-secret-key"
```

### 7. Run the application

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

## 📚 API Documentation

FastAPI automatically provides interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

Swagger UI can be used to:

* Test endpoints
* Register users
* Login
* Authorize with JWT
* Create jobs
* Apply for jobs
* Test filters and pagination
* Test error handling

---

## 🧪 Testing

The API was tested using **FastAPI Swagger UI**.

Testing included:

* User registration
* Login
* JWT authentication
* Current user endpoint
* Job creation
* Job retrieval
* Job filtering
* Job searching
* Job sorting
* Pagination
* Job updating
* Job deletion
* Application creation
* Duplicate application prevention
* Own-job application prevention
* Application retrieval
* Application authorization
* Application status updates
* Application deletion
* User profile update
* Password change
* User deletion
* Invalid tokens
* Missing authentication
* Invalid pagination values
* Invalid sorting values
* Invalid application status
* Wrong password
* Duplicate email
* Invalid input validation
* Non-existing resources

Dependency verification was also performed using:

```bash
pip check
```

Result:

```text
No broken requirements found.
```

---

## 🔒 Security

The project follows several basic security practices:

* Passwords are stored as hashes rather than plain text.
* JWT secret key is stored in `.env`.
* `.env` is excluded from Git.
* Database file is excluded from Git.
* Protected endpoints require authentication.
* Users can only modify their own jobs.
* Users cannot apply to their own jobs.
* Duplicate applications are prevented.
* Application status changes are authorization-controlled.

---

## 🎯 Learning Goals

This project was built to practice real-world backend development concepts including:

* REST API development
* FastAPI
* Pydantic validation
* SQLAlchemy ORM
* Relational database design
* CRUD operations
* Authentication
* JWT
* Password hashing
* Authorization
* Relationships
* Filtering
* Searching
* Sorting
* Pagination
* Error handling
* Environment variables
* API testing

---

## 🚀 Future Improvements

Possible future improvements include:

* Frontend integration with React
* Role-based authentication
* Admin dashboard
* Job categories
* Resume upload
* AI-powered resume analysis
* AI job recommendations
* Email notifications
* Application tracking dashboard
* PostgreSQL support
* Database migrations with Alembic
* Automated tests with Pytest
* API deployment

---

## 👨‍💻 Author

**Zaeem Hassan**

BS Computer Science Student
University of Sargodha

Interested in:

* Artificial Intelligence
* Machine Learning
* Backend Development
* AI Automation
* Full-Stack Development

---

## ⭐ Project Status

**Completed — Backend API**

The project currently provides a functional backend for managing users, jobs, and job applications with JWT authentication, database integration, filtering, searching, sorting, pagination, validation, and authorization.
