import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const scrapeAndAnalyzeSchemes = async (url) => {
  try {
    console.log(`[Scraper] Fetching data from: ${url}`);
    
    // 1. Fetch raw HTML
    const response = await fetch(url);
    const html = await response.text();
    
    // 2. Basic cleaning with Cheerio
    const $ = cheerio.load(html);
    // Remove scripts, styles, nav, footers to keep text content
    $('script, style, nav, footer, header').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();
    
    // 3. Pass to Gemini for Intelligence Extraction
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[Scraper] GEMINI_API_KEY missing. Returning mock data.');
      return [
        {
          name: 'Mock Scraped Scheme',
          description: 'A mock scheme from ' + url,
          benefits: '₹5000 Subsidy',
          requiredDocuments: JSON.stringify(['Aadhaar Card', 'Land Record']),
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      ];
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const prompt = `You are a Government Agricultural Scheme Data Extractor. 
    Analyze the following website text and extract all agricultural schemes mentioned.
    Return a JSON array of objects. Each object MUST have these keys:
    "name", "description", "state", "maxLandSize" (number or null), "allowedCategories" (array of strings), "benefits", "requiredDocuments" (array of strings), "deadline" (ISO date or null).
    
    Website Text (First 10000 chars):
    ${cleanText.substring(0, 10000)}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const schemes = JSON.parse(text);
      return schemes;
    } catch (e) {
      console.error('[Scraper] Failed to parse Gemini response into JSON', text);
      return [];
    }
  } catch (error) {
    console.error('[Scraper Error]', error);
    throw new Error('Failed to scrape and analyze schemes.');
  }
};
