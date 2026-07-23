import { diagnoseCropImage } from '../services/aiService.js';

export const diagnoseCrop = async (req, res) => {
  const { imageName } = req.body;
  
  try {
    const result = diagnoseCropImage(imageName);
    return res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      diagnosis: result
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
