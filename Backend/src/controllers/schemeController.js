import { Scheme } from '../models/Scheme.js';
import mongoose from 'mongoose';

// Mock list of government schemes for immediate evaluation
const MOCK_SCHEMES = [
  {
    _id: 'mock-scheme-1',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Provides ₹6,000 yearly income support in three equal installments directly to bank accounts.',
    state: 'All',
    maxLandSize: 5, // Under 5 acres
    allowedCategories: ['General', 'OBC', 'SC', 'ST'],
    benefits: '₹6,000 cash subsidy per annum.',
    requiredDocuments: ['Aadhaar Card', 'Land Registry Copies (Fard/Khatauni)', 'Bank Passbook'],
    deadline: '2026-10-31'
  },
  {
    _id: 'mock-scheme-2',
    name: 'PM Fasal Bima Yojana (Crop Insurance)',
    description: 'Comprehensive insurance cover against crop failure due to weather or natural calamities.',
    state: 'All',
    maxLandSize: null, // No limit
    allowedCategories: ['General', 'OBC', 'SC', 'ST'],
    benefits: 'Up to 90% premium subsidy, payouts in case of drought/floods.',
    requiredDocuments: ['Aadhaar Card', 'Land Sowing Certificate', 'Bank details'],
    deadline: '2026-08-15'
  },
  {
    _id: 'mock-scheme-3',
    name: 'Per Drop More Crop (Micro Irrigation Subsidy)',
    description: 'Promotes water conservation through subsidies on drip and sprinkler irrigation installations.',
    state: 'All',
    maxLandSize: 10,
    allowedCategories: ['OBC', 'SC', 'ST'],
    benefits: '85% to 90% subsidy on installation costs of drip systems.',
    requiredDocuments: ['Aadhaar Card', 'Soil & Water Testing Report', 'Quotation from approved drip dealer'],
    deadline: '2026-09-30'
  },
  {
    _id: 'mock-scheme-4',
    name: 'Paramparagat Krishi Vikas Yojana (Organic Farming Support)',
    description: 'Promotes organic farming practices through cluster formation and PGS certification assistance.',
    state: 'Uttar Pradesh',
    maxLandSize: 5,
    allowedCategories: ['General', 'OBC', 'SC', 'ST'],
    benefits: '₹50,000 per hectare support over 3 years for inputs and certification.',
    requiredDocuments: ['Aadhaar Card', 'Land Record', 'Soil Testing Certificate'],
    deadline: '2026-11-15'
  }
];

export const getEligibleSchemes = async (req, res) => {
  const { landArea, category, state, annualIncome, farmingExperience } = req.body;

  try {
    let dbSchemes = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      dbSchemes = await Scheme.find({});
    }
    
    // If database schemes are empty, merge/fallback to mock schemes
    const activeSchemes = dbSchemes.length > 0 ? dbSchemes : MOCK_SCHEMES;

    const parsedLand = Number(landArea) || 2.0;
    const parsedCategory = category || 'General';
    const parsedState = state || 'Uttar Pradesh';

    // Matching logic
    const eligibleList = activeSchemes.map(scheme => {
      let isEligible = true;
      let reasons = [];
      let probability = 85; // base probability

      // 1. Validate Land Size
      if (scheme.maxLandSize && parsedLand > scheme.maxLandSize) {
        isEligible = false;
        reasons.push(`Land area (${parsedLand} acres) exceeds the limit of ${scheme.maxLandSize} acres.`);
      }

      // 2. Validate Category
      if (scheme.allowedCategories && scheme.allowedCategories.length > 0) {
        if (!scheme.allowedCategories.includes(parsedCategory)) {
          isEligible = false;
          reasons.push(`Scheme targeted at ${scheme.allowedCategories.join('/')} (User: ${parsedCategory}).`);
        }
      }

      // 3. Validate State
      if (scheme.state && scheme.state !== 'All') {
        if (scheme.state.toLowerCase() !== parsedState.toLowerCase()) {
          isEligible = false;
          reasons.push(`Scheme limited to residents of ${scheme.state}.`);
        }
      }

      // Adjust probability based on documents and income
      if (annualIncome && annualIncome > 150000) {
        probability -= 15;
      }
      if (parsedCategory === 'SC' || parsedCategory === 'ST') {
        probability += 10;
      }

      return {
        ...JSON.parse(JSON.stringify(scheme)),
        isEligible,
        approvalProbability: isEligible ? Math.min(99, Math.max(40, probability)) : 0,
        reasons: reasons.length > 0 ? reasons : ['Matches your profile details']
      };
    });

    return res.json({
      status: 'success',
      totalCount: eligibleList.length,
      eligibleSchemes: eligibleList.filter(s => s.isEligible),
      ineligibleSchemes: eligibleList.filter(s => !s.isEligible)
    });
  } catch (error) {
    console.error('[Schemes Match Error]', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createScheme = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let newScheme = null;
    
    if (isDbConnected) {
      newScheme = await Scheme.create(req.body);
    } else {
      newScheme = { _id: `mock-scheme-${Date.now()}`, ...req.body };
      MOCK_SCHEMES.push(newScheme);
    }
    return res.json({ status: 'success', scheme: newScheme });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllSchemes = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let schemes = [];
    if (isDbConnected) {
      schemes = await Scheme.find({});
    } else {
      schemes = MOCK_SCHEMES;
    }
    return res.json({ status: 'success', count: schemes.length, schemes });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
