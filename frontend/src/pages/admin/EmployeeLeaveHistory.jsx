import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeeService, leaveService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  FileSpreadsheet,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  AlertCircle,
  Calendar,
  Building,
  Mail,
  ShieldCheck
} from 'lucide-react';

const EmployeeLeaveHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEmpId = searchParams.get('employeeId') || '';

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(initialEmpId);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leavesLoading, setLeavesLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 1. Fetch all employees for the selector dropdown
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await employeeService.getAllEmployees();
        setEmployees(data);

        // If no initial employee selected, pick the first employee
        if (!initialEmpId && data.length > 0) {
          const firstEmp = data.find((e) => e.role === 'EMPLOYEE') || data[0];
          setSelectedEmployeeId(firstEmp.id.toString());
          setSearchParams({ employeeId: firstEmp.id.toString() });
        }
      } catch (err) {
        setError(err.customMessage || 'Failed to fetch employees list.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEmployees();
  }, []);

  // 2. Fetch selected employee profile & leave history
  const fetchSelectedEmployeeData = async (empId) => {
    if (!empId) return;
    try {
      setLeavesLoading(true);
      setError('');
      const [profileData, leavesData] = await Promise.all([
        employeeService.getProfile(empId),
        leaveService.getEmployeeLeaves(empId),
      ]);
      setEmployeeProfile(profileData);
      setEmployeeLeaves(leavesData);
    } catch (err) {
      setError(err.customMessage || 'Failed to load employee leave history.');
    } finally {
      setLeavesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchSelectedEmployeeData(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const handleEmployeeChange = (e) => {
    const newId = e.target.value;
    setSelectedEmployeeId(newId);
    setSearchParams({ employeeId: newId });
  };

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
      fetchSelectedEmployeeData(selectedEmployeeId);
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
      fetchSelectedEmployeeData(selectedEmployeeId);
    } catch (err) {
      setError(err.customMessage || 'Failed to reject leave request.');
    } finally {
      setProcessingId(null);
    }
  };

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

  if (loading) return <Loading message="Loading employee leave history..." />;

  const pendingCount = employeeLeaves.filter((l) => l.status === 'PENDING').length;
  const approvedCount = employeeLeaves.filter((l) => l.status === 'APPROVED').length;
  const rejectedCount = employeeLeaves.filter((l) => l.status === 'REJECTED').length;

  return (
    <div className="page-container fade-in">
      <div className="mb-4 pb-2 border-bottom">
        <h4 className="fw-bold text-dark mb-1">Employee Leave History (Admin View)</h4>
        <p className="text-muted small mb-0">Inspect individual employee leave records, balances, and request timeline</p>
      </div>

      {actionSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <CheckCircle2 size={20} />
          <div>{actionSuccess}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Employee Selector Bar */}
      <div className="custom-card shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-3">
            <label className="form-label-custom d-flex align-items-center gap-1 mb-0">
              <User size={16} /> Select Employee:
            </label>
          </div>
          <div className="col-12 col-md-6">
            <select
              className="form-select form-select-custom"
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeCode}) - {emp.department} [{emp.role}]
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {leavesLoading ? (
        <Loading message="Fetching employee leave records..." />
      ) : employeeProfile ? (
        <>
          {/* Employee Summary Card */}
          <div className="row g-3 mb-4">
            {/* Profile Info */}
            <div className="col-12 col-lg-5">
              <div className="custom-card shadow-sm p-4 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 50, height: 50, fontSize: '1.25rem' }}
                  >
                    {employeeProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="fw-bold text-dark mb-0">{employeeProfile.name}</h5>
                    <div className="text-muted small">
                      {employeeProfile.employeeCode} • {employeeProfile.designation}
                    </div>
                  </div>
                </div>

                <div className="small border-top pt-2">
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Email:</span>
                    <span className="fw-medium text-dark">{employeeProfile.email}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Department:</span>
                    <span className="fw-medium text-dark">{employeeProfile.department}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1">
                    <span className="text-muted">Phone:</span>
                    <span className="fw-medium text-dark">{employeeProfile.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Leave Balance & Stats */}
            <div className="col-12 col-lg-7">
              <div className="custom-card shadow-sm p-4 h-100">
                <h6 className="fw-bold text-dark mb-3">Leave Balance & Requests Status</h6>
                <div className="row g-2 text-center mb-3">
                  <div className="col-4">
                    <div className="p-2 bg-light rounded-3">
                      <div className="text-muted small">Total Leave</div>
                      <div className="fs-5 fw-bold text-dark">{employeeProfile.totalLeave}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 bg-danger bg-opacity-10 rounded-3">
                      <div className="text-danger small">Used Leave</div>
                      <div className="fs-5 fw-bold text-danger">{employeeProfile.usedLeave}</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-2 bg-success bg-opacity-10 rounded-3">
                      <div className="text-success small">Remaining</div>
                      <div className="fs-5 fw-bold text-success">{employeeProfile.remainingLeave}</div>
                    </div>
                  </div>
                </div>

                <div className="row g-2 text-center small">
                  <div className="col-4">
                    <span className="text-warning fw-semibold">Pending: {pendingCount}</span>
                  </div>
                  <div className="col-4">
                    <span className="text-success fw-semibold">Approved: {approvedCount}</span>
                  </div>
                  <div className="col-4">
                    <span className="text-danger fw-semibold">Rejected: {rejectedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave History Table */}
          <div className="custom-card shadow-sm p-4">
            <h5 className="fw-bold text-dark mb-3">
              Leave History for {employeeProfile.name} ({employeeLeaves.length} Total)
            </h5>

            {employeeLeaves.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FileSpreadsheet size={40} className="mb-2 text-secondary opacity-50" />
                <p className="mb-0 fw-medium">No leave requests recorded for this employee.</p>
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
                      <th>Action / Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeLeaves.map((req) => (
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
                            <span className="small text-success fw-medium">Approved</span>
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
              </div>
            )}
          </div>
        </>
      ) : null}

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
                    placeholder="e.g. Project delivery milestone during requested dates..."
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

export default EmployeeLeaveHistory;
