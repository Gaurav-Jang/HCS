import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../utils/auth';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'patient',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.login(
        formData.email,
        formData.password,
        formData.userType
      );

      if (result.success) {
        toast.success('Login successful!');
        onLogin(result.user);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center medical-bg">
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-4">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <i className="fas fa-brain medical-icon fa-3x mb-3"></i>
                <h2 className="fw-bold text-primary">NeuroHealth</h2>
                <p className="text-muted">Brain Tumor Detection System</p>
              </div>

              {/* User Type Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Login as:</label>
                <div className="row g-2">
                  <div className="col-4">
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="patient"
                      value="patient"
                      checked={formData.userType === 'patient'}
                      onChange={handleChange}
                    />
                    <label className="btn btn-outline-primary w-100" htmlFor="patient">
                      <i className="fas fa-user me-1"></i>
                      Patient
                    </label>
                  </div>
                  <div className="col-4">
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="doctor"
                      value="doctor"
                      checked={formData.userType === 'doctor'}
                      onChange={handleChange}
                    />
                    <label className="btn btn-outline-primary w-100" htmlFor="doctor">
                      <i className="fas fa-user-md me-1"></i>
                      Doctor
                    </label>
                  </div>
                  <div className="col-4">
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="admin"
                      value="admin"
                      checked={formData.userType === 'admin'}
                      onChange={handleChange}
                    />
                    <label className="btn btn-outline-primary w-100" htmlFor="admin">
                      <i className="fas fa-cog me-1"></i>
                      Admin
                    </label>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </button>

                {/* Patient Signup Link */}
                {formData.userType === 'patient' && (
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-primary text-decoration-none fw-semibold">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                )}

                {/* Demo Credentials */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="text-muted fw-semibold mb-2">Demo Credentials:</h6>
                  <small className="text-muted d-block">
                    <strong>Admin:</strong> admin@healthcare.com / admin123<br />
                    <strong>Doctor:</strong> doctor@healthcare.com / doctor123<br />
                    <strong>Patient:</strong> patient@healthcare.com / patient123
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* Features Section */}
          <div className="row mt-4 text-center text-white">
            <div className="col-4">
              <i className="fas fa-brain fa-2x mb-2"></i>
              <p className="small">AI-Powered Detection</p>
            </div>
            <div className="col-4">
              <i className="fas fa-calendar-check fa-2x mb-2"></i>
              <p className="small">Easy Appointment Booking</p>
            </div>
            <div className="col-4">
              <i className="fas fa-shield-alt fa-2x mb-2"></i>
              <p className="small">Secure & Confidential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;