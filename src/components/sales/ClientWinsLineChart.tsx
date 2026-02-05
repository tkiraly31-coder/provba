import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { ClientWinsPoint } from '../../data/salesMockData';

interface ClientWinsLineChartProps {
  data: ClientWinsPoint[];
}

type ViewMode = 'simple' | 'cumulative';

function toCumulative(points: ClientWinsPoint[]): ClientWinsPoint[] {
  let sum = 0;
  return points.map((p) => {
    sum += p.wins;
    return { period: p.period, wins: sum };
  });
}

export function ClientWinsLineChart({ data }: ClientWinsLineChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('simple');

  const chartData = useMemo(
    () => (viewMode === 'cumulative' ? toCumulative(data) : data),
    [data, viewMode]
  );

  const valueLabel = viewMode === 'cumulative' ? 'Cumulative wins' : 'Client wins';

  return (
    <div className="sales-chart-card">
      <div className="sales-chart-header sales-chart-header-with-switch">
        <div>
          <h3 className="sales-chart-title">Client wins over time</h3>
          <p className="sales-chart-sub">
            {viewMode === 'cumulative' ? 'Running total of client wins' : 'Number of client wins per period'}
          </p>
        </div>
        <div className="sales-view-switch">
          <span className="sales-view-switch-label">View:</span>
          <button
            type="button"
            className={`sales-view-switch-btn ${viewMode === 'simple' ? 'active' : ''}`}
            onClick={() => setViewMode('simple')}
          >
            Simple
          </button>
          <button
            type="button"
            className={`sales-view-switch-btn ${viewMode === 'cumulative' ? 'active' : ''}`}
            onClick={() => setViewMode('cumulative')}
          >
            Cumulative
          </button>
        </div>
      </div>
      <div className="sales-chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
            <XAxis
              dataKey="period"
              tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }}
            />
            <YAxis
              dataKey="wins"
              allowDecimals={false}
              tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: ValueType, name: NameType) => {
                const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : 0;
                return [Number.isFinite(n) ? String(n) : '—', String(name ?? valueLabel)];
              }}
              labelFormatter={(label) => String(label ?? '')}
              contentStyle={{
                background: 'var(--sales-surface)',
                border: '1px solid var(--sales-border)',
                borderRadius: 12,
              }}
              labelStyle={{ color: 'var(--sales-text)' }}
            />
            <Line
              type="monotone"
              dataKey="wins"
              name={valueLabel}
              stroke="var(--sales-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--sales-primary)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
