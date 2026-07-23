export const weatherAgent = {
  name: 'Weather AI',
  role: 'Climatology and Forecasting Alerts',
  generatePrompt: (weatherData) => {
    return `
Domain: Weather AI (Climate specialist)
Current Temperature: ${weatherData?.current?.temp || 29.5}°C.
Rain Probability: ${weatherData?.current?.rainProb || 30}%.
Soil Moisture: ${weatherData?.current?.soilMoisture || 42}%.
Provide alerts on incoming rain spells or extreme heat waves to adjust agricultural operations.
    `;
  },
  getFallbackResponse: () => {
    return `- Current humidity is 65% with a 30% precipitation probability.
- Sowing operations should proceed safely before afternoon rains.`;
  }
};
