import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  confidence: { type: Number, required: true },
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fieldName: { type: String, trim: true, maxlength: 100, default: null },
  inputs: {
    N: Number, P: Number, K: Number, temperature: Number,
    humidity: Number, ph: Number, rainfall: Number,
  },
  recommendedCrop: { type: String, required: true },
  confidence: { type: Number, required: true },
  alternatives: [scoreSchema],
  model: { type: String, required: true },
  warning: String,
}, { timestamps: true });

recommendationSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Recommendation", recommendationSchema);
