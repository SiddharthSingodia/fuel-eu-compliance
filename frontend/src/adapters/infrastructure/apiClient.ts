import axios from 'axios';
import type { Route, ComplianceSnapshot } from '../core/domain/types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

export async function getRoutes(): Promise<Route[]> {
  const res = await api.get('/routes');
  return res.data;
}

export async function setBaseline(routeId: string) {
  const res = await api.post(`/routes/${encodeURIComponent(routeId)}/baseline`);
  return res.data;
}

export async function getComparison() {
  const res = await api.get('/routes/comparison');
  return res.data;
}

export async function getCB(shipId: string, year: number): Promise<ComplianceSnapshot> {
  const res = await api.get(`/compliance/cb`, { params: { shipId, year } });
  return res.data;
}

export async function getAdjustedCb(year: number) {
  const res = await api.get('/compliance/adjusted-cb', { params: { year } });
  return res.data;
}

export async function getBankingRecords(shipId: string, year: number) {
  const res = await api.get('/banking/records', { params: { shipId, year } });
  return res.data;
}

export async function postBank(shipId: string, year: number, amount: number) {
  const res = await api.post('/banking/bank', { shipId, year, amount });
  return res.data;
}

export async function postApplyBank(shipId: string, year: number, amount: number) {
  const res = await api.post('/banking/apply', { shipId, year, amount });
  return res.data;
}

export async function createPool(year: number, members: string[]) {
  const res = await api.post('/pools', { year, members });
  return res.data;
}

export default api;
