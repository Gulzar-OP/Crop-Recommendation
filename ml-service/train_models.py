from __future__ import annotations

import json
import os
import random
from pathlib import Path

os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
os.environ.setdefault("MPLBACKEND", "Agg")

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import SVC
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.layers import BatchNormalization, Dense, Dropout, Input
from tensorflow.keras.models import Sequential

SEED = 42
FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "dataset" / "Crop_recommendation.csv"
MODEL_DIR = ROOT / "models"
REPORT_DIR = ROOT / "reports"


def validate_data(df: pd.DataFrame) -> None:
    required = set(FEATURES + ["label"])
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    if df.empty:
        raise ValueError("Dataset is empty")
    if df[FEATURES].isna().any().any() or df["label"].isna().any():
        raise ValueError("Dataset contains missing values")


def make_ann(input_size: int, classes: int) -> Sequential:
    model = Sequential([
        Input(shape=(input_size,)),
        Dense(128, activation="relu"),
        BatchNormalization(),
        Dropout(0.30),
        Dense(64, activation="relu"),
        BatchNormalization(),
        Dropout(0.20),
        Dense(32, activation="relu"),
        Dropout(0.10),
        Dense(classes, activation="softmax"),
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def save_training_plot(history: tf.keras.callbacks.History) -> None:
    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    axes[0].plot(history.history["accuracy"], label="Train")
    axes[0].plot(history.history["val_accuracy"], label="Validation")
    axes[0].set(title="ANN Accuracy", xlabel="Epoch", ylabel="Accuracy")
    axes[0].legend()
    axes[0].grid(alpha=0.25)
    axes[1].plot(history.history["loss"], label="Train")
    axes[1].plot(history.history["val_loss"], label="Validation")
    axes[1].set(title="ANN Loss", xlabel="Epoch", ylabel="Loss")
    axes[1].legend()
    axes[1].grid(alpha=0.25)
    fig.tight_layout()
    fig.savefig(REPORT_DIR / "ann_training_history.png", dpi=180)
    plt.close(fig)


def save_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, classes: np.ndarray) -> None:
    matrix = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(15, 13))
    sns.heatmap(matrix, annot=True, fmt="d", cmap="Greens", xticklabels=classes, yticklabels=classes, ax=ax)
    ax.set(title="ANN Confusion Matrix", xlabel="Predicted Crop", ylabel="Actual Crop")
    plt.xticks(rotation=90)
    plt.yticks(rotation=0)
    fig.tight_layout()
    fig.savefig(REPORT_DIR / "ann_confusion_matrix.png", dpi=180)
    plt.close(fig)


def save_comparison_plot(results: dict[str, dict[str, float]]) -> None:
    names = list(results)
    accuracy = [results[name]["accuracy"] * 100 for name in names]
    f1 = [results[name]["macro_f1"] * 100 for name in names]
    x = np.arange(len(names))
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar(x - 0.18, accuracy, 0.36, label="Accuracy", color="#2e8b57")
    ax.bar(x + 0.18, f1, 0.36, label="Macro F1", color="#e9c46a")
    ax.set(ylim=(85, 101), ylabel="Score (%)", title="Model Performance Comparison")
    ax.set_xticks(x, names)
    ax.legend()
    ax.grid(axis="y", alpha=0.2)
    fig.tight_layout()
    fig.savefig(REPORT_DIR / "model_comparison.png", dpi=180)
    plt.close(fig)


def main() -> None:
    random.seed(SEED)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATA_PATH).drop_duplicates().reset_index(drop=True)
    validate_data(df)
    X = df[FEATURES]
    encoder = LabelEncoder()
    y = encoder.fit_transform(df["label"])
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=SEED, stratify=y
    )
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    ann = make_ann(len(FEATURES), len(encoder.classes_))
    history = ann.fit(
        X_train_scaled,
        y_train,
        validation_split=0.20,
        epochs=150,
        batch_size=32,
        callbacks=[
            EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True),
            ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5, min_lr=1e-5),
        ],
        verbose=0,
    )
    ann_pred = np.argmax(ann.predict(X_test_scaled, verbose=0), axis=1)

    random_forest = RandomForestClassifier(n_estimators=300, random_state=SEED, n_jobs=-1)
    random_forest.fit(X_train, y_train)
    rf_pred = random_forest.predict(X_test)

    svm = SVC(kernel="rbf", C=10, gamma="scale", random_state=SEED)
    svm.fit(X_train_scaled, y_train)
    svm_pred = svm.predict(X_test_scaled)

    predictions = {"ANN": ann_pred, "Random Forest": rf_pred, "SVM": svm_pred}
    results = {
        name: {
            "accuracy": float(accuracy_score(y_test, pred)),
            "macro_f1": float(f1_score(y_test, pred, average="macro")),
        }
        for name, pred in predictions.items()
    }
    best_model = max(results, key=lambda name: results[name]["accuracy"])

    ann.save(MODEL_DIR / "crop_ann_model.keras")
    joblib.dump(random_forest, MODEL_DIR / "random_forest_model.pkl")
    joblib.dump(svm, MODEL_DIR / "svm_model.pkl")
    joblib.dump(scaler, MODEL_DIR / "scaler.pkl")
    joblib.dump(encoder, MODEL_DIR / "label_encoder.pkl")
    joblib.dump(FEATURES, MODEL_DIR / "feature_order.pkl")

    save_training_plot(history)
    save_confusion_matrix(y_test, ann_pred, encoder.classes_)
    save_comparison_plot(results)

    report = classification_report(
        y_test, ann_pred, target_names=encoder.classes_, zero_division=0
    )
    (REPORT_DIR / "ann_classification_report.txt").write_text(report)
    summary = {
        "dataset": {
            "rows": int(len(df)),
            "features": FEATURES,
            "crop_classes": int(len(encoder.classes_)),
            "missing_values": int(df.isna().sum().sum()),
            "duplicates_removed": int(pd.read_csv(DATA_PATH).duplicated().sum()),
        },
        "split": {"train_rows": int(len(X_train)), "test_rows": int(len(X_test)), "random_state": SEED},
        "models": results,
        "best_model": best_model,
        "ann_epochs_trained": int(len(history.history["loss"])),
    }
    (REPORT_DIR / "metrics.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
