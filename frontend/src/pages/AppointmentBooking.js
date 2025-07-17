import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    doctor_id: '',
    appointment_date: '',
    time_slot: '',
    reason: '',
    symptoms: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockDoctors = [
    {
      id: '1',
      first_name: 'Dr. John',
      last_name: 'Smith',
      specialization: 'Neurology',
      experience_years: 10
    },
    {
      id: '2',
      first_name: 'Dr. Sarah',
      last_name: 'Johnson',
      specialization: 'Radiology',
      experience_years: 8
    },
    {
      id: '3',
      first_name: 'Dr. Michael',
      last_name: 'Brown',
      specialization: 'Neurosurgery',
      experience_years: 15
    }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Appointment request submitted successfully! You will receive a confirmation once the doctor approves.');
      setFormData({
        doctor_id: '',
        appointment_date: '',
        time_slot: '',
        reason: '',
        symptoms: '',
        priority: 'normal'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          <i className="fas fa-calendar-plus me-3"></i>
          Book Appointment
        </h1>
        <button className="btn btn-outline-secondary">
          <i className="fas fa-calendar me-2"></i>
          View My Appointments
        </button>
      </div>

      <div className="row">
        {/* Booking Form */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-form me-2"></i>
                Appointment Details
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="doctor_id" className="form-label">
                      <i className="fas fa-user-md me-2"></i>Select Doctor
                    </label>
                    <select
                      className="form-select"
                      id="doctor_id"
                      name="doctor_id"
                      value={formData.doctor_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose a doctor...</option>
                      {mockDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="appointment_date" className="form-label">
                      <i className="fas fa-calendar me-2"></i>Preferred Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="appointment_date"
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="time_slot" className="form-label">
                      <i className="fas fa-clock me-2"></i>Preferred Time
                    </label>
                    <select
                      className="form-select"
                      id="time_slot"
                      name="time_slot"
                      value={formData.time_slot}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose time slot...</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="priority" className="form-label">
                      <i className="fas fa-exclamation-circle me-2"></i>Priority
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="reason" className="form-label">
                    <i className="fas fa-clipboard me-2"></i>Reason for Visit
                  </label>
                  <select
                    className="form-select"
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select reason...</option>
                    <option value="consultation">General Consultation</option>
                    <option value="follow_up">Follow-up Visit</option>
                    <option value="mri_review">MRI Results Review</option>
                    <option value="headache">Headache/Migraine</option>
                    <option value="seizure">Seizure Concerns</option>
                    <option value="memory">Memory Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="symptoms" className="form-label">
                    <i className="fas fa-notes-medical me-2"></i>Symptoms & Additional Notes
                  </label>
                  <textarea
                    className="form-control"
                    id="symptoms"
                    name="symptoms"
                    rows="4"
                    value={formData.symptoms}
                    onChange={handleChange}
                    placeholder="Please describe your symptoms, concerns, or any additional information you'd like the doctor to know..."
                  ></textarea>
                  <small className="text-muted">
                    Providing detailed information helps the doctor prepare for your visit.
                  </small>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-check me-2"></i>
                        Book Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="col-lg-4">
          {/* Selected Doctor Info */}
          {formData.doctor_id && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fas fa-user-md me-2"></i>
                  Selected Doctor
                </h5>
              </div>
              <div className="card-body">
                {(() => {
                  const selectedDoctor = mockDoctors.find(d => d.id === formData.doctor_id);
                  return selectedDoctor ? (
                    <div className="text-center">
                      <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-user-md text-white fa-2x"></i>
                      </div>
                      <h6 className="fw-bold">{selectedDoctor.first_name} {selectedDoctor.last_name}</h6>
                      <p className="text-muted mb-2">{selectedDoctor.specialization}</p>
                      <small className="text-muted">
                        {selectedDoctor.experience_years} years experience
                      </small>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          )}

          {/* Appointment Guidelines */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Guidelines
              </h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Arrive 15 minutes before your appointment
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Bring all relevant medical records
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  List current medications
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  Prepare questions for the doctor
                </li>
                <li>
                  <i className="fas fa-check text-success me-2"></i>
                  Bring insurance information
                </li>
              </ul>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Emergency
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-2">For medical emergencies, call:</p>
              <h4 className="text-danger mb-3">911</h4>
              <p className="mb-2">For urgent questions:</p>
              <h5 className="text-primary">(555) 123-4567</h5>
              <small className="text-muted">Available 24/7</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;