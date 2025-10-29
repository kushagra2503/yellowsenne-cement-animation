🏭 Cross-Process Quality Prediction – JK Cement

This Streamlit web app predicts cement strength (28-day MPa) by integrating data across Raw Mix, Clinker, and Grinding processes.
It helps process engineers simulate process parameters, analyze model predictions, and understand feature influences using SHAP explainability, enabling real-time cement quality optimization.

🚀 Features

✅ Upload fused multi-silo dataset (CSV)
✅ Auto-train or load Random Forest model (jk_quality_rf.joblib)
✅ Display MAE, MSE, and R² model performance metrics
✅ Simulate process parameters through sliders
✅ Predict 28-day cement strength (MPa)
✅ Interpret quality level (Low / Standard / High / Excellent)
✅ Explain predictions using SHAP waterfall plots
✅ Provide AI-based suggestions to improve strength

🧠 Machine Learning Overview

Input Features:

limestone_pct, silica_pct, al2o3_pct, fe2o3_pct, lsf,
kiln_temp, fuel_rate, o2, cooling_rate, blaine, mill_power


Target Variable:
strength_28d → 28-day compressive strength (MPa)

Model Used:
RandomForestRegressor (n_estimators=200, random_state=7)

Performance Metrics:

MAE (Mean Absolute Error)

MSE (Mean Squared Error)

R² Score





2️⃣ Install dependencies

If you already have requirements.txt, simply run:

pip install -r requirements.txt

3️⃣ Launch the Streamlit app
streamlit run app.py

4️⃣ Upload your dataset

Upload your fused dataset (CSV) containing all required columns through the sidebar.

📊 Example Input Ranges
Process	Parameter	Range
Raw Mix	Limestone %	70 – 90
	Silica %	3 – 8
	Al₂O₃ %	1 – 3.5
	Fe₂O₃ %	1 – 3
	LSF	Auto-calculated
Kiln	Temp (°C)	1350 – 1500
	Fuel Rate (t/hr)	3.5 – 6
	O₂ (%)	3 – 6
	Cooling Rate	2 – 5
Grinding	Blaine	280 – 360
	Mill Power (kW)	1500 – 3500
📈 SHAP Explainability

Red bars: Features that increase predicted strength

Blue bars: Features that decrease predicted strength

Enables data-driven adjustments to maintain target quality.

🧭 AI Suggestions

After prediction, the app:

Identifies top 3 influencing parameters via SHAP values

Suggests whether to increase or decrease them

Helps achieve a target strength interactively

🧰 Technologies Used
Component	Technology
UI	Streamlit
ML	Scikit-learn (Random Forest)
Explainability	SHAP
Data Handling	Pandas, NumPy
Visualization	Matplotlib
Model Storage	Joblib
🧑‍💻 Author

Developed by: Sadiq Basha
Project: Cross-Process Optimization for Cement Quality
Stack: Python • Streamlit • ML • SHAP
