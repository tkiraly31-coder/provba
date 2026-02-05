/**
 * Creates an Excel file with the Sales Dashboard data structures and example rows.
 * Run: node scripts/createDataStructuresExcel.js
 * Output: Data_Structures_Reference.xlsx in project root
 */

import XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = join(__dirname, '..', 'Data_Structures_Reference.xlsx');

const SEGMENT_OPTIONS = ['Bank & Bank Tech', 'Fintechs', 'Gateways', 'Large Merchants', 'HVHM'];

function addSheet(wb, name, data) {
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, name);
}

function addSheetFromRows(wb, name, rows) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, name);
}

const workbook = XLSX.utils.book_new();

// ---- Reference sheet: type name, where used, fields ----
const referenceRows = [
  ['Data Type', 'Used In', 'Field Names / Notes'],
  ['SalesKPIs', 'Overview – KPI cards', 'forecastARR, pipelineValue, closedWon, winRate, forecastARRDelta?, pipelineValueDelta?, closedWonDelta?, winRateDelta?'],
  ['ForecastPoint', 'Overview – Forecast line chart', 'month, forecast, target'],
  ['ForecastPointBySegment', 'Overview – Forecast (with segment filter)', 'month, segment, forecast, target'],
  ['PipelineStage', 'Overview – Pipeline bar chart', 'name, value, count'],
  ['DealSegment', 'Overview – Deal donut chart', 'name, value (%), fill (color)'],
  ['ARRByMonthPoint', 'Forecast tab – Stacked ARR chart', 'month, license, minimum, volumeDriven'],
  ['ARRMonthDetail', 'Forecast tab – Modal detail (per month)', 'license[], minimum[], volumeDriven[] – see ARR detail sheets'],
  ['PipelineDeal', 'Pipeline tab – source for ACV chart', 'id, name, acv, closeDate (YYYY-MM), stage?, segment'],
  ['ACVByMonth', 'Pipeline tab – ACV bar chart', 'month, monthKey (YYYY-MM), totalACV'],
  ['ClientWinsPoint', 'Pipeline tab – Client wins line', 'period, wins'],
  ['ClientDeal', 'Accounts tab – table', 'id, dealName, closeDate (YYYY-MM-DD), segment, acv, estimatedTransactionsPerMonth, dealOwner'],
  ['QuarterDeal', 'Quarter tabs – table & chart', 'id, clientName, dealName, closeDate, segment, acv, arrForecast, annualizedTransactionForecast, dealOwner, targetAccount, latestNextSteps, confidenceQuarterClose (0-100)'],
  ['', '', ''],
  ['Segment values (for segment field):', '', SEGMENT_OPTIONS.join(' | ')],
];
addSheetFromRows(workbook, 'Reference', referenceRows);

// ---- SalesKPIs (single row) ----
addSheet(workbook, 'SalesKPIs', [
  {
    forecastARR: 2840000,
    pipelineValue: 1920000,
    closedWon: 12,
    winRate: 34,
    forecastARRDelta: 4.2,
    pipelineValueDelta: -2.1,
    closedWonDelta: 1,
    winRateDelta: 2.5,
  },
]);

// ---- ForecastPoint ----
addSheet(workbook, 'ForecastPoint', [
  { month: 'Jul', forecast: 2100000, target: 2400000 },
  { month: 'Aug', forecast: 2210000, target: 2448000 },
  { month: 'Sep', forecast: 2350000, target: 2496960 },
  { month: 'Oct', forecast: 2480000, target: 2546760 },
]);

// ---- ForecastPointBySegment ----
addSheet(workbook, 'ForecastPointBySegment', [
  { month: 'Jul', segment: 'Bank & Bank Tech', forecast: 588000, target: 672000 },
  { month: 'Jul', segment: 'Fintechs', forecast: 504000, target: 576000 },
  { month: 'Aug', segment: 'Bank & Bank Tech', forecast: 619000, target: 685000 },
  { month: 'Aug', segment: 'Fintechs', forecast: 531000, target: 588000 },
]);

// ---- PipelineStage ----
addSheet(workbook, 'PipelineStage', [
  { name: 'Qualification', value: 420000, count: 18 },
  { name: 'Discovery', value: 380000, count: 12 },
  { name: 'Proposal', value: 520000, count: 8 },
  { name: 'Negotiation', value: 350000, count: 5 },
  { name: 'Closed Won', value: 250000, count: 4 },
]);

// ---- DealSegment ----
addSheet(workbook, 'DealSegment', [
  { name: 'Bank & Bank Tech', value: 28, fill: '#1e1b4b' },
  { name: 'Fintechs', value: 24, fill: '#3730a3' },
  { name: 'Gateways', value: 18, fill: '#0ea5e9' },
  { name: 'Large Merchants', value: 18, fill: '#38bdf8' },
  { name: 'HVHM', value: 12, fill: '#7dd3fc' },
]);

// ---- ARRByMonthPoint ----
addSheet(workbook, 'ARRByMonthPoint', [
  { month: 'Jan', license: 180000, minimum: 80000, volumeDriven: 45000 },
  { month: 'Feb', license: 195000, minimum: 72000, volumeDriven: 52000 },
  { month: 'Mar', license: 210000, minimum: 95000, volumeDriven: 38000 },
]);

// ---- ARR detail (License) ----
addSheet(workbook, 'ARR_LicenseDetail', [
  { month: 'Jan', clientName: 'Acme Corp', amount: 90000, segment: 'Bank & Bank Tech' },
  { month: 'Jan', clientName: 'Beta Inc', amount: 90000, segment: 'Fintechs' },
  { month: 'Feb', clientName: 'Acme Corp', amount: 100000, segment: 'Bank & Bank Tech' },
  { month: 'Feb', clientName: 'Gamma Ltd', amount: 95000, segment: 'Gateways' },
]);

// ---- ARR detail (Minimum) ----
addSheet(workbook, 'ARR_MinimumDetail', [
  { month: 'Jan', clientName: 'Gamma Ltd', amount: 40000, segment: 'Gateways' },
  { month: 'Jan', clientName: 'Delta Solutions', amount: 40000, segment: 'Large Merchants' },
  { month: 'Feb', clientName: 'Epsilon Group', amount: 36000, segment: 'HVHM' },
  { month: 'Feb', clientName: 'Zeta Industries', amount: 36000, segment: 'Fintechs' },
]);

// ---- ARR detail (Volume-driven) ----
addSheet(workbook, 'ARR_VolumeDetail', [
  { month: 'Jan', clientName: 'Epsilon Group', transactions: 1200, pricePoint: 25, amount: 30000, segment: 'HVHM' },
  { month: 'Jan', clientName: 'Zeta Industries', transactions: 500, pricePoint: 30, amount: 15000, segment: 'Bank & Bank Tech' },
  { month: 'Feb', clientName: 'Eta Partners', transactions: 2000, pricePoint: 26, amount: 52000, segment: 'Fintechs' },
]);

// ---- PipelineDeal ----
addSheet(workbook, 'PipelineDeal', [
  { id: 'deal-1', name: 'Acme Corp – Platform', acv: 120000, closeDate: '2026-01', stage: 'Negotiation', segment: 'Bank & Bank Tech' },
  { id: 'deal-2', name: 'Beta Inc – Enterprise', acv: 85000, closeDate: '2026-02', stage: 'Proposal', segment: 'Fintechs' },
  { id: 'deal-3', name: 'Gamma Ltd – Standard', acv: 200000, closeDate: '2026-01', stage: 'Closed Won', segment: 'Gateways' },
  { id: 'deal-4', name: 'Delta Solutions – Premium', acv: 95000, closeDate: '2026-03', segment: 'Large Merchants' },
]);

// ---- ACVByMonth ----
addSheet(workbook, 'ACVByMonth', [
  { month: 'Jan 2026', monthKey: '2026-01', totalACV: 320000 },
  { month: 'Feb 2026', monthKey: '2026-02', totalACV: 185000 },
  { month: 'Mar 2026', monthKey: '2026-03', totalACV: 95000 },
]);

// ---- ClientWinsPoint ----
addSheet(workbook, 'ClientWinsPoint', [
  { period: 'Jan 2026', wins: 3 },
  { period: 'Feb 2026', wins: 5 },
  { period: 'Mar 2026', wins: 2 },
  { period: 'Apr 2026', wins: 4 },
]);

// ---- ClientDeal ----
addSheet(workbook, 'ClientDeal', [
  { id: 'client-deal-1', dealName: 'Acme Corp – Platform', closeDate: '2025-03-15', segment: 'Bank & Bank Tech', acv: 120000, estimatedTransactionsPerMonth: 15000, dealOwner: 'Alex Morgan' },
  { id: 'client-deal-2', dealName: 'Beta Inc – Enterprise', closeDate: '2025-06-22', segment: 'Fintechs', acv: 85000, estimatedTransactionsPerMonth: 22000, dealOwner: 'Jordan Smith' },
  { id: 'client-deal-3', dealName: 'Gamma Ltd – Standard', closeDate: '2026-01-10', segment: 'Gateways', acv: 200000, estimatedTransactionsPerMonth: 45000, dealOwner: 'Sam Taylor' },
]);

// ---- QuarterDeal ----
addSheet(workbook, 'QuarterDeal', [
  { id: 'q1-1', clientName: 'Acme Corp', dealName: 'Acme Corp – Platform', closeDate: '2026-02-14', segment: 'Fintechs', acv: 180000, arrForecast: 165000, annualizedTransactionForecast: 120000, dealOwner: 'Jordan Smith', targetAccount: true, latestNextSteps: 'Follow-up call scheduled.', confidenceQuarterClose: 85 },
  { id: 'q1-2', clientName: 'Beta Inc', dealName: 'Beta Inc – Enterprise', closeDate: '2026-03-05', segment: 'Bank & Bank Tech', acv: 95000, arrForecast: 88000, annualizedTransactionForecast: 80000, dealOwner: 'Alex Morgan', targetAccount: false, latestNextSteps: 'Demo completed. Sending proposal.', confidenceQuarterClose: 70 },
]);

XLSX.writeFile(workbook, outPath);
console.log('Created:', outPath);
