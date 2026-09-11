import os
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

import joblib
import numpy as np
import pandas as pd
import tensorflow as tf

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "models"

MODEL_PATH = MODEL_DIR / "crop_ann_model.keras"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"

print("MODEL DIR:", MODEL_DIR)
print("MODEL EXISTS:", MODEL_PATH.exists())
print("SCALER EXISTS:", SCALER_PATH.exists())
print("ENCODER EXISTS:", ENCODER_PATH.exists())

model = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
encoder = joblib.load(ENCODER_PATH)


def recommend_crop(
    N: float,
    P: float,
    K: float,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
) -> dict:

    values = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=[
            "N",
            "P",
            "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall",
        ],
    )

    scaled_values = scaler.transform(values)

    probabilities = model.predict(
        scaled_values,
        verbose=0,
    )[0]

    best_indices = np.argsort(probabilities)[::-1][:3]

    return {
        "recommended_crop": encoder.inverse_transform(
            [best_indices[0]]
        )[0],

        "confidence": round(
            float(probabilities[best_indices[0]]) * 100,
            2,
        ),

        "alternatives": [
            {
                "crop": encoder.inverse_transform([index])[0],
                "confidence": round(
                    float(probabilities[index]) * 100,
                    2,
                ),
            }
            for index in best_indices[1:]
        ],
    }


if __name__ == "__main__":
    print(
        recommend_crop(
            90,
            42,
            43,
            20.87,
            82.0,
            6.5,
            202.93,
        )
    )