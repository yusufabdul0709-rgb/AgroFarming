import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  temperature: { type: Number },
  humidity: { type: Number },
  rainfall: { type: Number },
  windSpeed: { type: Number },
  uvIndex: { type: Number },
  weatherCondition: { type: String },
  forecast7Days: [{
    dt_txt: String,
    temp_c: Number,
    description: String,
    humidity: Number
  }],
  fetchedAt: { type: Date, default: Date.now, expires: 1800 } // TTL 30 minutes
}, { timestamps: true });

export const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);
export default WeatherCache;
