import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    const result = await login({ email, password });
    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFieldErrors({});
    setError('');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="card border-0 shadow-lg" style={{ maxWidth: '440px', width: '100%', borderRadius: '16px' }}>
        <div className="card-body p-4 p-sm-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <Calendar size={32} />
            </div>
            <h4 className="fw-bold text-dark mb-1">Leave Management System</h4>
            <p className="text-muted small mb-0">Sign in with your work email and password</p>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-4" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label-custom d-flex align-items-center gap-1">
                <Mail size={15} /> Email Address
              </label>
              <input
                type="email"
                className={`form-control form-control-custom ${fieldErrors.email ? 'is-invalid' : ''}`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                }}
              />
              {fieldErrors.email && (
                <div className="invalid-feedback small">{fieldErrors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label-custom d-flex align-items-center gap-1">
                <Lock size={15} /> Password
              </label>
              <input
                type="password"
                className={`form-control form-control-custom ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                }}
              />
              {fieldErrors.password && (
                <div className="invalid-feedback small">{fieldErrors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-4 pt-3 border-top">
            <div className="text-muted small fw-medium mb-2 text-center">Quick Demo Credentials:</div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-between px-3"
                onClick={() => setDemoCredentials('employee@gmail.com', 'employee123')}
              >
                <span className="d-flex align-items-center gap-1">
                  <User size={14} /> Employee (Abhishek)
                </span>
                <code className="text-muted small">employee@gmail.com</code>
              </button>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-between px-3"
                onClick={() => setDemoCredentials('admin@gmail.com', 'admin123')}
              >
                <span className="d-flex align-items-center gap-1">
                  <ShieldCheck size={14} /> Admin (HR)
                </span>
                <code className="text-muted small">admin@gmail.com</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
