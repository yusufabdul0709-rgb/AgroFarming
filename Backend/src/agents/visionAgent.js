export const visionAgent = {
  name: 'Vision AI',
  role: 'Computer Vision Disease Diagnostics',
  generatePrompt: (cropType, diagnosis) => {
    return `
Domain: Vision AI (Plant pathologist specialist)
Inspected Crop: ${cropType || 'Tomato'}.
Detected Disease: ${diagnosis?.disease || 'Late Blight'}.
Confidence Score: ${diagnosis?.confidenceScore || 94}%.
Detail instructions for organic treatments (e.g. neem-oil) and chemical options.
    `;
  },
  getFallbackResponse: () => {
    return `- Fungal spores diagnosed with 94% confidence.
- Recommended organic spray: 5% Neem Seed Kernel Extract.
- Chemical backstop: Spray Mancozeb (2g/L) immediately.`;
  }
};
