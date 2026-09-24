import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  History,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Filter,
  AlertCircle,
  HelpCircle,
  Search
} from 'lucide-react';

const LeaveHistory = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await leaveService.getEmployeeLeaves(user.employeeId);
      setLeaves(data);
    } catch (err) {
      setError(err.customMessage || 'Failed to fetch leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.employeeId) {
      fetchLeaves();
    }
  }, [user]);

  const filteredLeaves = leaves.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      item.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.leaveType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.startDate?.includes(searchQuery) ||
      item.endDate?.includes(searchQuery);
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

  if (loading) return <Loading message="Loading leave history..." />;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-2 border-bottom gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Leave History</h4>
          <p className="text-muted small mb-0">Track all your past and pending leave requests</p>
        </div>
        <div>
          <Link to="/employee/apply-leave" className="btn btn-primary-custom shadow-sm">
            <PlusCircle size={18} />
            <span>Apply Leave</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="custom-card shadow-sm p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by reason, type, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 ms-auto d-flex align-items-center gap-2 justify-content-md-end">
            <Filter size={16} className="text-muted" />
            <select
              className="form-select form-select-sm"
              style={{ width: '170px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses ({leaves.length})</option>
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
            <History size={40} className="mb-2 text-secondary opacity-50" />
            <p className="mb-0 fw-medium">No leave records matching your criteria.</p>
          </div>
        ) : (
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Notes / Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((req) => (
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
                    <div className="text-dark" style={{ maxWidth: '250px' }}>
                      {req.reason}
                    </div>
                  </td>
                  <td>{getStatusBadge(req.status)}</td>
                  <td>
                    {req.status === 'REJECTED' && req.rejectionReason ? (
                      <div className="small text-danger d-flex align-items-center gap-1" title={req.rejectionReason}>
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span className="text-truncate" style={{ maxWidth: '200px' }}>
                          {req.rejectionReason}
                        </span>
                      </div>
                    ) : req.status === 'APPROVED' ? (
                      <span className="small text-success">Approved by HR</span>
                    ) : (
                      <span className="small text-muted">In Review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
