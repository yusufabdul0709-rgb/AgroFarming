import os
from dotenv import load_dotenv

load_dotenv()

# API Keys & Endpoints
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
DATA_GOV_IN_API_KEY = os.getenv("DATA_GOV_IN_API_KEY", "")
SOILGRIDS_API_URL = os.getenv("SOILGRIDS_API_URL", "https://rest.isric.org/soilgrids/v2.0/properties/layers")
OPEN_METEO_API_URL = os.getenv("OPEN_METEO_API_URL", "https://api.open-meteo.com/v1/forecast")
AGMARKNET_PRICES_RESOURCE_ID = os.getenv("AGMARKNET_PRICES_RESOURCE_ID", "9ef84268-d588-465a-a308-a864a43d0070")
STATE_PRICES_RESOURCE_ID = os.getenv("STATE_PRICES_RESOURCE_ID", "35985678-0d79-46b4-9ed6-6f13308a1d24")
OVERPASS_API_URL = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")

# System Ports
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

# Vector Database Config
VECTOR_DB_DIR = os.path.join(os.path.dirname(__file__), "VectorDB")
DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets")
