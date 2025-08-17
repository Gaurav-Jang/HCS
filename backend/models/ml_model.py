import os
import numpy as np
from tensorflow.keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array

# Load your trained model
MODEL_PATH = "models/model.h5"
model = load_model(MODEL_PATH)

# Class labels (adjust according to your model)
class_labels = ['pituitary', 'glioma', 'notumor', 'meningioma']

# Optional: Brain regions mapping (if your model supports it)
regions = ["Frontal Lobe", "Parietal Lobe", "Occipital Lobe", "Temporal Lobe"]

def predict_mri(image_path):
    """
    Predict tumor type and confidence for the given MRI image.
    """
    IMAGE_SIZE = 128  # your model input size
    img = load_img(image_path, target_size=(IMAGE_SIZE, IMAGE_SIZE))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)

    predicted_index = np.argmax(preds, axis=1)[0]
    confidence = float(np.max(preds, axis=1)[0] * 100)

    # Optionally map region if your model outputs it
    region_index = predicted_index if predicted_index < len(regions) else 0
    region = regions[region_index]

    return {
        "prediction": class_labels[predicted_index],
        "confidence": confidence,
        "region": region
    }
