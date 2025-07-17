# Healthcare Brain Tumor Detection System

A comprehensive healthcare platform focused on brain tumor detection using machine learning, with appointment booking, patient management, and doctor approval workflows.

## 🚀 Features

### 🧠 AI-Powered Brain Tumor Detection
- Upload MRI images for AI analysis
- Real-time tumor detection with confidence scores
- Detailed region analysis of brain scans
- Batch processing for multiple images
- Doctor review and validation of AI predictions

### 👥 Multi-User System
- **Patients**: Register, book appointments, upload MRI scans
- **Doctors**: Review appointments, analyze predictions, manage schedules
- **Admins**: Manage doctors, view system statistics, control access

### 📅 Appointment Management
- Real-time appointment booking with time slot availability
- Doctor approval workflow
- Automated scheduling conflicts prevention
- Appointment status tracking

### 🔒 Security & Authentication
- Role-based access control
- JWT token authentication
- Secure password hashing
- Protected API endpoints

## 🛠 Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **ML Framework**: TensorFlow/Keras
- **Authentication**: JWT tokens
- **Image Processing**: OpenCV, PIL
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React.js
- **UI Components**: React Bootstrap
- **Routing**: React Router
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: Font Awesome

### Machine Learning
- **Model**: Convolutional Neural Network (CNN)
- **Input**: MRI brain images (224x224 pixels)
- **Output**: Binary classification (Tumor/No Tumor)
- **Framework**: TensorFlow 2.x

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB 4.4+
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd healthcare-brain-tumor-detection
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# For Ubuntu/Debian
sudo systemctl start mongod

# For Windows
net start MongoDB
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:
```bash
MONGODB_URI=mongodb://localhost:27017/
SECRET_KEY=your-super-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
```

#### Start the Backend Server
```bash
python app.py
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

#### Start the Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔑 Default Login Credentials

The system comes with pre-configured demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthcare.com | admin123 |
| Doctor | doctor@healthcare.com | doctor123 |
| Patient | patient@healthcare.com | patient123 |

**⚠️ Important**: Change these credentials in production!

## 📱 Usage Guide

### For Patients

1. **Registration**: Sign up with email, personal details, and medical information
2. **MRI Upload**: Upload brain MRI images for AI analysis
3. **Appointment Booking**: 
   - View available doctors
   - Select date and time slots
   - Provide reason and symptoms
4. **View Results**: Check AI predictions and doctor reviews
5. **Manage Appointments**: Track appointment status, cancel if needed

### For Doctors

1. **Login**: Use doctor credentials (must be approved by admin)
2. **Dashboard**: View appointment statistics and pending reviews
3. **Appointment Management**:
   - Approve/reject patient appointments
   - Add notes and recommendations
   - Mark appointments as completed
4. **AI Review**: 
   - Review AI predictions on MRI scans
   - Add professional diagnosis
   - Validate or correct AI results

### For Administrators

1. **System Management**: Monitor overall system health
2. **Doctor Management**:
   - Add new doctors to the system
   - Approve doctor registrations
   - Manage doctor schedules and time slots
3. **Analytics**: View system statistics and usage patterns
4. **User Management**: Monitor patients and appointments

## 🧠 AI Model Details

### Model Architecture
- **Type**: Convolutional Neural Network (CNN)
- **Input Size**: 224x224x3 (RGB images)
- **Layers**: 
  - 4 Convolutional layers with BatchNormalization
  - MaxPooling layers for feature reduction
  - Dense layers for classification
  - Dropout for regularization

### Supported Image Formats
- PNG, JPG, JPEG, GIF, BMP, TIFF
- Maximum file size: 16MB
- Recommended: High-resolution MRI scans

### Model Performance
- **Accuracy**: ~92.5% (demonstration model)
- **Classes**: Binary (Tumor/No Tumor)
- **Confidence Scores**: Provided for each prediction

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Patient registration
- `POST /api/auth/verify-token` - Token verification

### Patient Endpoints
- `GET /api/patient/dashboard` - Patient dashboard
- `GET /api/patient/doctors` - Available doctors
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get appointments
- `GET /api/patient/predictions` - Get predictions

### Doctor Endpoints
- `GET /api/doctor/dashboard` - Doctor dashboard
- `GET /api/doctor/appointments` - Get appointments
- `PUT /api/doctor/appointments/{id}/approve` - Approve appointment
- `GET /api/doctor/predictions` - Get predictions
- `PUT /api/doctor/predictions/{id}/review` - Review prediction

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/doctors` - Add doctor
- `PUT /api/admin/doctors/{id}/approve` - Approve doctor

### ML Endpoints
- `POST /api/ml/predict` - Single image prediction
- `POST /api/ml/batch-predict` - Batch prediction
- `GET /api/ml/model-info` - Model information
- `GET /api/ml/statistics` - Prediction statistics

## 🔧 Development

### Project Structure
```
/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models/                # Database models
│   ├── routes/                # API route handlers
│   ├── utils/                 # Utilities (auth, ML, DB)
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   └── utils/             # Utilities (auth, API)
│   └── package.json           # Node dependencies
└── README.md
```

### Adding New Features

1. **Backend**: Add routes in `/backend/routes/`
2. **Frontend**: Add components in `/frontend/src/components/`
3. **Database**: Add models in `/backend/models/`
4. **ML**: Extend `/backend/utils/ml_model.py`

### Testing

#### Backend Testing
```bash
cd backend
python -m pytest tests/
```

#### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set production values
2. **Database**: Use MongoDB Atlas or dedicated instance
3. **Security**: 
   - Change default passwords
   - Use HTTPS
   - Set secure JWT secrets
4. **ML Model**: Train with production data
5. **Monitoring**: Add logging and monitoring

### Docker Deployment (Optional)

Create `Dockerfile` for containerization:
```dockerfile
# Backend Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This system is for demonstration purposes. For production medical use:
- Validate with real medical data
- Obtain necessary certifications
- Follow medical software regulations
- Ensure HIPAA compliance

## 🔗 Links

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TensorFlow Documentation](https://www.tensorflow.org/)

## 📞 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details

---

Built with ❤️ for healthcare innovation