import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { DealSegment, PipelineDeal } from '../../data/salesMockData';
import { DealsModal } from './DealsModal';

interface DealDonutChartProps {
  data: DealSegment[];
  /** When provided, clicking a segment opens a modal with deals in that segment */
  deals?: PipelineDeal[];
}

export function DealDonutChart({ data, deals }: DealDonutChartProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const dealsInSegment = useMemo(() => {
    if (!selectedSegment || !deals) return [];
    return deals.filter((d) => d.segment === selectedSegment);
  }, [deals, selectedSegment]);

  const handleSegmentClick = (segmentData: unknown, _index: number) => {
    const name = segmentData && typeof segmentData === 'object' && 'name' in segmentData
      ? (segmentData as { name?: string }).name
      : undefined;
    if (name != null && deals != null) {
      setSelectedSegment(name);
    }
  };

  return (
    <div className={`sales-chart-card ${deals ? 'sales-chart-body-clickable' : ''}`}>
      <div className="sales-chart-header">
        <h3 className="sales-chart-title">Deal distribution</h3>
        <p className="sales-chart-sub">
          By segment (% of deals).{deals ? ' Click a segment to see deals.' : ''}
        </p>
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
              onClick={handleSegmentClick}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="var(--sales-bg)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as { name?: string; value?: number; count?: number };
                const pct = typeof row.value === 'number' ? row.value : 0;
                const count = typeof row.count === 'number' ? row.count : null;
                return (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: 'var(--sales-surface)',
                      border: '1px solid var(--sales-border)',
                      borderRadius: 12,
                      boxShadow: 'var(--sales-shadow)',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--sales-text)' }}>
                      {row.name ?? ''}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sales-text-secondary)' }}>
                      {pct}%{count != null ? ` · ${count} deal${count !== 1 ? 's' : ''}` : ''}
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value: unknown) => <span style={{ color: 'var(--sales-text)' }}>{String(value ?? '')}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {deals != null && (
        <DealsModal
          isOpen={selectedSegment != null}
          title={selectedSegment ?? ''}
          headerTitle={selectedSegment != null ? `Deals in ${selectedSegment}` : undefined}
          deals={dealsInSegment}
          onClose={() => setSelectedSegment(null)}
        />
      )}
    </div>
  );
}
