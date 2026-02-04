import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PipelineStage } from '../../data/salesMockData';

interface PipelineBarChartProps {
  data: PipelineStage[];
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return `£${value}`;
}

export function PipelineBarChart({ data }: PipelineBarChartProps) {
  return (
    <div className="sales-chart-card">
      <div className="sales-chart-header">
        <h3 className="sales-chart-title">Pipeline by stage</h3>
        <p className="sales-chart-sub">Value and deal count per stage</p>
      </div>
      <div className="sales-chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }} />
            <YAxis tickFormatter={formatValue} tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }} />
            <Tooltip
              formatter={(value: number | undefined, name?: string) => [
                value != null ? (name === 'value' ? formatValue(value) : value) : '—',
                name === 'value' ? 'Value' : 'Deals',
              ]}
              contentStyle={{
                background: 'var(--sales-surface)',
                border: '1px solid var(--sales-border)',
                borderRadius: 12,
              }}
              labelStyle={{ color: 'var(--sales-text)' }}
            />
            <Bar dataKey="value" name="value" fill="var(--sales-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
