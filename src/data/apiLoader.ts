/**
 * Loads sales dashboard data from the SQL-backed API.
 * Set VITE_API_URL (e.g. http://localhost:3001) to use the database instead of mock/Google Sheets.
 */

import type { LoadedSalesData } from './googleSheetsLoader';

const API_BASE = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL;

export function isApiConfigured(): boolean {
  return Boolean(API_BASE);
}

export async function loadApiData(): Promise<LoadedSalesData> {
  if (!API_BASE) throw new Error('VITE_API_URL is not set');
  const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/sales-data`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as LoadedSalesData;
  return data;
}
