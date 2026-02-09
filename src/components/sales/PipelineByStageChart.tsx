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
import type { PipelineDeal } from '../../data/salesMockData';
import { DealsModal } from './DealsModal';

interface PipelineByStageChartProps {
  deals: PipelineDeal[];
}

const STAGE_ORDER = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

function formatValue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function PipelineByStageChart({ deals }: PipelineByStageChartProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stageData = useMemo(() => {
    const byStage = new Map<string, { value: number; count: number }>();
    for (const d of deals) {
      const stage = d.stage?.trim() || 'No stage';
      const cur = byStage.get(stage) ?? { value: 0, count: 0 };
      cur.value += d.acv;
      cur.count += 1;
      byStage.set(stage, cur);
    }
    const list = Array.from(byStage.entries()).map(([name, cur]) => ({
      name,
      value: cur.value,
      count: cur.count,
    }));
    list.sort((a, b) => {
      const ai = STAGE_ORDER.indexOf(a.name);
      const bi = STAGE_ORDER.indexOf(b.name);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [deals]);

  const dealsInStage = useMemo(() => {
    if (!selectedStage) return [];
    const key = selectedStage === 'No stage' ? '' : selectedStage;
    return deals.filter((d) => (d.stage?.trim() || '') === key);
  }, [deals, selectedStage]);

  const handleBarClick = (data: { name?: string } | undefined) => {
    if (data?.name != null) setSelectedStage(data.name);
  };

  return (
    <>
      <div className="sales-chart-card sales-chart-body-clickable">
        <div className="sales-chart-header">
          <h3 className="sales-chart-title">Pipeline by deal stage (ACV)</h3>
          <p className="sales-chart-sub">
            Total ACV per stage. Click a bar to see deals in that stage.
          </p>
        </div>
        <div className="sales-chart-body">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={stageData}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatValue}
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload as { name: string; value: number; count: number };
                  return (
                    <div
                      className="recharts-default-tooltip"
                      style={{
                        padding: '10px 14px',
                        background: 'var(--sales-surface)',
                        border: '1px solid var(--sales-border)',
                        borderRadius: 12,
                        boxShadow: 'var(--sales-shadow)',
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--sales-text)' }}>
                        {row.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--sales-text-secondary)' }}>
                        ACV: {formatValue(row.value)} · {row.count} deal{row.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(30, 27, 75, 0.06)' }}
              />
              <Bar
                dataKey="value"
                name="value"
                fill="var(--sales-primary)"
                radius={[6, 6, 0, 0]}
                barSize={32}
                onClick={handleBarClick}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DealsModal
        isOpen={selectedStage != null}
        title={selectedStage ?? ''}
        headerTitle={selectedStage != null ? `Deals in ${selectedStage}` : undefined}
        deals={dealsInStage}
        onClose={() => setSelectedStage(null)}
      />
    </>
  );
}
