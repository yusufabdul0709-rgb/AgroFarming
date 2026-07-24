import { diagnoseCropImage } from '../services/aiService.js';

export const diagnoseCrop = async (req, res) => {
  const { imageName, base64Image, isMillet } = req.body;
  
  try {
    const result = await diagnoseCropImage(imageName, base64Image, isMillet);
    return res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      diagnosis: result
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
