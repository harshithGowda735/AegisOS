import joblib
import pandas as pd
import os
import numpy as np

class DiabetesPredictor:
    def __init__(self):
        self.lr_model = None
        self.rf_model = None
        self.scaler = None
        self.features = None
        self.is_initialized = False
        self.init_models()

    def init_models(self):
        base_path = "app/models/"
        try:
            if os.path.exists(f"{base_path}diabetes_lr_model.pkl"):
                self.lr_model = joblib.load(f"{base_path}diabetes_lr_model.pkl")
                self.rf_model = joblib.load(f"{base_path}diabetes_rf_model.pkl")
                self.scaler = joblib.load(f"{base_path}diabetes_scaler.pkl")
                self.features = joblib.load(f"{base_path}diabetes_features.pkl")
                self.is_initialized = True
                print("[OK] Models loaded successfully.")
            else:
                print("[WARN] Models not found. AI Engine running in DEMO mode.")
        except Exception as e:
            print(f"[ERROR] Error loading models: {e}")

    def predict(self, input_data: dict, model_type="lr"):
        if not self.is_initialized:
            # Fallback Demo Mode logic
            bmi = input_data.get("BMI", 25)
            age = input_data.get("Age", 40)
            risk = 0.1
            if bmi > 30: risk += 0.4
            if age > 50: risk += 0.3
            
            risk_level = "High" if risk > 0.6 else "Moderate" if risk > 0.3 else "Low"
            confidence = abs(risk - 0.5) * 2
            message = f"{risk_level} risk detected. Probability: {risk:.1%}"

            return {
                "status": "demo",
                "risk": risk_level,
                "probability": risk,
                "confidence": round(confidence, 2),
                "message": message,
                "prediction": 1 if risk > 0.5 else 0,
                "top_factors": ["BMI" if bmi > 30 else "Age" if age > 50 else "General Health"]
            }

        # Real Inference
        df = pd.DataFrame([input_data])
        
        if model_type == "lr":
            input_sc = self.scaler.transform(df[self.features])
            prob = self.lr_model.predict_proba(input_sc)[0][1]
            pred = self.lr_model.predict(input_sc)[0]
        else:
            prob = self.rf_model.predict_proba(df[self.features])[0][1]
            pred = self.rf_model.predict(df[self.features])[0]

        risk_level = "High" if prob > 0.7 else "Moderate" if prob > 0.3 else "Low"

        # Feature importance for this specific prediction
        top_factors = ["BMI", "HighBP", "GenHlth"] # Simplified for now

        # Confidence as the absolute difference from 0.5
        confidence = abs(prob - 0.5) * 2  # Scale to 0-1

        message = f"{risk_level} risk detected. Probability: {prob:.1%}"

        return {
            "status": "active",
            "risk": risk_level,
            "probability": prob,
            "confidence": round(confidence, 2),
            "message": message,
            "prediction": int(pred),
            "top_factors": top_factors
        }

# Feature ranges for validation
FEATURE_RANGES = {
    "BMI": {"min": 12, "max": 98},
    "Age": {"min": 1, "max": 13},
    "HighBP": {"min": 0, "max": 1},
    "HighChol": {"min": 0, "max": 1},
    "PhysActivity": {"min": 0, "max": 1},
    "Smoker": {"min": 0, "max": 1},
    "GenHlth": {"min": 1, "max": 5},
    "MentHlth": {"min": 0, "max": 30},
    "PhysHlth": {"min": 0, "max": 30},
    "DiffWalk": {"min": 0, "max": 1},
    "Stroke": {"min": 0, "max": 1},
    "HeartDiseaseorAttack": {"min": 0, "max": 1},
    "Sex": {"min": 0, "max": 1},
    "Education": {"min": 1, "max": 6},
    "Income": {"min": 1, "max": 8},
    "Fruits": {"min": 0, "max": 1},
    "Veggies": {"min": 0, "max": 1},
    "HvyAlcoholConsump": {"min": 0, "max": 1},
    "AnyHealthcare": {"min": 0, "max": 1},
    "NoDocbcCost": {"min": 0, "max": 1},
    "CholCheck": {"min": 0, "max": 1},
}

def predict_risk(data, use_model="lr"):
    return predictor.predict(data, model_type=use_model)

# Global Instance
predictor = DiabetesPredictor()
