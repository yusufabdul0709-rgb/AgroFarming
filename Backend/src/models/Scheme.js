import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String },
  description: { type: String },
  eligibility: {
    maxLandArea: Number,
    maxIncome: Number,
    categories: [{ type: String }]
  },
  benefits: { type: String },
  applicationUrl: { type: String }
}, { timestamps: true });

export const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
