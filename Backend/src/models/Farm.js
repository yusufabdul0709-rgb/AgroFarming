import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Green Valley Paddy Field' },
  surveyNumber: { type: String, default: '142/A' },
  areaAcres: { type: Number, default: 2.5 },
  ownership: { type: String, default: 'Owned' },
  irrigationType: { type: String, default: 'Drip & Borewell' },
  currentCrop: { type: String, default: 'Paddy (Rice)' },
  gpsCoordinates: {
    latitude: { type: Number, default: 17.3850 },
    longitude: { type: Number, default: 78.4867 },
    village: { type: String, default: 'Shivampet' },
    mandal: { type: String, default: 'Narsapur' },
    district: { type: String, default: 'Rangareddy' },
    state: { type: String, default: 'Telangana' },
    pincode: { type: String, default: '501506' }
  },
  boundaries: [{
    latitude: Number,
    longitude: Number
  }],
  soilProfile: {
    pH: { type: Number, default: 6.8 },
    moisture: { type: Number, default: 35.0 },
    nitrogen: { type: Number, default: 120 },
    phosphorus: { type: Number, default: 40 },
    potassium: { type: Number, default: 40 },
    organicCarbon: { type: Number, default: 1.4 },
    texture: { type: String, default: 'Loamy Soil' }
  },
  waterMetrics: {
    waterScore: { type: Number, default: 78 },
    waterStressLevel: { type: String, default: 'Low Risk' }
  },
  cropStatus: {
    cropName: { type: String, default: 'Paddy (Rice)' },
    stage: { type: String, default: 'Vegetative' },
    growthPercentage: { type: Number, default: 65 },
    estimatedYield: { type: Number, default: 24.5 }
  }
}, { timestamps: true });

export const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
