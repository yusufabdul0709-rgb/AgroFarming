import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  documentType: { type: String, required: true },
  documentNumber: { type: String },
  extractedMetadata: { type: mongoose.Schema.Types.Mixed },
  encryptedUrl: { type: String, required: true },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  format: { type: String }
}, { timestamps: true });

export const Document = mongoose.model('Document', documentSchema);
export default Document;
