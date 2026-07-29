import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, default: 'Department of Agriculture & Farmers Welfare' },
  description: { type: String },
  source: { type: String, default: 'myScheme Official Portal' },
  eligibility: {
    maxLandArea: { type: Number, default: 25.0 },
    maxIncome: { type: Number, default: 500000 },
    categories: [{ type: String, default: ['OBC', 'General', 'SC', 'ST'] }],
    states: [{ type: String, default: ['Telangana', 'All India'] }]
  },
  benefits: { type: String },
  requiredDocuments: [{ type: String }],
  deadline: { type: String, default: 'Rolling Registration' },
  applicationUrl: { type: String, default: 'https://myscheme.gov.in' },
  status: { type: String, enum: ['PENDING_ADMIN_REVIEW', 'APPROVED'], default: 'APPROVED' },
  approvalProbability: { type: Number, default: 95.0 }
}, { timestamps: true });

export const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
