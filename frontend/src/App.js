import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import TumorDetection from './pages/TumorDetection';
import AppointmentBooking from './pages/AppointmentBooking';
import Layout from './components/Layout';

// Import auth service
import { authService } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Verify token is still valid
        const result = await authService.verifyToken();
        if (result.success) {
          setUser(currentUser);
        } else {
          // Token invalid, clear storage
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  // Public route component (redirect if already logged in)
  const PublicRoute = ({ children }) => {
    if (user) {
      // Redirect based on user type
      switch (user.user_type) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'doctor':
          return <Navigate to="/doctor" replace />;
        case 'patient':
          return <Navigate to="/patient" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
    return children;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout user={user} onLogout={handleLogout}>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <Layout user={user} onLogout={handleLogout}>
                  <DoctorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout user={user} onLogout={handleLogout}>
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Tumor Detection - Available to patients */}
          <Route
            path="/tumor-detection"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout user={user} onLogout={handleLogout}>
                  <TumorDetection />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Appointment Booking - Available to patients */}
          <Route
            path="/appointment-booking"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout user={user} onLogout={handleLogout}>
                  <AppointmentBooking />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center medical-bg">
                <div className="card p-5 text-center">
                  <i className="fas fa-exclamation-triangle text-warning fa-4x mb-3"></i>
                  <h2>Unauthorized Access</h2>
                  <p className="text-muted">You don't have permission to access this page.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={
                    user.user_type === 'admin'
                      ? '/admin'
                      : user.user_type === 'doctor'
                      ? '/doctor'
                      : '/patient'
                  }
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center medical-bg">
                <div className="card p-5 text-center">
                  <i className="fas fa-exclamation-circle text-danger fa-4x mb-3"></i>
                  <h2>Page Not Found</h2>
                  <p className="text-muted">The page you're looking for doesn't exist.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = '/')}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;