import { Scheme } from '../models/Scheme.js';

export const getEligibleSchemes = async (req, res) => {
  const { landArea, category, state, annualIncome, farmingExperience } = req.body;

  try {
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    const activeSchemes = await Scheme.find({});
    
    if (activeSchemes.length === 0) {
      return res.json({
        status: 'success',
        totalCount: 0,
        eligibleSchemes: [],
        ineligibleSchemes: []
      });
    }

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
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }
    
    const newScheme = await Scheme.create(req.body);
    return res.json({ status: 'success', scheme: newScheme });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllSchemes = async (req, res) => {
  try {
    const isDbConnected = true;
    if (!isDbConnected) {
      return res.status(500).json({ status: 'error', message: 'Database not connected.' });
    }

    const schemes = await Scheme.find({});
    return res.json({ status: 'success', count: schemes.length, schemes });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
