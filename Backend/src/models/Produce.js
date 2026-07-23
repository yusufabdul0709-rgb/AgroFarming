import mongoose from 'mongoose';

const ProduceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  quantity: { type: Number, required: true }, // in Quintals
  grade: { type: String, enum: ['Premium (A+)', 'Good (A)', 'Fair (B)', 'Average (C)'] },
  estimatedPrice: { type: Number }, // price per quintal
  harvestDate: { type: Date },
  status: { type: String, enum: ['Listing', 'Negotiating', 'Sold', 'Completed'], default: 'Listing' },
  buyer: { type: String }, // Buyer details placeholder
  location: {
    village: { type: String },
    district: { type: String }
  }
}, { timestamps: true });

export const Produce = mongoose.models.Produce || mongoose.model('Produce', ProduceSchema);
export default Produce;
