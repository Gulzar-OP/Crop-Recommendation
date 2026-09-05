from __future__ import annotations

import os
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, Header, HTTPException

from api.schemas import CropScore, PredictionRequest, PredictionResponse

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models"
FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
INTERNAL_API_KEY = os.getenv("ML_INTERNAL_API_KEY", "development-ml-key")

model = tf.keras.models.load_model(MODEL_DIR / "crop_ann_model.keras")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")

app = FastAPI(
    title="KrishiMitra ML Service",
    version="2.0.0",
    description="Private ANN inference service called by the Node.js backend.",
)


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True, "crop_classes": len(encoder.classes_)}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, x_internal_api_key: str | None = Header(default=None)):
    if x_internal_api_key != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid internal API key")

    frame = pd.DataFrame([[getattr(payload, name) for name in FEATURES]], columns=FEATURES)
    probabilities = model.predict(scaler.transform(frame), verbose=0)[0]
    best_indices = np.argsort(probabilities)[::-1][:3]
    crop_names = encoder.inverse_transform(best_indices)
    return PredictionResponse(
        recommended_crop=str(crop_names[0]),
        confidence=round(float(probabilities[best_indices[0]]) * 100, 2),
        alternatives=[
            CropScore(crop=str(crop_names[position]), confidence=round(float(probabilities[index]) * 100, 2))
            for position, index in enumerate(best_indices[1:], start=1)
        ],
        model="ANN / TensorFlow",
        warning="Decision-support output only. Validate with local agricultural guidance.",
    )
