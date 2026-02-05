import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { ACVByMonth, PipelineDeal } from '../../data/salesMockData';
import { DealsModal } from './DealsModal';

type ViewMode = 'simple' | 'cumulative';

interface PipelineACVChartProps {
  monthlyData: ACVByMonth[];
  dealsByMonth: Record<string, PipelineDeal[]>;
}

function formatACV(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return `£${value}`;
}

function toCumulativeACV(data: ACVByMonth[]): ACVByMonth[] {
  let sum = 0;
  return data.map((p) => {
    sum += p.totalACV;
    return { ...p, totalACV: sum };
  });
}

export function PipelineACVChart({ monthlyData, dealsByMonth }: PipelineACVChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(
    () => (viewMode === 'cumulative' ? toCumulativeACV(monthlyData) : monthlyData),
    [monthlyData, viewMode]
  );

  const selectedDeals = selectedMonth ? dealsByMonth[selectedMonth] ?? [] : [];
  const selectedLabel = selectedMonth
    ? monthlyData.find((d) => d.monthKey === selectedMonth)?.month ?? selectedMonth
    : '';

  const handleBarClick = (clickData: unknown) => {
    if (!clickData || typeof clickData !== 'object') return;
    const payload = (clickData as { payload?: ACVByMonth }).payload ?? (clickData as ACVByMonth);
    if (payload?.monthKey) setSelectedMonth(payload.monthKey);
  };

  const handleChartClick = (state: unknown) => {
    const s = state as { activeTooltipIndex?: number; activePayload?: { payload?: ACVByMonth }[] };
    const index = s?.activeTooltipIndex ?? (typeof hoveredIndex === 'number' ? hoveredIndex : null);
    const payload =
      (typeof index === 'number' && chartData[index]) ||
      s?.activePayload?.[0]?.payload ||
      (s?.activePayload?.[0] as ACVByMonth | undefined);
    if (payload?.monthKey) setSelectedMonth(payload.monthKey);
  };

  const handleMouseMove = (state: unknown) => {
    const s = state as { activeTooltipIndex?: number };
    setHoveredIndex(typeof s?.activeTooltipIndex === 'number' ? s.activeTooltipIndex : null);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  const tooltipLabel = viewMode === 'cumulative' ? 'Cumulative ACV' : 'Total ACV';

  return (
    <>
      <div className="sales-chart-card">
        <div className="sales-chart-header sales-chart-header-with-switch">
          <div>
            <h3 className="sales-chart-title">Forecast ACV by close date (2026)</h3>
            <p className="sales-chart-sub">
              {viewMode === 'cumulative'
                ? 'Running total of ACV by close date. Click a bar to see deals.'
                : 'Total ACV per month. Click a bar to see deals.'}
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
        <div
          className="sales-chart-body sales-chart-body-clickable"
          onClick={() => {
            if (hoveredIndex != null && chartData[hoveredIndex]) setSelectedMonth(chartData[hoveredIndex].monthKey);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && hoveredIndex != null && chartData[hoveredIndex]) {
              setSelectedMonth(chartData[hoveredIndex].monthKey);
            }
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              onClick={handleChartClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }}
              />
              <YAxis
                dataKey="totalACV"
                tickFormatter={formatACV}
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: ValueType, name: NameType) => {
                  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : 0;
                  return [Number.isFinite(n) ? formatACV(n) : '—', String(name ?? tooltipLabel)];
                }}
                contentStyle={{
                  background: 'var(--sales-surface)',
                  border: '1px solid var(--sales-border)',
                  borderRadius: 12,
                }}
                labelStyle={{ color: 'var(--sales-text)' }}
                labelFormatter={(label) => String(label ?? '')}
              />
              <Bar
                dataKey="totalACV"
                name={tooltipLabel}
                fill="var(--sales-primary)"
                radius={[6, 6, 0, 0]}
                cursor="pointer"
                onClick={handleBarClick}
                isAnimationActive={false}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.monthKey}
                    fill={
                      selectedMonth === entry.monthKey
                        ? 'var(--sales-primary-hover)'
                        : 'var(--sales-primary)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DealsModal
        isOpen={selectedMonth != null}
        title={selectedLabel}
        deals={selectedDeals}
        onClose={() => setSelectedMonth(null)}
      />
    </>
  );
}
