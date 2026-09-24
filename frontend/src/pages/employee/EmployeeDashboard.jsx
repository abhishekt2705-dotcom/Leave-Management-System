import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { employeeService, leaveService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [balanceData, leavesData] = await Promise.all([
        employeeService.getLeaveBalance(user.employeeId),
        leaveService.getEmployeeLeaves(user.employeeId),
      ]);
      setBalance(balanceData);
      setRecentLeaves(leavesData.slice(0, 5)); // Show 5 most recent requests
    } catch (err) {
      setError(err.customMessage || 'Failed to load dashboard details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.employeeId) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) return <Loading message="Loading employee dashboard..." />;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="status-badge approved">
            <CheckCircle2 size={13} /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="status-badge rejected">
            <XCircle size={13} /> Rejected
          </span>
        );
      default:
        return (
          <span className="status-badge pending">
            <Clock size={13} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            Welcome, {user?.name}
          </h3>
          <p className="text-muted mb-0 d-flex align-items-center gap-2">
            <span>Employee ID: <strong className="text-dark">{user?.employeeCode || `EMP-${user?.employeeId}`}</strong></span>
            <span>•</span>
            <span>Department: <strong className="text-dark">{user?.department || 'General'}</strong></span>
          </p>
        </div>
        <div>
          <Link to="/employee/apply-leave" className="btn btn-primary-custom shadow-sm">
            <PlusCircle size={18} />
            <span>Apply for Leave</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Leave Balance Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Total Allowance */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Leave</div>
              <h2 className="fw-bold text-dark mt-1 mb-0">{balance?.totalLeave ?? 20}</h2>
              <div className="text-muted small mt-1">Annual Allowance</div>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <Calendar size={26} />
            </div>
          </div>
        </div>

        {/* Used Leaves */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Used Leaves</div>
              <h2 className="fw-bold text-danger mt-1 mb-0">{balance?.usedLeave ?? 0}</h2>
              <div className="text-muted small mt-1">Days consumed</div>
            </div>
            <div className="stat-icon bg-danger bg-opacity-10 text-danger">
              <TrendingUp size={26} />
            </div>
          </div>
        </div>

        {/* Remaining Leaves */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', borderColor: '#bbf7d0' }}>
            <div>
              <div className="text-success small fw-semibold text-uppercase">Remaining Leaves</div>
              <h2 className="fw-bold text-success mt-1 mb-0">{balance?.remainingLeave ?? 20}</h2>
              <div className="text-muted small mt-1">Available balance</div>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <CheckCircle2 size={26} />
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Pending Leaves</div>
              <h2 className="fw-bold text-warning mt-1 mb-0">{balance?.pendingRequestsCount ?? 0}</h2>
              <div className="text-muted small mt-1">Awaiting approval</div>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <Clock size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests Section */}
      <div className="custom-card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">Recent Leave Requests</h5>
            <p className="text-muted small mb-0">Your latest submitted leave applications</p>
          </div>
          <Link to="/employee/leave-history" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <span>View Full History</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {recentLeaves.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Layers size={40} className="mb-2 text-secondary opacity-50" />
            <p className="mb-2">No leave requests found.</p>
            <Link to="/employee/apply-leave" className="btn btn-primary-custom btn-sm">
              Apply Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <span className="leave-type-badge">{req.leaveType} LEAVE</span>
                    </td>
                    <td className="fw-medium">{req.startDate}</td>
                    <td className="fw-medium">{req.endDate}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {req.numberOfDays} {req.numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '240px' }} title={req.reason}>
                      {req.reason}
                    </td>
                    <td>{getStatusBadge(req.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
