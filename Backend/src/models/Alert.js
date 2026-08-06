import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String },
  message: { type: String, required: true },
  severity: { type: String, default: 'Info' },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
