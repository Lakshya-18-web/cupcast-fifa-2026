from pathlib import Path
import joblib


# Project root:
# FIFA-World-Cup-2026/
PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = PROJECT_ROOT / "models" / "world_cup_prediction_model.pkl"
FEATURE_COLUMNS_PATH = PROJECT_ROOT / "models" / "feature_columns.pkl"


def load_model():
    """Load the trained FIFA World Cup prediction model."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def load_feature_columns():
    """Load the feature columns used during model training."""
    if not FEATURE_COLUMNS_PATH.exists():
        raise FileNotFoundError(
            f"Feature columns file not found: {FEATURE_COLUMNS_PATH}"
        )

    return joblib.load(FEATURE_COLUMNS_PATH)


model = load_model()
feature_columns = load_feature_columns()