import mongoose from 'mongoose';

const soilCacheSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  pH: { type: Number },
  nitrogen: { type: Number },
  phosphorus: { type: Number },
  potassium: { type: Number },
  organicCarbon: { type: Number },
  clayPercent: { type: Number },
  soilType: { type: String },
  fetchedAt: { type: Date, default: Date.now, expires: 86400 } // TTL 24 hours
}, { timestamps: true });

export const SoilCache = mongoose.model('SoilCache', soilCacheSchema);
export default SoilCache;
