import os
import pickle
import numpy as np
from typing import Dict, Any

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "Training", "models")

class WaterIntelligenceModel:
    """
    Trained RandomForestRegressor for Water Availability Scoring (0-100).
    Loads water_scorer.pkl.
    """
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        model_path = os.path.join(MODELS_DIR, "water_scorer.pkl")
        if os.path.exists(model_path):
            with open(model_path, "rb") as f:
                data = pickle.load(f)
                self.model = data["model"]
            print(f"[WaterScorer] Loaded trained model from {model_path}")
        else:
            print(f"[WaterScorer] WARNING: No trained model. Using heuristic.")

    def score(self, rainfall_mm: float = 120.0, soil_moisture: float = 0.3,
              river_dist_km: float = 5.0, canal_dist_km: float = 3.0,
              groundwater_depth_m: float = 8.0) -> Dict[str, Any]:
        if self.model is not None:
            features = np.array([[rainfall_mm, soil_moisture, river_dist_km, canal_dist_km, groundwater_depth_m]])
            water_score = round(float(self.model.predict(features)[0]), 1)
            water_score = max(5, min(98, water_score))
        else:
            water_score = round(min(
                (rainfall_mm / 350) * 30 + soil_moisture * 50 +
                max(0, (15 - river_dist_km) / 15) * 15 +
                max(0, (10 - canal_dist_km) / 10) * 15 +
                max(0, (20 - groundwater_depth_m) / 20) * 15, 98), 1)

        if water_score >= 75:
            zone = "Green Zone (Adequate Water)"
            irrigation = "Flood irrigation viable. Drip irrigation recommended for cost savings."
        elif water_score >= 45:
            zone = "Yellow Zone (Moderate Water)"
            irrigation = "Sprinkler or drip irrigation strongly recommended. Avoid flood irrigation."
        else:
            zone = "Red Zone (Water Stress)"
            irrigation = "CRITICAL: Drip irrigation mandatory. Consider millets and drought-resistant varieties."

        return {
            "water_availability_score": water_score,
            "zone": zone,
            "irrigation_advisory": irrigation,
            "breakdown": {
                "rainfall_contribution_pct": round(min((rainfall_mm / 350) * 30, 30), 1),
                "soil_moisture_contribution_pct": round(min(soil_moisture * 50, 25), 1),
                "proximity_contribution_pct": round(min(max(0, (15 - river_dist_km) / 15) * 15 + max(0, (10 - canal_dist_km) / 10) * 15, 30), 1),
                "groundwater_contribution_pct": round(min(max(0, (20 - groundwater_depth_m) / 20) * 15, 15), 1),
            },
            "water_saving_tips": [
                "Mulch fields to reduce evaporation by 20-30%",
                "Schedule irrigation during early morning (5-7 AM) to minimize loss",
                "Install rain gauges to track actual rainfall vs forecast"
            ],
            "algorithm": "RandomForest Trained Regressor v1.0" if self.model else "Heuristic Fallback"
        }

water_scorer_engine = WaterIntelligenceModel()
