import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';

// In-memory fallback database for mock mode
export const MOCK_USERS = [
  {
    _id: 'mock-user-111',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    village: 'Milak',
    district: 'Rampur',
    state: 'Uttar Pradesh',
    gpsLocation: { latitude: 28.6139, longitude: 77.2090 },
    landArea: 3.5,
    landOwnership: 'Owned',
    soilType: 'Alluvial (Loamy)',
    irrigationSource: 'Tube Well',
    waterAvailability: 'Moderate',
    annualIncome: 120000,
    category: 'OBC',
    currentCrops: ['Paddy'],
    previousCrops: ['Wheat', 'Mustard'],
    farmingExperience: 12,
    preferredLanguage: 'Hindi'
  }
];

export const registerOrLogin = async (req, res) => {
  const { phone, name, preferredLanguage } = req.body;

  if (!phone) {
    return res.status(400).json({ status: 'error', message: 'Phone number is required' });
  }

  try {
    // Attempt Mongoose lookup
    let user = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      user = await User.findOne({ phone });
    } else {
      user = MOCK_USERS.find(u => u.phone === phone);
    }

    if (!user) {
      // Register new user
      const newUserObj = {
        name: name || 'New Farmer',
        phone,
        preferredLanguage: preferredLanguage || 'English',
        village: 'Kalyanpur',
        district: 'Kanpur',
        state: 'Uttar Pradesh',
        gpsLocation: { latitude: 26.4499, longitude: 80.3319 },
        landArea: 2.5,
        landOwnership: 'Owned',
        soilType: 'Loamy',
        irrigationSource: 'Canal',
        waterAvailability: 'Moderate',
        annualIncome: 95000,
        category: 'General',
        currentCrops: ['Paddy'],
        previousCrops: ['Wheat'],
        farmingExperience: 8
      };

      if (isDbConnected) {
        user = await User.create(newUserObj);
        
        // Auto-create a Farm Twin entry
        await Farm.create({
          user: user._id,
          soilProfile: { pH: 6.8, moisture: 48, nitrogen: 110, phosphorus: 38, potassium: 195 },
          cropStatus: { cropName: 'Paddy', stage: 'Vegetative', growthPercentage: 35, estimatedYield: 4.2 }
        });
      } else {
        // Create in-memory mock user
        user = { _id: `mock-user-${Date.now()}`, ...newUserObj };
        MOCK_USERS.push(user);
      }
      
      console.log(`[Auth] Registered new farmer: ${user.name} (${user.phone})`);
    } else {
      console.log(`[Auth] Farmer logged in: ${user.name}`);
    }

    return res.json({
      status: 'success',
      token: 'mock-jwt-token-apnakissan',
      user
    });
  } catch (error) {
    console.error('[Auth Error]', error);
    // Graceful fallback to return a mock session on database failures
    const mockUser = MOCK_USERS[0];
    return res.json({
      status: 'success',
      token: 'mock-jwt-token-apnakissan',
      user: mockUser
    });
  }
};

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    let user = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    } else {
      const idx = MOCK_USERS.findIndex(u => u._id === userId);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...updateData };
        user = MOCK_USERS[idx];
      }
    }

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }

    return res.json({ status: 'success', user });
  } catch (error) {
    console.error('[Update Profile Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllFarmers = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let farmers = [];
    if (isDbConnected) {
      farmers = await User.find({});
    } else {
      farmers = MOCK_USERS;
    }
    return res.json({ status: 'success', count: farmers.length, farmers });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
import mongoose from 'mongoose';
