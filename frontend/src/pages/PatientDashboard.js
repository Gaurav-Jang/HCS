import React from 'react';

const PatientDashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-user me-3"></i>
          Patient Dashboard
        </h1>
        <div>
          <a href="/tumor-detection" className="btn btn-primary me-2">
            <i className="fas fa-brain me-2"></i>
            Upload MRI Scan
          </a>
          <a href="/appointment-booking" className="btn btn-outline-primary">
            <i className="fas fa-calendar-plus me-2"></i>
            Book Appointment
          </a>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card appointment-card border-0 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="text-uppercase text-muted mb-1">Upcoming Appointments</h6>
                  <h3 className="mb-0">2</h3>
                  <small className="text-info">
                    <i className="fas fa-calendar me-1"></i>
                    Next: Tomorrow
                  </small>
                </div>
                <div className="text-info">
                  <i className="fas fa-calendar fa-2x"></i>
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
                  <h6 className="text-uppercase text-muted mb-1">MRI Scans</h6>
                  <h3 className="mb-0">5</h3>
                  <small className="text-success">
                    <i className="fas fa-brain me-1"></i>
                    Analyzed
                  </small>
                </div>
                <div className="text-success">
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
                  <h6 className="text-uppercase text-muted mb-1">Total Visits</h6>
                  <h3 className="mb-0">12</h3>
                  <small className="text-primary">
                    <i className="fas fa-hospital me-1"></i>
                    Since Registration
                  </small>
                </div>
                <div className="text-primary">
                  <i className="fas fa-hospital fa-2x"></i>
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
                  <h6 className="text-uppercase text-muted mb-1">Health Score</h6>
                  <h3 className="mb-0">92%</h3>
                  <small className="text-success">
                    <i className="fas fa-heart me-1"></i>
                    Excellent
                  </small>
                </div>
                <div className="text-success">
                  <i className="fas fa-heart fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent MRI Results */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-brain me-2"></i>
                Recent MRI Analysis Results
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Result</th>
                      <th>Confidence</th>
                      <th>Doctor Review</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-15</td>
                      <td><span className="badge bg-success">No Tumor</span></td>
                      <td>94%</td>
                      <td><span className="badge bg-success">Reviewed</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2024-01-08</td>
                      <td><span className="badge bg-warning">Under Review</span></td>
                      <td>67%</td>
                      <td><span className="badge bg-warning">Pending</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2023-12-20</td>
                      <td><span className="badge bg-success">No Tumor</span></td>
                      <td>89%</td>
                      <td><span className="badge bg-success">Reviewed</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions & Info */}
        <div className="col-lg-4">
          {/* Next Appointment */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                Next Appointment
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h4 className="text-primary">Tomorrow</h4>
                <p className="mb-2">10:30 AM</p>
                <p className="text-muted mb-3">Dr. John Smith - Neurology</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-info-circle me-2"></i>
                    View Details
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <a href="/tumor-detection" className="btn btn-primary">
                  <i className="fas fa-brain me-2"></i>
                  Upload New MRI Scan
                </a>
                <a href="/appointment-booking" className="btn btn-outline-primary">
                  <i className="fas fa-calendar-plus me-2"></i>
                  Book New Appointment
                </a>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>
                  Download Reports
                </button>
                <button className="btn btn-outline-info">
                  <i className="fas fa-question-circle me-2"></i>
                  Get Help
                </button>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-warning text-white">
              <h5 className="mb-0">
                <i className="fas fa-lightbulb me-2"></i>
                Health Tips
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="fw-bold">Regular Checkups</h6>
                <p className="small text-muted mb-2">
                  Schedule regular neurological checkups to monitor brain health.
                </p>
              </div>
              <div className="mb-3">
                <h6 className="fw-bold">Stay Hydrated</h6>
                <p className="small text-muted mb-2">
                  Proper hydration is essential for optimal brain function.
                </p>
              </div>
              <div>
                <h6 className="fw-bold">Exercise Regularly</h6>
                <p className="small text-muted mb-0">
                  Physical activity improves blood flow to the brain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;