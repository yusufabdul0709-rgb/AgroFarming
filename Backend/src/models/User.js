import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferredLanguage: { type: String, default: 'English' },
  village: { type: String },
  district: { type: String },
  state: { type: String },
  gpsLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  landArea: { type: Number },
  landOwnership: { type: String },
  soilType: { type: String },
  irrigationSource: { type: String },
  waterAvailability: { type: String },
  annualIncome: { type: Number },
  category: { type: String },
  currentCrops: [{ type: String }],
  previousCrops: [{ type: String }],
  farmingExperience: { type: Number }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export default User;
