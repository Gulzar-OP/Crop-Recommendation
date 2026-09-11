import os

os.environ["MPLBACKEND"] = "Agg"

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import confusion_matrix

from config import REPORT_DIR


def save_training_graph(history):
    figure, axes = plt.subplots(
        1,
        2,
        figsize=(13, 5)
    )

    # Accuracy graph
    axes[0].plot(
        history.history["accuracy"],
        label="Training"
    )

    axes[0].plot(
        history.history["val_accuracy"],
        label="Validation"
    )

    axes[0].set_title("ANN Accuracy")
    axes[0].set_xlabel("Epoch")
    axes[0].set_ylabel("Accuracy")
    axes[0].legend()
    axes[0].grid(alpha=0.3)

    # Loss graph
    axes[1].plot(
        history.history["loss"],
        label="Training"
    )

    axes[1].plot(
        history.history["val_loss"],
        label="Validation"
    )

    axes[1].set_title("ANN Loss")
    axes[1].set_xlabel("Epoch")
    axes[1].set_ylabel("Loss")
    axes[1].legend()
    axes[1].grid(alpha=0.3)

    figure.tight_layout()

    figure.savefig(
        REPORT_DIR / "ann_training_history.png",
        dpi=180
    )

    plt.close(figure)


def save_confusion_matrix(
    y_test,
    predictions,
    crop_names
):
    matrix = confusion_matrix(
        y_test,
        predictions
    )

    plt.figure(figsize=(15, 13))

    sns.heatmap(
        matrix,
        annot=True,
        fmt="d",
        cmap="Greens",
        xticklabels=crop_names,
        yticklabels=crop_names,
    )

    plt.title("ANN Confusion Matrix")
    plt.xlabel("Predicted Crop")
    plt.ylabel("Actual Crop")

    plt.xticks(rotation=90)
    plt.yticks(rotation=0)

    plt.tight_layout()

    plt.savefig(
        REPORT_DIR / "ann_confusion_matrix.png",
        dpi=180
    )

    plt.close()