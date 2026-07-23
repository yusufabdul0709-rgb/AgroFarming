export const getMarketIntel = async (cropName, district = 'Lucknow') => {
  const crop = (cropName || 'Paddy').toLowerCase();
  
  // Base details database for simulated intelligence
  const marketProfiles = {
    paddy: { base: 2183, trend: 'up', demand: 85, buyers: ['AgroCorp India', 'Pioneer Foods', 'Kissan Mandi Association'] },
    wheat: { base: 2275, trend: 'up', demand: 90, buyers: ['ITC ABD', 'State Warehousing Corp', 'Aashirvaad Farms'] },
    maize: { base: 2090, trend: 'down', demand: 70, buyers: ['Star Feeds', 'Bio-Ethanol Refineries', 'Apex Grain Traders'] },
    tomato: { base: 1800, trend: 'volatile', demand: 95, buyers: ['FreshVeggies Ltd', 'Metro Cash & Carry', 'Reliance Retail'] },
    cotton: { base: 7020, trend: 'up', demand: 80, buyers: ['Vardhman Textiles', 'CCI Punjab Hub', 'Deccan Spinners'] },
    sugarcane: { base: 340, trend: 'stable', demand: 75, buyers: ['Balrampur Chini Mills', 'Cooperative Sugar Factory'] },
    soybean: { base: 4600, trend: 'stable', demand: 78, buyers: ['Adani Wilmar', 'Soy Solvent Association', 'Ruchi Soya'] }
  };

  const profile = marketProfiles[crop] || { base: 2000, trend: 'stable', demand: 75, buyers: ['Local Mandi Merchant', 'Regional Distributor'] };

  // Calculate simulated 30-day forecast
  const predictions = Array.from({ length: 4 }).map((_, idx) => {
    const week = idx + 1;
    let factor = 1.0;
    if (profile.trend === 'up') factor += (week * 0.015);
    else if (profile.trend === 'down') factor -= (week * 0.012);
    else if (profile.trend === 'volatile') factor += (Math.sin(week) * 0.04);
    
    return {
      week: `Week ${week}`,
      price: Math.round(profile.base * factor)
    };
  });

  const bestSellingDate = new Date();
  bestSellingDate.setDate(bestSellingDate.getDate() + (profile.trend === 'up' ? 18 : 3));

  const nearbyBuyers = profile.buyers.map((name, index) => ({
    id: `buyer-${index + 1}`,
    name,
    distance: `${2.4 + (index * 3.5)} km`,
    offeredPrice: Math.round(profile.base * (1.0 + (index * 0.01 - 0.005))),
    rating: (4.2 + (index * 0.2)).toFixed(1),
    phone: `+91 98765 4321${index}`
  }));

  return {
    cropName: cropName || 'Paddy',
    todayPrice: profile.base,
    priceTrend: profile.trend,
    demandScore: profile.demand,
    nearbyBuyers,
    bestSellingDate: bestSellingDate.toISOString().split('T')[0],
    predictions,
    mandiName: `${district} Main Mandi`,
    historicalMax: Math.round(profile.base * 1.15),
    historicalMin: Math.round(profile.base * 0.85),
    exportDemand: profile.demand > 80 ? 'High' : 'Moderate'
  };
};
