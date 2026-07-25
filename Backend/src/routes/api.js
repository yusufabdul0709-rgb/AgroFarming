import express from 'express';
import { registerOrLogin, updateProfile, getAllFarmers, syncProfile } from '../controllers/authController.js';
import { getFarmTwin, simulateTwin, getAllFarms, updateFarmTwin } from '../controllers/farmController.js';
import { getPrices, getMarketplaceListings, createMarketplaceListing } from '../controllers/marketController.js';
import { getEligibleSchemes, createScheme, getAllSchemes } from '../controllers/schemeController.js';
import { diagnoseCrop } from '../controllers/visionController.js';
import { handleAIChat, handleAIVision } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const apiRouter = express.Router();

// Authentication / Farmers routes
apiRouter.post('/auth/login', registerOrLogin);
apiRouter.post('/auth/sync', authMiddleware, syncProfile);
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
apiRouter.get('/schemes/all', getAllSchemes);
apiRouter.post('/schemes/create', createScheme);

// Computer Vision routes
apiRouter.post('/vision/diagnose', diagnoseCrop);
apiRouter.post('/ai/vision', handleAIVision);

// AI Multi-Agent Chat routes
apiRouter.post('/ai/chat', handleAIChat);

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
