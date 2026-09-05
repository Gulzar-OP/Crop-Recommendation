import axios from "axios";
import Recommendation from "../models/Recommendation.js";

const fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
const ranges = { N:[0,200], P:[0,200], K:[0,250], temperature:[-10,60], humidity:[0,100], ph:[0,14], rainfall:[0,1000] };

function validateInputs(body) {
  const inputs = {};
  for (const field of fields) {
    const value = Number(body[field]);
    const [min,max] = ranges[field];
    if (!Number.isFinite(value) || value < min || value > max) throw Object.assign(new Error(`Invalid ${field}: expected ${min} to ${max}`), { status: 400 });
    inputs[field] = value;
  }
  return inputs;
}

function serialize(item) {
  return { id: item._id, field_name: item.fieldName, inputs: item.inputs, recommended_crop: item.recommendedCrop, confidence: item.confidence, alternatives: item.alternatives, model: item.model, warning: item.warning, created_at: item.createdAt };
}

export async function createRecommendation(req, res, next) {
  try {
    const inputs = validateInputs(req.body);
    const { data } = await axios.post(`${process.env.ML_SERVICE_URL}/predict`, inputs, { headers: { "x-internal-api-key": process.env.ML_INTERNAL_API_KEY }, timeout: 15000 });
    const item = await Recommendation.create({ userId: req.user._id, fieldName: req.body.field_name?.trim() || null, inputs, recommendedCrop: data.recommended_crop, confidence: data.confidence, alternatives: data.alternatives, model: data.model, warning: data.warning });
    return res.status(201).json({ success: true, ...serialize(item) });
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") error = Object.assign(new Error("ML prediction service is unavailable"), { status: 503 });
    next(error);
  }
}

export async function getHistory(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const items = await Recommendation.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(limit);
    return res.json({ success: true, count: items.length, items: items.map(serialize) });
  } catch (error) { next(error); }
}

export async function deleteHistory(req, res, next) {
  try {
    const item = await Recommendation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ success: false, message: "Recommendation not found" });
    return res.json({ success: true, message: "Recommendation deleted" });
  } catch (error) { next(error); }
}
