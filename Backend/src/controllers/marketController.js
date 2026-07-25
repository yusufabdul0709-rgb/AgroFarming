import { Produce } from '../models/Produce.js';
import { getMarketIntel } from '../services/marketService.js';

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
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    const listings = await Produce.find({}).populate('user', 'name phone');
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
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

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

    const newListing = await Produce.create(listingObj);
    return res.json({ status: 'success', listing: newListing });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
