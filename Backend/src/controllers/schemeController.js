import { Scheme } from '../models/Scheme.js';
import { Document } from '../models/Document.js';

export const matchSchemeVault = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  
  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'Missing user ID' });
  }

  try {
    let userStoredDocTypes = [];
    try {
      const docs = await Document.find({ user: userId });
      userStoredDocTypes = docs.map(d => d.documentType.toLowerCase());
    } catch (dbErr) {
      console.warn('[Schemes] Could not fetch user documents.', dbErr.message);
    }

    // 2. Fetch active schemes
    const activeSchemes = await Scheme.find({});
    
    // 3. Match logic
    const matchedSchemes = activeSchemes.map(scheme => {
      let requiredDocs = [];
      try {
        requiredDocs = scheme.requiredDocuments ? JSON.parse(scheme.requiredDocuments) : [];
      } catch (e) {
        requiredDocs = [];
      }
      
      const missingDocs = [];
      const presentDocs = [];

      requiredDocs.forEach(reqDoc => {
        if (userStoredDocTypes.includes(reqDoc.toLowerCase())) {
          presentDocs.push(reqDoc);
        } else {
          // Provide instructions for missing doc
          let howToObtain = 'Visit your nearest MeeSeva / CSC office.';
          let expectedTime = 7; // days
          if (reqDoc.toLowerCase().includes('land')) {
            howToObtain = 'Visit the MRO / Tehsil Office with Survey Number.';
            expectedTime = 14;
          } else if (reqDoc.toLowerCase().includes('bank')) {
            howToObtain = 'Visit your bank branch to get an updated passbook.';
            expectedTime = 2;
          }

          missingDocs.push({
            name: reqDoc,
            howToObtain,
            expectedProcessingTimeDays: expectedTime,
            priority: 'High'
          });
        }
      });

      const totalRequired = requiredDocs.length;
      const totalPresent = presentDocs.length;
      const readinessScore = totalRequired === 0 ? 100 : Math.round((totalPresent / totalRequired) * 100);

      // Smart Timeline
      let deadlineDays = null;
      let timelineRecommendation = 'Apply immediately.';
      
      if (scheme.deadline) {
        const diffTime = Math.abs(new Date(scheme.deadline) - new Date());
        deadlineDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const totalEstimatedProcessing = missingDocs.reduce((acc, curr) => acc + curr.expectedProcessingTimeDays, 0);
        
        if (totalEstimatedProcessing === 0) {
          timelineRecommendation = 'Everything is Ready. Click Apply.';
        } else if (deadlineDays > totalEstimatedProcessing) {
          timelineRecommendation = `You still have enough time. Collect missing documents first. Expected completion: within ${totalEstimatedProcessing} days.`;
        } else {
          timelineRecommendation = `WARNING: Deadline is closing in ${deadlineDays} days, but documents might take ${totalEstimatedProcessing} days. Act immediately!`;
        }
      }

      return {
        ...JSON.parse(JSON.stringify(scheme)),
        readinessScore,
        presentDocs,
        missingDocs,
        smartTimeline: {
          deadlineDaysRemaining: deadlineDays,
          recommendation: timelineRecommendation
        }
      };
    });

    res.json({ status: 'success', schemes: matchedSchemes });
  } catch (error) {
    console.error('[Vault Scheme Match Error]', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

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
