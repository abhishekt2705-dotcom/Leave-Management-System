import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/api';
import Loading from '../../components/Loading';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Shield,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await employeeService.getProfile(user.employeeId);
        setProfile(data);
      } catch (err) {
        setError(err.customMessage || 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.employeeId) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div className="page-container fade-in" style={{ maxWidth: '900px' }}>
      <div className="mb-4 pb-2 border-bottom">
        <h4 className="fw-bold text-dark mb-1">Employee Profile</h4>
        <p className="text-muted small mb-0">View your personal and employment details</p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {profile && (
        <div className="row g-4">
          {/* Main Profile Info Card */}
          <div className="col-12 col-md-4">
            <div className="custom-card shadow-sm p-4 text-center h-100">
              <div
                className="rounded-circle bg-primary bg-opacity-10 text-primary d-inline-flex align-items-center justify-content-center mb-3 mx-auto shadow-sm"
                style={{ width: '88px', height: '88px', fontSize: '2rem', fontWeight: 'bold' }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={40} />}
              </div>
              <h5 className="fw-bold text-dark mb-1">{profile.name}</h5>
              <p className="text-muted small mb-2">{profile.designation || 'Software Engineer'}</p>
              <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 mb-3">
                {profile.role}
              </div>

              <div className="border-top pt-3 text-start small">
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Employee Code:</span>
                  <strong className="text-dark">{profile.employeeCode}</strong>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Department:</span>
                  <strong className="text-dark">{profile.department}</strong>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Joined On:</span>
                  <strong className="text-dark">{profile.joiningDate || 'N/A'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Leave Balances */}
          <div className="col-12 col-md-8">
            <div className="custom-card shadow-sm p-4 mb-4">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Contact & Employment Information</h6>
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Mail size={14} /> Official Email
                  </label>
                  <div className="fw-medium text-dark">{profile.email}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Phone size={14} /> Phone Number
                  </label>
                  <div className="fw-medium text-dark">{profile.phone || 'N/A'}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Building size={14} /> Department
                  </label>
                  <div className="fw-medium text-dark">{profile.department || 'Engineering'}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Award size={14} /> Designation
                  </label>
                  <div className="fw-medium text-dark">{profile.designation || 'Specialist'}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Calendar size={14} /> Joining Date
                  </label>
                  <div className="fw-medium text-dark">{profile.joiningDate || '2023-01-01'}</div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="text-muted small d-flex align-items-center gap-1 mb-1">
                    <Shield size={14} /> System Role
                  </label>
                  <div className="fw-medium text-dark">{profile.role}</div>
                </div>
              </div>
            </div>

            {/* Leave Balance Overview */}
            <div className="custom-card shadow-sm p-4">
              <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Leave Balance Summary</h6>
              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-muted small fw-semibold">Total</div>
                    <div className="fs-4 fw-bold text-dark mt-1">{profile.totalLeave}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-danger bg-opacity-10 rounded-3">
                    <div className="text-danger small fw-semibold">Used</div>
                    <div className="fs-4 fw-bold text-danger mt-1">{profile.usedLeave}</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-success bg-opacity-10 rounded-3">
                    <div className="text-success small fw-semibold">Remaining</div>
                    <div className="fs-4 fw-bold text-success mt-1">{profile.remainingLeave}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;
