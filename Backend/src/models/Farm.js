import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Farm Twin' },
  boundaries: [{
    latitude: Number,
    longitude: Number
  }],
  soilProfile: {
    pH: Number,
    moisture: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number
  },
  waterMetrics: {
    waterScore: Number,
    waterStressLevel: String
  },
  cropStatus: {
    cropName: String,
    stage: String,
    growthPercentage: Number,
    estimatedYield: Number
  }
}, { timestamps: true });

export const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
