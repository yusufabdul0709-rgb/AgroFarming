export const getWeatherData = async (lat, lon) => {
  const latitude = lat || 26.8467; // Lucknow, UP coordinates default
  const longitude = lon || 80.9462;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API responded with code: ${response.status}`);
    }
    const data = await response.json();
    
    return {
      current: {
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        feelsLike: data.current.apparent_temperature,
        rainProb: data.daily.precipitation_probability_max[0] || 10,
        windSpeed: data.current.wind_speed_10m,
        uvIndex: data.current.uv_index || 4,
        code: data.current.weather_code,
        soilMoisture: 38.5, // Mocked details matching Open-Meteo extension
        soilTemp: 28.2,
        evapotranspiration: 4.8 // mm/day
      },
      forecast: data.daily.time.map((time, idx) => ({
        date: time,
        tempMax: data.daily.temperature_2m_max[idx],
        tempMin: data.daily.temperature_2m_min[idx],
        rainProb: data.daily.precipitation_probability_max[idx] || 0,
        code: data.daily.weather_code[idx]
      }))
    };
  } catch (error) {
    console.warn('[Weather Service] Failed to fetch weather, using mock fallbacks:', error.message);
    return getMockWeather(latitude, longitude);
  }
};

const getMockWeather = (latitude, longitude) => {
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const forecast = Array.from({ length: 7 }).map((_, idx) => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + idx);
    return {
      date: targetDate.toISOString().split('T')[0],
      tempMax: 32 + Math.floor(Math.random() * 6),
      tempMin: 23 + Math.floor(Math.random() * 4),
      rainProb: Math.floor(Math.random() * 80),
      code: Math.random() > 0.5 ? 3 : 1 // 3: Cloudy, 1: Clear
    };
  });

  return {
    current: {
      temp: 29.5,
      humidity: 65,
      feelsLike: 32.0,
      rainProb: 30,
      windSpeed: 12.4,
      uvIndex: 5,
      code: 3,
      soilMoisture: 42.1,
      soilTemp: 27.6,
      evapotranspiration: 4.2
    },
    forecast
  };
};
