import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['WEATHER', 'MARKET', 'SCHEME', 'DISEASE', 'HARVEST', 'SYSTEM'], default: 'SYSTEM' },
  read: { type: Boolean, default: false },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
