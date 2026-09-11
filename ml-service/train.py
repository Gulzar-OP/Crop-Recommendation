import json
import os
import random

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import joblib
import numpy as np
import tensorflow as tf

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
)
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ReduceLROnPlateau,
)

from ann_model import create_ann_model
from config import (
    FEATURES,
    MODEL_DIR,
    REPORT_DIR,
    SEED,
)
from data_utils import prepare_data
from report_utils import (
    save_confusion_matrix,
    save_training_graph,
)


def main():
    # Same results ke liye random seed
    random.seed(SEED)
    np.random.seed(SEED)
    tf.random.set_seed(SEED)

    # Output folders create karo
    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    REPORT_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    # Dataset prepare karo
    data = prepare_data()

    df = data["df"]
    X_train = data["X_train"]
    X_test = data["X_test"]
    y_train = data["y_train"]
    y_test = data["y_test"]
    scaler = data["scaler"]
    label_encoder = data["label_encoder"]

    number_of_classes = len(
        label_encoder.classes_
    )

    print("Dataset rows:", len(df))
    print("Crop classes:", number_of_classes)
    print("Training samples:", len(X_train))
    print("Testing samples:", len(X_test))

    # ANN model create karo
    model = create_ann_model(
        input_size=len(FEATURES),
        number_of_classes=number_of_classes,
    )

    model.summary()

    # Early stopping
    early_stopping = EarlyStopping(
        monitor="val_loss",
        patience=15,
        restore_best_weights=True,
    )

    # Learning rate reduction
    reduce_learning_rate = ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.5,
        patience=5,
        min_lr=0.00001,
    )

    # ANN train karo
    history = model.fit(
        X_train,
        y_train,
        validation_split=0.20,
        epochs=150,
        batch_size=32,
        callbacks=[
            early_stopping,
            reduce_learning_rate,
        ],
        verbose=1,
    )

    # Crop probabilities predict karo
    probabilities = model.predict(
        X_test,
        verbose=0
    )

    # Highest probability ka index
    predictions = np.argmax(
        probabilities,
        axis=1
    )

    # Performance
    accuracy = accuracy_score(
        y_test,
        predictions
    )

    macro_f1 = f1_score(
        y_test,
        predictions,
        average="macro"
    )

    print("\nANN Accuracy:", accuracy)
    print("ANN Macro F1:", macro_f1)

    # Classification report
    report = classification_report(
        y_test,
        predictions,
        target_names=label_encoder.classes_,
        zero_division=0,
    )

    print("\nClassification Report:\n")
    print(report)

    # ANN model save karo
    model.save(
        MODEL_DIR / "crop_ann_model.keras"
    )

    # Scaler save karo
    joblib.dump(
        scaler,
        MODEL_DIR / "scaler.pkl"
    )

    # Label encoder save karo
    joblib.dump(
        label_encoder,
        MODEL_DIR / "label_encoder.pkl"
    )

    # Feature order save karo
    joblib.dump(
        FEATURES,
        MODEL_DIR / "feature_order.pkl"
    )

    # Training graph save karo
    save_training_graph(history)

    # Confusion matrix save karo
    save_confusion_matrix(
        y_test,
        predictions,
        label_encoder.classes_,
    )

    # Classification report save karo
    report_path = (
        REPORT_DIR
        / "ann_classification_report.txt"
    )

    report_path.write_text(report)

    # Metrics JSON
    metrics = {
        "model": "Artificial Neural Network",
        "total_rows": int(len(df)),
        "features": FEATURES,
        "crop_classes": number_of_classes,
        "crop_names": (
            label_encoder
            .classes_
            .tolist()
        ),
        "duplicates_removed": (
            data["duplicates_removed"]
        ),
        "accuracy": float(accuracy),
        "macro_f1": float(macro_f1),
        "epochs_trained": len(
            history.history["loss"]
        ),
    }

    metrics_path = (
        REPORT_DIR
        / "metrics.json"
    )

    metrics_path.write_text(
        json.dumps(
            metrics,
            indent=2
        )
    )

    print("\nANN model saved successfully")
    print("Reports saved successfully")


if __name__ == "__main__":
    main()