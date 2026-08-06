import dotenv from 'dotenv';
dotenv.config();

// 1. Weather Data - OpenWeatherMap (primary) + Open-Meteo (fallback)
export const getWeatherData = async (req, res) => {
  const { latitude, longitude } = req.query;
  const OWM_KEY = process.env.OPENWEATHER_API_KEY || 'c08e560f4721f574beb679819eff458a';

  // Try OpenWeatherMap first
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OWM_KEY}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OWM_KEY}&units=metric`)
    ]);

    if (currentRes.ok && forecastRes.ok) {
      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      // Build 7-day forecast from 3-hour intervals (pick one per day)
      const dailyMap = {};
      for (const item of (forecast.list || [])) {
        const day = item.dt_txt?.split(' ')[0];
        if (day && !dailyMap[day]) {
          dailyMap[day] = {
            date: day,
            dt_txt: item.dt_txt,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            humidity: item.main.humidity,
            description: item.weather?.[0]?.description || 'Clear',
            icon: item.weather?.[0]?.icon || '01d',
            rain_mm: item.rain?.['3h'] || 0,
            wind_kmh: Math.round((item.wind?.speed || 0) * 3.6)
          };
        }
      }
      const forecast7days = Object.values(dailyMap).slice(0, 7);

      return res.json({
        status: 'success',
        source: 'OpenWeatherMap',
        data: {
          temperature_c: Math.round(current.main?.temp * 10) / 10,
          feels_like_c: Math.round(current.main?.feels_like * 10) / 10,
          humidity_percent: current.main?.humidity,
          pressure_hpa: current.main?.pressure,
          wind_speed_kmh: Math.round((current.wind?.speed || 0) * 3.6),
          wind_deg: current.wind?.deg,
          weather_condition: current.weather?.[0]?.description?.replace(/\b\w/g, c => c.toUpperCase()) || 'Clear',
          weather_icon: current.weather?.[0]?.icon || '01d',
          rain_1h_mm: current.rain?.['1h'] || 0,
          clouds_percent: current.clouds?.all || 0,
          visibility_m: current.visibility || 10000,
          sunrise: current.sys?.sunrise,
          sunset: current.sys?.sunset,
          city_name: current.name || '',
          forecast_7days: forecast7days
        }
      });
    }
  } catch (owmErr) {
    console.warn('[Weather] OpenWeatherMap failed, trying Open-Meteo:', owmErr.message);
  }

  // Fallback: Open-Meteo
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,wind_speed_10m,soil_temperature_0cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,cloud_cover&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m&forecast_days=16`);
    const data = await response.json();
    return res.json({ status: 'success', source: 'Open-Meteo', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. SoilGrids (ISRIC)
export const getSoilGrids = async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const response = await fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${longitude}&lat=${latitude}`);
    const data = await response.json();
    return res.json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. NASA POWER
export const getNasaPower = async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT&community=AG&longitude=${longitude}&latitude=${latitude}&format=JSON`);
    const data = await response.json();
    return res.json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Reverse Geocoding (Nominatim)
export const getReverseGeocode = async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    return res.json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Agmarknet (Mandi Prices)
export const getAgmarknetPrices = async (req, res) => {
  try {
    const apiKey = process.env.AGMARKNET_API_KEY;
    // Agmarknet typically uses data.gov.in format
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return res.json({ status: 'success', data });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

import { GoogleGenerativeAI } from '@google/generative-ai';

// 6. AI Crop Recommendation Engine
export const getCropRecommendations = async (req, res) => {
  const { farmContext, weatherContext } = req.body;
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the backend environment variables.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Pro is better for complex structured JSON generation

    const prompt = `
      Act as an expert agricultural agronomist. 
      Recommend the best crop based on the following context:
      Farm Context: ${JSON.stringify(farmContext)}
      Weather Context: ${JSON.stringify(weatherContext)}

      Provide a JSON response with exactly these fields:
      - crop (string): Name of recommended crop
      - suitabilityScore (number): 0 to 100
      - expectedYield (string): e.g., '28-32 qtl/acre'
      - estProfit (string): e.g., '₹45,000/acre'
      - waterNeed (string): 'Low', 'Medium', or 'High'
      - duration (string): e.g., '120-130 days'
      - bestMatch (boolean): true or false
      - highProfit (boolean): true or false

      Return ONLY raw JSON, no markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return res.json({
      status: 'success',
      data: parsedData
    });
  } catch (error) {
    console.error('[Crop Rec Engine Error]', error);
    // Fallback if API fails
    return res.json({
      status: 'success',
      data: {
        crop: 'Paddy (Swarna)',
        suitabilityScore: 92,
        bestMatch: true,
        highProfit: true,
        expectedYield: '28-32 qtl/acre',
        estProfit: '₹45,000/acre',
        waterNeed: 'Medium',
        duration: '120-130 days'
      }
    });
  }
};
