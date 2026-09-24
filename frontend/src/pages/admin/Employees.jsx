import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employeeService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  Users,
  Search,
  FileSpreadsheet,
  Mail,
  Building,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  User,
  ShieldCheck,
  Calendar,
  Lock,
  Phone,
  Award,
  X
} from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Employee Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    totalLeave: 20,
    role: 'EMPLOYEE',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.customMessage || 'Failed to fetch employees list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: 'Engineering',
      designation: '',
      totalLeave: 20,
      role: 'EMPLOYEE',
      joiningDate: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.totalLeave || formData.totalLeave < 1) {
      errors.totalLeave = 'Leave allowance must be at least 1 day';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setFormErrors({});
      await employeeService.createEmployee(formData);
      setIsModalOpen(false);
      setSuccessMessage(`Employee ${formData.name} added successfully!`);
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchEmployees();
    } catch (err) {
      setFormErrors({ server: err.customMessage || 'Failed to create employee.' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      searchQuery === '' ||
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) return <Loading message="Loading employees list..." />;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-2 border-bottom gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Company Employees Directory</h4>
          <p className="text-muted small mb-0">Manage employee records, onboard new staff, and monitor leave balances</p>
        </div>
        <div>
          <button onClick={openAddModal} className="btn btn-primary-custom shadow-sm">
            <UserPlus size={18} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
          <CheckCircle2 size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Search Header */}
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
                placeholder="Search employee by name, code, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-4 ms-auto text-md-end text-muted small">
            Showing <strong>{filteredEmployees.length}</strong> of {employees.length} employees
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="table-responsive-custom shadow-sm">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Users size={40} className="mb-2 text-secondary opacity-50" />
            <p className="mb-2 fw-medium">No employees found matching the search criteria.</p>
            <button onClick={openAddModal} className="btn btn-primary-custom btn-sm">
              <UserPlus size={16} /> Add First Employee
            </button>
          </div>
        ) : (
          <table className="table table-custom">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department & Designation</th>
                <th>Contact</th>
                <th>Total Leave</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 36, height: 36, fontSize: '0.9rem' }}
                      >
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{emp.name}</div>
                        <div className="text-muted small">{emp.employeeCode}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-medium text-dark">{emp.department || 'General'}</div>
                    <div className="text-muted small">{emp.designation || 'Staff'}</div>
                  </td>
                  <td>
                    <div className="small text-dark">{emp.email}</div>
                    <div className="text-muted small">{emp.phone || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border">
                      {emp.totalLeave} days
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                      {emp.usedLeave} days
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle fw-bold">
                      {emp.remainingLeave} days
                    </span>
                  </td>
                  <td>
                    {emp.role === 'ADMIN' ? (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        <ShieldCheck size={12} className="me-1 inline" /> Admin
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                        Employee
                      </span>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/admin/employee-leave-history?employeeId=${emp.id}`}
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      title="View Full Leave History"
                    >
                      <FileSpreadsheet size={14} /> History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <UserPlus size={20} className="text-primary" /> Onboard New Employee
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateEmployee} noValidate>
                <div className="modal-body py-4">
                  {formErrors.server && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2 small" role="alert">
                      <AlertCircle size={18} className="flex-shrink-0" />
                      <div>{formErrors.server}</div>
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <User size={15} /> Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-custom ${formErrors.name ? 'is-invalid' : ''}`}
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Mail size={15} /> Work Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-custom ${formErrors.email ? 'is-invalid' : ''}`}
                        placeholder="john.doe@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>

                    {/* Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Lock size={15} /> Login Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-custom ${formErrors.password ? 'is-invalid' : ''}`}
                        placeholder="Assign password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                    </div>

                    {/* Phone */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Phone size={15} /> Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {/* Department */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Building size={15} /> Department
                      </label>
                      <select
                        className="form-select form-select-custom"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    {/* Designation */}
                    <div className="col-12 col-md-6">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Award size={15} /> Designation <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-custom ${formErrors.designation ? 'is-invalid' : ''}`}
                        placeholder="e.g. Senior Software Engineer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                      {formErrors.designation && <div className="invalid-feedback">{formErrors.designation}</div>}
                    </div>

                    {/* Total Leave Allowance */}
                    <div className="col-12 col-md-4">
                      <label className="form-label-custom">Annual Leave Allowance</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className={`form-control form-control-custom ${formErrors.totalLeave ? 'is-invalid' : ''}`}
                        value={formData.totalLeave}
                        onChange={(e) => setFormData({ ...formData, totalLeave: parseInt(e.target.value) || 20 })}
                      />
                      {formErrors.totalLeave && <div className="invalid-feedback">{formErrors.totalLeave}</div>}
                    </div>

                    {/* Role */}
                    <div className="col-12 col-md-4">
                      <label className="form-label-custom">System Role</label>
                      <select
                        className="form-select form-select-custom"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>

                    {/* Joining Date */}
                    <div className="col-12 col-md-4">
                      <label className="form-label-custom d-flex align-items-center gap-1">
                        <Calendar size={15} /> Joining Date
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-custom"
                        value={formData.joiningDate}
                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top pt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-3"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary-custom px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Saving Employee...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
