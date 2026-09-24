import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  UserCheck,
  Users,
  ClipboardList,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Calendar className="text-primary" size={26} />
        <span>LeavePortal</span>
      </div>

      <ul className="sidebar-menu">
        {isAdmin ? (
          <>
            <li className="sidebar-item">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/admin/leave-requests"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <ClipboardList size={18} />
                <span>Leave Requests</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/admin/employees"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Users size={18} />
                <span>Employees</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/admin/employee-leave-history"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <FileSpreadsheet size={18} />
                <span>Employee History</span>
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li className="sidebar-item">
              <NavLink
                to="/employee/dashboard"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/employee/apply-leave"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <CalendarPlus size={18} />
                <span>Apply Leave</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/employee/leave-history"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <History size={18} />
                <span>Leave History</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink
                to="/employee/profile"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <UserCheck size={18} />
                <span>My Profile</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="sidebar-footer text-muted small">
        <div className="d-flex align-items-center justify-content-between">
          <span>Logged in as</span>
          <span className="badge bg-dark border border-secondary text-white">
            {user?.role}
          </span>
        </div>
        <div className="mt-1 text-white-50 text-truncate">{user?.email}</div>
      </div>
    </aside>
  );
};

export default Sidebar;
