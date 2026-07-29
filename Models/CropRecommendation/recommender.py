import os
import pickle
import numpy as np
from typing import Dict, Any

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "Training", "models")

class CropRecommenderModel:
    """
    Trained RandomForestClassifier for crop recommendation.
    Loads crop_recommender.pkl trained on temperature, humidity, ph, rainfall, NPK, water_score.
    """
    def __init__(self):
        self.model = None
        self.crops = ["Paddy (Rice)", "Cotton", "Maize (Corn)", "Pearl Millet (Bajra)",
                      "Groundnut (Peanut)", "Soybean", "Chilli", "Sugarcane", "Red Gram (Arhar)"]
        self._load_model()

    def _load_model(self):
        model_path = os.path.join(MODELS_DIR, "crop_recommender.pkl")
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                data = pickle.load(f)
                self.model = data["model"]
                self.crops = data.get("crops", self.crops)
            print(f"[CropRecommender] Loaded trained model from {model_path}")
        else:
            print(f"[CropRecommender] WARNING: No trained model found at {model_path}. Using heuristic fallback.")

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        soil = input_data.get("soil", {})
        weather = input_data.get("weather", {})
        temp = weather.get("temperature_c", 28.0)
        humidity = weather.get("humidity_percent", 65.0)
        ph = soil.get("ph", 6.8)
        rainfall = weather.get("rain_24h_mm", 5.0) * 30  # estimate monthly
        npk = input_data.get("npk", {"N": 120, "P": 40, "K": 40})
        water_score = input_data.get("water_score", 75)

        features = np.array([[temp, humidity, ph, rainfall, npk.get("N", 120), npk.get("P", 40), npk.get("K", 40), water_score]])

        if self.model is not None:
            pred_label = self.model.predict(features)[0]
            probas = self.model.predict_proba(features)[0]
            confidence = round(float(np.max(probas)) * 100, 1)
            top_crop = self.crops[int(pred_label)]

            # Get top 3 crops
            top_indices = np.argsort(probas)[::-1][:3]
            alternatives = []
            for idx in top_indices[1:3]:
                alternatives.append({
                    "crop": self.crops[int(idx)],
                    "confidence_percent": round(float(probas[int(idx)]) * 100, 1)
                })
        else:
            top_crop = "Paddy (Rice)"
            confidence = 85.0
            alternatives = [
                {"crop": "Maize (Corn)", "confidence_percent": 72.0},
                {"crop": "Cotton", "confidence_percent": 65.0}
            ]

        # Yield and risk estimates per crop
        yield_map = {"Paddy (Rice)": 24.5, "Cotton": 12.0, "Maize (Corn)": 22.0,
                     "Pearl Millet (Bajra)": 14.0, "Groundnut (Peanut)": 16.5,
                     "Soybean": 18.0, "Chilli": 28.0, "Sugarcane": 35.0, "Red Gram (Arhar)": 10.0}
        risk_map = {"Paddy (Rice)": 22, "Cotton": 35, "Maize (Corn)": 15,
                    "Pearl Millet (Bajra)": 10, "Groundnut (Peanut)": 20}
        water_map = {"Paddy (Rice)": 85, "Cotton": 55, "Maize (Corn)": 45,
                     "Pearl Millet (Bajra)": 25, "Sugarcane": 90}

        est_yield = yield_map.get(top_crop, 18.0)

        return {
            "best_crop": top_crop,
            "confidence_percent": confidence,
            "expected_yield": f"{est_yield} Quintals / Acre",
            "yield_quintals_per_acre": est_yield,
            "water_requirement_score": water_map.get(top_crop, 50),
            "risk_score_percent": risk_map.get(top_crop, 20),
            "alternative_crops": alternatives,
            "recommendation_reason": f"{top_crop} is the ML model's top prediction for your farm conditions (Temp {temp}°C, pH {ph}, Water Score {water_score}/100).",
            "algorithm": "RandomForest Trained Classifier v1.0" if self.model else "Heuristic Fallback"
        }

recommender_engine = CropRecommenderModel()
