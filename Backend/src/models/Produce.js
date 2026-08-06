import mongoose from 'mongoose';

const produceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  expectedPrice: { type: Number },
  harvestDate: { type: String },
  quality: { type: String },
  status: { type: String, default: 'Available' },
  images: [{ type: String }]
}, { timestamps: true });

export const Produce = mongoose.model('Produce', produceSchema);
export default Produce;
