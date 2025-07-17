from flask import Blueprint, request, jsonify
from models.user import User
from models.appointment import Appointment
from models.prediction import Prediction
from utils.auth_utils import login_required, admin_required

admin_bp = Blueprint('admin', __name__)
user_model = User()
appointment_model = Appointment()
prediction_model = Prediction()

@admin_bp.route('/dashboard', methods=['GET'])
@login_required
@admin_required
def admin_dashboard():
    """Get admin dashboard statistics"""
    try:
        # Get all doctors
        all_doctors = user_model.get_all_doctors()
        approved_doctors = [doc for doc in all_doctors if doc.get('approved_by_admin', False)]
        pending_doctors = [doc for doc in all_doctors if not doc.get('approved_by_admin', False)]
        
        # Get patient count
        from utils.db import db_instance
        users_collection = db_instance.get_collection('users')
        patient_count = users_collection.count_documents({'user_type': 'patient'})
        
        # Get appointment statistics
        pending_appointments = appointment_model.get_pending_appointments()
        appointments_collection = db_instance.get_collection('appointments')
        total_appointments = appointments_collection.count_documents({})
        
        # Get prediction statistics
        prediction_stats = prediction_model.get_predictions_stats()
        
        return jsonify({
            'doctors': {
                'total': len(all_doctors),
                'approved': len(approved_doctors),
                'pending': len(pending_doctors)
            },
            'patients': {
                'total': patient_count
            },
            'appointments': {
                'total': total_appointments,
                'pending': len(pending_appointments)
            },
            'predictions': prediction_stats
        }), 200
        
    except Exception as e:
        print(f"Admin dashboard error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/doctors', methods=['GET'])
@login_required
@admin_required
def get_all_doctors():
    """Get all doctors with their details"""
    try:
        doctors = user_model.get_all_doctors()
        
        # Remove passwords and format response
        doctors_data = []
        for doctor in doctors:
            doctor_data = {
                'id': str(doctor['_id']),
                'email': doctor['email'],
                'first_name': doctor['first_name'],
                'last_name': doctor['last_name'],
                'phone': doctor.get('phone', ''),
                'specialization': doctor.get('specialization', ''),
                'license_number': doctor.get('license_number', ''),
                'experience_years': doctor.get('experience_years', 0),
                'approved_by_admin': doctor.get('approved_by_admin', False),
                'is_active': doctor.get('is_active', True),
                'created_at': doctor.get('created_at'),
                'available_time_slots': doctor.get('available_time_slots', [])
            }
            doctors_data.append(doctor_data)
        
        return jsonify({'doctors': doctors_data}), 200
        
    except Exception as e:
        print(f"Get doctors error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/doctors/<doctor_id>/approve', methods=['PUT'])
@login_required
@admin_required
def approve_doctor(doctor_id):
    """Approve a doctor"""
    try:
        success = user_model.approve_doctor(doctor_id)
        if success:
            return jsonify({'message': 'Doctor approved successfully'}), 200
        else:
            return jsonify({'error': 'Failed to approve doctor'}), 400
        
    except Exception as e:
        print(f"Approve doctor error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/doctors', methods=['POST'])
@login_required
@admin_required
def add_doctor():
    """Add a new doctor"""
    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'phone', 'specialization', 'license_number']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if doctor already exists
        existing_user = user_model.find_user_by_email(data['email'])
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create doctor user
        user_data = {
            'email': data['email'],
            'password': data['password'],
            'user_type': 'doctor',
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'phone': data['phone'],
            'specialization': data['specialization'],
            'license_number': data['license_number'],
            'experience_years': data.get('experience_years', 0),
            'available_time_slots': data.get('available_time_slots', [
                '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
            ])
        }
        
        user_id = user_model.create_user(user_data)
        if not user_id:
            return jsonify({'error': 'Failed to create doctor'}), 500
        
        # Auto-approve since added by admin
        user_model.approve_doctor(user_id)
        
        return jsonify({
            'message': 'Doctor added successfully',
            'doctor_id': user_id
        }), 201
        
    except Exception as e:
        print(f"Add doctor error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/patients', methods=['GET'])
@login_required
@admin_required
def get_all_patients():
    """Get all patients"""
    try:
        from utils.db import db_instance
        users_collection = db_instance.get_collection('users')
        patients = list(users_collection.find({'user_type': 'patient'}))
        
        # Remove passwords and format response
        patients_data = []
        for patient in patients:
            patient_data = {
                'id': str(patient['_id']),
                'email': patient['email'],
                'first_name': patient['first_name'],
                'last_name': patient['last_name'],
                'phone': patient.get('phone', ''),
                'date_of_birth': patient.get('date_of_birth'),
                'gender': patient.get('gender', ''),
                'is_active': patient.get('is_active', True),
                'created_at': patient.get('created_at')
            }
            patients_data.append(patient_data)
        
        return jsonify({'patients': patients_data}), 200
        
    except Exception as e:
        print(f"Get patients error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/appointments', methods=['GET'])
@login_required
@admin_required
def get_all_appointments():
    """Get all appointments"""
    try:
        from utils.db import db_instance
        appointments_collection = db_instance.get_collection('appointments')
        
        pipeline = [
            {'$lookup': {
                'from': 'users',
                'localField': 'doctor_id',
                'foreignField': '_id',
                'as': 'doctor_info'
            }},
            {'$lookup': {
                'from': 'users',
                'localField': 'patient_id',
                'foreignField': '_id',
                'as': 'patient_info'
            }},
            {'$sort': {'created_at': -1}}
        ]
        
        appointments = list(appointments_collection.aggregate(pipeline))
        
        return jsonify({'appointments': appointments}), 200
        
    except Exception as e:
        print(f"Get appointments error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/predictions', methods=['GET'])
@login_required
@admin_required
def get_all_predictions():
    """Get all predictions"""
    try:
        predictions = prediction_model.get_all_predictions()
        return jsonify({'predictions': predictions}), 200
        
    except Exception as e:
        print(f"Get predictions error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/doctors/<doctor_id>/time-slots', methods=['PUT'])
@login_required
@admin_required
def update_doctor_time_slots(doctor_id):
    """Update doctor's available time slots"""
    try:
        data = request.get_json()
        time_slots = data.get('time_slots', [])
        
        success = user_model.update_doctor_time_slots(doctor_id, time_slots)
        if success:
            return jsonify({'message': 'Time slots updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update time slots'}), 400
        
    except Exception as e:
        print(f"Update time slots error: {e}")
        return jsonify({'error': 'Internal server error'}), 500