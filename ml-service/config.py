from pathlib import Path


SEED = 42

FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
]

ROOT = Path(__file__).resolve().parent
print(ROOT)
DATA_PATH = (
    ROOT
    # /"ml-service"
    / "dataset"
    / "Crop_recommendation.csv"
)

MODEL_DIR = ROOT / "models"
REPORT_DIR = ROOT / "reports"