import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { leaveService, employeeService } from '../../services/api';
import {
  CalendarPlus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  Info
} from 'lucide-react';

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [balance, setBalance] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch current leave balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const bal = await employeeService.getLeaveBalance(user.employeeId);
        setBalance(bal);
      } catch (err) {
        console.error('Failed to load leave balance', err);
      }
    };
    if (user?.employeeId) {
      fetchBalance();
    }
  }, [user]);

  // Calculate days whenever startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setCalculatedDays(diffDays);
      } else {
        setCalculatedDays(0);
      }
    } else {
      setCalculatedDays(0);
    }
  }, [startDate, endDate]);

  const validate = () => {
    const errors = {};
    if (!leaveType) {
      errors.leaveType = 'Please select a leave type';
    }
    if (!startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!endDate) {
      errors.endDate = 'End date is required';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.endDate = 'End date cannot be earlier than start date';
    }
    if (!reason.trim()) {
      errors.reason = 'Reason is required';
    } else if (reason.trim().length < 3) {
      errors.reason = 'Reason must be at least 3 characters long';
    } else if (reason.trim().length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters';
    }

    if (balance && calculatedDays > balance.remainingLeave) {
      errors.general = `Insufficient leave balance. You are requesting ${calculatedDays} days, but only have ${balance.remainingLeave} days remaining.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    try {
      setLoading(true);
      await leaveService.applyLeave({
        employeeId: user.employeeId,
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      });

      setSuccessMessage('Leave application submitted successfully! Awaiting administrator review.');
      setTimeout(() => {
        navigate('/employee/leave-history');
      }, 1500);
    } catch (err) {
      setServerError(err.customMessage || 'Failed to submit leave request. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h4 className="fw-bold text-dark mb-0">Apply for Leave</h4>
            <p className="text-muted small mb-0">Submit a new leave request for administrative approval</p>
          </div>
        </div>

        {balance && (
          <div className="badge bg-success-subtle text-success border border-success-subtle p-2 px-3 rounded-3 text-end">
            <span className="small d-block text-muted">Available Balance</span>
            <span className="fw-bold fs-6">{balance.remainingLeave} Days</span>
          </div>
        )}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <CheckCircle2 size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      {serverError && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertCircle size={20} className="flex-shrink-0" />
          <div>{serverError}</div>
        </div>
      )}

      {fieldErrors.general && (
        <div className="alert alert-warning d-flex align-items-center gap-2 mb-4" role="alert">
          <Info size={20} className="flex-shrink-0" />
          <div>{fieldErrors.general}</div>
        </div>
      )}

      {/* Form Card */}
      <div className="custom-card shadow-sm p-4 p-md-5">
        <form onSubmit={handleSubmit} noValidate>
          {/* Leave Type */}
          <div className="mb-4">
            <label className="form-label-custom">
              Leave Type <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select form-select-custom ${fieldErrors.leaveType ? 'is-invalid' : ''}`}
              value={leaveType}
              onChange={(e) => {
                setLeaveType(e.target.value);
                if (fieldErrors.leaveType) setFieldErrors({ ...fieldErrors, leaveType: '' });
              }}
            >
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
            </select>
            {fieldErrors.leaveType && (
              <div className="invalid-feedback">{fieldErrors.leaveType}</div>
            )}
          </div>

          {/* Date Range */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label-custom d-flex align-items-center gap-1">
                <Calendar size={15} /> Start Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control form-control-custom ${fieldErrors.startDate ? 'is-invalid' : ''}`}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (fieldErrors.startDate) setFieldErrors({ ...fieldErrors, startDate: '' });
                }}
              />
              {fieldErrors.startDate && (
                <div className="invalid-feedback">{fieldErrors.startDate}</div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label-custom d-flex align-items-center gap-1">
                <Calendar size={15} /> End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`form-control form-control-custom ${fieldErrors.endDate ? 'is-invalid' : ''}`}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (fieldErrors.endDate) setFieldErrors({ ...fieldErrors, endDate: '' });
                }}
              />
              {fieldErrors.endDate && (
                <div className="invalid-feedback">{fieldErrors.endDate}</div>
              )}
            </div>
          </div>

          {/* Duration Summary */}
          {calculatedDays > 0 && (
            <div className="p-3 mb-4 rounded-3 bg-light border d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <Clock size={18} className="text-primary" />
                <span className="text-muted small">Calculated Duration:</span>
              </div>
              <span className="fw-bold text-primary fs-6">
                {calculatedDays} {calculatedDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {/* Reason */}
          <div className="mb-4">
            <label className="form-label-custom d-flex align-items-center gap-1">
              <FileText size={15} /> Reason for Leave <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control form-control-custom ${fieldErrors.reason ? 'is-invalid' : ''}`}
              rows={4}
              placeholder="Please provide a clear and detailed explanation for your leave request..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (fieldErrors.reason) setFieldErrors({ ...fieldErrors, reason: '' });
              }}
            ></textarea>
            <div className="d-flex justify-content-between mt-1">
              {fieldErrors.reason ? (
                <div className="invalid-feedback d-block">{fieldErrors.reason}</div>
              ) : (
                <div className="text-muted small">Minimum 3 characters, max 500 characters</div>
              )}
              <div className="text-muted small ms-auto">{reason.length}/500</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-end pt-3 border-top">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary px-4"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-custom px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CalendarPlus size={18} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
