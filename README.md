🏭 Cross-Process Quality Prediction – JK Cement

Full-stack application for predicting 28-day cement strength by integrating Raw Mix, Kiln, and Grinding process data.

## Architecture Overview

- **Backend**: FastAPI service (`main.py`) offering endpoints for dataset ingestion, model training, strength prediction, SHAP explanations, and operator guidance.
- **Frontend**: React (Vite) single-page app that mirrors the former Streamlit experience with richer visualisations and UX polish.
- **Model Persistence**: Random Forest stored as `jk_quality_rf.joblib`, alongside training metadata required for SHAP analysis.

## Features

- CSV upload with schema validation across all process silos
- Background RandomForest training or hot-loading of existing model artefact
- Performance metrics (MAE, MSE, R²) surfaced to the UI
- Interactive parameter sliders for Raw Mix, Kiln, and Grinding stages
- Real-time strength prediction with quality banding and emoji cues
- SHAP contributions for explainable AI insights
- Operator guidance suggesting directional parameter adjustments toward a target strength

## Getting Started

### 1. Backend (FastAPI)

```bash
cd /Users/yashree/Desktop/cementui/Cement_strength_prediction
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend (React)

```bash
cd /Users/yashree/Desktop/cementui/Cement_strength_prediction/frontend
npm install
npm run dev -- --port 5173
```

The React app expects the backend on `http://localhost:8000`. Update `.env` in `frontend` if you host elsewhere.

### 3. Usage Flow

1. Upload the fused multi-silo CSV via the “Dataset” card. The backend trains (or fine-tunes) the model and returns metrics plus a preview sample.
2. Adjust process sliders or input fields in the “Simulation” panel. Inputs automatically populate the `lsf` feature when omitted.
3. Submit for prediction to view strength, quality class, SHAP contributions, and top adjustment suggestions.

## API Reference

| Endpoint | Method | Description |
| --- | --- | --- |
| `/health` | GET | Service heartbeat (`ready` / `waiting_for_data`) |
| `/config` | GET | Slider metadata, feature names, latest metrics, and sample rows |
| `/train` | POST (multipart) | Upload CSV to (re)train the Random Forest and refresh explainability artefacts |
| `/predict` | POST (JSON) | Predict strength, return SHAP contributions and operator suggestions |

### Request/Response Highlights

- **/train** accepts `file: CSV`. Response includes metrics, feature order, and sample records.
- **/predict** expects:
  ```json
  {
    "limestone_pct": 80.0,
    "silica_pct": 5.0,
    "al2o3_pct": 2.0,
    "fe2o3_pct": 2.0,
    "kiln_temp": 1425,
    "fuel_rate": 4.5,
    "o2": 4.5,
    "cooling_rate": 3.2,
    "blaine": 320,
    "mill_power": 2200,
    "target_strength": 4.0
  }
  ```
  The backend auto-computes `lsf` if omitted and responds with prediction, quality label, SHAP base value, ranked contributions, and human-readable suggestions.

## Data Schema

Required columns in the uploaded dataset:

```
limestone_pct, silica_pct, al2o3_pct, fe2o3_pct, lsf,
kiln_temp, fuel_rate, o2, cooling_rate, blaine, mill_power,
strength_28d
```

Maintaining column names and units ensures seamless ingestion and accurate predictions.

## Tech Stack

- **Backend**: FastAPI, scikit-learn, pandas, shap
- **Frontend**: React, Vite, TypeScript, custom CSS styling
- **Tooling**: Joblib for persistence, Uvicorn for ASGI serving

## Development Notes

- The SHAP explainer is re-generated on every training session and cached with the model artefact for consistent predictions across server restarts.
- Quality thresholds mirror the original Streamlit logic; adjust `_strength_classification` in `main.py` for different bands.
- Frontend environment variables live in `frontend/.env` (see sample file). Update `VITE_API_BASE_URL` to target a remote backend.

Happy optimizing! 💪
