import axios from 'axios';
import type {
  ConfigResponse,
  PredictionResponse,
  SimulationPayload,
  TrainResponse,
} from './types';

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const client = axios.create({
  baseURL: apiBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchConfig = async (): Promise<ConfigResponse> => {
  const { data } = await client.get<ConfigResponse>('/config');
  return data;
};

export const trainModel = async (file: File): Promise<TrainResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await client.post<TrainResponse>('/train', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const predictStrength = async (
  payload: SimulationPayload,
): Promise<PredictionResponse> => {
  const { data } = await client.post<PredictionResponse>('/predict', payload);
  return data;
};

export const healthCheck = async (): Promise<string> => {
  const { data } = await client.get<{ status: string }>('/health');
  return data.status;
};

