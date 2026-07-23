import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  gpsLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  aadhaar: { type: String },
  landArea: { type: Number }, // in acres
  landOwnership: { type: String, enum: ['Owned', 'Leased', 'Sharecropped'] },
  soilType: { type: String },
  irrigationSource: { type: String },
  waterAvailability: { type: String, enum: ['Abundant', 'Moderate', 'Scarce'] },
  annualIncome: { type: Number },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST'] },
  currentCrops: [{ type: String }],
  previousCrops: [{ type: String }],
  farmingExperience: { type: Number }, // in years
  preferredLanguage: { type: String, default: 'English' }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
