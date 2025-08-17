from flask import Blueprint, request, jsonify
import os
import uuid
from models.ml_model import predict_mri

ml_bp = Blueprint('ml', __name__)

UPLOAD_FOLDER = 'uploads/mri_images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@ml_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No image uploaded"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"}), 400

    # Save uploaded image
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        result = predict_mri(filepath)
        return jsonify({
            "success": True,
            "data": {
                "prediction": result["prediction"],
                "confidence": result["confidence"],  # as number for frontend
                "region": result["region"],
                "image": filepath
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
