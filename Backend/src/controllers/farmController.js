import { Farm } from '../models/Farm.js';
import { User } from '../models/User.js';
import { simulateFarmTwinDecision } from '../services/aiService.js';

export const getFarmTwin = async (req, res) => {
  const { userId } = req.params;

  try {
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    const farm = await Farm.findOne({ user: userId }).populate('user');

    if (!farm) {
      return res.status(404).json({ status: 'error', message: 'Farm twin not found' });
    }

    return res.json({ status: 'success', farm });
  } catch (error) {
    console.error('[Get Farm Twin Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const simulateTwin = async (req, res) => {
  const { userId } = req.params;
  const decision = req.body; // { cropName, rainfallChange, irrigationFrequency }

  try {
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    const farm = await Farm.findOne({ user: userId });
    
    if (!farm) {
       return res.status(404).json({ status: 'error', message: 'Farm twin not found' });
    }

    // Get farmer profile details for land area calculation
    let landArea = 2.5;
    const user = await User.findById(farm.user);
    if (user) landArea = user.landArea || 2.5;

    const farmContext = {
      soilProfile: farm.soilProfile,
      cropStatus: farm.cropStatus,
      landArea
    };

    const simulationResult = simulateFarmTwinDecision(farmContext, decision);

    return res.json({
      status: 'success',
      originalTwinState: farm,
      simulationResult
    });
  } catch (error) {
    console.error('[Simulation Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllFarms = async (req, res) => {
  try {
    const isDbConnected = true;
    if (!isDbConnected) {
       return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }
    
    const farms = await Farm.find({}).populate('user');
    return res.json({ status: 'success', count: farms.length, farms });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateFarmTwin = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    let farm = await Farm.findOne({ user: userId });

    if (!farm) {
      const farmId = 'farm-' + Math.random().toString(36).substr(2, 9);
      farm = await Farm.create({
        _id: farmId,
        user: userId,
        name: updateData.name || 'My Farm Twin',
        boundaries: updateData.boundaries || [],
        soilProfile: updateData.soilProfile || { pH: 6.8, moisture: 48, nitrogen: 110, phosphorus: 38, potassium: 195 },
        waterMetrics: updateData.waterMetrics || { waterScore: 85, waterStressLevel: 'Low' },
        cropStatus: updateData.cropStatus || { cropName: 'Paddy', stage: 'Vegetative', growthPercentage: 35, estimatedYield: 4.2 }
      });
    } else {
      farm = await Farm.findOneAndUpdate({ user: userId }, updateData, { new: true });
    }

    return res.json({ status: 'success', farm });
  } catch (error) {
    console.error('[Update Farm Twin Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
