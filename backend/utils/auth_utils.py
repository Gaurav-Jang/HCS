import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models.user import User

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

def generate_token(user_data):
    """Generate JWT token for user"""
    try:
        payload = {
            'user_id': str(user_data['_id']),
            'email': user_data['email'],
            'user_type': user_data['user_type'],
            'exp': datetime.utcnow() + timedelta(days=7)  # Token expires in 7 days
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return token
    except Exception as e:
        print(f"Error generating token: {e}")
        return None

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def login_required(f):
    """Decorator to require login for protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = verify_token(token)
            if not payload:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            # Add user info to request context
            request.user = payload
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
    
    return decorated

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'user') or request.user.get('user_type') != 'admin':
            return jsonify({'error': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    
    return decorated

def doctor_required(f):
    """Decorator to require doctor privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'user') or request.user.get('user_type') not in ['admin', 'doctor']:
            return jsonify({'error': 'Doctor privileges required'}), 403
        return f(*args, **kwargs)
    
    return decorated

def patient_required(f):
    """Decorator to require patient privileges"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(request, 'user') or request.user.get('user_type') not in ['admin', 'patient']:
            return jsonify({'error': 'Patient privileges required'}), 403
        return f(*args, **kwargs)
    
    return decorated

def get_current_user():
    """Get current user from request context"""
    if hasattr(request, 'user'):
        user_model = User()
        return user_model.find_user_by_id(request.user['user_id'])
    return None