import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Shield, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-2">
        <h5 className="mb-0 fw-bold text-dark d-none d-sm-block">
          Employee Leave Management
        </h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 text-end">
          <div>
            <div className="fw-semibold text-dark fs-6">{user?.name}</div>
            <div className="text-muted small d-flex align-items-center gap-1 justify-content-end">
              {user?.role === 'ADMIN' ? (
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                  <Shield size={12} className="me-1 inline" /> Admin
                </span>
              ) : (
                <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                  <Briefcase size={12} className="me-1 inline" /> {user?.department || 'Employee'}
                </span>
              )}
            </div>
          </div>
          <div
            className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-primary fw-bold"
            style={{ width: 40, height: 40 }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 ms-2"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
