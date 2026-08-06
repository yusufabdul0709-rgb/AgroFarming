import { User } from '../models/User.js';
import { Farm } from '../models/Farm.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apnakissan_secret_key_123';

export const registerOrLogin = async (req, res) => {
  const { phone, password, name, preferredLanguage, isRegistering } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ status: 'error', message: 'Phone number and password are required' });
  }

  try {
    let user = await User.findOne({ phone });

    if (isRegistering) {
      if (user) {
        return res.status(400).json({ status: 'error', message: 'User already exists. Please login instead.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUserObj = {
        name: name || 'New Farmer',
        phone,
        password: hashedPassword,
        preferredLanguage: preferredLanguage || 'English',
        village: 'Kalyanpur',
        district: 'Kanpur',
        state: '',
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

      user = await User.create(newUserObj);
      
      // Auto-create a Farm Twin entry
      await Farm.create({
        user: user._id,
        soilProfile: { pH: 6.8, moisture: 48, nitrogen: 110, phosphorus: 38, potassium: 195 },
        cropStatus: { cropName: 'Paddy', stage: 'Vegetative', growthPercentage: 35, estimatedYield: 4.2 }
      });
      
      console.log(`[Auth] Registered new farmer: ${user.name} (${user.phone})`);
    } else {
      // Login flow
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'invalid credentials, plz try again' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'invalid credentials, plz try again' });
      }

      console.log(`[Auth] Farmer logged in: ${user.name}`);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    // Exclude password from the returned user object
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      status: 'success',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('[Auth Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }

    return res.json({ status: 'success', user });
  } catch (error) {
    console.error('[Update Profile Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password').populate('farms');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }
    return res.json({ status: 'success', user });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({}).select('-password');
    return res.json({ status: 'success', count: farmers.length, farmers });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const syncProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const syncData = req.body;
    
    if (syncData.password) {
      const salt = await bcrypt.genSalt(10);
      syncData.password = await bcrypt.hash(syncData.password, salt);
    }
    
    const user = await User.findByIdAndUpdate(userId, syncData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }
    return res.json({ status: 'success', message: 'Profile synced successfully', user });
  } catch (error) {
    console.error('[Sync Profile Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
