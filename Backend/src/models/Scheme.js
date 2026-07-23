import mongoose from 'mongoose';

const SchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  state: { type: String }, // e.g. All, Andhra Pradesh, Uttar Pradesh
  maxLandSize: { type: Number }, // in acres, null means no limit
  minLandSize: { type: Number },
  allowedCategories: [{ type: String }], // SC, ST, OBC, General
  minFarmingExperience: { type: Number },
  benefits: { type: String },
  requiredDocuments: [{ type: String }],
  deadline: { type: Date }
}, { timestamps: true });

export const Scheme = mongoose.models.Scheme || mongoose.model('Scheme', SchemeSchema);
export default Scheme;
