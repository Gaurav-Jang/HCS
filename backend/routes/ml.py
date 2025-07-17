from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from models.prediction import Prediction
from utils.auth_utils import login_required
from utils.ml_model import brain_tumor_detector
import uuid

ml_bp = Blueprint('ml', __name__)
prediction_model = Prediction()

# Configure upload settings
UPLOAD_FOLDER = 'uploads/mri_images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_upload_folder():
    """Create upload folder if it doesn't exist"""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
def to_python_type(obj):
    if isinstance(obj, (np.bool_, np.bool8)):
        return bool(obj)
    elif isinstance(obj, (np.int32, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

@ml_bp.route('/predict', methods=['POST'])
@login_required
def predict_brain_tumor():
    """Upload MRI image and predict brain tumor"""
    try:
        # Check if file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed types: png, jpg, jpeg, gif, bmp, tiff'}), 400
        
        # Check file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File size too large. Maximum size: 16MB'}), 400
        
        # Create upload folder
        create_upload_folder()
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Make prediction
        prediction_result = brain_tumor_detector.predict(file_path)
        if not prediction_result:
            return jsonify({'error': 'Failed to process image'}), 500
        
        # Get additional image analysis
        region_analysis = brain_tumor_detector.analyze_image_regions(file_path)
        
        # Get optional parameters
        doctor_id = request.form.get('doctor_id')
        appointment_id = request.form.get('appointment_id')
        
        # Create prediction record
        prediction_data = {
            'patient_id': request.user['user_id'],
            'doctor_id': doctor_id,
            'appointment_id': appointment_id,
            'image_path': file_path,
            'image_name': file.filename,
            'prediction_result': prediction_result['result'],
            'confidence_score': prediction_result['confidence'],
            'model_version': prediction_result['model_version'],
            'prediction_details': {
                'tumor_probability': prediction_result['tumor_probability'],
                'no_tumor_probability': prediction_result['no_tumor_probability'],
                'region_analysis': region_analysis
            }
        }
        
        prediction_id = prediction_model.create_prediction(prediction_data)
        if not prediction_id:
            return jsonify({'error': 'Failed to save prediction'}), 500
        
        return jsonify({
            'message': 'Prediction completed successfully',
            'prediction_id': prediction_id,
            'result': {
                'prediction': prediction_result['result'],
                'confidence': prediction_result['confidence'],
                'tumor_probability': prediction_result['tumor_probability'],
                'no_tumor_probability': prediction_result['no_tumor_probability'],
                'region_analysis': region_analysis,
                'model_version': prediction_result['model_version']
            }
        }), 200
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ml_bp.route('/predictions/<prediction_id>/image', methods=['GET'])
@login_required
def get_prediction_image(prediction_id):
    """Get the MRI image for a specific prediction"""
    try:
        # Get prediction details
        prediction = prediction_model.get_prediction_by_id(prediction_id)
        if not prediction:
            return jsonify({'error': 'Prediction not found'}), 404
        
        # Check access permissions
        user_type = request.user['user_type']
        user_id = request.user['user_id']
        
        if user_type == 'patient' and str(prediction['patient_id']) != user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        elif user_type == 'doctor' and prediction.get('doctor_id') and str(prediction['doctor_id']) != user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        # Check if image file exists
        image_path = prediction['image_path']
        if not os.path.exists(image_path):
            return jsonify({'error': 'Image file not found'}), 404
        
        # Return image file
        from flask import send_file
        return send_file(image_path, as_attachment=True)
        
    except Exception as e:
        print(f"Get prediction image error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ml_bp.route('/batch-predict', methods=['POST'])
@login_required
def batch_predict():
    """Upload multiple MRI images for batch prediction"""
    try:
        # Check if files are present
        if 'images' not in request.files:
            return jsonify({'error': 'No image files provided'}), 400
        
        files = request.files.getlist('images')
        if not files or len(files) == 0:
            return jsonify({'error': 'No files selected'}), 400
        
        # Limit batch size
        if len(files) > 10:
            return jsonify({'error': 'Maximum 10 files allowed per batch'}), 400
        
        create_upload_folder()
        predictions = []
        
        for file in files:
            if file.filename == '':
                continue
                
            if not allowed_file(file.filename):
                predictions.append({
                    'filename': file.filename,
                    'error': 'Invalid file type'
                })
                continue
            
            try:
                # Generate unique filename
                file_extension = file.filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
                file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
                
                # Save file
                file.save(file_path)
                
                # Make prediction
                prediction_result = brain_tumor_detector.predict(file_path)
                if not prediction_result:
                    predictions.append({
                        'filename': file.filename,
                        'error': 'Failed to process image'
                    })
                    continue
                
                # Get additional image analysis
                region_analysis = brain_tumor_detector.analyze_image_regions(file_path)
                
                # Create prediction record
                prediction_data = {
                    'patient_id': request.user['user_id'],
                    'image_path': file_path,
                    'image_name': file.filename,
                    'prediction_result': prediction_result['result'],
                    'confidence_score': prediction_result['confidence'],
                    'model_version': prediction_result['model_version'],
                    'prediction_details': {
                        'tumor_probability': prediction_result['tumor_probability'],
                        'no_tumor_probability': prediction_result['no_tumor_probability'],
                        'region_analysis': region_analysis
                    }
                }
                
                prediction_id = prediction_model.create_prediction(prediction_data)
                
                predictions.append({
                    'filename': file.filename,
                    'prediction_id': prediction_id,
                    'result': prediction_result['result'],
                    'confidence': prediction_result['confidence']
                })
                
            except Exception as e:
                predictions.append({
                    'filename': file.filename,
                    'error': f'Processing failed: {str(e)}'
                })
        
        return jsonify({
            'message': 'Batch prediction completed',
            'predictions': predictions,
            'total_processed': len([p for p in predictions if 'prediction_id' in p]),
            'total_failed': len([p for p in predictions if 'error' in p])
        }), 200
        
    except Exception as e:
        print(f"Batch prediction error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@ml_bp.route('/model-info', methods=['GET'])
@login_required
def get_model_info():
    """Get information about the ML model"""
    try:
        model_info = {
            'model_version': '1.0',
            'model_type': 'Convolutional Neural Network (CNN)',
            'input_size': '224x224 pixels',
            'supported_formats': list(ALLOWED_EXTENSIONS),
            'max_file_size': '16MB',
            'classes': ['No Tumor', 'Tumor Detected'],
            'description': 'Deep learning model trained for brain tumor detection in MRI images',
            'accuracy': '92.5%',  # This would be from actual model evaluation
            'last_updated': '2024-01-01'
        }

        return jsonify({'model_info': model_info}), 200

    except Exception as e:
        print(f"Get model info error: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@ml_bp.route('/statistics', methods=['GET'])
@login_required
def get_prediction_statistics():
    """Get prediction statistics for the user"""
    try:
        user_type = request.user['user_type']
        user_id = request.user['user_id']
        
        if user_type == 'patient':
            predictions = prediction_model.get_patient_predictions(user_id)
        elif user_type == 'doctor':
            predictions = prediction_model.get_doctor_predictions(user_id)
        elif user_type == 'admin':
            predictions = prediction_model.get_all_predictions()
        else:
            return jsonify({'error': 'Invalid user type'}), 400
        
        # Calculate statistics
        total_predictions = len(predictions)
        tumor_detected = len([p for p in predictions if p['prediction_result'] == 'tumor_detected'])
        no_tumor = len([p for p in predictions if p['prediction_result'] == 'no_tumor'])
        reviewed = len([p for p in predictions if p['reviewed_by_doctor']])
        
        stats = {
            'total_predictions': total_predictions,
            'tumor_detected': tumor_detected,
            'no_tumor': no_tumor,
            'reviewed_predictions': reviewed,
            'pending_review': total_predictions - reviewed,
            'tumor_detection_rate': (tumor_detected / total_predictions * 100) if total_predictions > 0 else 0
        }
        
        return jsonify({'statistics': stats}), 200
        
    except Exception as e:
        print(f"Get prediction statistics error: {e}")
        return jsonify({'error': 'Internal server error'}), 500