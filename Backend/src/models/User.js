import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  profilePhoto: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
  preferredLanguage: { type: String, default: 'Telugu' },
  age: { type: Number, default: 42 },
  gender: { type: String, default: 'Male' },
  annualIncome: { type: Number, default: 150000 },
  category: { type: String, default: 'OBC' },
  farmingExperience: { type: Number, default: 15 },
  village: { type: String, default: 'Shivampet' },
  mandal: { type: String, default: 'Narsapur' },
  district: { type: String, default: 'Rangareddy' },
  state: { type: String, default: 'Telangana' },
  pincode: { type: String, default: '501506' },
  gpsLocation: {
    latitude: { type: Number, default: 17.3850 },
    longitude: { type: Number, default: 78.4867 }
  },
  farms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }],
  landArea: { type: Number, default: 2.5 },
  landOwnership: { type: String, default: 'Owned' },
  soilType: { type: String, default: 'Loamy Soil' },
  irrigationSource: { type: String, default: 'Borewell & Canal' },
  waterAvailability: { type: String, default: 'Good' },
  currentCrops: [{ type: String, default: ['Paddy (Rice)', 'Cotton'] }],
  previousCrops: [{ type: String, default: ['Maize', 'Groundnut'] }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export default User;
