import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveService, employeeService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [statsData, allLeaves] = await Promise.all([
        leaveService.getDashboardStats(),
        leaveService.getAllLeaves(),
      ]);
      setStats(statsData);
      setPendingRequests(allLeaves.filter((l) => l.status === 'PENDING').slice(0, 5));
    } catch (err) {
      setError(err.customMessage || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this leave request? Leave balance will be deducted.')) {
      return;
    }

    try {
      setProcessingId(id);
      setError('');
      await leaveService.approveLeave(id);
      setActionSuccess('Leave request approved successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchDashboardData();
    } catch (err) {
      setError(err.customMessage || 'Failed to approve leave request.');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedLeaveId) return;

    try {
      setProcessingId(selectedLeaveId);
      setError('');
      await leaveService.rejectLeave(selectedLeaveId, rejectionReason);
      setRejectModalOpen(false);
      setActionSuccess('Leave request rejected successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchDashboardData();
    } catch (err) {
      setError(err.customMessage || 'Failed to reject leave request.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Loading message="Loading admin dashboard..." />;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Administrator Dashboard</h3>
          <p className="text-muted mb-0">Overview of leave requests, employee balances, and approvals</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/leave-requests" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
            <ClipboardList size={16} /> All Leave Requests
          </Link>
          <Link to="/admin/employees" className="btn btn-primary-custom btn-sm">
            <Users size={16} /> View Employees
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <CheckCircle2 size={20} />
          <div>{actionSuccess}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Admin Stat Cards */}
      <div className="row g-3 mb-4">
        {/* Total Employees */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Total Employees</div>
              <h2 className="fw-bold text-dark mt-1 mb-0">{stats?.totalEmployees ?? 0}</h2>
              <div className="text-muted small mt-1">Active staff</div>
            </div>
            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
              <Users size={26} />
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', borderColor: '#fef3c7' }}>
            <div>
              <div className="text-warning small fw-semibold text-uppercase">Pending Requests</div>
              <h2 className="fw-bold text-warning mt-1 mb-0">{stats?.pendingRequests ?? 0}</h2>
              <div className="text-muted small mt-1">Requires review</div>
            </div>
            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
              <Clock size={26} />
            </div>
          </div>
        </div>

        {/* Approved Requests */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Approved Requests</div>
              <h2 className="fw-bold text-success mt-1 mb-0">{stats?.approvedRequests ?? 0}</h2>
              <div className="text-muted small mt-1">Leaves granted</div>
            </div>
            <div className="stat-icon bg-success bg-opacity-10 text-success">
              <CheckCircle2 size={26} />
            </div>
          </div>
        </div>

        {/* Rejected Requests */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm border-0">
            <div>
              <div className="text-muted small fw-semibold text-uppercase">Rejected Requests</div>
              <h2 className="fw-bold text-danger mt-1 mb-0">{stats?.rejectedRequests ?? 0}</h2>
              <div className="text-muted small mt-1">Leaves declined</div>
            </div>
            <div className="stat-icon bg-danger bg-opacity-10 text-danger">
              <XCircle size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests for Action */}
      <div className="custom-card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">Pending Leave Approvals</h5>
            <p className="text-muted small mb-0">Requests waiting for administrative review and balance deduction</p>
          </div>
          <Link to="/admin/leave-requests" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <span>View All ({stats?.pendingRequests ?? 0})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <CheckCircle2 size={40} className="mb-2 text-success opacity-50" />
            <p className="mb-0 fw-medium">All caught up! No pending leave requests to review.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="fw-bold text-dark">{req.employeeName}</div>
                      <div className="text-muted small">
                        {req.employeeCode} • {req.department}
                      </div>
                    </td>
                    <td>
                      <span className="leave-type-badge">{req.leaveType}</span>
                    </td>
                    <td>
                      <div className="fw-medium">{req.startDate}</div>
                      <div className="text-muted small">to {req.endDate}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {req.numberOfDays} {req.numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td style={{ maxWidth: '240px' }} title={req.reason}>
                      <div className="text-truncate">{req.reason}</div>
                    </td>
                    <td>
                      <span className="status-badge pending">
                        <Clock size={12} /> Pending
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          onClick={() => handleApprove(req.id)}
                          disabled={processingId === req.id}
                          className="btn-success-sm"
                          title="Approve Leave"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(req.id)}
                          disabled={processingId === req.id}
                          className="btn-danger-sm"
                          title="Reject Leave"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-danger d-flex align-items-center gap-2">
                  <XCircle size={20} /> Reject Leave Request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRejectModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="text-muted small mb-3">
                  Please provide an optional reason for rejecting this leave request. The employee will be able to see this reason in their leave history.
                </p>
                <div className="mb-3">
                  <label className="form-label-custom">Rejection Reason / Notes</label>
                  <textarea
                    className="form-control form-control-custom"
                    rows={3}
                    placeholder="e.g. Critical project delivery deadline during requested dates..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top pt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setRejectModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={handleConfirmReject}
                  disabled={processingId !== null}
                >
                  <X size={16} /> Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
