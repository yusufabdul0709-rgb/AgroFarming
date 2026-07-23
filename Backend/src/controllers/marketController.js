import { Produce } from '../models/Produce.js';
import { getMarketIntel } from '../services/marketService.js';
import mongoose from 'mongoose';

// In-memory marketplace store
const MOCK_PRODUCE = [
  {
    _id: 'mock-prod-1',
    user: 'mock-user-111',
    cropName: 'Paddy',
    quantity: 45, // Quintals
    grade: 'Premium (A+)',
    estimatedPrice: 2183,
    harvestDate: new Date(),
    status: 'Listing',
    location: { village: 'Milak', district: 'Rampur' }
  }
];

export const getPrices = async (req, res) => {
  const { cropName, district } = req.query;
  try {
    const intel = await getMarketIntel(cropName, district);
    return res.json({ status: 'success', marketIntelligence: intel });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getMarketplaceListings = async (req, res) => {
  try {
    let listings = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      listings = await Produce.find({}).populate('user');
    } else {
      listings = MOCK_PRODUCE;
    }
    
    return res.json({ status: 'success', count: listings.length, listings });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createMarketplaceListing = async (req, res) => {
  const { userId, cropName, quantity, grade, estimatedPrice, harvestDate, location } = req.body;

  if (!userId || !cropName || !quantity) {
    return res.status(400).json({ status: 'error', message: 'Missing required listing parameters' });
  }

  try {
    let newListing = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    const listingObj = {
      user: userId,
      cropName,
      quantity: Number(quantity),
      grade: grade || 'Good (A)',
      estimatedPrice: Number(estimatedPrice) || 2000,
      harvestDate: harvestDate || new Date(),
      status: 'Listing',
      location: location || { village: 'Milak', district: 'Rampur' }
    };

    if (isDbConnected) {
      newListing = await Produce.create(listingObj);
    } else {
      newListing = { _id: `mock-prod-${Date.now()}`, ...listingObj };
      MOCK_PRODUCE.push(newListing);
    }

    return res.json({ status: 'success', listing: newListing });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
