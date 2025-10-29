import streamlit as st
import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import shap

st.set_page_config(page_title="Cross-Process Quality Prediction - JK Cement", layout="wide")
st.title("🏭 Cross-Process Quality Prediction (Raw Mix → Clinker → Cement Quality)")

st.sidebar.header("📂 Upload Dataset")
uploaded_file = st.sidebar.file_uploader("Upload fused multi-silo dataset (CSV)", type=["csv"])

if uploaded_file is not None:
    data = pd.read_csv(uploaded_file)
    st.subheader("Sample fused dataset (from uploaded file)")
    st.dataframe(data.sample(6))
else:
    st.warning("Please upload your dataset CSV to continue.")
    st.stop()

features = [
    "limestone_pct", "silica_pct", "al2o3_pct", "fe2o3_pct", "lsf",
    "kiln_temp", "fuel_rate", "o2", "cooling_rate", "blaine", "mill_power"
]
target = "strength_28d"

missing_cols = [c for c in features + [target] if c not in data.columns]
if missing_cols:
    st.error(f"Missing required columns in your dataset: {missing_cols}")
    st.stop()

X = data[features]
y = data[target]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=7)
model_path = "jk_quality_rf.joblib"

if not os.path.exists(model_path):
    model = RandomForestRegressor(n_estimators=200, random_state=7)
    model.fit(X_train, y_train)
    joblib.dump(model, model_path)
else:
    model = joblib.load(model_path)


preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
mse = mean_squared_error(y_test, preds)
r2 = r2_score(y_test, preds)
st.markdown(f"**Model performance** — MAE: {mae:.3f} | MSE: {mse:.3f} | R²: {r2:.3f}")


st.sidebar.header("⚙️ Simulate Inputs from Different Silos")

st.sidebar.subheader("Raw Mix Lab")
lim = st.sidebar.slider("Limestone %", 70.0, 90.0, 80.0)
sil = st.sidebar.slider("Silica %", 3.0, 8.0, 5.0)
al = st.sidebar.slider("Al2O3 %", 1.0, 3.5, 2.0)
fe = st.sidebar.slider("Fe2O3 %", 1.0, 3.0, 2.0)

st.sidebar.subheader("Kiln")
kt = st.sidebar.slider("Kiln Temp (°C)", 1350, 1500, 1425)
fr = st.sidebar.slider("Fuel Rate (t/hr)", 3.5, 6.0, 4.5)
o2v = st.sidebar.slider("O2 (%)", 3.0, 6.0, 4.5)
cr = st.sidebar.slider("Cooling Rate", 2.0, 5.0, 3.2)

st.sidebar.subheader("Grinding")
bl = st.sidebar.slider("Blaine", 280, 360, 320)
mp = st.sidebar.slider("Mill Power (kW)", 1500, 3500, 2200)

input_df = pd.DataFrame([{
    "limestone_pct": lim,
    "silica_pct": sil,
    "al2o3_pct": al,
    "fe2o3_pct": fe,
    "lsf": 0.8 * lim / 100,
    "kiln_temp": kt,
    "fuel_rate": fr,
    "o2": o2v,
    "cooling_rate": cr,
    "blaine": bl,
    "mill_power": mp,
}])

st.subheader("Predicted output for the given inputs")
pred_val = model.predict(input_df)[0]
st.metric("Predicted 28-day Strength (MPa)", f"{pred_val:.2f}")


if pred_val < 3:
    quality = "Low / Substandard ⚠️"
    color = "red"
elif 3 <= pred_val < 3.5:
    quality = "Standard / Acceptable ✅"
    color = "orange"
elif 4 <= pred_val < 4.5:
    quality = "High / Good quality 💪"
    color = "green"
else:
    quality = "Very High / Excellent quality 🌟"
    color = "darkgreen"

st.markdown(f"<span style='color:{color}; font-weight:bold'>Strength Interpretation: {quality}</span>", unsafe_allow_html=True)


st.subheader("Why the model predicted this (SHAP explanation)")

@st.cache_resource(hash_funcs={RandomForestRegressor: lambda _: None})
def get_explainer(model):
    return shap.Explainer(model)

expl = get_explainer(model)
shap_input = expl(input_df)

fig1, ax1 = plt.subplots(figsize=(6, 4))
shap.plots.waterfall(shap_input[0], show=False)
st.pyplot(fig1)
st.write("""
The SHAP explanation shows how each input feature contributed to the predicted 28-day cement strength. 
Positive (Red) SHAP values increase predicted strength; negative (Blue) values reduce it. 
Top influencing features help operators adjust parameters to achieve target strength.
""")


st.subheader("Simple AI suggestion to reach a target strength")

target_strength = st.number_input("Target 28-day Strength (MPa)", value=float(pred_val + 0.5))
delta = target_strength - pred_val

expl_local = expl(input_df)
shap_series = pd.Series(expl_local.values[0], index=features)
top_features = shap_series.abs().sort_values(ascending=False).index[:3]

suggestions = []
for f in top_features:
    sign = np.sign(shap_series[f])
    if sign < 0:
        act = f"Increase {f}"
    else:
        act = f"Decrease {f}"
    suggestions.append(act)

st.write("Top features influencing prediction:", list(top_features))
st.info("Suggested changes (manual operator guidance):")
for s in suggestions:
    st.write("•", s)



