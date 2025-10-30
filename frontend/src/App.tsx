import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  fetchConfig,
  healthCheck,
  predictStrength,
  trainModel,
} from './api';
import type {
  ConfigResponse,
  DatasetRow,
  Metrics,
  PredictionResponse,
  SimulationPayload,
  SliderSetting,
} from './types';

type FeatureKey = Exclude<keyof SimulationPayload, 'lsf' | 'target_strength'>;

const featureGroups: { title: string; keys: FeatureKey[] }[] = [
  {
    title: 'Raw Mix Lab',
    keys: ['limestone_pct', 'silica_pct', 'al2o3_pct', 'fe2o3_pct'],
  },
  {
    title: 'Kiln',
    keys: ['kiln_temp', 'fuel_rate', 'o2', 'cooling_rate'],
  },
  {
    title: 'Grinding',
    keys: ['blaine', 'mill_power'],
  },
];

const chartFeatureKeys: FeatureKey[] = featureGroups.flatMap((group) => group.keys);

const initialPayload: SimulationPayload = {
  limestone_pct: 80,
  silica_pct: 5,
  al2o3_pct: 2,
  fe2o3_pct: 2,
  kiln_temp: 1425,
  fuel_rate: 4.5,
  o2: 4.5,
  cooling_rate: 3.2,
  blaine: 320,
  mill_power: 2200,
  target_strength: 3.8,
};

const formatNumber = (value: number, fraction = 3): string =>
  Number(value).toFixed(fraction);

const computeLsf = (limestonePct: number): number => Number(((0.8 * limestonePct) / 100).toFixed(4));

const getColorStyle = (qualityColor: string) => ({
  backgroundColor: qualityColor,
  color: qualityColor === 'darkgreen' ? '#fff' : '#0f172a',
});

export default function App(): JSX.Element {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [status, setStatus] = useState<'ready' | 'waiting_for_data' | 'loading'>('loading');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [sampleRows, setSampleRows] = useState<DatasetRow[]>([]);
  const [form, setForm] = useState<SimulationPayload>(initialPayload);
  const [training, setTraining] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sliderConfig = config?.slider_config ?? {};

  const buildDefaultForm = useCallback(
    (settings: Record<string, SliderSetting>): SimulationPayload => ({
      ...initialPayload,
      limestone_pct: settings.limestone_pct?.default ?? initialPayload.limestone_pct,
      silica_pct: settings.silica_pct?.default ?? initialPayload.silica_pct,
      al2o3_pct: settings.al2o3_pct?.default ?? initialPayload.al2o3_pct,
      fe2o3_pct: settings.fe2o3_pct?.default ?? initialPayload.fe2o3_pct,
      kiln_temp: settings.kiln_temp?.default ?? initialPayload.kiln_temp,
      fuel_rate: settings.fuel_rate?.default ?? initialPayload.fuel_rate,
      o2: settings.o2?.default ?? initialPayload.o2,
      cooling_rate: settings.cooling_rate?.default ?? initialPayload.cooling_rate,
      blaine: settings.blaine?.default ?? initialPayload.blaine,
      mill_power: settings.mill_power?.default ?? initialPayload.mill_power,
      target_strength: initialPayload.target_strength,
      lsf: computeLsf(settings.limestone_pct?.default ?? initialPayload.limestone_pct),
    }),
    []
  );

  const loadStatus = useCallback(async () => {
    try {
      const health = await healthCheck();
      if (health === 'ready' || health === 'waiting_for_data') {
        setStatus(health);
      } else {
        setStatus('waiting_for_data');
      }
    } catch (err) {
      console.warn('Health check failed', err);
      setStatus('waiting_for_data');
    }
  }, []);

  const loadConfig = useCallback(async () => {
    setStatus('loading');
    try {
      const cfg = await fetchConfig();
      setConfig(cfg);
      setMetrics(cfg.metrics ?? null);
      setSampleRows(cfg.sample_data ?? []);
      setForm(buildDefaultForm(cfg.slider_config ?? {}));
      setStatus(cfg.dataset_ready ? 'ready' : 'waiting_for_data');
    } catch (err) {
      console.error('Failed to load config', err);
      setError('Unable to reach backend. Confirm FastAPI server is running.');
      setStatus('waiting_for_data');
    }
  }, [buildDefaultForm]);

  useEffect(() => {
    void loadConfig();
    void loadStatus();
  }, [loadConfig, loadStatus]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Reset the file input so the same file can be selected again later
    event.target.value = '';
    setTraining(true);
    setError(null);

    try {
      const response = await trainModel(file);
      setMetrics(response.metrics);
      setSampleRows(response.sample_data ?? []);
      setStatus('ready');
    } catch (err) {
      console.error('Training failed', err);
      setError('Training failed. Ensure the CSV includes all required columns.');
    } finally {
      setTraining(false);
      // reload config to refresh slider defaults/background state
      void loadConfig();
    }
  };

  const openFilePicker = () => {
    if (!training) {
      fileInputRef.current?.click();
    }
  };

  const updateFormValue = (key: FeatureKey, value: number) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value } as SimulationPayload;
      if (key === 'limestone_pct') {
        next.lsf = computeLsf(value);
      }
      return next;
    });
  };

  const handleTargetChange = (value: number) => {
    setForm((prev) => ({ ...prev, target_strength: value }));
  };

  const submitPrediction = async () => {
    setPredictionLoading(true);
    setError(null);
    setPrediction(null); // Clear old prediction
    try {
      const payload: SimulationPayload = {
        ...form,
        lsf: computeLsf(form.limestone_pct),
      };

      // Artificial delay to show the full processing animation
      const [response] = await Promise.all([
        predictStrength(payload),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
      
      setPrediction(response);
    } catch (err) {
      console.error('Prediction failed', err);
      setError('Unable to generate prediction. Ensure the model is trained.');
    } finally {
      setPredictionLoading(false);
    }
  };

  const renderSlider = (key: FeatureKey) => {
    const slider = sliderConfig[key];
    if (!slider) return null;
    const numericValue = form[key] ?? slider.default;

    return (
      <div className="slider-row" key={key}>
        <div className="slider-header">
          <span>{labelForFeature(key)}</span>
          <small>
            {slider.min} – {slider.max}
          </small>
        </div>
        <div className="slider-inputs">
          <input
            type="range"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={numericValue}
            onChange={(event) => updateFormValue(key, Number(event.target.value))}
          />
          <input
            type="number"
            value={Number(numericValue.toFixed(3))}
            onChange={(event) => updateFormValue(key, Number(event.target.value))}
          />
        </div>
      </div>
    );
  };

  const shapRows = useMemo(() => {
    if (!prediction?.shap_contributions) return [];
    return prediction.shap_contributions
      .map((item) => ({
        ...item,
        impact: Math.abs(item.shap_value),
      }))
      .sort((a, b) => b.impact - a.impact);
  }, [prediction?.shap_contributions]);

  const strengthTrendData = useMemo(() => {
    const historical: Array<{ index: number; strength: number }> = sampleRows
      .map((row, index) => {
        const raw = row['strength_28d'];
        const value = typeof raw === 'number' ? raw : Number(raw);
        if (!Number.isFinite(value)) {
          return null;
        }
        return {
          index: index + 1,
          strength: Number(value.toFixed(3)),
        };
      })
      .filter((point): point is { index: number; strength: number } => Boolean(point));

    // Add current prediction as the latest point
    if (prediction) {
      historical.push({
        index: historical.length + 1,
        strength: Number(prediction.predicted_strength.toFixed(3)),
      });
    }

    return historical;
  }, [sampleRows, prediction]);

  const featureComparisonData = useMemo(() => {
    if (!sampleRows.length) {
      return [];
    }

    return chartFeatureKeys
      .map((key) => {
        let total = 0;
        let count = 0;

        sampleRows.forEach((row) => {
          const raw = row[key];
          const value = typeof raw === 'number' ? raw : Number(raw);
          if (Number.isFinite(value)) {
            total += value;
            count += 1;
          }
        });

        if (!count) {
          return null;
        }

        const average = Number((total / count).toFixed(3));
        const current = Number((form[key] ?? average).toFixed(3));

        return {
          feature: labelForFeature(key),
          average,
          current,
        };
      })
      .filter((item): item is { feature: string; average: number; current: number } => Boolean(item));
  }, [sampleRows, form]);

  return (
    <div className="app-shell">
      <header className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div className="branding">
            <img
              src="/assets/index.jpeg"
              alt="Yellowsesne Technologies logo"
              className="brand-logo"
            />
            <div>
              <h1 style={{ margin: 0, fontSize: '1.9rem' }}>Yellowsesne Technologies</h1>
              <p className="hint">
                Cross-process cement intelligence · Raw Mix → Clinker → Cement strength insights.
              </p>
            </div>
          </div>
          <span className={`status-tag ${status === 'ready' ? 'status-ready' : 'status-waiting'}`}>
            <span className="loading-spinner" style={{ visibility: status === 'loading' ? 'visible' : 'hidden' }} />
            {status === 'ready' ? 'Model Ready' : status === 'loading' ? 'Loading…' : 'Waiting for Dataset'}
          </span>
        </div>
        {error ? <div className="error-banner">{error}</div> : null}
      </header>

      <div className="grid two">
        <section className="card">
          <h2>📂 Dataset</h2>
          <p className="hint">Upload fused multi-silo CSV (Raw Mix + Kiln + Grinding + strength_28d).</p>
          <div className="upload-box" role="presentation" onClick={openFilePicker}>
            <div style={{ fontWeight: 600 }}>Drop CSV here or click to browse</div>
            <div className="hint">We recommend including at least a few hundred rows for robust training.</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={training}
            />
            <button
              className="primary-button"
              type="button"
              disabled={training}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                openFilePicker();
              }}
            >
              {training ? 'Training model…' : 'Upload & Train'}
            </button>
          </div>
          {sampleRows.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 12 }}>Sample rows</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(sampleRows[0]).map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleRows.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, idx) => (
                          <td key={idx}>{typeof value === 'number' ? formatNumber(value, 3) : value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="card">
          <h2>📈 Model Performance & Prediction</h2>
          {metrics ? (
            <div className="metrics-grid">
              <div className="metric-tile">
                <span>MAE</span>
                <strong>{formatNumber(metrics.mae, 3)}</strong>
              </div>
              <div className="metric-tile">
                <span>MSE</span>
                <strong>{formatNumber(metrics.mse, 3)}</strong>
              </div>
              <div className="metric-tile">
                <span>R²</span>
                <strong>{formatNumber(metrics.r2, 3)}</strong>
              </div>
            </div>
          ) : (
            <p className="hint">Metrics appear after training completes.</p>
          )}
          <button
            className="primary-button"
            type="button"
            onClick={submitPrediction}
            disabled={predictionLoading || status !== 'ready'}
          >
            {predictionLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <span className="pulse-dot" />
                <span>Analyzing…</span>
              </span>
            ) : (
              'Predict Strength'
            )}
          </button>

          {predictionLoading ? (
            <ProcessingAnimation />
          ) : prediction ? (
            <>
              <div className="prediction-banner prediction-fade-in" style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Predicted 28-day Strength</div>
                <div style={{ fontSize: '2.6rem', fontWeight: 700 }}>
                  {formatNumber(prediction.predicted_strength, 2)} {prediction.strength_units}
                </div>
                <span className="quality-pill" style={getColorStyle(prediction.quality_color)}>
                  {prediction.quality_label}
                </span>
              </div>
              <div className="prediction-fade-in" style={{ animationDelay: '0.15s' }}>
                <h3>Operator Suggestions</h3>
                {prediction.suggestions.length > 0 ? (
                  <ul className="suggestions-list">
                    {prediction.suggestions.map((item, index) => (
                      <li key={index} className="suggestion-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="hint">Suggestions appear once SHAP explainer is ready.</p>
                )}
              </div>
            </>
          ) : null}
        </section>
      </div>

      <section className="card">
        <h2>⚙️ Simulation Controls</h2>
        <div className="grid two">
          {featureGroups.map((group) => (
            <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>{group.title}</h3>
              {group.keys.map((key) => renderSlider(key))}
            </div>
          ))}
        </div>
        <div className="hint">LSF is auto-calculated: {formatNumber(computeLsf(form.limestone_pct), 4)}</div>
      </section>

      <section className="card">
        <h2>📊 Process Insights</h2>
        {strengthTrendData.length || featureComparisonData.length ? (
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Strength Trend</h3>
              {strengthTrendData.length ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strengthTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                      <XAxis
                        dataKey="index"
                        tickLine={false}
                        label={{ value: 'Sample', position: 'insideBottomRight', offset: -4 }}
                      />
                      <YAxis tickLine={false} label={{ value: 'MPa', angle: -90, position: 'insideLeft' }} />
                      <Tooltip cursor={{ stroke: '#f59e0b', strokeWidth: 1 }} />
                      <Legend />
                      <Line type="monotone" dataKey="strength" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="Strength" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="hint">Upload a dataset to visualise recent strength measurements.</p>
              )}
            </div>

            <div className="chart-card">
              <h3>Process Inputs: Current vs Dataset Average</h3>
              {featureComparisonData.length ? (
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                      <XAxis
                        dataKey="feature"
                        tickLine={false}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" fill="#cbd5e1" radius={[10, 10, 0, 0]} name="Dataset Avg" />
                      <Bar dataKey="current" fill="#fbbf24" radius={[10, 10, 0, 0]} name="Current Input" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="hint">Upload a dataset to compare your simulation inputs with historical averages.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="hint">Upload a dataset to unlock trend charts for strength and process inputs.</p>
        )}
      </section>

      {prediction && shapRows.length ? (
        <section className="card">
          <h2>🧠 SHAP Insights</h2>
          <p className="hint" style={{ marginBottom: '12px' }}>
            Positive values increase predicted strength; negative values decrease it. Hover over SHAP values for details.
          </p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Value</th>
                  <th>SHAP Impact</th>
                </tr>
              </thead>
              <tbody>
                {shapRows.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td className="text-center">{formatNumber(row.actual_value, 3)}</td>
                    <td className="text-center shap-cell">
                      <span className="shap-value" data-impact={row.shap_value > 0 ? 'positive' : row.shap_value < 0 ? 'negative' : 'neutral'}>
                        {formatNumber(row.shap_value, 3)}
                        <span className="shap-tooltip">
                          {row.shap_value > 0
                            ? '✅ Good strength '
                            : row.shap_value < 0
                            ? 'Decreased strength'
                            : 'Neutral impact on strength'}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

const labelForFeature = (key: FeatureKey): string => {
  switch (key) {
    case 'limestone_pct':
      return 'Limestone (%)';
    case 'silica_pct':
      return 'Silica (%)';
    case 'al2o3_pct':
      return 'Al₂O₃ (%)';
    case 'fe2o3_pct':
      return 'Fe₂O₃ (%)';
    case 'kiln_temp':
      return 'Kiln Temp (°C)';
    case 'fuel_rate':
      return 'Fuel Rate (t/hr)';
    case 'o2':
      return 'O₂ (%)';
    case 'cooling_rate':
      return 'Cooling Rate';
    case 'blaine':
      return 'Blaine';
    case 'mill_power':
      return 'Mill Power (kW)';
    default:
      return key;
  }
};

const ProcessingAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    'Parsing process inputs…',
    'Running Random Forest…',
    'Computing SHAP values…',
    'Generating suggestions…',
  ];

  return (
    <div className="processing-animation">
      <div className="processing-spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="processing-text">{steps[step] || steps[0]}</p>
      <div className="processing-steps">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`step-dot ${index < step ? 'active' : index === step ? 'pulsing' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

