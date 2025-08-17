from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Database connection
from utils.db import db_instance

# Route blueprints
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.doctor import doctor_bp
from routes.patient import patient_bp
from routes.ml import ml_bp  # ML prediction routes

# Load environment variables from .env
load_dotenv()

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)

    # Basic configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # Allow up to 32MB for MRI images

    # Enable CORS for frontend applications
    CORS(app,
         origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
         allow_headers=[
             'Content-Type', 'Authorization', 'Access-Control-Allow-Headers',
             'Origin', 'Accept', 'X-Requested-With'
         ],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         supports_credentials=True
    )

    # Initialize database connection
    if not db_instance.connect():
        print("Failed to connect to database!")
        return None

    # Register all blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(doctor_bp, url_prefix='/api/doctor')
    app.register_blueprint(patient_bp, url_prefix='/api/patient')
    app.register_blueprint(ml_bp, url_prefix='/api/ml')

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Healthcare Brain Tumor Detection System API is running',
            'version': '1.0.0'
        }), 200

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'File too large. Maximum size: 32MB'}), 413

    # Create default admin user
    create_default_admin()

    return app

def create_default_admin():
    """Create default admin user if not exists"""
    try:
        from models.user import User
        user_model = User()

        admin_email = 'admin@healthcare.com'
        existing_admin = user_model.find_user_by_email(admin_email)

        if not existing_admin:
            print("Creating default admin...")
            admin_data = {
                'email': admin_email,
                'password': 'admin123',  # Change in production
                'user_type': 'admin',
                'first_name': 'System',
                'last_name': 'Administrator',
                'phone': '+1234567890'
            }
            admin_id = user_model.create_user(admin_data)
            if admin_id:
                print(f"Default admin created: {admin_email} / admin123")
            else:
                print("Failed to create default admin")
        else:
            print("Admin user already exists")
    except Exception as e:
        print(f"Error creating default admin: {e}")

def create_sample_data():
    """Create sample doctor and patient for testing"""
    try:
        from models.user import User
        user_model = User()

        # Sample doctor
        doctor_email = 'doctor@healthcare.com'
        if not user_model.find_user_by_email(doctor_email):
            doctor_data = {
                'email': doctor_email,
                'password': 'doctor123',
                'user_type': 'doctor',
                'first_name': 'Dr. John',
                'last_name': 'Smith',
                'phone': '+1234567891',
                'specialization': 'Neurology',
                'license_number': 'MD12345',
                'experience_years': 10,
                'available_time_slots': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
            }
            doctor_id = user_model.create_user(doctor_data)
            if doctor_id:
                user_model.approve_doctor(doctor_id)
                print(f"Sample doctor created: {doctor_email} / doctor123")

        # Sample patient
        patient_email = 'patient@healthcare.com'
        if not user_model.find_user_by_email(patient_email):
            patient_data = {
                'email': patient_email,
                'password': 'patient123',
                'user_type': 'patient',
                'first_name': 'Jane',
                'last_name': 'Doe',
                'phone': '+1234567892',
                'date_of_birth': '1990-01-01',
                'gender': 'Female'
            }
            patient_id = user_model.create_user(patient_data)
            if patient_id:
                print(f"Sample patient created: {patient_email} / patient123")
    except Exception as e:
        print(f"Error creating sample data: {e}")

if __name__ == '__main__':
    app = create_app()
    if app:
        # Create sample data for testing
        create_sample_data()

        print("\n" + "="*50)
        print("Healthcare Brain Tumor Detection System API")
        print("="*50)
        print("API Server starting on http://localhost:5001")
        print("\nDefault login credentials:")
        print("Admin: admin@healthcare.com / admin123")
        print("Doctor: doctor@healthcare.com / doctor123")
        print("Patient: patient@healthcare.com / patient123")
        print("="*50 + "\n")

        app.run(host='0.0.0.0', port=5001, debug=True)
    else:
        print("Failed to create application!")
