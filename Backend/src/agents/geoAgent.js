export const geoAgent = {
  name: 'Geo AI',
  role: 'Soil grids and GIS intelligence',
  generatePrompt: (farmerProfile) => {
    return `
Domain: Geo AI (Soil and topography specialist)
Soil type: ${farmerProfile?.soilType || 'Loamy'}.
GPS Coordinates: Lat ${farmerProfile?.gpsLocation?.latitude || 26.8}, Lon ${farmerProfile?.gpsLocation?.longitude || 80.9}.
Provide suggestions for fertilizer replenishment (NPK) according to this soil profile.
    `;
  },
  getFallbackResponse: () => {
    return `- Soil pH stands at approximately 6.7. This is highly suitable for most cash crops.
- Recommended NPK ratio is 120:40:60 kg/ha. Apply Nitrogen in split doses.`;
  }
};
