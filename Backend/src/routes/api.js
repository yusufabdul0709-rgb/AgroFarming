import express from 'express';
import { registerOrLogin, updateProfile, getProfile, getAllFarmers, syncProfile } from '../controllers/authController.js';
import { getFarmTwin, simulateTwin, getAllFarms, updateFarmTwin } from '../controllers/farmController.js';
import { getPrices, getMarketplaceListings, createMarketplaceListing } from '../controllers/marketController.js';
import { getEligibleSchemes, createScheme, getAllSchemes, matchSchemeVault } from '../controllers/schemeController.js';
import { diagnoseCrop } from '../controllers/visionController.js';
import { handleAIChat, handleAIVision } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { uploadDocument, getDocuments, decryptDocument, updateDocument, deleteDocument } from '../controllers/vaultController.js';

export const apiRouter = express.Router();

// Authentication / Farmers routes
apiRouter.post('/auth/login', registerOrLogin);
apiRouter.post('/auth/sync', authMiddleware, syncProfile);
apiRouter.get('/auth/profile/:userId', authMiddleware, getProfile);
apiRouter.put('/auth/profile/:userId', authMiddleware, updateProfile);
apiRouter.get('/auth/farmers', getAllFarmers);

// Digital Farm Twin routes
apiRouter.get('/farm/twin/:userId', authMiddleware, getFarmTwin);
apiRouter.put('/farm/twin/:userId', authMiddleware, updateFarmTwin);
apiRouter.post('/farm/simulate/:userId', authMiddleware, simulateTwin);
apiRouter.get('/farm/twins', getAllFarms);

// Marketplace & Market Intelligence routes
apiRouter.get('/market/prices', getPrices);
apiRouter.get('/market/produce', getMarketplaceListings);
apiRouter.post('/market/produce', authMiddleware, createMarketplaceListing);

// Schemes matching routes
apiRouter.post('/schemes/match', getEligibleSchemes);
apiRouter.post('/schemes/vault-match', authMiddleware, matchSchemeVault);
apiRouter.get('/schemes/all', getAllSchemes);
apiRouter.post('/schemes/create', createScheme);

// Kissan Secure Vault routes
apiRouter.post('/vault/upload', authMiddleware, uploadDocument);
apiRouter.get('/vault/documents', authMiddleware, getDocuments);
apiRouter.get('/vault/document/:id/decrypt', authMiddleware, decryptDocument);
apiRouter.put('/vault/document/:id', authMiddleware, updateDocument);
apiRouter.delete('/vault/document/:id', authMiddleware, deleteDocument);

// Computer Vision routes
apiRouter.post('/vision/diagnose', diagnoseCrop);
apiRouter.post('/ai/vision', handleAIVision);

// AI Multi-Agent Chat routes
apiRouter.post('/ai/chat', handleAIChat);

// External API integrations
import { getWeatherData, getSoilGrids, getNasaPower, getReverseGeocode, getAgmarknetPrices, getCropRecommendations } from '../controllers/externalApiController.js';

// Weather Intelligence route
apiRouter.get('/weather', getWeatherData);

// Soil Grids
apiRouter.get('/soil', getSoilGrids);

// NASA POWER Climate Data
apiRouter.get('/climate', getNasaPower);

// Reverse Geocoding
apiRouter.get('/geocode', getReverseGeocode);

// Agmarknet Prices
apiRouter.get('/market/agmarknet', getAgmarknetPrices);

// Crop Recommendations
apiRouter.get('/farm/recommendations', getCropRecommendations);

// AI Microservice Gateway Endpoints (Python FastAPI Integration)
import {
  getAICropRecommendation,
  getAIPricePrediction,
  getAIYieldPrediction,
  diagnoseAIDisease,
  gradeAIMillet,
  getAIWaterIntelligence,
  matchAISchemes,
  scanAIOCR,
  processAIVoice,
  queryAIRAG,
  orchestrateMasterAI
} from '../controllers/aiGatewayController.js';

import { getSchemeReviewQueue, approveSchemeIngestion } from '../services/schemeIngestionService.js';

apiRouter.post('/ai/crop-recommendation', getAICropRecommendation);
apiRouter.post('/ai/price-prediction', getAIPricePrediction);
apiRouter.post('/ai/yield', getAIYieldPrediction);
apiRouter.post('/ai/disease', diagnoseAIDisease);
apiRouter.post('/ai/millet', gradeAIMillet);
apiRouter.post('/ai/water', getAIWaterIntelligence);
apiRouter.post('/ai/schemes', matchAISchemes);
apiRouter.post('/ai/ocr', scanAIOCR);
apiRouter.post('/ai/voice', processAIVoice);
apiRouter.post('/ai/rag', queryAIRAG);
apiRouter.post('/ai/orchestrate', orchestrateMasterAI);

// Scheme Ingestion Service endpoints
apiRouter.get('/schemes/ingest/queue', getSchemeReviewQueue);
apiRouter.post('/schemes/ingest/approve', approveSchemeIngestion);

// Admin Dashboard Analytics endpoint
import { getAdminDashboardAnalytics } from '../controllers/adminController.js';
apiRouter.get('/admin/analytics', getAdminDashboardAnalytics);


