import { Farm } from '../models/Farm.js';
import { User } from '../models/User.js';
import { simulateFarmTwinDecision } from '../services/aiService.js';
import mongoose from 'mongoose';

// In-memory fallback farm twins
const MOCK_FARMS = [
  {
    _id: 'mock-farm-111',
    user: 'mock-user-111',
    name: 'Greenacres Ridge',
    boundaries: [
      { latitude: 28.6139, longitude: 77.2090 },
      { latitude: 28.6145, longitude: 77.2095 },
      { latitude: 28.6140, longitude: 77.2105 },
      { latitude: 28.6134, longitude: 77.2100 }
    ],
    soilProfile: { pH: 6.7, moisture: 52, nitrogen: 125, phosphorus: 42, potassium: 215 },
    waterMetrics: { waterScore: 88, waterStressLevel: 'Low', lastIrrigationDate: new Date() },
    cropStatus: { cropName: 'Paddy', stage: 'Vegetative', growthPercentage: 38, estimatedYield: 4.5 }
  }
];

export const getFarmTwin = async (req, res) => {
  const { userId } = req.params;

  try {
    let farm = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      farm = await Farm.findOne({ user: userId }).populate('user');
    } else {
      farm = MOCK_FARMS.find(f => f.user === userId);
      if (!farm && userId.startsWith('mock-user-')) {
        // Create mock twin dynamically for any new user
        farm = {
          _id: `mock-farm-${Date.now()}`,
          user: userId,
          name: 'Harvest Crest Twin',
          boundaries: [
            { latitude: 26.4499, longitude: 80.3319 },
            { latitude: 26.4505, longitude: 80.3325 },
            { latitude: 26.4500, longitude: 80.3335 },
            { latitude: 26.4494, longitude: 80.3330 }
          ],
          soilProfile: { pH: 6.8, moisture: 45, nitrogen: 110, phosphorus: 38, potassium: 195 },
          waterMetrics: { waterScore: 82, waterStressLevel: 'Low', lastIrrigationDate: new Date() },
          cropStatus: { cropName: 'Paddy', stage: 'Sowing', growthPercentage: 10, estimatedYield: 4.2 }
        };
        MOCK_FARMS.push(farm);
      }
    }

    if (!farm) {
      // Return first mock farm as global fallback
      farm = MOCK_FARMS[0];
    }

    return res.json({ status: 'success', farm });
  } catch (error) {
    console.error('[Get Farm Twin Error]', error);
    return res.json({ status: 'success', farm: MOCK_FARMS[0] });
  }
};

export const simulateTwin = async (req, res) => {
  const { userId } = req.params;
  const decision = req.body; // { cropName, rainfallChange, irrigationFrequency }

  try {
    let farm = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      farm = await Farm.findOne({ user: userId });
    } else {
      farm = MOCK_FARMS.find(f => f.user === userId) || MOCK_FARMS[0];
    }

    // Get farmer profile details for land area calculation
    let landArea = 2.5;
    if (isDbConnected && farm) {
      const user = await User.findById(farm.user);
      if (user) landArea = user.landArea || 2.5;
    }

    const farmContext = {
      soilProfile: farm?.soilProfile,
      cropStatus: farm?.cropStatus,
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
    const isDbConnected = mongoose.connection.readyState === 1;
    let farms = [];
    if (isDbConnected) {
      farms = await Farm.find({}).populate('user');
    } else {
      farms = MOCK_FARMS;
    }
    return res.json({ status: 'success', count: farms.length, farms });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
