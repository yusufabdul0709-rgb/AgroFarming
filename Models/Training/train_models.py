"""
ApnaKissan ML Model Training Pipeline
Trains 4 core ML models on synthetic agricultural datasets and saves .pkl weights.
Run: python -m Models.Training.train_models
"""
import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, r2_score
import pickle

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "datasets")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATASETS_DIR, exist_ok=True)

np.random.seed(42)

# ============================================================================
# 1. CROP RECOMMENDATION MODEL (RandomForestClassifier)
# Features: temperature, humidity, ph, rainfall, N, P, K, water_score
# Target: crop_label (0-8 mapped to crop names)
# ============================================================================
def train_crop_recommender():
    print("[1/4] Training Crop Recommendation Model...")
    CROPS = ["Paddy (Rice)", "Cotton", "Maize (Corn)", "Pearl Millet (Bajra)",
             "Groundnut (Peanut)", "Soybean", "Chilli", "Sugarcane", "Red Gram (Arhar)"]
    n = 2000
    temperature = np.random.uniform(18, 42, n)
    humidity = np.random.uniform(30, 95, n)
    ph = np.random.uniform(4.5, 9.0, n)
    rainfall = np.random.uniform(20, 300, n)
    N = np.random.uniform(10, 200, n)
    P = np.random.uniform(5, 100, n)
    K = np.random.uniform(5, 100, n)
    water_score = np.random.uniform(10, 98, n)

    # Generate realistic crop labels based on feature conditions
    labels = []
    for i in range(n):
        if water_score[i] > 70 and rainfall[i] > 150 and temperature[i] > 22:
            labels.append(0)  # Paddy
        elif ph[i] > 6.5 and temperature[i] > 25 and water_score[i] > 40:
            labels.append(1)  # Cotton
        elif 20 <= temperature[i] <= 32 and 6.0 <= ph[i] <= 7.5:
            labels.append(2)  # Maize
        elif water_score[i] < 50 and temperature[i] > 28:
            labels.append(3)  # Pearl Millet (drought resilient)
        elif ph[i] < 7.0 and temperature[i] > 24 and humidity[i] < 70:
            labels.append(4)  # Groundnut
        elif rainfall[i] > 100 and N[i] > 80:
            labels.append(5)  # Soybean
        elif temperature[i] > 25 and humidity[i] > 60:
            labels.append(6)  # Chilli
        elif water_score[i] > 75 and temperature[i] > 20:
            labels.append(7)  # Sugarcane
        else:
            labels.append(8)  # Red Gram

    X = np.column_stack([temperature, humidity, ph, rainfall, N, P, K, water_score])
    y = np.array(labels)

    # Save dataset
    df = pd.DataFrame(X, columns=["temperature", "humidity", "ph", "rainfall", "N", "P", "K", "water_score"])
    df["crop_label"] = y
    df["crop_name"] = [CROPS[l] for l in y]
    df.to_csv(os.path.join(DATASETS_DIR, "crop_recommendation_dataset.csv"), index=False)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=12)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"    Accuracy: {acc*100:.1f}%")

    model_path = os.path.join(MODELS_DIR, "crop_recommender.pkl")
    with open(model_path, "wb") as f:
        pickle.dump({"model": model, "crops": CROPS, "features": ["temperature", "humidity", "ph", "rainfall", "N", "P", "K", "water_score"]}, f)
    print(f"    Saved: {model_path}")
    return acc

# ============================================================================
# 2. YIELD PREDICTION MODEL (RandomForestRegressor)
# Features: temperature, humidity, rainfall, ph, N, P, K, water_score, land_acres
# Target: yield_quintals_per_acre
# ============================================================================
def train_yield_predictor():
    print("[2/4] Training Yield Prediction Model...")
    n = 1500
    temperature = np.random.uniform(18, 40, n)
    humidity = np.random.uniform(30, 95, n)
    rainfall = np.random.uniform(20, 300, n)
    ph = np.random.uniform(4.5, 9.0, n)
    N = np.random.uniform(10, 200, n)
    P = np.random.uniform(5, 100, n)
    K = np.random.uniform(5, 100, n)
    water_score = np.random.uniform(10, 98, n)
    land_acres = np.random.uniform(0.5, 25, n)

    # Realistic yield calculation
    base_yield = 18.0
    yield_vals = (base_yield
        + (water_score / 100) * 8
        + (N / 200) * 4
        + np.where((temperature > 20) & (temperature < 35), 3, -2)
        + np.where(rainfall > 80, 2, -1)
        + np.random.normal(0, 1.5, n))
    yield_vals = np.clip(yield_vals, 5, 40)

    X = np.column_stack([temperature, humidity, rainfall, ph, N, P, K, water_score, land_acres])
    y = yield_vals

    df = pd.DataFrame(X, columns=["temperature", "humidity", "rainfall", "ph", "N", "P", "K", "water_score", "land_acres"])
    df["yield_qtl_per_acre"] = y
    df.to_csv(os.path.join(DATASETS_DIR, "yield_prediction_dataset.csv"), index=False)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    r2 = r2_score(y_test, model.predict(X_test))
    print(f"    R² Score: {r2:.3f}")

    model_path = os.path.join(MODELS_DIR, "yield_predictor.pkl")
    with open(model_path, "wb") as f:
        pickle.dump({"model": model, "features": ["temperature", "humidity", "rainfall", "ph", "N", "P", "K", "water_score", "land_acres"]}, f)
    print(f"    Saved: {model_path}")
    return r2

# ============================================================================
# 3. PRICE FORECASTER MODEL (GradientBoostingRegressor)
# Features: current_price, month, season_idx, rainfall_mm, production_tonnes
# Target: future_price
# ============================================================================
def train_price_forecaster():
    print("[3/4] Training Price Forecasting Model...")
    n = 1800
    current_price = np.random.uniform(1500, 8000, n)
    month = np.random.randint(1, 13, n)
    season_idx = np.where(month <= 3, 0, np.where(month <= 6, 1, np.where(month <= 9, 2, 3)))
    rainfall_mm = np.random.uniform(20, 300, n)
    production_tonnes = np.random.uniform(100, 10000, n)

    # Price movement based on supply/demand dynamics
    seasonal_factor = np.where(season_idx == 2, 1.08, np.where(season_idx == 3, 1.12, 1.0))
    supply_factor = np.where(production_tonnes > 5000, 0.95, 1.05)
    future_price = current_price * seasonal_factor * supply_factor + np.random.normal(0, 80, n)
    future_price = np.clip(future_price, 1000, 12000)

    X = np.column_stack([current_price, month, season_idx, rainfall_mm, production_tonnes])
    y = future_price

    df = pd.DataFrame(X, columns=["current_price", "month", "season_idx", "rainfall_mm", "production_tonnes"])
    df["future_price"] = y
    df.to_csv(os.path.join(DATASETS_DIR, "price_prediction_dataset.csv"), index=False)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = GradientBoostingRegressor(n_estimators=150, random_state=42, max_depth=6, learning_rate=0.1)
    model.fit(X_train, y_train)
    r2 = r2_score(y_test, model.predict(X_test))
    print(f"    R² Score: {r2:.3f}")

    model_path = os.path.join(MODELS_DIR, "price_forecaster.pkl")
    with open(model_path, "wb") as f:
        pickle.dump({"model": model, "features": ["current_price", "month", "season_idx", "rainfall_mm", "production_tonnes"]}, f)
    print(f"    Saved: {model_path}")
    return r2

# ============================================================================
# 4. WATER INTELLIGENCE SCORER (RandomForestRegressor)
# Features: rainfall_mm, soil_moisture, river_dist_km, canal_dist_km, groundwater_depth_m
# Target: water_availability_score (0-100)
# ============================================================================
def train_water_scorer():
    print("[4/4] Training Water Intelligence Scoring Model...")
    n = 1200
    rainfall_mm = np.random.uniform(0, 350, n)
    soil_moisture = np.random.uniform(0.05, 0.60, n)
    river_dist_km = np.random.uniform(0.2, 20, n)
    canal_dist_km = np.random.uniform(0.1, 15, n)
    groundwater_depth_m = np.random.uniform(2, 30, n)

    # Compute realistic water score
    rain_contrib = np.clip(rainfall_mm / 350 * 30, 0, 30)
    moisture_contrib = np.clip(soil_moisture * 50, 0, 25)
    proximity_contrib = np.clip((15 - river_dist_km) / 15 * 15 + (10 - canal_dist_km) / 10 * 15, 0, 30)
    gw_contrib = np.clip((20 - groundwater_depth_m) / 20 * 15, 0, 15)
    water_score = rain_contrib + moisture_contrib + proximity_contrib + gw_contrib + np.random.normal(0, 3, n)
    water_score = np.clip(water_score, 5, 98)

    X = np.column_stack([rainfall_mm, soil_moisture, river_dist_km, canal_dist_km, groundwater_depth_m])
    y = water_score

    df = pd.DataFrame(X, columns=["rainfall_mm", "soil_moisture", "river_dist_km", "canal_dist_km", "groundwater_depth_m"])
    df["water_score"] = y
    df.to_csv(os.path.join(DATASETS_DIR, "water_intelligence_dataset.csv"), index=False)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=8)
    model.fit(X_train, y_train)
    r2 = r2_score(y_test, model.predict(X_test))
    print(f"    R² Score: {r2:.3f}")

    model_path = os.path.join(MODELS_DIR, "water_scorer.pkl")
    with open(model_path, "wb") as f:
        pickle.dump({"model": model, "features": ["rainfall_mm", "soil_moisture", "river_dist_km", "canal_dist_km", "groundwater_depth_m"]}, f)
    print(f"    Saved: {model_path}")
    return r2

# ============================================================================
# MAIN TRAINING ENTRY POINT
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("  ApnaKissan ML Model Training Pipeline")
    print("=" * 60)
    results = {}
    results["crop_recommendation_accuracy"] = train_crop_recommender()
    results["yield_prediction_r2"] = train_yield_predictor()
    results["price_forecasting_r2"] = train_price_forecaster()
    results["water_scoring_r2"] = train_water_scorer()
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE - All 4 Models Saved to Models/Training/models/")
    print("=" * 60)
    for k, v in results.items():
        print(f"  {k}: {v:.4f}")

    # Save training report
    report_path = os.path.join(MODELS_DIR, "training_report.json")
    with open(report_path, "w") as f:
        json.dump({k: round(float(v), 4) for k, v in results.items()}, f, indent=2)
    print(f"\n  Training Report: {report_path}")
