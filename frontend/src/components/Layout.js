import React, { useState } from 'react';

const Layout = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getSidebarItems = () => {
    switch (user?.user_type) {
      case 'admin':
        return [
          { icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/admin' },
          { icon: 'fas fa-user-md', label: 'Doctors', path: '/admin/doctors' },
          { icon: 'fas fa-users', label: 'Patients', path: '/admin/patients' },
          { icon: 'fas fa-calendar', label: 'Appointments', path: '/admin/appointments' },
          { icon: 'fas fa-brain', label: 'Predictions', path: '/admin/predictions' },
        ];
      case 'doctor':
        return [
          { icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/doctor' },
          { icon: 'fas fa-calendar-check', label: 'Appointments', path: '/doctor/appointments' },
          { icon: 'fas fa-brain', label: 'Predictions', path: '/doctor/predictions' },
          { icon: 'fas fa-clock', label: 'Schedule', path: '/doctor/schedule' },
        ];
      case 'patient':
        return [
          { icon: 'fas fa-tachometer-alt', label: 'Dashboard', path: '/patient' },
          { icon: 'fas fa-brain', label: 'Tumor Detection', path: '/tumor-detection' },
          { icon: 'fas fa-calendar-plus', label: 'Book Appointment', path: '/appointment-booking' },
          { icon: 'fas fa-calendar', label: 'My Appointments', path: '/patient/appointments' },
          { icon: 'fas fa-file-medical', label: 'My Results', path: '/patient/predictions' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`sidebar text-white ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          width: sidebarOpen ? '250px' : '60px',
          transition: 'width 0.3s ease',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div className="p-3">
          <div className="d-flex align-items-center mb-4">
            <i className="fas fa-brain text-success fs-3 me-2"></i>
            {sidebarOpen && <h5 className="mb-0 text-white">NeuroHealth</h5>}
          </div>

          <nav className="nav flex-column">
            {getSidebarItems().map((item, index) => (
              <a
                key={index}
                href={item.path}
                className="nav-link text-white py-3 px-2 rounded mb-1"
                style={{
                  transition: 'background-color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className={`${item.icon} me-3`}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </a>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="mt-auto p-3 border-top border-secondary">
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                 style={{ width: '40px', height: '40px' }}>
              <i className="fas fa-user text-white"></i>
            </div>
            {sidebarOpen && (
              <div className="flex-grow-1">
                <div className="text-white fw-semibold small">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-muted small text-capitalize">
                  {user?.user_type}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '250px' : '60px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <button
              className="btn btn-outline-light me-3"
              onClick={toggleSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>

            <span className="navbar-brand mb-0 h1">
              {user?.user_type === 'admin' && 'Admin Panel'}
              {user?.user_type === 'doctor' && 'Doctor Portal'}
              {user?.user_type === 'patient' && 'Patient Portal'}
            </span>

            <div className="navbar-nav ms-auto">
              <div className="nav-item dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-2"></i>
                  {user?.first_name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#settings">
                      <i className="fas fa-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={onLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;