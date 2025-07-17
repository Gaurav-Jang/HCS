from datetime import datetime
from bson import ObjectId
from utils.db import db_instance

class Prediction:
    def __init__(self):
        self.collection = db_instance.get_collection('predictions')
    
    def create_prediction(self, prediction_data):
        """Create a new prediction record"""
        try:
            prediction_doc = {
                'patient_id': ObjectId(prediction_data['patient_id']),
                'doctor_id': ObjectId(prediction_data.get('doctor_id')) if prediction_data.get('doctor_id') else None,
                'appointment_id': ObjectId(prediction_data.get('appointment_id')) if prediction_data.get('appointment_id') else None,
                'image_path': prediction_data['image_path'],
                'image_name': prediction_data['image_name'],
                'prediction_result': prediction_data['prediction_result'],  # 'tumor_detected', 'no_tumor', 'inconclusive'
                'confidence_score': prediction_data['confidence_score'],
                'model_version': prediction_data.get('model_version', '1.0'),
                'prediction_details': prediction_data.get('prediction_details', {}),
                'created_at': datetime.utcnow(),
                'reviewed_by_doctor': False,
                'doctor_notes': '',
                'final_diagnosis': '',
                'status': 'pending_review'  # pending_review, reviewed, confirmed
            }
            
            result = self.collection.insert_one(prediction_doc)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating prediction: {e}")
            return None
    
    def get_patient_predictions(self, patient_id):
        """Get all predictions for a patient"""
        try:
            pipeline = [
                {'$match': {'patient_id': ObjectId(patient_id)}},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'doctor_id',
                    'foreignField': '_id',
                    'as': 'doctor_info'
                }},
                {'$sort': {'created_at': -1}}
            ]
            return list(self.collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting patient predictions: {e}")
            return []
    
    def get_doctor_predictions(self, doctor_id):
        """Get all predictions assigned to a doctor"""
        try:
            pipeline = [
                {'$match': {'doctor_id': ObjectId(doctor_id)}},
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
            print(f"Error getting doctor predictions: {e}")
            return []
    
    def update_prediction_review(self, prediction_id, doctor_notes, final_diagnosis, status='reviewed'):
        """Update prediction with doctor's review"""
        try:
            update_data = {
                'doctor_notes': doctor_notes,
                'final_diagnosis': final_diagnosis,
                'reviewed_by_doctor': True,
                'status': status,
                'reviewed_at': datetime.utcnow()
            }
            
            result = self.collection.update_one(
                {'_id': ObjectId(prediction_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating prediction review: {e}")
            return False
    
    def get_prediction_by_id(self, prediction_id):
        """Get prediction by ID"""
        try:
            pipeline = [
                {'$match': {'_id': ObjectId(prediction_id)}},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'patient_id',
                    'foreignField': '_id',
                    'as': 'patient_info'
                }},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'doctor_id',
                    'foreignField': '_id',
                    'as': 'doctor_info'
                }}
            ]
            result = list(self.collection.aggregate(pipeline))
            return result[0] if result else None
        except Exception as e:
            print(f"Error getting prediction by ID: {e}")
            return None
    
    def get_all_predictions(self):
        """Get all predictions for admin view"""
        try:
            pipeline = [
                {'$lookup': {
                    'from': 'users',
                    'localField': 'patient_id',
                    'foreignField': '_id',
                    'as': 'patient_info'
                }},
                {'$lookup': {
                    'from': 'users',
                    'localField': 'doctor_id',
                    'foreignField': '_id',
                    'as': 'doctor_info'
                }},
                {'$sort': {'created_at': -1}}
            ]
            return list(self.collection.aggregate(pipeline))
        except Exception as e:
            print(f"Error getting all predictions: {e}")
            return []
    
    def get_predictions_stats(self):
        """Get prediction statistics"""
        try:
            pipeline = [
                {'$group': {
                    '_id': '$prediction_result',
                    'count': {'$sum': 1}
                }}
            ]
            stats = list(self.collection.aggregate(pipeline))
            
            total_predictions = self.collection.count_documents({})
            reviewed_predictions = self.collection.count_documents({'reviewed_by_doctor': True})
            
            return {
                'total_predictions': total_predictions,
                'reviewed_predictions': reviewed_predictions,
                'prediction_breakdown': stats
            }
        except Exception as e:
            print(f"Error getting prediction stats: {e}")
            return {}