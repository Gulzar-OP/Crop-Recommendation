import os
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"

model = tf.keras.models.load_model(MODEL_DIR / "crop_ann_model.keras")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")
encoder = joblib.load(MODEL_DIR / "label_encoder.pkl")


def recommend_crop(N: float, P: float, K: float, temperature: float,
                   humidity: float, ph: float, rainfall: float) -> dict:
    values = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
    )
    probabilities = model.predict(scaler.transform(values), verbose=0)[0]
    best_indices = np.argsort(probabilities)[::-1][:3]
    return {
        "recommended_crop": encoder.inverse_transform([best_indices[0]])[0],
        "confidence": round(float(probabilities[best_indices[0]]) * 100, 2),
        "alternatives": [
            {
                "crop": encoder.inverse_transform([index])[0],
                "confidence": round(float(probabilities[index]) * 100, 2),
            }
            for index in best_indices[1:]
        ],
    }


if __name__ == "__main__":
    print(recommend_crop(90, 42, 43, 20.87, 82.0, 6.5, 202.93))
