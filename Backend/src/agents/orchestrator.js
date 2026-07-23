import { farmerAgent } from './farmerAgent.js';
import { geoAgent } from './geoAgent.js';
import { weatherAgent } from './weatherAgent.js';
import { marketAgent } from './marketAgent.js';
import { schemeAgent } from './schemeAgent.js';
import { visionAgent } from './visionAgent.js';
import { waterAgent } from './waterAgent.js';
import { queryRAG } from '../services/aiService.js';

export const orchestrateMultiAgentAI = async (prompt, farmerProfile, language = 'English') => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const contextRAG = queryRAG(prompt);
  const query = prompt.toLowerCase();

  // 1. Gather Agent Prompts
  const systemPrompt = `
You are the ApnaKissan Multi-Agent Orchestrator. You collaborate with specialized AI agents:
- ${farmerAgent.name}: ${farmerAgent.role}
- ${geoAgent.name}: ${geoAgent.role}
- ${weatherAgent.name}: ${weatherAgent.role}
- ${marketAgent.name}: ${marketAgent.role}
- ${schemeAgent.name}: ${schemeAgent.role}
- ${visionAgent.name}: ${visionAgent.role}
- ${waterAgent.name}: ${waterAgent.role}

Farmer context details:
- Owner Name: ${farmerProfile?.name || 'Farmer'}
- Social category: ${farmerProfile?.category || 'General'}
- Village region: ${farmerProfile?.village || 'Unknown'}, ${farmerProfile?.state || 'India'}
- Land Size: ${farmerProfile?.landArea || 2.5} acres
- Soil Profile: ${farmerProfile?.soilType || 'Loamy'}

RAG Knowledge Base Context:
"${contextRAG}"

Provide a synthesized, cohesive, supportive response in ${language}. Use bullet points. Do not print markdown heading tags inside the text block.
  `;

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nFarmer Query: ${prompt}` }] }
          ]
        })
      });

      if (response.ok) {
        const json = await response.json();
        const output = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (output) return output;
      }
    } catch (err) {
      console.warn('[Orchestrator Agent] Live call failed, using mock synthesizers:', err.message);
    }
  }

  // 2. Offline Fallback Synthesis
  const greeting = language === 'Hindi' ? 'नमस्ते किसान भाई! ' : 
                   language === 'Telugu' ? 'నమస్తే రైతు సోదరులారా! ' : 'Hello! ';

  let output = greeting;

  if (query.includes('weather') || query.includes('rain') || query.includes('temp')) {
    output += `[Weather AI & Water AI Response]\n${weatherAgent.getFallbackResponse()}\n${waterAgent.getFallbackResponse()}`;
  } else if (query.includes('scheme') || query.includes('subsidy') || query.includes('government')) {
    output += `[Scheme AI Response]\n${schemeAgent.getFallbackResponse()}`;
  } else if (query.includes('price') || query.includes('mandi') || query.includes('market') || query.includes('sell')) {
    output += `[Market AI Response]\n${marketAgent.getFallbackResponse(farmerProfile?.currentCrops?.[0])}`;
  } else if (query.includes('disease') || query.includes('pest') || query.includes('blight') || query.includes('spot')) {
    output += `[Vision AI & Farmer AI Response]\n${visionAgent.getFallbackResponse()}\n${farmerAgent.getFallbackResponse(contextRAG)}`;
  } else {
    output += `[Farmer AI & Geo AI Response]\n${farmerAgent.getFallbackResponse(contextRAG)}\n${geoAgent.getFallbackResponse()}`;
  }

  return output;
};
