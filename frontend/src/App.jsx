import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';

import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import LeaveRequests from './pages/admin/LeaveRequests';
import EmployeeLeaveHistory from './pages/admin/EmployeeLeaveHistory';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

// Root index redirect based on auth status
const RootRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return user.role === 'ADMIN' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/employee/dashboard" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <AppLayout>
                <EmployeeDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/apply-leave"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <AppLayout>
                <ApplyLeave />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leave-history"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <AppLayout>
                <LeaveHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMIN']}>
              <AppLayout>
                <EmployeeProfile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-requests"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AppLayout>
                <LeaveRequests />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AppLayout>
                <Employees />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employee-leave-history"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AppLayout>
                <EmployeeLeaveHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
