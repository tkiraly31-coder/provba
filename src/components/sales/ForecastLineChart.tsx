import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ForecastPoint } from '../../data/salesMockData';

interface ForecastLineChartProps {
  data: ForecastPoint[];
}

function formatAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

export function ForecastLineChart({ data }: ForecastLineChartProps) {
  return (
    <div className="sales-chart-card">
      <div className="sales-chart-header">
        <h3 className="sales-chart-title">Forecast over time</h3>
        <p className="sales-chart-sub">Quarter-end forecast vs target</p>
      </div>
      <div className="sales-chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }} />
            <YAxis tickFormatter={formatAxis} tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }} />
            <Tooltip
              formatter={(value: number | undefined) => [value != null ? formatAxis(value) : '—', '']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                background: 'var(--sales-surface)',
                border: '1px solid var(--sales-border)',
                borderRadius: 12,
              }}
              labelStyle={{ color: 'var(--sales-text)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span style={{ color: 'var(--sales-text)' }}>{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="var(--sales-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--sales-primary)', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="var(--sales-accent)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--sales-accent)', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
