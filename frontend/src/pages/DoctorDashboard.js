import React from 'react';

const DoctorDashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-user-md me-3"></i>
          Doctor Dashboard
        </h1>
        <div>
          <button className="btn btn-primary me-2">
            <i className="fas fa-calendar-check me-2"></i>
            View Appointments
          </button>
          <button className="btn btn-outline-primary">
            <i className="fas fa-brain me-2"></i>
            Review Predictions
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card appointment-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Pending Appointments</h6>
                  <h3 className="mb-0">8</h3>
                  <small className="text-warning">
                    <i className="fas fa-clock me-1"></i>
                    Awaiting Review
                  </small>
                </div>
                <div className="text-warning">
                  <i className="fas fa-clock fa-2x"></i>
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
                  <h6 className="text-uppercase text-muted mb-1">Today's Appointments</h6>
                  <h3 className="mb-0">5</h3>
                  <small className="text-success">
                    <i className="fas fa-calendar-check me-1"></i>
                    Scheduled
                  </small>
                </div>
                <div className="text-success">
                  <i className="fas fa-calendar-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card prediction-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Pending Reviews</h6>
                  <h3 className="mb-0">12</h3>
                  <small className="text-info">
                    <i className="fas fa-brain me-1"></i>
                    AI Predictions
                  </small>
                </div>
                <div className="text-info">
                  <i className="fas fa-brain fa-2x"></i>
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
                  <h6 className="text-uppercase text-muted mb-1">Patients Treated</h6>
                  <h3 className="mb-0">147</h3>
                  <small className="text-primary">
                    <i className="fas fa-users me-1"></i>
                    This Month
                  </small>
                </div>
                <div className="text-primary">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-calendar me-2"></i>
                Today's Schedule
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">09:00 AM - John Doe</h6>
                    <p className="mb-1 text-muted">Follow-up consultation</p>
                    <small>Patient ID: P-001</small>
                  </div>
                  <span className="badge bg-success rounded-pill">Confirmed</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">10:30 AM - Jane Smith</h6>
                    <p className="mb-1 text-muted">MRI results review</p>
                    <small>Patient ID: P-002</small>
                  </div>
                  <span className="badge bg-warning rounded-pill">Pending</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">02:00 PM - Mike Johnson</h6>
                    <p className="mb-1 text-muted">Initial consultation</p>
                    <small>Patient ID: P-003</small>
                  </div>
                  <span className="badge bg-success rounded-pill">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-brain me-2"></i>
                Recent AI Predictions
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Patient: Sarah Wilson</small>
                  <span className="badge bg-danger">Tumor Detected</span>
                </div>
                <div className="progress mb-1">
                  <div className="progress-bar bg-danger" style={{ width: '87%' }}></div>
                </div>
                <small className="text-muted">Confidence: 87%</small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Patient: Tom Brown</small>
                  <span className="badge bg-success">No Tumor</span>
                </div>
                <div className="progress mb-1">
                  <div className="progress-bar bg-success" style={{ width: '94%' }}></div>
                </div>
                <small className="text-muted">Confidence: 94%</small>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Patient: Lisa Davis</small>
                  <span className="badge bg-warning">Requires Review</span>
                </div>
                <div className="progress mb-1">
                  <div className="progress-bar bg-warning" style={{ width: '67%' }}></div>
                </div>
                <small className="text-muted">Confidence: 67%</small>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Quick Stats
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 border-end">
                  <h4 className="text-success">92%</h4>
                  <small className="text-muted">Accuracy Rate</small>
                </div>
                <div className="col-6">
                  <h4 className="text-primary">24</h4>
                  <small className="text-muted">This Week</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;