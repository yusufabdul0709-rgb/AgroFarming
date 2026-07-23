export const waterAgent = {
  name: 'Water AI',
  role: 'Water intelligence and stress analysis',
  generatePrompt: (waterMetrics) => {
    return `
Domain: Water AI (Hydrologist specialist)
Water score: ${waterMetrics?.waterScore || 85}/100.
Water stress: ${waterMetrics?.waterStressLevel || 'Low'}.
Provide recommendations on rainwater harvesting and alternate wetting & drying frequencies.
    `;
  },
  getFallbackResponse: () => {
    return `- Water score: 85/100 (Healthy profile).
- Drip irrigation method is highly advised for sandy soils to save up to 40% water.`;
  }
};
