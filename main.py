import io
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


FEATURES: List[str] = [
    "limestone_pct",
    "silica_pct",
    "al2o3_pct",
    "fe2o3_pct",
    "lsf",
    "kiln_temp",
    "fuel_rate",
    "o2",
    "cooling_rate",
    "blaine",
    "mill_power",
]
TARGET = "strength_28d"
MODEL_PATH = Path(__file__).resolve().parent / "jk_quality_rf.joblib"


SLIDER_CONFIG: Dict[str, Dict[str, float]] = {
    "limestone_pct": {"min": 70.0, "max": 90.0, "step": 0.1, "default": 80.0},
    "silica_pct": {"min": 3.0, "max": 8.0, "step": 0.1, "default": 5.0},
    "al2o3_pct": {"min": 1.0, "max": 3.5, "step": 0.1, "default": 2.0},
    "fe2o3_pct": {"min": 1.0, "max": 3.0, "step": 0.1, "default": 2.0},
    "kiln_temp": {"min": 1350.0, "max": 1500.0, "step": 1.0, "default": 1425.0},
    "fuel_rate": {"min": 3.5, "max": 6.0, "step": 0.1, "default": 4.5},
    "o2": {"min": 3.0, "max": 6.0, "step": 0.1, "default": 4.5},
    "cooling_rate": {"min": 2.0, "max": 5.0, "step": 0.1, "default": 3.2},
    "blaine": {"min": 280.0, "max": 360.0, "step": 1.0, "default": 320.0},
    "mill_power": {"min": 1500.0, "max": 3500.0, "step": 10.0, "default": 2200.0},
}


class SimulationInputs(BaseModel):
    limestone_pct: float = Field(..., ge=0)
    silica_pct: float = Field(..., ge=0)
    al2o3_pct: float = Field(..., ge=0)
    fe2o3_pct: float = Field(..., ge=0)
    kiln_temp: float
    fuel_rate: float
    o2: float = Field(..., ge=0, description="Oxygen percentage at kiln outlet")
    cooling_rate: float
    blaine: float
    mill_power: float
    lsf: Optional[float] = Field(None, description="Lime saturation factor. Optional; computed if missing.")
    target_strength: Optional[float] = Field(
        None,
        description="Target 28-day strength to reach for recommendation messaging.",
    )


class ShapContribution(BaseModel):
    feature: str
    shap_value: float
    actual_value: float


class PredictionResponse(BaseModel):
    predicted_strength: float
    strength_units: str = "MPa"
    quality_label: str
    quality_color: str
    delta_to_target: Optional[float]
    shap_base_value: Optional[float]
    shap_contributions: List[ShapContribution]
    top_features: List[str]
    suggestions: List[str]


def _strength_classification(strength: float) -> Dict[str, str]:
    if strength < 3:
        return {"label": "Low / Substandard ⚠️", "color": "red"}
    if 3 <= strength < 3.5:
        return {"label": "Standard / Acceptable ✅", "color": "orange"}
    if 4 <= strength < 4.5:
        return {"label": "High / Good Quality", "color": "green"}
    return {"label": "Very High / Excellent Quality 🌟", "color": "darkgreen"}


def _load_artifacts() -> Dict[str, Optional[object]]:
    if not MODEL_PATH.exists():
        return {
            "model": None,
            "explainer": None,
            "metrics": None,
            "sample_data": None,
            "background": None,
        }

    try:
        artifact = joblib.load(MODEL_PATH)
    except Exception:  # pragma: no cover - corrupt artifact fallback
        return {
            "model": None,
            "explainer": None,
            "metrics": None,
            "sample_data": None,
            "background": None,
        }

    if isinstance(artifact, RandomForestRegressor):
        return {
            "model": artifact,
            "explainer": None,
            "metrics": None,
            "sample_data": None,
            "background": None,
        }

    model: Optional[RandomForestRegressor] = artifact.get("model")
    background = artifact.get("background")
    metrics = artifact.get("metrics")
    sample_data = artifact.get("sample_data")

    explainer = None
    if model is not None and background is not None:
        explainer = shap.Explainer(model, background, feature_names=FEATURES)

    return {
        "model": model,
        "explainer": explainer,
        "metrics": metrics,
        "sample_data": sample_data,
        "background": background,
    }


app = FastAPI(
    title="Cross-Process Quality Prediction API",
    description="API that powers cement strength predictions, SHAP explanations, and operator guidance.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATE = _load_artifacts()


def _compute_model(  # pragma: no cover - helper
    df: pd.DataFrame,
) -> Dict[str, object]:
    missing_cols = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Dataset missing required columns: {missing_cols}")

    X = df[FEATURES]
    y = df[TARGET]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=True, random_state=7
    )

    model = RandomForestRegressor(n_estimators=200, random_state=7)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    metrics = {
        "mae": float(mean_absolute_error(y_test, preds)),
        "mse": float(mean_squared_error(y_test, preds)),
        "r2": float(r2_score(y_test, preds)),
    }

    background = X_train.sample(min(200, len(X_train)), random_state=7)
    explainer = shap.Explainer(model, background, feature_names=FEATURES)

    sample_data = (
        df.sample(min(6, len(df)), random_state=7)
        .reset_index(drop=True)
        .to_dict(orient="records")
    )

    artifact = {
        "model": model,
        "background": background,
        "metrics": metrics,
        "sample_data": sample_data,
    }
    joblib.dump(artifact, MODEL_PATH)

    return {
        "model": model,
        "explainer": explainer,
        "metrics": metrics,
        "sample_data": sample_data,
        "background": background,
    }


@app.post("/train")
async def train(file: UploadFile = File(...)) -> Dict[str, object]:
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:  # pragma: no cover - pandas error
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {exc}") from exc

    global STATE
    STATE = _compute_model(df)

    response = {
        "message": "Model trained successfully.",
        "metrics": STATE["metrics"],
        "feature_names": FEATURES,
        "target_name": TARGET,
        "sample_data": STATE["sample_data"],
    }
    return response


@app.get("/config")
async def get_config() -> Dict[str, object]:
    dataset_ready = STATE.get("model") is not None
    return {
        "features": FEATURES,
        "target": TARGET,
        "slider_config": SLIDER_CONFIG,
        "dataset_ready": dataset_ready,
        "metrics": STATE.get("metrics"),
        "sample_data": STATE.get("sample_data"),
    }


def _prepare_input(payload: SimulationInputs) -> Tuple[pd.DataFrame, Optional[float]]:
    data = payload.dict()
    target_strength = data.pop("target_strength", None)
    if data.get("lsf") is None:
        data["lsf"] = 0.8 * data["limestone_pct"] / 100
    ordered_values = [data[feature] for feature in FEATURES]
    input_df = pd.DataFrame([ordered_values], columns=FEATURES)
    return input_df, target_strength


@app.post("/predict", response_model=PredictionResponse)
async def predict(payload: SimulationInputs) -> PredictionResponse:
    model = STATE.get("model")
    explainer = STATE.get("explainer")
    if model is None:
        raise HTTPException(status_code=400, detail="Model not trained. Upload a dataset via /train first.")

    input_df, target_strength = _prepare_input(payload)
    prediction = float(model.predict(input_df)[0])

    quality = _strength_classification(prediction)
    delta_to_target = None
    if target_strength is not None:
        delta_to_target = float(np.round(target_strength - prediction, 4))

    shap_contributions: List[ShapContribution] = []
    top_features: List[str] = []
    shap_base_value: Optional[float] = None
    suggestions: List[str] = []

    if explainer is not None:
        explanation = explainer(input_df)
        shap_base_value = float(np.array(explanation.base_values).flatten()[0])
        shap_values = explanation.values[0]
        contributions: List[ShapContribution] = []
        for feature, shap_value in zip(FEATURES, shap_values):
            contributions.append(
                ShapContribution(
                    feature=feature,
                    shap_value=float(shap_value),
                    actual_value=float(input_df.iloc[0][feature]),
                )
            )
        shap_contributions = contributions
        sorted_contributions = sorted(
            contributions,
            key=lambda item: abs(item.shap_value),
            reverse=True,
        )
        top_features = [item.feature for item in sorted_contributions[:3]]

        for item in sorted_contributions[:3]:
            action = "Decrease" if item.shap_value > 0 else "Increase"
            suggestions.append(f"{action} {item.feature}")

    response = PredictionResponse(
        predicted_strength=float(np.round(prediction, 4)),
        quality_label=quality["label"],
        quality_color=quality["color"],
        delta_to_target=delta_to_target,
        shap_base_value=shap_base_value,
        shap_contributions=shap_contributions,
        top_features=top_features,
        suggestions=suggestions,
    )
    return response


@app.get("/health")
async def healthcheck() -> Dict[str, str]:
    status = "ready" if STATE.get("model") else "waiting_for_data"
    return {"status": status}