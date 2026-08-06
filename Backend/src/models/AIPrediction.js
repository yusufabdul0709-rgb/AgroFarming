import mongoose from 'mongoose';

const aiPredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  predictionType: { type: String, required: true }, // MASTER_ORCHESTRATOR, CROP_REC, PRICE_FORECAST, etc.
  inputPayload: { type: Object },
  outputResult: { type: Object },
  confidenceScore: { type: Number }
}, { timestamps: true });

export const AIPrediction = mongoose.model('AIPrediction', aiPredictionSchema);
export default AIPrediction;
