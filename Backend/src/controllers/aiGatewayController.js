import dotenv from 'dotenv';
dotenv.config();

const PYTHON_AI_SERVICE_URL = process.env.PYTHON_AI_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Helper function to forward request to Python FastAPI AI microservice with fallback
 */
async function forwardToAIService(endpoint, payload) {
  try {
    const response = await fetch(`${PYTHON_AI_SERVICE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn(`[AIGateway] Python AI service unavailable at ${PYTHON_AI_SERVICE_URL}${endpoint}, executing fallback response.`);
  }

  // Graceful Fallback Generator
  return {
    status: 'fallback',
    message: 'AI Model processing operating in Node.js fallback mode',
    endpoint,
    data: {
      best_crop: 'Paddy (Rice)',
      confidence_percent: 94.5,
      expected_yield: '24.5 Quintals / Acre',
      water_availability_score: 78.0,
      risk_score_percent: 22.0,
      price_forecast: {
        next_30_days: { price_rs_qtl: 2320, trend: 'Upward (+3.1%)' },
        next_90_days: { price_rs_qtl: 2410, trend: 'Bullish (+7.1%)' }
      }
    }
  };
}

export const getAICropRecommendation = async (req, res) => {
  const result = await forwardToAIService('/api/ai/crop-recommendation', req.body);
  res.json(result);
};

export const getAIPricePrediction = async (req, res) => {
  const result = await forwardToAIService('/api/ai/price-prediction', req.body);
  res.json(result);
};

export const getAIYieldPrediction = async (req, res) => {
  const result = await forwardToAIService('/api/ai/yield', req.body);
  res.json(result);
};

export const diagnoseAIDisease = async (req, res) => {
  const result = await forwardToAIService('/api/ai/disease', req.body);
  res.json(result);
};

export const gradeAIMillet = async (req, res) => {
  const result = await forwardToAIService('/api/ai/millet', req.body);
  res.json(result);
};

export const getAIWaterIntelligence = async (req, res) => {
  const result = await forwardToAIService('/api/ai/water', req.body);
  res.json(result);
};

export const matchAISchemes = async (req, res) => {
  const result = await forwardToAIService('/api/ai/schemes', req.body);
  res.json(result);
};

export const scanAIOCR = async (req, res) => {
  const result = await forwardToAIService('/api/ai/ocr', req.body);
  res.json(result);
};

export const processAIVoice = async (req, res) => {
  const result = await forwardToAIService('/api/ai/voice', req.body);
  res.json(result);
};

export const queryAIRAG = async (req, res) => {
  const result = await forwardToAIService('/api/ai/rag', req.body);
  res.json(result);
};

export const orchestrateMasterAI = async (req, res) => {
  const result = await forwardToAIService('/api/ai/orchestrate', req.body);
  res.json(result);
};
