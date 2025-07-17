from datetime import datetime
from bson import ObjectId
import bcrypt
from utils.db import db_instance

class User:
    def __init__(self):
        self.collection = db_instance.get_collection('users')
        print("DEBUG: users collection is", self.collection)
    def create_user(self, user_data):
        """Create a new user"""
        try:
            # Hash password
            password = user_data['password'].encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            
            user_doc = {
                'email': user_data['email'],
                'password': hashed_password,
                'user_type': user_data['user_type'],  # 'admin', 'doctor', 'patient'
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'phone': user_data.get('phone', ''),
                'created_at': datetime.utcnow(),
                'is_active': True
            }
            
            # Add role-specific fields
            if user_data['user_type'] == 'doctor':
                user_doc.update({
                    'specialization': user_data.get('specialization', 'Neurology'),
                    'license_number': user_data.get('license_number', ''),
                    'experience_years': user_data.get('experience_years', 0),
                    'available_time_slots': user_data.get('available_time_slots', []),
                    'approved_by_admin': False
                })
            elif user_data['user_type'] == 'patient':
                user_doc.update({
                    'date_of_birth': user_data.get('date_of_birth'),
                    'gender': user_data.get('gender', ''),
                    'medical_history': user_data.get('medical_history', []),
                    'emergency_contact': user_data.get('emergency_contact', {})
                })
            
            result = self.collection.insert_one(user_doc)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def find_user_by_email(self, email):
        """Find user by email"""
        try:
            return self.collection.find_one({'email': email})
        except Exception as e:
            print(f"Error finding user: {e}")
            return None
    
    def find_user_by_id(self, user_id):
        """Find user by ID"""
        try:
            return self.collection.find_one({'_id': ObjectId(user_id)})
        except Exception as e:
            print(f"Error finding user by ID: {e}")
            return None
    
    def verify_password(self, password, hashed_password):
        """Verify password"""
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password)
        except Exception as e:
            print(f"Error verifying password: {e}")
            return False
    
    def get_all_doctors(self):
        """Get all doctors"""
        try:
            return list(self.collection.find({'user_type': 'doctor'}))
        except Exception as e:
            print(f"Error getting doctors: {e}")
            return []
    
    def approve_doctor(self, doctor_id):
        """Approve doctor by admin"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(doctor_id)},
                {'$set': {'approved_by_admin': True}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error approving doctor: {e}")
            return False
    
    def update_doctor_time_slots(self, doctor_id, time_slots):
        """Update doctor's available time slots"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(doctor_id)},
                {'$set': {'available_time_slots': time_slots}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating time slots: {e}")
            return False
    
    def get_approved_doctors(self):
        """Get all approved doctors"""
        try:
            return list(self.collection.find({
                'user_type': 'doctor',
                'approved_by_admin': True,
                'is_active': True
            }))
        except Exception as e:
            print(f"Error getting approved doctors: {e}")
            return []