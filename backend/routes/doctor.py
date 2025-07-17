from flask import Blueprint, request, jsonify
from models.appointment import Appointment
from models.prediction import Prediction
from utils.auth_utils import login_required, doctor_required

doctor_bp = Blueprint('doctor', __name__)
appointment_model = Appointment()
prediction_model = Prediction()

@doctor_bp.route('/appointments', methods=['GET'])
@login_required
@doctor_required
def get_doctor_appointments():
    """Get all appointments for the logged-in doctor"""
    try:
        doctor_id = request.user['user_id']
        appointments = appointment_model.get_doctor_appointments(doctor_id)
        
        return jsonify({'appointments': appointments}), 200
        
    except Exception as e:
        print(f"Get doctor appointments error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/appointments/<appointment_id>/approve', methods=['PUT'])
@login_required
@doctor_required
def approve_appointment(appointment_id):
    """Approve an appointment"""
    try:
        data = request.get_json()
        notes = data.get('notes', '')
        
        success = appointment_model.update_appointment_status(
            appointment_id, 'approved', notes
        )
        
        if success:
            return jsonify({'message': 'Appointment approved successfully'}), 200
        else:
            return jsonify({'error': 'Failed to approve appointment'}), 400
        
    except Exception as e:
        print(f"Approve appointment error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/appointments/<appointment_id>/reject', methods=['PUT'])
@login_required
@doctor_required
def reject_appointment(appointment_id):
    """Reject an appointment"""
    try:
        data = request.get_json()
        notes = data.get('notes', 'Appointment rejected by doctor')
        
        success = appointment_model.update_appointment_status(
            appointment_id, 'rejected', notes
        )
        
        if success:
            return jsonify({'message': 'Appointment rejected'}), 200
        else:
            return jsonify({'error': 'Failed to reject appointment'}), 400
        
    except Exception as e:
        print(f"Reject appointment error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/appointments/<appointment_id>/complete', methods=['PUT'])
@login_required
@doctor_required
def complete_appointment(appointment_id):
    """Mark appointment as completed"""
    try:
        data = request.get_json()
        notes = data.get('notes', '')
        
        success = appointment_model.update_appointment_status(
            appointment_id, 'completed', notes
        )
        
        if success:
            return jsonify({'message': 'Appointment marked as completed'}), 200
        else:
            return jsonify({'error': 'Failed to complete appointment'}), 400
        
    except Exception as e:
        print(f"Complete appointment error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/predictions', methods=['GET'])
@login_required
@doctor_required
def get_doctor_predictions():
    """Get all predictions assigned to the doctor"""
    try:
        doctor_id = request.user['user_id']
        predictions = prediction_model.get_doctor_predictions(doctor_id)
        
        return jsonify({'predictions': predictions}), 200
        
    except Exception as e:
        print(f"Get doctor predictions error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/predictions/<prediction_id>/review', methods=['PUT'])
@login_required
@doctor_required
def review_prediction(prediction_id):
    """Review a prediction with doctor's notes and final diagnosis"""
    try:
        data = request.get_json()
        doctor_notes = data.get('doctor_notes', '')
        final_diagnosis = data.get('final_diagnosis', '')
        
        if not doctor_notes or not final_diagnosis:
            return jsonify({'error': 'Doctor notes and final diagnosis are required'}), 400
        
        success = prediction_model.update_prediction_review(
            prediction_id, doctor_notes, final_diagnosis
        )
        
        if success:
            return jsonify({'message': 'Prediction reviewed successfully'}), 200
        else:
            return jsonify({'error': 'Failed to review prediction'}), 400
        
    except Exception as e:
        print(f"Review prediction error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/dashboard', methods=['GET'])
@login_required
@doctor_required
def doctor_dashboard():
    """Get doctor dashboard statistics"""
    try:
        doctor_id = request.user['user_id']
        
        # Get appointment statistics
        appointments = appointment_model.get_doctor_appointments(doctor_id)
        pending_appointments = [apt for apt in appointments if apt['status'] == 'pending']
        approved_appointments = [apt for apt in appointments if apt['status'] == 'approved']
        completed_appointments = [apt for apt in appointments if apt['status'] == 'completed']
        
        # Get prediction statistics
        predictions = prediction_model.get_doctor_predictions(doctor_id)
        pending_reviews = [pred for pred in predictions if not pred['reviewed_by_doctor']]
        
        return jsonify({
            'appointments': {
                'total': len(appointments),
                'pending': len(pending_appointments),
                'approved': len(approved_appointments),
                'completed': len(completed_appointments)
            },
            'predictions': {
                'total': len(predictions),
                'pending_review': len(pending_reviews),
                'reviewed': len(predictions) - len(pending_reviews)
            }
        }), 200
        
    except Exception as e:
        print(f"Doctor dashboard error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@doctor_bp.route('/schedule', methods=['GET'])
@login_required
@doctor_required
def get_doctor_schedule():
    """Get doctor's schedule for a specific date"""
    try:
        date = request.args.get('date')
        if not date:
            return jsonify({'error': 'Date parameter is required'}), 400
        
        doctor_id = request.user['user_id']
        
        # Get appointments for the specific date
        from utils.db import db_instance
        appointments_collection = db_instance.get_collection('appointments')
        
        pipeline = [
            {'$match': {
                'doctor_id': appointment_model.collection.database.client.get_database().get_collection('users').find_one({'_id': doctor_id})['_id'],
                'appointment_date': date,
                'status': {'$in': ['pending', 'approved']}
            }},
            {'$lookup': {
                'from': 'users',
                'localField': 'patient_id',
                'foreignField': '_id',
                'as': 'patient_info'
            }}
        ]
        
        scheduled_appointments = list(appointments_collection.aggregate(pipeline))
        
        return jsonify({'schedule': scheduled_appointments}), 200
        
    except Exception as e:
        print(f"Get doctor schedule error: {e}")
        return jsonify({'error': 'Internal server error'}), 500