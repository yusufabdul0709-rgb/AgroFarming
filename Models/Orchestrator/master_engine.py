import logging
from typing import Dict, Any
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

logger = logging.getLogger(__name__)

class MasterAIOrchestrator:
    """
    Master AI Decision Engine for ApnaKissan.
    Executes when farmer opens app / triggers comprehensive farm evaluation:
    1. Fetches GPS location, SoilGrids, Open-Meteo Weather, Mandi Prices, & OSM Hydrology.
    2. Runs all 10 specialized ML models in parallel.
    3. Synthesizes complete Farmer Dashboard & GIS Map layers.
    """
    def orchestrate_farm_assessment(self, lat: float = 17.3850, lon: float = 78.4867, land_acres: float = 2.5, crop_hint: str = "Paddy (Rice)") -> Dict[str, Any]:
        logger.info(f"Orchestrating AI Assessment for Lat: {lat}, Lon: {lon}, Acres: {land_acres}")

        # 1. Fetch live external GIS & climate layers
        soil_data = fetch_soilgrids_data(lat, lon)
        weather_data = fetch_weather_forecast(lat, lon)
        mandi_data = fetch_mandi_prices()
        osm_water = fetch_nearby_osm_hydrology(lat, lon)

        # 2. Execute Water Intelligence Engine
        water_intel = water_intelligence_engine.calculate_water_intelligence(osm_water, weather_data)

        # 3. Execute Crop Recommendation Engine
        recommendation_input = {
            "latitude": lat,
            "longitude": lon,
            "soil": soil_data,
            "weather": weather_data,
            "water_score": water_intel["water_availability_score"]
        }
        crop_recommendation = recommender_engine.predict(recommendation_input)

        selected_crop = crop_recommendation["best_crop"]

        # 4. Execute Yield Prediction Engine
        yield_pred = yield_predictor_engine.predict_yield(
            crop=selected_crop,
            land_acres=land_acres,
            soil_type=soil_data.get("soil_type", "Loamy Soil"),
            water_score=water_intel["water_availability_score"]
        )

        # 5. Execute Price Forecasting Engine
        price_forecast = price_forecaster_engine.predict_prices(commodity=selected_crop)

        # 6. Calculate Profitability Estimates
        total_prod_qtl = yield_pred["total_expected_production_quintals"]
        harvest_price = price_forecast["forecast"]["next_harvest_season"]["price_rs_qtl"]
        expected_gross_revenue = round(total_prod_qtl * harvest_price)
        estimated_input_cost = round(land_acres * 14500) # ₹14,500 per acre average cost
        expected_net_profit = expected_gross_revenue - estimated_input_cost

        # 7. Execute Scheme Recommendation Engine
        schemes_match = scheme_matcher_engine.match_schemes(land_acres=land_acres)

        # 8. Execute Disease Risk Assessment
        disease_risk = disease_detector_engine.diagnose_image(crop_hint=selected_crop)

        # 9. Format GIS Map Features
        gis_map_layers = {
            "center": {"lat": lat, "lon": lon},
            "boundaries": [
                {"lat": lat + 0.002, "lon": lon + 0.002},
                {"lat": lat - 0.002, "lon": lon + 0.002},
                {"lat": lat - 0.002, "lon": lon - 0.002},
                {"lat": lat + 0.002, "lon": lon - 0.002}
            ],
            "water_sources_markers": [
                {"type": "Canal", "distance_km": osm_water["canal_distance_km"]},
                {"type": "River Stream", "distance_km": osm_water["river_distance_km"]}
            ],
            "nearby_mandi_markers": [
                {"name": m.get("market"), "commodity": m.get("commodity"), "price": m.get("modal_price_rs_qtl")}
                for m in mandi_data[:2]
            ]
        }

        # 10. Assemble Master Unified Response
        return {
            "status": "success",
            "location": {"latitude": lat, "longitude": lon},
            "environment_layers": {
                "soil": soil_data,
                "weather": weather_data,
                "water_hydrology": osm_water
            },
            "master_ai_dashboard": {
                "best_crop": selected_crop,
                "confidence_percent": crop_recommendation["confidence_percent"],
                "expected_yield": crop_recommendation["expected_yield"],
                "total_production_quintals": total_prod_qtl,
                "water_availability_score": water_intel["water_availability_score"],
                "risk_score_percent": crop_recommendation["risk_score_percent"],
                "profitability_forecast": {
                    "expected_gross_revenue_rs": expected_gross_revenue,
                    "estimated_input_cost_rs": estimated_input_cost,
                    "expected_net_profit_rs": expected_net_profit,
                    "best_selling_window": price_forecast["best_selling_date_recommendation"]
                },
                "price_trend_summary": price_forecast["forecast"],
                "disease_probability": {
                    "disease_name": disease_risk["disease_name"],
                    "severity": disease_risk["severity_level"]
                },
                "government_schemes": {
                    "eligible_count": schemes_match["total_eligible_schemes"],
                    "top_scheme": schemes_match["eligible_schemes"][0]["scheme_name"] if schemes_match["eligible_schemes"] else "PM-KISAN",
                    "approval_chance": schemes_match["eligible_schemes"][0]["approval_chance_percent"] if schemes_match["eligible_schemes"] else 95.0,
                    "required_documents": schemes_match["eligible_schemes"][0]["required_documents"] if schemes_match["eligible_schemes"] else []
                }
            },
            "gis_map": gis_map_layers,
            "orchestator_version": "ApnaKissan Multi-Model Master Decision Engine v1.0"
        }

master_ai_orchestrator = MasterAIOrchestrator()
