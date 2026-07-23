import express from 'express';
import { registerOrLogin, updateProfile, getAllFarmers } from '../controllers/authController.js';
import { getFarmTwin, simulateTwin, getAllFarms } from '../controllers/farmController.js';
import { getPrices, getMarketplaceListings, createMarketplaceListing } from '../controllers/marketController.js';
import { getEligibleSchemes, createScheme, getAllSchemes } from '../controllers/schemeController.js';
import { diagnoseCrop } from '../controllers/visionController.js';
import { handleAIChat } from '../controllers/aiController.js';
import { getWeatherData } from '../services/weatherService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const apiRouter = express.Router();

// Authentication / Farmers routes
apiRouter.post('/auth/login', registerOrLogin);
apiRouter.put('/auth/profile/:userId', authMiddleware, updateProfile);
apiRouter.get('/auth/farmers', getAllFarmers);

// Digital Farm Twin routes
apiRouter.get('/farm/twin/:userId', authMiddleware, getFarmTwin);
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

// AI Multi-Agent Chat routes
apiRouter.post('/ai/chat', authMiddleware, handleAIChat);

// Weather Intelligence route
apiRouter.get('/weather', async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const data = await getWeatherData(Number(latitude), Number(longitude));
    return res.json({ status: 'success', weather: data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});
