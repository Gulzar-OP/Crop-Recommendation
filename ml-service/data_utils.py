import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import (
    LabelEncoder,
    StandardScaler,
)

from config import (
    DATA_PATH,
    FEATURES,
    SEED,
)


def validate_data(df):
    required_columns = FEATURES + ["label"]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns: {missing_columns}"
        )

    if df.empty:
        raise ValueError("Dataset is empty")

    if df[required_columns].isnull().any().any():
        raise ValueError(
            "Dataset contains missing values"
        )


def prepare_data():
    # Dataset load
    original_df = pd.read_csv(DATA_PATH)

    # Duplicate count
    duplicates_removed = int(
        original_df.duplicated().sum()
    )

    # Duplicate rows remove
    df = (
        original_df
        .drop_duplicates()
        .reset_index(drop=True)
    )

    # Dataset validation
    validate_data(df)

    # Inputs
    X = df[FEATURES]

    # Output crop names
    crop_labels = df["label"]

    # Crop names ko numbers mein convert karo
    label_encoder = LabelEncoder()

    y = label_encoder.fit_transform(
        crop_labels
    )

    # 80% training, 20% testing
    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.20,
            random_state=SEED,
            stratify=y,
        )
    )

    # Feature scaling
    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(
        X_train
    )

    X_test_scaled = scaler.transform(
        X_test
    )

    return {
        "df": df,
        "X_train": X_train_scaled,
        "X_test": X_test_scaled,
        "y_train": y_train,
        "y_test": y_test,
        "scaler": scaler,
        "label_encoder": label_encoder,
        "duplicates_removed": duplicates_removed,
    }