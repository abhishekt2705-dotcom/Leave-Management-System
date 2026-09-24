# Full-Stack Employee Leave Management System

A production-ready Full-Stack Employee Leave Management System built with **Spring Boot 3 (Java 17/21/25)**, **React.js 18 (Vite + Bootstrap 5)**, and **MySQL**.

---

## 🚀 Features

### 👤 Employee Portal
- **Dashboard**: Personal summary cards displaying Annual Leave Allowance, Consumed/Used Leaves, Remaining Leave Balance, and Pending Requests.
- **Apply for Leave**: Dynamic form with real-time day calculation, date-range validation, and balance checks.
- **Leave History**: Filterable and searchable table of past requests with real-time status badges (`PENDING`, `APPROVED`, `REJECTED`) and rejection notes.
- **Profile**: Comprehensive personal, department, designation, and contact information view.

### 🛡️ Admin Portal
- **Admin Dashboard**: Real-time statistical metrics (Total Staff, Pending Reviews, Approved, and Rejected counters) with quick approval action lists.
- **Leave Requests Review**: Complete table of all employee applications with interactive `[Approve]` and `[Reject]` actions (with optional rejection remarks modal).
- **Employee Directory**: Full staff list with remaining leave balances and direct access to individual employee histories.
- **Employee Onboarding**: Full modal form to register/onboard new employees with customizable initial leave allowance and department assignment.
- **Individual Leave Timeline**: Drill-down inspection per employee with status summaries and action history.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17+, Spring Boot 3.3.x, Spring Data JPA (Hibernate), Spring Web, Spring Validation |
| **Frontend** | React 18, Vite, React Router DOM 6, Axios, Bootstrap 5, Lucide Icons |
| **Database** | MySQL 8.x |
| **Build Tools** | Maven 3.9+, Node.js (npm) |

---

## 📂 Project Architecture

```
Leave-Management-System/
│
├── backend/
│   ├── src/main/java/com/example/leavemanagement/
│   │   ├── LeaveManagementApplication.java
│   │   ├── controller/          # REST API Controllers (Auth, Employee, Leave)
│   │   ├── service/             # Business Logic, Overlap & Balance Verification
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   ├── entity/              # Employee, LeaveRequest, Role, LeaveType, LeaveStatus
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── exception/           # Custom Exceptions & Central GlobalExceptionHandler
│   │   └── config/              # WebConfig (CORS Filter) & DataInitializer
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── src/test/java/           # Automated Unit & Service Tests
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, Loading, ProtectedRoute (RBAC)
│   │   ├── context/             # AuthContext (JWT/Session state & persistence)
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page with 1-click Demo credentials
│   │   │   ├── employee/        # Employee Dashboard, Apply, History, Profile
│   │   │   └── admin/           # Admin Dashboard, Employees, Approvals, History
│   │   ├── services/            # Axios API Client with Response Interceptor
│   │   ├── App.jsx              # App Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── database/
│   └── schema.sql               # MySQL DDL & Seed Schema
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### 1. Database Setup (MySQL)
Make sure MySQL is running on `localhost:3306`. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS leave_management;
```
Configure your credentials in `backend/src/main/resources/application.properties` if different from `root`/`root`.

---

### 2. Run Backend (Spring Boot)
```bash
cd backend
mvn clean test
mvn spring-boot:run
```
Backend starts on: `http://localhost:8080`

---

### 3. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on: `http://localhost:5173`

---

## 🔑 Default Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin123` |
| **Employee** | `employee@gmail.com` | `employee123` |

*(The login screen also provides 1-Click Demo autofill buttons for testing!)*

---

## 📑 REST API Documentation

### 1. Authentication
- `POST /api/auth/login` — Sign in and retrieve user session metadata.

### 2. Employees
- `POST /api/employees` — Onboard a new employee *(Admin)*.
- `GET /api/employees` — List all employees *(Admin)*.
- `GET /api/employees/{id}` — Get employee profile.
- `GET /api/employees/{id}/leave-balance` — Get leave allowance and balance breakdown.
- `GET /api/employees/{id}/leaves` — Get employee's leave history.

### 3. Leave Requests
- `POST /api/leaves` — Apply for a new leave.
- `GET /api/leaves` — List all leave requests *(Admin)*.
- `GET /api/leaves/employee/{employeeId}` — Get leaves of a specific employee.
- `PUT /api/leaves/{id}/approve` — Approve a pending leave and deduct balance *(Admin)*.
- `PUT /api/leaves/{id}/reject` — Reject a pending leave *(Admin)*.
- `GET /api/leaves/dashboard-stats` — Retrieve admin dashboard summary counts *(Admin)*.
