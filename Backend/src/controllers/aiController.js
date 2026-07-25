import { orchestrateMultiAgentAI } from '../services/aiService.js';
import { User } from '../models/User.js';
<<<<<<< HEAD
import mongoose from 'mongoose';
=======
import { MOCK_USERS } from './authController.js';
>>>>>>> 3d5592091add5dd5df7aeb23a0d5374cda4428a1

export const handleAIChat = async (req, res) => {
  const { prompt, userId, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt text is required' });
  }

  try {
    let user = null;
    const isDbConnected = true;

    if (userId) {
      if (isDbConnected) {
        user = await User.findById(userId);
      } else {
        user = null;
      }
    }

    const aiResponse = await orchestrateMultiAgentAI(prompt, user, language || user?.preferredLanguage || 'English');

    return res.json({
      status: 'success',
      response: aiResponse,
      language: language || user?.preferredLanguage || 'English'
    });
  } catch (error) {
    console.error('[AI Chat Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const handleAIVision = async (req, res) => {
  const { imageBase64, analysisType } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ status: 'error', message: 'Image base64 is required' });
  }

  try {
    let result = {};
    // Real implementation would pass imageBase64 to Gemini 1.5 Flash Vision API.
    if (analysisType === 'millet') {
      result = {
        grainType: 'Pearl Millet (Bajra)',
        freshnessScore: '94%',
        fungusDetected: false,
        moistureContent: '11.8%',
        qualityGrade: 'Grade A+ (Export Quality)',
        marketValue: '₹2,350 / Quintal',
        recommendation: 'Optimal grain hardness & moisture. Ready for immediate storage or mandi sale.'
      };
    } else {
      result = {
        crop: 'Tomato',
        disease: 'Late Blight (Phytophthora infestans)',
        confidence: '96.4%',
        severity: 'Moderate',
        symptom: 'Dark water-soaked lesions on leaf margins and stems.',
        chemicalTreatment: 'Spray Copper Oxychloride 50 WP (2g/L water) or Mancozeb 75 WP.',
        organicTreatment: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Trichoderma viride culture.',
        nearbyAgroStores: [
          { name: 'Kissan Seva Kendra', distance: '1.2 km', phone: '+91 98765 12345' },
          { name: 'Raju Farmers Fertilizers', distance: '3.4 km', phone: '+91 94400 54321' }
        ]
      };
    }

    return res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('[AI Vision Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
