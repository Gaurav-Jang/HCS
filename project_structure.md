# Healthcare Brain Tumor Detection System

## Project Structure
```
/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── models/
│   │   ├── user.py           # User models (Admin, Doctor, Patient)
│   │   ├── appointment.py    # Appointment model
│   │   └── prediction.py     # ML prediction model
│   ├── routes/
│   │   ├── auth.py           # Authentication routes
│   │   ├── admin.py          # Admin routes
│   │   ├── doctor.py         # Doctor routes
│   │   ├── patient.py        # Patient routes
│   │   └── ml.py             # ML prediction routes
│   ├── utils/
│   │   ├── db.py             # MongoDB connection
│   │   ├── auth_utils.py     # Authentication utilities
│   │   └── ml_model.py       # Brain tumor detection model
│   ├── ml_models/
│   │   └── brain_tumor_model.h5  # Trained model
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Features
- Admin panel for doctor management
- Patient registration and appointment booking
- Doctor login and appointment approval
- Brain tumor detection from MRI images
- Time slot management for appointments
- Secure authentication system