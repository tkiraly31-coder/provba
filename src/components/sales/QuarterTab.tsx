import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getDealsByQuarter, type QuarterId } from '../../data/salesMockData';

type BarMetric = 'acv' | 'arrForecast' | 'annualizedTransactionForecast';

const QUARTER_LABEL: Record<string, string> = {
  '2026Q1': '2026 Q1 (Jan–Mar)',
  '2026Q2': '2026 Q2 (Apr–Jun)',
  '2026Q3': '2026 Q3 (Jul–Sep)',
  '2026Q4': '2026 Q4 (Oct–Dec)',
};

function tabIdToQuarter(tabId: string): QuarterId {
  const map: Record<string, QuarterId> = {
    '2026q1': '2026Q1',
    '2026q2': '2026Q2',
    '2026q3': '2026Q3',
    '2026q4': '2026Q4',
  };
  return map[tabId] ?? '2026Q1';
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d}/${months[parseInt(m!, 10) - 1]}/${y}`;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return `£${value}`;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toLocaleString();
}

interface QuarterTabProps {
  tabId: string;
}

export function QuarterTab({ tabId }: QuarterTabProps) {
  const quarter = tabIdToQuarter(tabId);
  const deals = useMemo(() => getDealsByQuarter(quarter), [quarter]);
  const [barMetric, setBarMetric] = useState<BarMetric>('acv');

  const chartData = useMemo(() => {
    const byClient = new Map<string, { acv: number; arrForecast: number; annualizedTransactionForecast: number }>();
    for (const d of deals) {
      const cur = byClient.get(d.clientName) ?? { acv: 0, arrForecast: 0, annualizedTransactionForecast: 0 };
      cur.acv += d.acv;
      cur.arrForecast += d.arrForecast;
      cur.annualizedTransactionForecast += d.annualizedTransactionForecast;
      byClient.set(d.clientName, cur);
    }
    return Array.from(byClient.entries())
      .map(([clientName, vals]) => ({ clientName, ...vals }))
      .sort((a, b) => (b[barMetric] as number) - (a[barMetric] as number));
  }, [deals, barMetric]);

  const dataKey = barMetric;
  const formatTooltip = (value: number) =>
    barMetric === 'annualizedTransactionForecast' ? formatNumber(value) : formatCurrency(value);
  const formatAxis = (value: number) =>
    barMetric === 'annualizedTransactionForecast' ? formatNumber(value) : formatCurrency(value);

  const metricLabel =
    barMetric === 'acv'
      ? 'ACV'
      : barMetric === 'arrForecast'
        ? 'ARR forecast'
        : 'Annualized transaction forecast';

  const totalSum = useMemo(
    () => chartData.reduce((s, row) => s + (row[barMetric] as number), 0),
    [chartData, barMetric]
  );
  const totalSumFormatted =
    barMetric === 'annualizedTransactionForecast' ? formatNumber(totalSum) : formatCurrency(totalSum);

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">{QUARTER_LABEL[quarter]}</h1>
        <p className="sales-page-subtitle">
          Deals anticipated to close in this quarter. Per-client bar chart and deal table below.
        </p>
      </header>

      <div className="sales-chart-card sales-quarter-chart">
        <div className="sales-chart-header sales-chart-header-with-switch">
          <div>
            <h3 className="sales-chart-title">Per client</h3>
            <p className="sales-chart-sub">Horizontal bar chart: {metricLabel}</p>
          </div>
          <div className="sales-quarter-sum-kpi">
            <span className="sales-quarter-sum-label">Total {metricLabel}</span>
            <span className="sales-quarter-sum-value">{totalSumFormatted}</span>
          </div>
          <div className="sales-view-switch">
            <span className="sales-view-switch-label">Show:</span>
            <button
              type="button"
              className={`sales-view-switch-btn ${barMetric === 'acv' ? 'active' : ''}`}
              onClick={() => setBarMetric('acv')}
            >
              ACV
            </button>
            <button
              type="button"
              className={`sales-view-switch-btn ${barMetric === 'arrForecast' ? 'active' : ''}`}
              onClick={() => setBarMetric('arrForecast')}
            >
              ARR forecast
            </button>
            <button
              type="button"
              className={`sales-view-switch-btn ${barMetric === 'annualizedTransactionForecast' ? 'active' : ''}`}
              onClick={() => setBarMetric('annualizedTransactionForecast')}
            >
              Ann. txn forecast
            </button>
          </div>
        </div>
        <div className="sales-chart-body">
          <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 36)}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 8, right: 24, left: 100, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" horizontal={false} />
              <XAxis type="number" tickFormatter={formatAxis} tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }} />
              <YAxis type="category" dataKey="clientName" width={96} tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }} />
              <Tooltip
                formatter={(value: number | undefined) => [value != null ? formatTooltip(value) : '—', metricLabel]}
                contentStyle={{
                  background: 'var(--sales-surface)',
                  border: '1px solid var(--sales-border)',
                  borderRadius: 12,
                }}
                labelStyle={{ color: 'var(--sales-text)' }}
              />
              <Bar dataKey={dataKey} name={metricLabel} fill="var(--sales-primary)" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sales-accounts-table-wrap sales-chart-card">
        <div className="sales-accounts-table-meta">
          {deals.length} deal{deals.length !== 1 ? 's' : ''} closing in this quarter
        </div>
        <div className="sales-accounts-table-scroll">
          <table className="sales-accounts-table">
            <thead>
              <tr>
                <th>Deal name</th>
                <th>Confidence of quarter close</th>
                <th>Close date</th>
                <th>Segment</th>
                <th>ACV</th>
                <th>ARR forecast</th>
                <th>Ann. txn forecast</th>
                <th>Target account</th>
                <th>Latest / Next steps</th>
                <th>Deal owner</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id}>
                  <td className="sales-accounts-cell-name">{d.dealName}</td>
                  <td>{d.confidenceQuarterClose}%</td>
                  <td>{formatDate(d.closeDate)}</td>
                  <td>{d.segment}</td>
                  <td className="sales-accounts-cell-acv">{formatCurrency(d.acv)}</td>
                  <td>{formatCurrency(d.arrForecast)}</td>
                  <td>{formatNumber(d.annualizedTransactionForecast)}</td>
                  <td>{d.targetAccount ? 'Yes' : 'No'}</td>
                  <td className="sales-accounts-cell-steps">{d.latestNextSteps}</td>
                  <td>{d.dealOwner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
