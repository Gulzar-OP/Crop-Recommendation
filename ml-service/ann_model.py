import tensorflow as tf

from tensorflow.keras.layers import (
    BatchNormalization,
    Dense,
    Dropout,
    Input,
)
from tensorflow.keras.models import Sequential


def create_ann_model(
    input_size,
    number_of_classes
):
    model = Sequential([
        # Input layer
        Input(
            shape=(input_size,)
        ),

        # Hidden layer 1
        Dense(
            128,
            activation="relu"
        ),
        BatchNormalization(),
        Dropout(0.30),

        # Hidden layer 2
        Dense(
            64,
            activation="relu"
        ),
        BatchNormalization(),
        Dropout(0.20),

        # Hidden layer 3
        Dense(
            32,
            activation="relu"
        ),
        Dropout(0.10),

        # Output layer
        Dense(
            number_of_classes,
            activation="softmax"
        ),
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=0.001
        ),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model