export const schemeAgent = {
  name: 'Scheme AI',
  role: 'Subsidies and scheme eligibility',
  generatePrompt: (farmerProfile, schemesCount) => {
    return `
Domain: Scheme AI (Government policy specialist)
Farmer State: ${farmerProfile?.state || 'Uttar Pradesh'}.
Social Category: ${farmerProfile?.category || 'OBC'}.
Acreage: ${farmerProfile?.landArea || 2.5} acres.
Schemes Evaluated: ${schemesCount || 4}.
Describe how to prepare documents for PM-KISAN or Per Drop More Crop micro-irrigation applications.
    `;
  },
  getFallbackResponse: () => {
    return `- You qualify for the PM-KISAN subsidy (₹6,000 cash per annum).
- Sowing/irrigation stubs: Micro-irrigation equipment holds an 85% regional subsidy rate.`;
  }
};
