import React, { useState, useEffect } from 'react';
import { leaveService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Layers
} from 'lucide-react';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await leaveService.getAllLeaves();
      setLeaves(data);
    } catch (err) {
      setError(err.customMessage || 'Failed to fetch leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this leave request? Leave balance will be deducted.')) {
      return;
    }

    try {
      setProcessingId(id);
      setError('');
      await leaveService.approveLeave(id);
      setActionSuccess('Leave request approved and balance deducted successfully!');
      setTimeout(() => setActionSuccess(''), 3000);
      fetchLeaves();
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
      fetchLeaves();
    } catch (err) {
      setError(err.customMessage || 'Failed to reject leave request.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredLeaves = leaves.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leaveType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  if (loading) return <Loading message="Loading all leave requests..." />;

  return (
    <div className="page-container fade-in">
      <div className="mb-4 pb-2 border-bottom">
        <h4 className="fw-bold text-dark mb-1">Leave Requests Management</h4>
        <p className="text-muted small mb-0">Review, approve, or reject employee leave applications</p>
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

      {/* Filters and Search Bar */}
      <div className="custom-card shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by employee, code, department, reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 ms-auto d-flex align-items-center gap-2 justify-content-md-end">
            <Filter size={16} className="text-muted" />
            <select
              className="form-select form-select-sm"
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Requests ({leaves.length})</option>
              <option value="PENDING">
                Pending ({leaves.filter((l) => l.status === 'PENDING').length})
              </option>
              <option value="APPROVED">
                Approved ({leaves.filter((l) => l.status === 'APPROVED').length})
              </option>
              <option value="REJECTED">
                Rejected ({leaves.filter((l) => l.status === 'REJECTED').length})
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-responsive-custom shadow-sm">
        {filteredLeaves.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Layers size={40} className="mb-2 text-secondary opacity-50" />
            <p className="mb-0 fw-medium">No leave requests found matching criteria.</p>
          </div>
        ) : (
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((req) => (
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
                  <td>
                    <div className="text-dark" style={{ maxWidth: '240px' }} title={req.reason}>
                      {req.reason}
                    </div>
                  </td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>
                    {req.status === 'PENDING' ? (
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
                    ) : req.status === 'APPROVED' ? (
                      <span className="small text-success fw-medium">Approved & Deducted</span>
                    ) : (
                      <div className="small text-danger" title={req.rejectionReason}>
                        Rejected {req.rejectionReason ? `(${req.rejectionReason})` : ''}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  Please provide a reason for rejecting this leave request.
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

export default LeaveRequests;
