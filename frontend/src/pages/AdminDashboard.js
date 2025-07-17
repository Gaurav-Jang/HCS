import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminService } from '../utils/auth';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const result = await adminService.getDashboard();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-tachometer-alt me-3"></i>
          Admin Dashboard
        </h1>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card stats-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Total Doctors</h6>
                  <h3 className="mb-0">{dashboardData?.doctors?.total || 0}</h3>
                  <small className="text-success">
                    <i className="fas fa-check me-1"></i>
                    {dashboardData?.doctors?.approved || 0} Approved
                  </small>
                </div>
                <div className="text-primary">
                  <i className="fas fa-user-md fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card stats-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Total Patients</h6>
                  <h3 className="mb-0">{dashboardData?.patients?.total || 0}</h3>
                  <small className="text-info">
                    <i className="fas fa-users me-1"></i>
                    Registered
                  </small>
                </div>
                <div className="text-info">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card stats-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Appointments</h6>
                  <h3 className="mb-0">{dashboardData?.appointments?.total || 0}</h3>
                  <small className="text-warning">
                    <i className="fas fa-clock me-1"></i>
                    {dashboardData?.appointments?.pending || 0} Pending
                  </small>
                </div>
                <div className="text-warning">
                  <i className="fas fa-calendar fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card stats-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">AI Predictions</h6>
                  <h3 className="mb-0">{dashboardData?.predictions?.total_predictions || 0}</h3>
                  <small className="text-success">
                    <i className="fas fa-brain me-1"></i>
                    AI Powered
                  </small>
                </div>
                <div className="text-success">
                  <i className="fas fa-brain fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <a href="/admin/doctors" className="btn btn-outline-primary w-100">
                    <i className="fas fa-user-md d-block mb-2 fa-2x"></i>
                    Manage Doctors
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/patients" className="btn btn-outline-info w-100">
                    <i className="fas fa-users d-block mb-2 fa-2x"></i>
                    View Patients
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/appointments" className="btn btn-outline-warning w-100">
                    <i className="fas fa-calendar d-block mb-2 fa-2x"></i>
                    Appointments
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/predictions" className="btn btn-outline-success w-100">
                    <i className="fas fa-brain d-block mb-2 fa-2x"></i>
                    AI Results
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2"></i>
                System Health
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>System Status</span>
                  <span className="text-success fw-bold">Online</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Database</span>
                  <span className="text-success fw-bold">Connected</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>AI Model</span>
                  <span className="text-success fw-bold">Ready</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;