from flask import Blueprint, request, jsonify
from models.user import User
from models.appointment import Appointment
from models.prediction import Prediction
from utils.auth_utils import login_required, patient_required
from datetime import datetime

patient_bp = Blueprint('patient', __name__)
user_model = User()
appointment_model = Appointment()
prediction_model = Prediction()

@patient_bp.route('/doctors', methods=['GET'])
@login_required
@patient_required
def get_available_doctors():
    """Get all approved doctors available for appointments"""
    try:
        doctors = user_model.get_approved_doctors()
        
        # Format response
        doctors_data = []
        for doctor in doctors:
            doctor_data = {
                'id': str(doctor['_id']),
                'first_name': doctor['first_name'],
                'last_name': doctor['last_name'],
                'specialization': doctor.get('specialization', ''),
                'experience_years': doctor.get('experience_years', 0),
                'available_time_slots': doctor.get('available_time_slots', [])
            }
            doctors_data.append(doctor_data)
        
        return jsonify({'doctors': doctors_data}), 200
        
    except Exception as e:
        print(f"Get available doctors error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/appointments', methods=['POST'])
@login_required
@patient_required
def book_appointment():
    """Book a new appointment"""
    try:
        data = request.get_json()
        patient_id = request.user['user_id']
        
        # Required fields
        required_fields = ['doctor_id', 'appointment_date', 'time_slot', 'reason']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if time slot is available
        if not appointment_model.check_time_slot_availability(
            data['doctor_id'], data['appointment_date'], data['time_slot']
        ):
            return jsonify({'error': 'Time slot is not available'}), 400
        
        # Create appointment
        appointment_data = {
            'patient_id': patient_id,
            'doctor_id': data['doctor_id'],
            'appointment_date': data['appointment_date'],
            'time_slot': data['time_slot'],
            'reason': data['reason'],
            'symptoms': data.get('symptoms', ''),
            'notes': data.get('notes', ''),
            'priority': data.get('priority', 'normal')
        }
        
        appointment_id = appointment_model.create_appointment(appointment_data)
        if not appointment_id:
            return jsonify({'error': 'Failed to book appointment'}), 500
        
        return jsonify({
            'message': 'Appointment booked successfully',
            'appointment_id': appointment_id
        }), 201
        
    except Exception as e:
        print(f"Book appointment error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/appointments', methods=['GET'])
@login_required
@patient_required
def get_patient_appointments():
    """Get all appointments for the logged-in patient"""
    try:
        patient_id = request.user['user_id']
        appointments = appointment_model.get_patient_appointments(patient_id)
        
        return jsonify({'appointments': appointments}), 200
        
    except Exception as e:
        print(f"Get patient appointments error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/appointments/<appointment_id>', methods=['GET'])
@login_required
@patient_required
def get_appointment_details(appointment_id):
    """Get detailed information about a specific appointment"""
    try:
        appointment = appointment_model.get_appointment_by_id(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        # Check if appointment belongs to the patient
        if str(appointment['patient_id']) != request.user['user_id']:
            return jsonify({'error': 'Unauthorized access to appointment'}), 403
        
        return jsonify({'appointment': appointment}), 200
        
    except Exception as e:
        print(f"Get appointment details error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/appointments/<appointment_id>/cancel', methods=['PUT'])
@login_required
@patient_required
def cancel_appointment(appointment_id):
    """Cancel an appointment"""
    try:
        # Check if appointment exists and belongs to patient
        appointment = appointment_model.get_appointment_by_id(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        if str(appointment['patient_id']) != request.user['user_id']:
            return jsonify({'error': 'Unauthorized access to appointment'}), 403
        
        # Only allow cancellation of pending or approved appointments
        if appointment['status'] not in ['pending', 'approved']:
            return jsonify({'error': 'Cannot cancel appointment with current status'}), 400
        
        success = appointment_model.update_appointment_status(
            appointment_id, 'cancelled', 'Cancelled by patient'
        )
        
        if success:
            return jsonify({'message': 'Appointment cancelled successfully'}), 200
        else:
            return jsonify({'error': 'Failed to cancel appointment'}), 400
        
    except Exception as e:
        print(f"Cancel appointment error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/predictions', methods=['GET'])
@login_required
@patient_required
def get_patient_predictions():
    """Get all predictions for the logged-in patient"""
    try:
        patient_id = request.user['user_id']
        predictions = prediction_model.get_patient_predictions(patient_id)
        
        return jsonify({'predictions': predictions}), 200
        
    except Exception as e:
        print(f"Get patient predictions error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/predictions/<prediction_id>', methods=['GET'])
@login_required
@patient_required
def get_prediction_details(prediction_id):
    """Get detailed information about a specific prediction"""
    try:
        prediction = prediction_model.get_prediction_by_id(prediction_id)
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        # Check if prediction belongs to the patient
        if str(prediction['patient_id']) != request.user['user_id']:
            return jsonify({'error': 'Unauthorized access to prediction'}), 403
        
        return jsonify({'prediction': prediction}), 200
        
    except Exception as e:
        print(f"Get prediction details error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/dashboard', methods=['GET'])
@login_required
@patient_required
def patient_dashboard():
    """Get patient dashboard statistics"""
    try:
        patient_id = request.user['user_id']
        
        # Get appointment statistics
        appointments = appointment_model.get_patient_appointments(patient_id)
        pending_appointments = [apt for apt in appointments if apt['status'] == 'pending']
        approved_appointments = [apt for apt in appointments if apt['status'] == 'approved']
        completed_appointments = [apt for apt in appointments if apt['status'] == 'completed']
        
        # Get prediction statistics
        predictions = prediction_model.get_patient_predictions(patient_id)
        recent_predictions = sorted(predictions, key=lambda x: x['created_at'], reverse=True)[:5]
        
        # Get next appointment
        upcoming_appointments = [
            apt for apt in appointments 
            if apt['status'] in ['pending', 'approved'] and 
            datetime.strptime(apt['appointment_date'], '%Y-%m-%d') >= datetime.now()
        ]
        next_appointment = upcoming_appointments[0] if upcoming_appointments else None
        
        return jsonify({
            'appointments': {
                'total': len(appointments),
                'pending': len(pending_appointments),
                'approved': len(approved_appointments),
                'completed': len(completed_appointments),
                'next_appointment': next_appointment
            },
            'predictions': {
                'total': len(predictions),
                'recent': recent_predictions
            }
        }), 200
        
    except Exception as e:
        print(f"Patient dashboard error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@patient_bp.route('/doctors/<doctor_id>/available-slots', methods=['GET'])
@login_required
@patient_required
def get_doctor_available_slots(doctor_id):
    """Get available time slots for a specific doctor on a specific date"""
    try:
        date = request.args.get('date')
        if not date:
            return jsonify({'error': 'Date parameter is required'}), 400
        
        # Get doctor's available time slots
        doctor = user_model.find_user_by_id(doctor_id)
        if not doctor or doctor['user_type'] != 'doctor':
            return jsonify({'error': 'Doctor not found'}), 404
        
        all_slots = doctor.get('available_time_slots', [])
        
        # Get booked slots for the date
        from utils.db import db_instance
        appointments_collection = db_instance.get_collection('appointments')
        from bson import ObjectId
        
        booked_slots = appointments_collection.find({
            'doctor_id': ObjectId(doctor_id),
            'appointment_date': date,
            'status': {'$in': ['pending', 'approved']}
        })
        
        booked_time_slots = [apt['time_slot'] for apt in booked_slots]
        available_slots = [slot for slot in all_slots if slot not in booked_time_slots]
        
        return jsonify({'available_slots': available_slots}), 200
        
    except Exception as e:
        print(f"Get doctor available slots error: {e}")
        return jsonify({'error': 'Internal server error'}), 500