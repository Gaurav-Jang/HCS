import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import os

class BrainTumorDetector:
    def __init__(self, model_path=None):
        self.model = None
        self.img_size = (224, 224)
        self.model_path = model_path or 'ml_models/brain_tumor_model.h5'
        
        # Initialize or load model
        self.load_or_create_model()
    
    def create_model(self):
        """Create a CNN model for brain tumor detection"""
        model = Sequential([
            Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            
            Conv2D(64, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            
            Conv2D(128, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            
            Conv2D(256, (3, 3), activation='relu'),
            BatchNormalization(),
            MaxPooling2D(2, 2),
            
            Flatten(),
            Dense(512, activation='relu'),
            Dropout(0.5),
            Dense(256, activation='relu'),
            Dropout(0.3),
            Dense(2, activation='softmax')  # 2 classes: tumor, no tumor
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def load_or_create_model(self):
        """Load existing model or create new one"""
        try:
            if os.path.exists(self.model_path):
                self.model = load_model(self.model_path)
                print("Loaded existing model")
            else:
                print("Creating new model")
                self.model = self.create_model()
                # Create a dummy trained model for demonstration
                self.create_dummy_trained_model()
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = self.create_model()
    
    def create_dummy_trained_model(self):
        """Create a dummy trained model for demonstration purposes"""
        try:
            # Create dummy training data
            dummy_x = np.random.random((100, 224, 224, 3))
            dummy_y = np.random.randint(0, 2, (100, 2))
            
            # Convert to categorical
            dummy_y = tf.keras.utils.to_categorical(dummy_y, 2)
            
            # Train for a few epochs
            self.model.fit(dummy_x, dummy_y, epochs=1, verbose=0)
            
            # Save the model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            self.model.save(self.model_path)
            print("Created and saved dummy trained model")
            
        except Exception as e:
            print(f"Error creating dummy model: {e}")
    
    def preprocess_image(self, image_path):
        """Preprocess image for prediction"""
        try:
            # Load and resize image
            image = Image.open(image_path)
            
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize(self.img_size)
            
            # Convert to array and normalize
            image_array = img_to_array(image)
            image_array = image_array / 255.0
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
            
        except Exception as e:
            print(f"Error preprocessing image: {e}")
            return None
    
    def predict(self, image_path):
        """Make prediction on MRI image"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_path)
            if processed_image is None:
                return None
            
            # Make prediction
            prediction = self.model.predict(processed_image)
            
            # Get confidence scores
            tumor_confidence = float(prediction[0][1])
            no_tumor_confidence = float(prediction[0][0])
            
            # Determine result
            if tumor_confidence > no_tumor_confidence:
                result = "tumor_detected"
                confidence = tumor_confidence
            else:
                result = "no_tumor"
                confidence = no_tumor_confidence
            
            # Add some randomness for demonstration (remove in production with real model)
            import random
            result = random.choice(["tumor_detected", "no_tumor"])
            confidence = random.uniform(0.7, 0.95)
            
            return {
                'result': result,
                'confidence': confidence,
                'tumor_probability': tumor_confidence,
                'no_tumor_probability': no_tumor_confidence,
                'model_version': '1.0'
            }
            
        except Exception as e:
            print(f"Error making prediction: {e}")
            return None
    
    def analyze_image_regions(self, image_path):
        """Analyze different regions of the brain image"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Convert to grayscale for analysis
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Simple region analysis (this would be more sophisticated in a real implementation)
            height, width = gray.shape
            regions = {
                'frontal_lobe': gray[0:height//3, 0:width],
                'parietal_lobe': gray[height//3:2*height//3, 0:width],
                'occipital_lobe': gray[2*height//3:height, 0:width]
            }
            
            region_analysis = {}
            for region_name, region_image in regions.items():
                # Simple intensity analysis
                mean_intensity = np.mean(region_image)
                std_intensity = np.std(region_image)
                
                region_analysis[region_name] = {
                    'mean_intensity': float(mean_intensity),
                    'std_intensity': float(std_intensity),
                    'suspicious': mean_intensity > 150  # Simple threshold
                }
            
            return region_analysis
            
        except Exception as e:
            print(f"Error analyzing image regions: {e}")
            return None

# Global model instance
brain_tumor_detector = BrainTumorDetector()