import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Weather', 'Disease', 'Scheme', 'Market'], default: 'Weather' },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  state: { type: String }, // specific location target
  district: { type: String }
}, { timestamps: true });

export const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
export default Alert;
