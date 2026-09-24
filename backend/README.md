# Employee Leave Management System - Backend

A clean, production-grade Spring Boot REST API for managing employee leaves, approvals, balances, and role-based workflows.

## Technology Stack
- **Java 17+ / Java 25**
- **Spring Boot 3.3.x**
  - Spring Web (RESTful APIs)
  - Spring Data JPA (Hibernate ORM)
  - Spring Validation (Jakarta Bean Validation)
- **Database**: MySQL 8.x (with automated DDL schema and DataInitializer)
- **Build Tool**: Maven

## Architecture & Package Structure
```
com.example.leavemanagement
├── controller/
│   ├── AuthController.java          # Login endpoints
│   ├── EmployeeController.java      # Profile, balance & staff endpoints
│   └── LeaveController.java         # Apply, list, approve & reject endpoints
├── service/
│   ├── AuthService.java             # Authentication logic
│   ├── EmployeeService.java         # Employee retrieval & balance query
│   └── LeaveService.java            # Leave validations & approval transactions
├── repository/
│   ├── EmployeeRepository.java      # JPA repository for Employees
│   └── LeaveRequestRepository.java  # JPA repository & overlap queries
├── entity/
│   ├── Employee.java                # Employee entity (OneToMany leaves)
│   ├── LeaveRequest.java            # Leave request entity
│   ├── LeaveType.java               # Enum: CASUAL, SICK, EARNED
│   ├── LeaveStatus.java             # Enum: PENDING, APPROVED, REJECTED
│   └── Role.java                    # Enum: EMPLOYEE, ADMIN
├── dto/
│   ├── LoginRequest.java            # Login payload DTO
│   ├── LoginResponse.java           # Login result DTO
│   ├── EmployeeResponse.java        # Employee response DTO
│   ├── LeaveRequestDto.java         # Leave application request DTO
│   ├── LeaveResponse.java           # Leave details response DTO
│   ├── LeaveBalanceResponse.java    # Balance details DTO
│   ├── AdminDashboardStats.java     # Admin statistics DTO
│   └── RejectRequestDto.java        # Rejection payload DTO
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── InsufficientLeaveException.java
│   ├── InvalidLeaveException.java
│   ├── OverlappingLeaveException.java
│   ├── InvalidCredentialsException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java  # Central @RestControllerAdvice
└── config/
    ├── WebConfig.java               # CORS configuration
    └── DataInitializer.java         # Seed sample employees & leaves
```

## Key Business Logic & Validation Rules
1. **Date Validation**: Start date cannot be after end date. Dates must be present.
2. **Leave Balance Validation**: Employee cannot apply for more days than their available `remaining_leave`.
3. **Overlapping Leave Validation**: Backend checks for date collisions with existing `PENDING` or `APPROVED` requests.
4. **Transactional Approval**:
   - Only `PENDING` leaves can be approved/rejected.
   - Upon `APPROVED`: Deducts leave days from employee's `remaining_leave` and increments `used_leave` within a database transaction.
   - Upon `REJECTED`: Leave status updated to `REJECTED` (with optional reason) without modifying employee balance.

## Default Credentials & Seed Data
| Role | Email | Password | Name | Department |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gmail.com` | `admin123` | System Admin | Human Resources |
| **EMPLOYEE** | `employee@gmail.com` | `employee123` | Abhishek Sharma | Engineering |
| **EMPLOYEE** | `priya@gmail.com` | `priya123` | Priya Patel | Product Design |
| **EMPLOYEE** | `rahul@gmail.com` | `rahul123` | Rahul Verma | Quality Assurance |

## REST API Endpoints

### 1. Authentication
- `POST /api/auth/login` - Authenticate user & return role and profile details.

### 2. Employee Endpoints
- `GET /api/employees/{id}` - Get employee profile.
- `GET /api/employees/{id}/leave-balance` - Get employee leave balance and pending counts.
- `GET /api/employees/{id}/leaves` - Get employee leave history.
- `GET /api/employees` - Get all employees (Admin).

### 3. Leave Management Endpoints
- `POST /api/leaves` - Apply for a new leave request.
- `GET /api/leaves` - Get all leave requests across the organization (Admin).
- `GET /api/leaves/employee/{employeeId}` - Get leave requests for a specific employee.
- `PUT /api/leaves/{id}/approve` - Approve a pending leave and deduct balance (Admin).
- `PUT /api/leaves/{id}/reject` - Reject a pending leave request (Admin).
- `GET /api/leaves/dashboard-stats` - Get dashboard statistical counters (Admin).

## Setup & Running Locally

### Prerequisites
- JDK 17+ (e.g. JDK 17, 21, or 25)
- Apache Maven 3.8+
- MySQL Server 8.x running on `localhost:3306`

### Database Setup
1. By default, `application.properties` connects to MySQL at `localhost:3306` with database name `leave_management`.
2. Configure credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/leave_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Alternatively, execute `database/schema.sql` in MySQL workbench or CLI.

### Build and Run
```bash
# Compile and run unit tests
mvn clean test

# Start the Spring Boot Application
mvn spring-boot:run
```
The server will start on `http://localhost:8080`.
