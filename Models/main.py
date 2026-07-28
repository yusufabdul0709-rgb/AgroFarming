import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from Models.config import PORT, HOST
from Models.Shared.api_connectors import (
    fetch_soilgrids_data,
    fetch_weather_forecast,
    fetch_mandi_prices,
    fetch_nearby_osm_hydrology
)
from Models.CropRecommendation.recommender import recommender_engine
from Models.CropPricePrediction.forecaster import price_forecaster_engine
from Models.YieldPrediction.predictor import yield_predictor_engine
from Models.DiseaseDetection.detector import disease_detector_engine
from Models.MilletQuality.grader import millet_grader_engine
from Models.WaterIntelligence.water_scorer import water_intelligence_engine
from Models.SchemeRecommendation.matcher import scheme_matcher_engine
from Models.OCR.ocr_scanner import ocr_scanner_engine
from Models.VoiceAI.speech_engine import voice_ai_engine
from Models.RAG.rag_engine import rag_knowledge_engine
from Models.Orchestrator.master_engine import master_ai_orchestrator

app = FastAPI(
    title="ApnaKissan Multi-Model AI Service & Orchestrator",
    description="Microservice AI Layer serving Crop Recommendation, Price Forecasting, Yield Prediction, Disease Detection, Water Intelligence, Millet Quality, Schemes RAG & Voice AI.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class LocationInput(BaseModel):
    latitude: float = Field(17.3850, description="Latitude coordinate")
    longitude: float = Field(78.4867, description="Longitude coordinate")
    land_acres: Optional[float] = Field(2.5, description="Land holding size in acres")
    season: Optional[str] = Field("Kharif", description="Agricultural season")

class PricePredictionInput(BaseModel):
    commodity: str = Field("Paddy (Rice)", description="Crop commodity name")
    district: Optional[str] = Field("Warangal", description="District name")
    state: Optional[str] = Field("Telangana", description="State name")

class YieldPredictionInput(BaseModel):
    crop: str = Field("Paddy (Rice)", description="Crop type")
    land_acres: float = Field(2.5, description="Land holding in acres")
    soil_type: Optional[str] = Field("Loamy Soil", description="Soil type")
    water_score: Optional[float] = Field(75.0, description="Water score 0-100")

class DiseaseDetectionInput(BaseModel):
    image_base64: Optional[str] = Field(None, description="Base64 encoded leaf image")
    crop_hint: Optional[str] = Field(None, description="Crop name hint")

class MilletQualityInput(BaseModel):
    grain_type: str = Field("Pearl Millet (Bajra)", description="Millet variety")
    image_base64: Optional[str] = Field(None, description="Base64 sample image")

class SchemeMatchInput(BaseModel):
    land_acres: float = Field(2.5, description="Land holdings in acres")
    annual_income: float = Field(150000.0, description="Annual family income")
    category: Optional[str] = Field("OBC", description="Social category")
    state: Optional[str] = Field("Telangana", description="State name")

class OCRInput(BaseModel):
    document_type: str = Field("Aadhaar", description="Document type (Aadhaar / Land Passbook)")
    image_base64: Optional[str] = Field(None, description="Document image Base64")

class VoiceAIInput(BaseModel):
    language: str = Field("te", description="Language code (te, hi, en, ta, kn)")
    text_prompt: Optional[str] = Field(None, description="Input query text")

class RAGInput(BaseModel):
    query: str = Field("What is the optimal NPK ratio for paddy in Telangana?", description="Search query")

# REST API Endpoints

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ApnaKissan AI Layer FastAPI Microservices",
        "models_loaded": 11,
        "api_connectors": ["SoilGrids v2.0", "Open-Meteo", "data.gov.in Agmarknet", "OpenStreetMap Overpass"]
    }

@app.post("/api/ai/crop-recommendation")
def predict_crop_recommendation(payload: LocationInput):
    soil = fetch_soilgrids_data(payload.latitude, payload.longitude)
    weather = fetch_weather_forecast(payload.latitude, payload.longitude)
    osm = fetch_nearby_osm_hydrology(payload.latitude, payload.longitude)
    water_intel = water_intelligence_engine.calculate_water_intelligence(osm, weather)
    
    inp = {
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "soil": soil,
        "weather": weather,
        "water_score": water_intel["water_availability_score"],
        "season": payload.season
    }
    return recommender_engine.predict(inp)

@app.post("/api/ai/price-prediction")
def predict_crop_prices(payload: PricePredictionInput):
    return price_forecaster_engine.predict_prices(
        commodity=payload.commodity,
        district=payload.district or "Warangal",
        state=payload.state or "Telangana"
    )

@app.post("/api/ai/yield")
def predict_crop_yield(payload: YieldPredictionInput):
    return yield_predictor_engine.predict_yield(
        crop=payload.crop,
        land_acres=payload.land_acres,
        soil_type=payload.soil_type or "Loamy Soil",
        water_score=payload.water_score or 75.0
    )

@app.post("/api/ai/disease")
def diagnose_crop_disease(payload: DiseaseDetectionInput):
    return disease_detector_engine.diagnose_image(
        image_data=payload.image_base64,
        crop_hint=payload.crop_hint
    )

@app.post("/api/ai/millet")
def grade_millet_quality(payload: MilletQualityInput):
    return millet_grader_engine.grade_millet(
        grain_type=payload.grain_type,
        image_data=payload.image_base64
    )

@app.post("/api/ai/water")
def evaluate_water_intelligence(payload: LocationInput):
    weather = fetch_weather_forecast(payload.latitude, payload.longitude)
    osm = fetch_nearby_osm_hydrology(payload.latitude, payload.longitude)
    return water_intelligence_engine.calculate_water_intelligence(osm, weather)

@app.post("/api/ai/schemes")
def recommend_government_schemes(payload: SchemeMatchInput):
    return scheme_matcher_engine.match_schemes(
        land_acres=payload.land_acres,
        annual_income=payload.annual_income,
        category=payload.category or "OBC",
        state=payload.state or "Telangana"
    )

@app.post("/api/ai/ocr")
def scan_ocr_document(payload: OCRInput):
    return ocr_scanner_engine.scan_document(
        document_type=payload.document_type,
        image_base64=payload.image_base64
    )

@app.post("/api/ai/voice")
def process_voice_ai(payload: VoiceAIInput):
    return voice_ai_engine.process_speech(
        language=payload.language,
        text_prompt=payload.text_prompt
    )

@app.post("/api/ai/rag")
def query_rag_knowledge(payload: RAGInput):
    return rag_knowledge_engine.query_rag(query=payload.query)

@app.post("/api/ai/orchestrate")
def master_ai_orchestration(payload: LocationInput):
    return master_ai_orchestrator.orchestrate_farm_assessment(
        lat=payload.latitude,
        lon=payload.longitude,
        land_acres=payload.land_acres or 2.5
    )

if __name__ == "__main__":
    uvicorn.run("Models.main:app", host=HOST, port=PORT, reload=True)
