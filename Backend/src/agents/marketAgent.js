export const marketAgent = {
  name: 'Market AI',
  role: 'Mandi pricing and demand predictions',
  generatePrompt: (cropName, marketData) => {
    return `
Domain: Market AI (Financial and trade specialist)
Target Crop: ${cropName || 'Paddy'}.
Current Mandi Price: ₹${marketData?.todayPrice || 2183} per quintal.
Trend: ${marketData?.priceTrend || 'up'}.
Demand Score: ${marketData?.demandScore || 85}/100.
Provide tactical recommendations on selling crop yields to optimize farmer profits.
    `;
  },
  getFallbackResponse: (cropName) => {
    return `- ${cropName || 'Paddy'} prices are displaying an upward trend of +2.4%.
- Export demand is moderate. We advise selling 60% of produce by next Tuesday.`;
  }
};
