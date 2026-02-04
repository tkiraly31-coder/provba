/**
 * Mock data for Sales Forecast / Commercial Performance dashboard.
 * Replace with HubSpot API data later.
 */

export interface ForecastPoint {
  month: string;
  forecast: number;
  target: number;
}

export interface PipelineStage {
  name: string;
  value: number;
  count: number;
}

export interface DealSegment {
  name: string;
  value: number;
  fill: string;
}

export interface SalesKPIs {
  forecastARR: number;
  pipelineValue: number;
  closedWon: number;
  winRate: number;
  forecastARRDelta?: number;
  pipelineValueDelta?: number;
  closedWonDelta?: number;
  winRateDelta?: number;
}

function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export function getSalesKPIs(): SalesKPIs {
  return {
    forecastARR: 2840000,
    pipelineValue: 1920000,
    closedWon: 12,
    winRate: 34,
    forecastARRDelta: 4.2,
    pipelineValueDelta: -2.1,
    closedWonDelta: 1,
    winRateDelta: 2.5,
  };
}

export function getForecastOverTime(): ForecastPoint[] {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  let f = 2100000;
  let t = 2400000;
  return months.map((month, i) => {
    f += randomInRange(80000, 180000);
    t = Math.round(t * (1 + (i % 3 === 0 ? 0.02 : 0)));
    return { month, forecast: f, target: t };
  });
}

/** ARR per month by category (for Forecast stacked column chart) */
export interface ARRByMonthPoint {
  month: string;
  license: number;
  minimum: number;
  volumeDriven: number;
}

/** Client-level detail for License revenue */
export interface ARRLicenseItem {
  clientName: string;
  amount: number;
}

/** Client-level detail for Minimum revenue */
export interface ARRMinimumItem {
  clientName: string;
  amount: number;
}

/** Client-level detail for Volume-driven revenue (transactions × price point) */
export interface ARRVolumeDrivenItem {
  clientName: string;
  transactions: number;
  pricePoint: number; // in £
  amount: number;    // transactions * pricePoint
}

export interface ARRMonthDetail {
  license: ARRLicenseItem[];
  minimum: ARRMinimumItem[];
  volumeDriven: ARRVolumeDrivenItem[];
}

const SAMPLE_CLIENTS = [
  'Acme Corp', 'Beta Inc', 'Gamma Ltd', 'Delta Solutions', 'Epsilon Group',
  'Zeta Industries', 'Eta Partners', 'Theta Systems', 'Iota Consulting', 'Kappa Finance',
];

function splitAmount(total: number, parts: number): number[] {
  if (parts <= 1) return [total];
  const out: number[] = [];
  let remaining = total;
  for (let i = 0; i < parts - 1; i++) {
    const max = Math.floor(remaining / (parts - i));
    const val = randomInRange(Math.floor(max * 0.3), Math.min(max, remaining));
    out.push(val);
    remaining -= val;
  }
  out.push(remaining);
  return out;
}

/** Returns chart data and per-month client detail (detail amounts sum to chart totals) */
export function getForecastARRWithDetails(): {
  chartData: ARRByMonthPoint[];
  detailsByMonth: Record<string, ARRMonthDetail>;
} {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData: ARRByMonthPoint[] = [];
  const detailsByMonth: Record<string, ARRMonthDetail> = {};

  for (const month of months) {
    const license = randomInRange(80, 220) * 1000;
    const minimum = randomInRange(40, 120) * 1000;
    const volumeDriven = randomInRange(20, 100) * 1000;
    chartData.push({ month, license, minimum, volumeDriven });

    const licenseParts = splitAmount(license, randomInRange(2, 4));
    const minimumParts = splitAmount(minimum, randomInRange(2, 4));
    const volumeParts = randomInRange(2, 4);
    const volumeAmounts = splitAmount(volumeDriven, volumeParts);

    detailsByMonth[month] = {
      license: licenseParts.map((amount, i) => ({
        clientName: SAMPLE_CLIENTS[(months.indexOf(month) + i) % SAMPLE_CLIENTS.length],
        amount,
      })),
      minimum: minimumParts.map((amount, i) => ({
        clientName: SAMPLE_CLIENTS[(months.indexOf(month) + i + 2) % SAMPLE_CLIENTS.length],
        amount,
      })),
      volumeDriven: volumeAmounts.map((amount, i) => {
        const pricePoint = randomInRange(5, 50);
        const transactions = Math.max(1, Math.round(amount / pricePoint));
        const actualAmount = transactions * pricePoint;
        return {
          clientName: SAMPLE_CLIENTS[(months.indexOf(month) + i + 4) % SAMPLE_CLIENTS.length],
          transactions,
          pricePoint,
          amount: actualAmount,
        };
      }),
    };
  }

  return { chartData, detailsByMonth };
}

/** @deprecated Use getForecastARRWithDetails() for chart + popup. Kept for backwards compat. */
export function getARRByMonth(): ARRByMonthPoint[] {
  return getForecastARRWithDetails().chartData;
}

export function getPipelineByStage(): PipelineStage[] {
  return [
    { name: 'Qualification', value: 420000, count: 18 },
    { name: 'Discovery', value: 380000, count: 12 },
    { name: 'Proposal', value: 520000, count: 8 },
    { name: 'Negotiation', value: 350000, count: 5 },
    { name: 'Closed Won', value: 250000, count: 4 },
  ];
}

const DEAL_COLORS = ['#5B4B8A', '#7B6BA8', '#9B8BC4', '#BBAED8', '#DBD0EC', '#E8E0F4'];

export function getDealDistribution(): DealSegment[] {
  const segments = [
    { name: 'Enterprise', value: 45 },
    { name: 'Mid-Market', value: 28 },
    { name: 'SMB', value: 18 },
    { name: 'Other', value: 9 },
  ];
  return segments.map((s, i) => ({
    ...s,
    fill: DEAL_COLORS[i % DEAL_COLORS.length],
  }));
}

/** Single deal with close date used for Pipeline ACV forecast */
export interface PipelineDeal {
  id: string;
  name: string;
  acv: number;
  closeDate: string; // YYYY-MM
  stage?: string;
}

const DEAL_NAMES = [
  'Acme Corp – Platform',
  'Beta Inc – Enterprise',
  'Gamma Ltd – Standard',
  'Delta Solutions – Premium',
  'Epsilon Group – Platform',
  'Zeta Industries – Enterprise',
  'Eta Partners – Standard',
  'Theta Systems – Premium',
  'Iota Consulting – Platform',
  'Kappa Finance – Enterprise',
  'Lambda Tech – Standard',
  'Mu Industries – Premium',
  'Nu Ventures – Platform',
  'Xi Corp – Enterprise',
  'Omicron Ltd – Standard',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Mock deals with close dates in 2026 (for Pipeline ACV by month) */
export function getPipelineDeals2026(): PipelineDeal[] {
  const deals: PipelineDeal[] = [];
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
  let id = 1;
  for (const closeDate of months) {
    const count = randomInRange(1, 4);
    for (let i = 0; i < count; i++) {
      const baseName = randomChoice(DEAL_NAMES);
      const name = count > 1 && i > 0 ? `${baseName} – ${closeDate}` : baseName;
      deals.push({
        id: `deal-${id++}`,
        name,
        acv: randomInRange(40000, 280000),
        closeDate,
        stage: randomChoice(['Proposal', 'Negotiation', 'Closed Won']),
      });
    }
  }
  return deals;
}

export interface ACVByMonth {
  month: string;   // "Jan 2026"
  monthKey: string; // "2026-01"
  totalACV: number;
}

/** Aggregate ACV by month in 2026 for the Pipeline bar chart */
export function getACVByMonth2026(deals: PipelineDeal[]): ACVByMonth[] {
  const MONTH_LABELS: Record<string, string> = {
    '2026-01': 'Jan 2026', '2026-02': 'Feb 2026', '2026-03': 'Mar 2026', '2026-04': 'Apr 2026',
    '2026-05': 'May 2026', '2026-06': 'Jun 2026', '2026-07': 'Jul 2026', '2026-08': 'Aug 2026',
    '2026-09': 'Sep 2026', '2026-10': 'Oct 2026', '2026-11': 'Nov 2026', '2026-12': 'Dec 2026',
  };
  const byMonth = new Map<string, number>();
  for (const d of deals) {
    const current = byMonth.get(d.closeDate) ?? 0;
    byMonth.set(d.closeDate, current + d.acv);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, totalACV]) => ({
      month: MONTH_LABELS[monthKey] ?? monthKey,
      monthKey,
      totalACV,
    }));
}

/** Group deals by close month for the popup */
export function getDealsByMonth2026(deals: PipelineDeal[]): Record<string, PipelineDeal[]> {
  const byMonth: Record<string, PipelineDeal[]> = {};
  for (const d of deals) {
    if (!byMonth[d.closeDate]) byMonth[d.closeDate] = [];
    byMonth[d.closeDate].push(d);
  }
  for (const arr of Object.values(byMonth)) arr.sort((a, b) => b.acv - a.acv);
  return byMonth;
}

/** Client wins per period (for Pipeline line chart) */
export interface ClientWinsPoint {
  period: string;
  wins: number;
}

/** Mock client wins per month (e.g. closed-won count per month) */
export function getClientWinsOverTime(): ClientWinsPoint[] {
  const months = [
    'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
    'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026',
  ];
  return months.map((period) => ({
    period,
    wins: randomInRange(1, 8),
  }));
}

/** Client deal row for Accounts tabular view */
export interface ClientDeal {
  id: string;
  dealName: string;
  closeDate: string; // YYYY-MM-DD
  segment: string;
  acv: number;
  estimatedTransactionsPerMonth: number;
  dealOwner: string;
}

const DEAL_OWNERS = ['Alex Morgan', 'Jordan Smith', 'Sam Taylor', 'Casey Lee', 'Riley Brown'];
const SEGMENTS = ['Enterprise', 'Mid-Market', 'SMB', 'Other'];
const DEAL_NAME_PREFIXES = ['Acme Corp', 'Beta Inc', 'Gamma Ltd', 'Delta Solutions', 'Epsilon Group', 'Zeta Industries', 'Eta Partners', 'Theta Systems', 'Iota Consulting', 'Kappa Finance', 'Lambda Tech', 'Mu Industries'];

export function getClientDeals(): ClientDeal[] {
  const deals: ClientDeal[] = [];
  let id = 1;
  for (let i = 0; i < 48; i++) {
    const prefix = DEAL_NAME_PREFIXES[i % DEAL_NAME_PREFIXES.length];
    const suffix = i > 11 ? ` – ${['Platform', 'Enterprise', 'Standard', 'Premium'][i % 4]}` : '';
    const day = 1 + (i % 28);
    const month = (i % 12) + 1;
    const year = 2025 + (i >= 24 ? 1 : 0);
    const closeDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    deals.push({
      id: `client-deal-${id++}`,
      dealName: `${prefix}${suffix}`,
      closeDate,
      segment: SEGMENTS[i % SEGMENTS.length],
      acv: randomInRange(30, 350) * 1000,
      estimatedTransactionsPerMonth: randomInRange(500, 50000),
      dealOwner: DEAL_OWNERS[i % DEAL_OWNERS.length],
    });
  }
  return deals.sort((a, b) => a.closeDate.localeCompare(b.closeDate));
}

/** Deal with forecast fields for quarter views (2026 Q1–Q4) */
export type QuarterId = '2026Q1' | '2026Q2' | '2026Q3' | '2026Q4';

export interface QuarterDeal {
  id: string;
  clientName: string;
  dealName: string;
  closeDate: string;
  segment: string;
  acv: number;
  arrForecast: number;
  annualizedTransactionForecast: number;
  dealOwner: string;
  targetAccount: boolean;
  latestNextSteps: string;
  confidenceQuarterClose: number; // 0-100
}

const LATEST_NEXT_STEPS_SAMPLES = [
  'Follow-up call scheduled for next week. Awaiting legal review of MSA.',
  'Demo completed. Sending pricing proposal and scheduling QBR.',
  'Contract sent for signature. Chasing procurement for approval.',
  'Discovery call done. Preparing ROI deck and technical deep-dive.',
  'Waiting on budget confirmation. Next: intro to technical lead.',
  'Proposal under review. Follow-up in 5 days if no response.',
  'Kick-off meeting booked. Pending security questionnaire.',
  'Renewal discussion scheduled. Preparing usage report.',
  'POC extended by 2 weeks. Success criteria agreed.',
  'Final negotiation. Discussing volume discounts and payment terms.',
  'Stakeholder alignment meeting next Tuesday. Draft SOW shared.',
  'Champion left company. Re-engaging with new decision maker.',
];

const QUARTER_MONTHS: Record<QuarterId, number[]> = {
  '2026Q1': [1, 2, 3],
  '2026Q2': [4, 5, 6],
  '2026Q3': [7, 8, 9],
  '2026Q4': [10, 11, 12],
};

export function getDealsByQuarter(quarter: QuarterId): QuarterDeal[] {
  const months = QUARTER_MONTHS[quarter];
  const deals: QuarterDeal[] = [];
  const clients = ['Acme Corp', 'Beta Inc', 'Gamma Ltd', 'Delta Solutions', 'Epsilon Group', 'Zeta Industries', 'Eta Partners', 'Theta Systems', 'Iota Consulting', 'Kappa Finance', 'Lambda Tech', 'Mu Industries'];
  let id = 1;
  const count = randomInRange(6, 14);
  for (let i = 0; i < count; i++) {
    const clientName = clients[i % clients.length];
    const month = months[randomInRange(0, months.length - 1)];
    const day = randomInRange(1, 28);
    const closeDate = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const acv = randomInRange(40, 320) * 1000;
    const arrForecast = Math.round(acv * (0.85 + Math.random() * 0.3));
    const annualizedTransactionForecast = randomInRange(6000, 480000);
    deals.push({
      id: `quarter-deal-${quarter}-${id++}`,
      clientName,
      dealName: `${clientName} – ${['Platform', 'Enterprise', 'Standard', 'Premium'][i % 4]}`,
      closeDate,
      segment: SEGMENTS[i % SEGMENTS.length],
      acv,
      arrForecast,
      annualizedTransactionForecast,
      dealOwner: DEAL_OWNERS[i % DEAL_OWNERS.length],
      targetAccount: Math.random() > 0.4,
      latestNextSteps: LATEST_NEXT_STEPS_SAMPLES[i % LATEST_NEXT_STEPS_SAMPLES.length],
      confidenceQuarterClose: randomInRange(25, 95),
    });
  }
  return deals.sort((a, b) => a.closeDate.localeCompare(b.closeDate));
}
