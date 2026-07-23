import mongoose from 'mongoose';

const FarmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Farm Twin' },
  boundaries: [{
    latitude: { type: Number },
    longitude: { type: Number }
  }],
  soilProfile: {
    pH: { type: Number, default: 6.5 },
    moisture: { type: Number, default: 45 }, // %
    nitrogen: { type: Number, default: 120 }, // kg/ha
    phosphorus: { type: Number, default: 40 }, // kg/ha
    potassium: { type: Number, default: 210 } // kg/ha
  },
  waterMetrics: {
    waterScore: { type: Number, default: 85 }, // 0 to 100
    waterStressLevel: { type: String, default: 'Low' }, // Low, Medium, High
    lastIrrigationDate: { type: Date }
  },
  cropStatus: {
    cropName: { type: String },
    plantedDate: { type: Date },
    stage: { type: String, enum: ['Sowing', 'Vegetative', 'Flowering', 'Maturation', 'Harvested'] },
    growthPercentage: { type: Number, default: 0 },
    estimatedYield: { type: Number } // tons/acre
  }
}, { timestamps: true });

export const Farm = mongoose.models.Farm || mongoose.model('Farm', FarmSchema);
export default Farm;
