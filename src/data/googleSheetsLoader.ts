/**
 * Fetches sheet data from Google Sheets via "Publish to web" CSV export.
 * Sheet must be published (File → Share → Publish to web) for the URL to work.
 */

import {
  googleSheetsConfig,
  isGoogleSheetsConfigured,
} from './googleSheetsConfig';
import type {
  SalesKPIs,
  ForecastPoint,
  ForecastPointBySegment,
  PipelineStage,
  DealSegment,
  ARRByMonthPoint,
  ARRMonthDetail,
  PipelineDeal,
  ACVByMonth,
  ClientWinsPoint,
  ClientDeal,
  QuarterDeal,
} from './salesMockData';

const BASE =
  'https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=GID';

function buildUrl(spreadsheetId: string, gid: string): string {
  return BASE.replace('SPREADSHEET_ID', spreadsheetId).replace('GID', gid);
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function num(v: string): number {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(n) ? 0 : n;
}

function bool(v: string): boolean {
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1' || s === 'yes' || s === 'x';
}

function buildDetailsByMonth(
  lic: Record<string, string>[],
  min: Record<string, string>[],
  vol: Record<string, string>[]
): Record<string, import('./salesMockData').ARRMonthDetail> {
  const months = new Set<string>([
    ...lic.map((r) => String(r.month ?? '')),
    ...min.map((r) => String(r.month ?? '')),
    ...vol.map((r) => String(r.month ?? '')),
  ].filter(Boolean));
  const out: Record<string, import('./salesMockData').ARRMonthDetail> = {};
  for (const month of months) {
    out[month] = {
      license: lic.filter((r) => (r.month ?? '') === month).map((r) => ({
        clientName: String(r.clientName ?? ''),
        amount: num(r.amount),
        segment: String(r.segment ?? ''),
      })),
      minimum: min.filter((r) => (r.month ?? '') === month).map((r) => ({
        clientName: String(r.clientName ?? ''),
        amount: num(r.amount),
        segment: String(r.segment ?? ''),
      })),
      volumeDriven: vol.filter((r) => (r.month ?? '') === month).map((r) => ({
        clientName: String(r.clientName ?? ''),
        transactions: num(r.transactions),
        pricePoint: num(r.pricePoint),
        amount: num(r.amount),
        segment: String(r.segment ?? ''),
      })),
    };
  }
  return out;
}

async function fetchSheet(name: string): Promise<Record<string, string>[]> {
  const gid = googleSheetsConfig.sheetGids[name];
  if (!gid || !googleSheetsConfig.spreadsheetId) return [];
  const url = buildUrl(googleSheetsConfig.spreadsheetId, gid);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

export interface LoadedSalesData {
  salesKPIs: SalesKPIs | null;
  forecastPoint: ForecastPoint[];
  forecastPointBySegment: ForecastPointBySegment[];
  pipelineStage: PipelineStage[];
  dealSegment: DealSegment[];
  arrByMonthPoint: ARRByMonthPoint[];
  detailsByMonth: Record<string, ARRMonthDetail>;
  pipelineDeal: PipelineDeal[];
  acvByMonth: ACVByMonth[];
  clientWinsPoint: ClientWinsPoint[];
  clientDeal: ClientDeal[];
  quarterDeal: QuarterDeal[];
}

export async function loadGoogleSheetsData(): Promise<LoadedSalesData> {
  const id = googleSheetsConfig.spreadsheetId;
  if (!id) throw new Error('Google Sheets spreadsheetId not configured');

  const sheet = async (name: string) => {
    try {
      return await fetchSheet(name);
    } catch {
      return [];
    }
  };

  const [salesKPIsRows, forecastPointRows, forecastBySegRows, pipelineStageRows, dealSegRows, arrByMonthRows, arrLicRows, arrMinRows, arrVolRows, pipelineDealRows, acvRows, clientWinsRows, clientDealRows, quarterDealRows] = await Promise.all([
    sheet('SalesKPIs'),
    sheet('ForecastPoint'),
    sheet('ForecastPointBySegment'),
    sheet('PipelineStage'),
    sheet('DealSegment'),
    sheet('ARRByMonthPoint'),
    sheet('ARR_LicenseDetail'),
    sheet('ARR_MinimumDetail'),
    sheet('ARR_VolumeDetail'),
    sheet('PipelineDeal'),
    sheet('ACVByMonth'),
    sheet('ClientWinsPoint'),
    sheet('ClientDeal'),
    sheet('QuarterDeal'),
  ]);

  const salesKPIs: SalesKPIs | null =
    salesKPIsRows.length > 0
      ? {
          forecastARR: num(salesKPIsRows[0].forecastARR),
          pipelineValue: num(salesKPIsRows[0].pipelineValue),
          closedWon: num(salesKPIsRows[0].closedWon),
          winRate: num(salesKPIsRows[0].winRate),
          forecastARRDelta: salesKPIsRows[0].forecastARRDelta ? num(salesKPIsRows[0].forecastARRDelta) : undefined,
          pipelineValueDelta: salesKPIsRows[0].pipelineValueDelta ? num(salesKPIsRows[0].pipelineValueDelta) : undefined,
          closedWonDelta: salesKPIsRows[0].closedWonDelta ? num(salesKPIsRows[0].closedWonDelta) : undefined,
          winRateDelta: salesKPIsRows[0].winRateDelta ? num(salesKPIsRows[0].winRateDelta) : undefined,
        }
      : null;

  return {
    salesKPIs,
    forecastPoint: forecastPointRows.map((r) => ({
      month: String(r.month ?? ''),
      forecast: num(r.forecast),
      target: num(r.target),
    })),
    forecastPointBySegment: forecastBySegRows.map((r) => ({
      month: String(r.month ?? ''),
      segment: String(r.segment ?? ''),
      forecast: num(r.forecast),
      target: num(r.target),
    })),
    pipelineStage: pipelineStageRows.map((r) => ({
      name: String(r.name ?? ''),
      value: num(r.value),
      count: num(r.count),
    })),
    dealSegment: dealSegRows.map((r) => ({
      name: String(r.name ?? ''),
      value: num(r.value),
      fill: String(r.fill ?? '#1e1b4b'),
    })),
    arrByMonthPoint: arrByMonthRows.map((r) => ({
      month: String(r.month ?? ''),
      license: num(r.license),
      minimum: num(r.minimum),
      volumeDriven: num(r.volumeDriven),
    })),
    detailsByMonth: buildDetailsByMonth(arrLicRows, arrMinRows, arrVolRows),
    pipelineDeal: pipelineDealRows.map((r) => ({
      id: String(r.id ?? ''),
      name: String(r.name ?? ''),
      acv: num(r.acv),
      closeDate: String(r.closeDate ?? ''),
      stage: r.stage ? String(r.stage) : undefined,
      segment: String(r.segment ?? ''),
    })),
    acvByMonth: acvRows.map((r) => ({
      month: String(r.month ?? ''),
      monthKey: String(r.monthKey ?? ''),
      totalACV: num(r.totalACV),
    })),
    clientWinsPoint: clientWinsRows.map((r) => ({
      period: String(r.period ?? ''),
      wins: num(r.wins),
    })),
    clientDeal: clientDealRows.map((r) => ({
      id: String(r.id ?? ''),
      dealName: String(r.dealName ?? ''),
      closeDate: String(r.closeDate ?? ''),
      segment: String(r.segment ?? ''),
      acv: num(r.acv),
      estimatedTransactionsPerMonth: num(r.estimatedTransactionsPerMonth),
      dealOwner: String(r.dealOwner ?? ''),
    })),
    quarterDeal: quarterDealRows.map((r) => ({
      id: String(r.id ?? ''),
      clientName: String(r.clientName ?? ''),
      dealName: String(r.dealName ?? ''),
      closeDate: String(r.closeDate ?? ''),
      segment: String(r.segment ?? ''),
      acv: num(r.acv),
      arrForecast: num(r.arrForecast),
      annualizedTransactionForecast: num(r.annualizedTransactionForecast),
      dealOwner: String(r.dealOwner ?? ''),
      targetAccount: bool(r.targetAccount),
      latestNextSteps: String(r.latestNextSteps ?? ''),
      confidenceQuarterClose: num(r.confidenceQuarterClose),
    })),
  };
}

export { isGoogleSheetsConfigured };
