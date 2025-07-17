from datetime import datetime
from bson import ObjectId
from utils.db import db_instance

class Appointment:
    def __init__(self):
        self.collection = db_instance.get_collection('appointments')
    
    def create_appointment(self, appointment_data):
        """Create a new appointment"""
        try:
            appointment_doc = {
                'patient_id': ObjectId(appointment_data['patient_id']),
                'doctor_id': ObjectId(appointment_data['doctor_id']),
                'appointment_date': appointment_data['appointment_date'],
                'time_slot': appointment_data['time_slot'],
                'reason': appointment_data.get('reason', ''),
                'symptoms': appointment_data.get('symptoms', ''),
                'status': 'pending',  # pending, approved, rejected, completed, cancelled
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'notes': appointment_data.get('notes', ''),
                'priority': appointment_data.get('priority', 'normal')  # normal, urgent, emergency
            }
            
            result = self.collection.insert_one(appointment_doc)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating appointment: {e}")
            return None
    
    def get_patient_appointments(self, patient_id):
        """Get all appointments for a patient"""
        try:
            pipeline = [
                {'$match': {'patient_id': ObjectId(patient_id)}},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'doctor_id',
                    'foreignField': '_id',
                    'as': 'doctor_info'
                }},
                {'$sort': {'appointment_date': 1}}
            ]
            return list(self.collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting patient appointments: {e}")
            return []
    
    def get_doctor_appointments(self, doctor_id):
        """Get all appointments for a doctor"""
        try:
            pipeline = [
                {'$match': {'doctor_id': ObjectId(doctor_id)}},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'patient_id',
                    'foreignField': '_id',
                    'as': 'patient_info'
                }},
                {'$sort': {'appointment_date': 1}}
            ]
            return list(self.collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting doctor appointments: {e}")
            return []
    
    def update_appointment_status(self, appointment_id, status, notes=None):
        """Update appointment status"""
        try:
            update_data = {
                'status': status,
                'updated_at': datetime.utcnow()
            }
            if notes:
                update_data['doctor_notes'] = notes
            
            result = self.collection.update_one(
                {'_id': ObjectId(appointment_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating appointment status: {e}")
            return False
    
    def get_appointment_by_id(self, appointment_id):
        """Get appointment by ID"""
        try:
            pipeline = [
                {'$match': {'_id': ObjectId(appointment_id)}},
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
                }}
            ]
            result = list(self.collection.aggregate(pipeline))
            return result[0] if result else None
        except Exception as e:
            print(f"Error getting appointment by ID: {e}")
            return None
    
    def check_time_slot_availability(self, doctor_id, appointment_date, time_slot):
        """Check if time slot is available for doctor"""
        try:
            existing_appointment = self.collection.find_one({
                'doctor_id': ObjectId(doctor_id),
                'appointment_date': appointment_date,
                'time_slot': time_slot,
                'status': {'$in': ['pending', 'approved']}
            })
            return existing_appointment is None
        except Exception as e:
            print(f"Error checking time slot availability: {e}")
            return False
    
    def get_pending_appointments(self):
        """Get all pending appointments for admin view"""
        try:
            pipeline = [
                {'$match': {'status': 'pending'}},
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
            return list(self.collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting pending appointments: {e}")
            return []