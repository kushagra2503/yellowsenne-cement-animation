export type SliderSetting = {
  min: number;
  max: number;
  step: number;
  default: number;
};

export type Metrics = {
  mae: number;
  mse: number;
  r2: number;
};

export type DatasetRow = Record<string, number | string>;

export type ConfigResponse = {
  features: string[];
  target: string;
  slider_config: Record<string, SliderSetting>;
  dataset_ready: boolean;
  metrics?: Metrics | null;
  sample_data?: DatasetRow[] | null;
};

export type TrainResponse = {
  message: string;
  metrics: Metrics;
  feature_names: string[];
  target_name: string;
  sample_data: DatasetRow[];
};

export type ShapContribution = {
  feature: string;
  shap_value: number;
  actual_value: number;
};

export type PredictionResponse = {
  predicted_strength: number;
  strength_units: string;
  quality_label: string;
  quality_color: string;
  delta_to_target?: number | null;
  shap_base_value?: number | null;
  shap_contributions: ShapContribution[];
  top_features: string[];
  suggestions: string[];
};

export type SimulationPayload = {
  limestone_pct: number;
  silica_pct: number;
  al2o3_pct: number;
  fe2o3_pct: number;
  kiln_temp: number;
  fuel_rate: number;
  o2: number;
  cooling_rate: number;
  blaine: number;
  mill_power: number;
  lsf?: number;
  target_strength?: number;
};

