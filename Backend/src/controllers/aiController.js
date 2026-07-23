import { orchestrateMultiAgentAI } from '../services/aiService.js';
import { User } from '../models/User.js';
import { MOCK_USERS } from './authController.js';
import mongoose from 'mongoose';

export const handleAIChat = async (req, res) => {
  const { prompt, userId, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt text is required' });
  }

  try {
    let user = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (userId) {
      if (isDbConnected) {
        user = await User.findById(userId);
      } else {
        user = MOCK_USERS.find(u => u._id === userId);
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
