import { Scheme } from '../models/Scheme.js';

// Local RAG database - representing loaded ICAR manuals and scheme details
const RAG_DATABASE = [
  {
    topic: 'Paddy water requirement',
    keywords: ['paddy', 'rice', 'water', 'flood', 'irrigation'],
    content: 'Paddy is a water-intensive crop requiring about 1200-1500 mm of water throughout its cycle. Saturated soil conditions should be maintained. Alternative wetting and drying (AWD) can reduce water usage by 20-30% without yield loss.'
  },
  {
    topic: 'Wheat sowing guide',
    keywords: ['wheat', 'sow', 'winter', 'rabi', 'temperature'],
    content: 'Wheat is a Rabi crop sown from November to December. Optimum temperature is 20-25°C. Needs 4 to 6 irrigations, with the Crown Root Initiation (CRI) stage at 21 days being the most critical.'
  },
  {
    topic: 'Tomato late blight disease',
    keywords: ['tomato', 'blight', 'fungus', 'spot', 'rot'],
    content: 'Late blight is caused by Phytophthora infestans. Appears as dark, water-soaked spots on leaves. Treatment: Spray Copper Oxychloride (2g/L) or Metalaxyl+Mancozeb. Organic: Neem oil spray or Trichoderma viride culture.'
  },
  {
    topic: 'Soil pH adjustment',
    keywords: ['acidic', 'alkaline', 'soil', 'ph', 'lime', 'gypsum'],
    content: 'For acidic soils (pH < 6.0), apply agricultural lime (calcium carbonate) to raise pH. For alkaline soils (pH > 7.5), apply gypsum (calcium sulfate) to reduce alkalinity and improve soil structure.'
  },
  {
    topic: 'PM-KISAN Scheme',
    keywords: ['pm-kisan', 'scheme', 'money', 'financial', 'subsidy'],
    content: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) offers direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across the country.'
  }
];

// Perform search on local RAG
export const queryRAG = (queryText) => {
  const words = queryText.toLowerCase().split(/\s+/);
  let bestMatch = null;
  let maxScore = 0;

  for (const doc of RAG_DATABASE) {
    let score = 0;
    for (const word of words) {
      if (doc.keywords.some(k => word.includes(k) || k.includes(word))) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  }

  return bestMatch ? bestMatch.content : 'General agricultural best practices recommend testing soil health and adjusting irrigation according to local weather forecasts.';
};

export { orchestrateMultiAgentAI } from '../agents/orchestrator.js';

// AI Digital Twin Decision Simulator
export const simulateFarmTwinDecision = (farmProfile, decision) => {
  const { cropName, rainfallChange, irrigationFrequency } = decision;
  
  // Base constants
  const soilPH = farmProfile?.soilProfile?.pH || 6.5;
  const originalCrops = farmProfile?.cropStatus?.cropName || 'Paddy';
  const farmArea = farmProfile?.landArea || 2.5;

  let simulatedYield = 4.2; // Tons per acre base
  let simulatedWaterReq = 1200; // mm base
  let expectedInvestment = 15000; // Rs/acre
  let expectedProfit = 35000; // Rs/acre
  let riskScore = 20; // out of 100
  let suitabilityScore = 85; // %

  const simulatedCrop = cropName || originalCrops;

  // 1. Simulating Crop Swapping
  if (simulatedCrop.toLowerCase() === 'maize') {
    simulatedYield = 3.5;
    simulatedWaterReq = 600; // less water
    expectedInvestment = 9000;
    expectedProfit = 22000;
    riskScore = 15;
    suitabilityScore = soilPH >= 6.0 && soilPH <= 7.0 ? 92 : 75;
  } else if (simulatedCrop.toLowerCase() === 'wheat') {
    simulatedYield = 3.8;
    simulatedWaterReq = 500;
    expectedInvestment = 10000;
    expectedProfit = 26000;
    riskScore = 18;
    suitabilityScore = 88;
  } else if (simulatedCrop.toLowerCase() === 'tomato') {
    simulatedYield = 12.5; // high weight
    simulatedWaterReq = 700;
    expectedInvestment = 28000; // high investment
    expectedProfit = 75000; // high profit potential
    riskScore = 45; // highly volatile
    suitabilityScore = soilPH >= 5.5 && soilPH <= 6.8 ? 90 : 65;
  } else {
    // Paddy default
    simulatedYield = 4.5;
    simulatedWaterReq = 1350;
    expectedInvestment = 13000;
    expectedProfit = 31000;
    riskScore = 25;
    suitabilityScore = 85;
  }

  // 2. Simulating Rainfall Change (e.g. -20% or +15%)
  const rainDiff = Number(rainfallChange) || 0; // percentage
  if (rainDiff < 0) {
    // drought stress
    const stressFactor = Math.abs(rainDiff) * 0.008;
    simulatedYield = simulatedYield * (1 - stressFactor);
    expectedProfit = expectedProfit * (1 - stressFactor * 1.5);
    riskScore += Math.abs(rainDiff) * 0.8;
  } else if (rainDiff > 0) {
    // excess rain
    const excessFactor = rainDiff * 0.003;
    simulatedYield = simulatedYield * (1 + excessFactor);
    expectedProfit = expectedProfit * (1 + excessFactor * 0.5);
  }

  // 3. Simulating Irrigation Frequency
  const irrFreq = Number(irrigationFrequency) || 3; // times per week
  if (irrFreq < 3) {
    // reduce water supply
    simulatedWaterReq -= (3 - irrFreq) * 150;
    simulatedYield *= 0.92;
    expectedProfit *= 0.90;
  } else if (irrFreq > 3) {
    // increase water supply
    simulatedWaterReq += (irrFreq - 3) * 120;
    simulatedYield *= 1.03;
    expectedProfit -= (irrFreq - 3) * 800; // added cost of irrigation energy/diesel
  }

  // Round values
  simulatedYield = Number(simulatedYield.toFixed(2));
  simulatedWaterReq = Math.round(simulatedWaterReq);
  expectedInvestment = Math.round(expectedInvestment * farmArea);
  expectedProfit = Math.round(expectedProfit * farmArea);
  riskScore = Math.min(100, Math.max(5, Math.round(riskScore)));
  suitabilityScore = Math.min(100, Math.max(10, Math.round(suitabilityScore)));

  return {
    simulatedCrop,
    simulatedYield: `${simulatedYield} Tons/Acre`,
    totalYield: `${(simulatedYield * farmArea).toFixed(1)} Tons`,
    waterRequirement: `${simulatedWaterReq} mm`,
    expectedInvestment: `₹${expectedInvestment.toLocaleString('en-IN')}`,
    expectedProfit: `₹${expectedProfit.toLocaleString('en-IN')}`,
    riskScore,
    suitabilityScore,
    waterStressLevel: simulatedWaterReq > 1000 ? 'Moderate' : 'Low',
    simulationReport: `Growing ${simulatedCrop} on your ${farmArea} acres will require approximately ${simulatedWaterReq}mm water. With a ${rainDiff}% deviation in rainfall and irrigating ${irrFreq} times/week, your simulated net profit is predicted to be ₹${expectedProfit.toLocaleString('en-IN')}.`
  };
};

// Computer Vision Diagnosis Engine
export const diagnoseCropImage = (imageName = 'paddy_leaf.jpg') => {
  const name = imageName.toLowerCase();
  
  // Pre-configured diagnostic responses representing YOLOv8 classification output
  if (name.includes('tomato') || name.includes('blight')) {
    return {
      cropType: 'Tomato',
      disease: 'Late Blight (Fungal Infection)',
      confidenceScore: 94.2,
      leafHealth: 'Poor (Chlorotic spotting & necrosis)',
      plantGrowthStage: 'Vegetative-to-Flowering',
      fruitQuality: 'Grade B (Minor spots)',
      treatment: 'Apply Mancozeb or Copper Oxychloride immediately. Ensure strict soil drainage.',
      organicAlternative: 'Spray 5% Neem Seed Kernel Extract (NSKE) or dust with Wood Ash.',
      agroShops: [
        { name: 'Kissan Seva Kendra', distance: '1.2 km', contact: '+91 94500 12345' },
        { name: 'Agro Chemicals & Fertilizer Traders', distance: '3.8 km', contact: '+91 98899 54321' }
      ],
      expectedPriceRange: '₹1,500 - ₹2,000 / Quintal (Grade B impact)',
      qualityGrade: 'Grade B'
    };
  }

  if (name.includes('rice') || name.includes('paddy') || name.includes('blast') || name.includes('leaf')) {
    return {
      cropType: 'Paddy',
      disease: 'Rice Blast (Pyricularia oryzae)',
      confidenceScore: 89.5,
      leafHealth: 'Degraded (Spindle-shaped gray-center spots)',
      plantGrowthStage: 'Tillering',
      fruitQuality: 'Not Applicable',
      treatment: 'Spray Tricyclazole 75 WP at 0.6g/liter of water.',
      organicAlternative: 'Use Pseudomonas fluorescens formulation (10g/L) for foliar application.',
      agroShops: [
        { name: 'Vedic Organic Inputs Co.', distance: '4.5 km', contact: '+91 91234 56789' },
        { name: 'Mandi Agro Mart', distance: '5.2 km', contact: '+91 90050 09876' }
      ],
      expectedPriceRange: '₹2,050 - ₹2,183 / Quintal',
      qualityGrade: 'Grade A'
    };
  }

  // Default healthy response
  return {
    cropType: 'Wheat',
    disease: 'None (Healthy Crop)',
    confidenceScore: 98.7,
    leafHealth: 'Excellent (Green chlorophyll structure)',
    plantGrowthStage: 'Milking Stage',
    fruitQuality: 'Premium Grade A+',
    treatment: 'No chemical intervention required. Maintain current irrigation schedule.',
    organicAlternative: 'Apply organic vermicompost as top dressing to optimize grain filling.',
    agroShops: [
      { name: 'Kissan Fertilizer Center', distance: '2.5 km', contact: '+91 94150 99887' }
    ],
    expectedPriceRange: '₹2,275 - ₹2,400 / Quintal (Premium)',
    qualityGrade: 'Premium (A+)'
  };
};
