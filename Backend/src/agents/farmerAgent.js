export const farmerAgent = {
  name: 'Farmer AI',
  role: 'Agronomy and Cultivation Guidance',
  generatePrompt: (farmerProfile, ragContext) => {
    return `
Domain: Farmer AI (Agronomy specialist)
Context: Farmer possesses ${farmerProfile?.farmingExperience || 5} years experience.
Land size: ${farmerProfile?.landArea || 2.5} acres.
Soil Type: ${farmerProfile?.soilType || 'Loamy'}.
Knowledge base fact: "${ragContext}"

Provide direct, actionable cultivation tips. Keep it concise, simple, and encouraging for a farmer.
    `;
  },
  getFallbackResponse: (ragContext) => {
    return `- Sowing stage instructions: Ensure the land is plowed twice to create a fine tilth.
- Apply organic vermicompost in equal sections.
- AWD method: ${ragContext}`;
  }
};
