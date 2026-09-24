# Employee Leave Management System - Frontend

A modern, responsive, and intuitive React application for the Employee Leave Management System built with React 18, React Router 6, Axios, and Bootstrap 5.

## Features
- **Authentication & RBAC**:
  - Secure login with role-based routing (Employee vs. Admin).
  - Protected routes preventing unauthorized page access.
  - One-click demo credential autofill for fast testing and demonstrations.
- **Employee Portal**:
  - **Employee Dashboard**: Welcome card with personal metadata, total/used/remaining leave summary cards, and quick recent requests list.
  - **Apply Leave**: Interactive leave application form with live date-range calculation, leave type selector, reason validation, and client/server validation display.
  - **Leave History**: Filterable and searchable table of past leave submissions with status indicators (`PENDING`, `APPROVED`, `REJECTED`) and rejection notes.
  - **My Profile**: Comprehensive view of personal details, employment designation, department, and annual allowance stats.
- **Admin Portal**:
  - **Admin Dashboard**: Live statistical metrics (Total Employees, Pending, Approved, Rejected) and actionable pending approvals list.
  - **Leave Requests**: Comprehensive management table with search, status filters, and confirmation modals for approving and rejecting leaves.
  - **Employees Directory**: Complete directory of company employees with remaining leave metrics.
  - **Individual Employee History**: Detailed drill-down by employee with leave balance overview and action controls.

## Technologies Used
- **React.js 18**
- **Vite**
- **React Router DOM 6**
- **Axios** (with unified error interception)
- **Bootstrap 5 & Lucide Icons**

## Project Structure
```
src/
├── components/
│   ├── Navbar.jsx               # Top navigation bar with user profile & logout
│   ├── Sidebar.jsx              # Role-aware navigation sidebar
│   ├── Loading.jsx              # Reusable loading spinner
│   └── ProtectedRoute.jsx       # Route guard for role-based access
├── context/
│   └── AuthContext.jsx          # User authentication state & localStorage persistence
├── pages/
│   ├── Login.jsx                # Login page with validation & demo credentials
│   ├── employee/
│   │   ├── EmployeeDashboard.jsx
│   │   ├── EmployeeProfile.jsx
│   │   ├── ApplyLeave.jsx
│   │   └── LeaveHistory.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── Employees.jsx
│       ├── LeaveRequests.jsx
│       └── EmployeeLeaveHistory.jsx
├── services/
│   └── api.js                   # Centralized Axios API service
├── App.jsx                      # Main router and layout wrapper
├── main.jsx                     # Application bootstrap
└── index.css                    # Custom modern theme styling
```

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### Backend API Configuration
The frontend connects by default to `http://localhost:8080/api`. To change the URL, define an environment variable `VITE_API_URL` in `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```
