import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { DealSegment } from '../../data/salesMockData';

interface DealDonutChartProps {
  data: DealSegment[];
}

export function DealDonutChart({ data }: DealDonutChartProps) {
  return (
    <div className="sales-chart-card">
      <div className="sales-chart-header">
        <h3 className="sales-chart-title">Deal distribution</h3>
        <p className="sales-chart-sub">By segment (% of pipeline)</p>
      </div>
      <div className="sales-chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--sales-bg)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: ValueType | undefined, name?: NameType) => {
                const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : 0;
                return [Number.isFinite(n) ? `${n}%` : '—', String(name ?? 'Share')];
              }}
              contentStyle={{
                background: 'var(--sales-surface)',
                border: '1px solid var(--sales-border)',
                borderRadius: 12,
              }}
              labelStyle={{ color: 'var(--sales-text)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value: unknown) => <span style={{ color: 'var(--sales-text)' }}>{String(value ?? '')}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
