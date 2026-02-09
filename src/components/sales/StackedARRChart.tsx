import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { ARRByMonthPoint, ARRMonthDetail } from '../../data/salesMockData';
import { ARRDetailModal } from './ARRDetailModal';

interface StackedARRChartProps {
  data: ARRByMonthPoint[];
  detailsByMonth: Record<string, ARRMonthDetail>;
}

const LICENSE_COLOR = 'var(--sales-chart-1)';
const MINIMUM_COLOR = 'var(--sales-bg-alt)';
const VOLUME_COLOR = 'var(--sales-chart-3)';

function formatARR(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function tooltipValueToNumber(value: ValueType | undefined): number {
  if (value === undefined) return NaN;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return 0;
}

function getMonthFromBarClick(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const payload = (data as { payload?: ARRByMonthPoint }).payload ?? (data as ARRByMonthPoint);
  return payload?.month ?? null;
}

export function StackedARRChart({ data, detailsByMonth }: StackedARRChartProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleBarClick = (clickData: unknown) => {
    const month = getMonthFromBarClick(clickData);
    if (month) setSelectedMonth(month);
  };

  const handleChartClick = (state: unknown) => {
    const s = state as { activeTooltipIndex?: number; activePayload?: { payload?: ARRByMonthPoint }[] };
    const index = s?.activeTooltipIndex ?? (typeof hoveredIndex === 'number' ? hoveredIndex : null);
    const month =
      (typeof index === 'number' && data[index]?.month) ||
      s?.activePayload?.[0]?.payload?.month ||
      (s?.activePayload?.[0] as ARRByMonthPoint | undefined)?.month;
    if (month) setSelectedMonth(month);
  };

  const handleMouseMove = (state: unknown) => {
    const s = state as { activeTooltipIndex?: number };
    setHoveredIndex(typeof s?.activeTooltipIndex === 'number' ? s.activeTooltipIndex : null);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <>
      <div className="sales-chart-card">
        <div className="sales-chart-header">
          <h3 className="sales-chart-title">Estimated ARR per month</h3>
          <p className="sales-chart-sub">Stacked by License, Minimum, and Volume-driven. Click a bar to see client detail.</p>
        </div>
        <div
          className="sales-chart-body sales-chart-body-clickable"
          onClick={() => {
            if (hoveredIndex != null && data[hoveredIndex]) setSelectedMonth(data[hoveredIndex].month);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && hoveredIndex != null && data[hoveredIndex]) {
              setSelectedMonth(data[hoveredIndex].month);
            }
          }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }} onClick={handleChartClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--sales-border)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 11 }}
              />
              <YAxis
                tickFormatter={formatARR}
                tick={{ fill: 'var(--sales-text-secondary)', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: ValueType | undefined, name?: NameType) => {
                  const n = tooltipValueToNumber(value);
                  return [Number.isFinite(n) ? formatARR(n) : '—', String(name ?? '')];
                }}
                contentStyle={{
                  background: 'var(--sales-surface)',
                  border: '1px solid var(--sales-border)',
                  borderRadius: 12,
                }}
                labelStyle={{ color: 'var(--sales-text)' }}
                labelFormatter={(label) => String(label ?? '')}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value: unknown) => <span style={{ color: 'var(--sales-text)' }}>{String(value ?? '')}</span>}
              />
              <Bar dataKey="license" name="License" stackId="arr" fill={LICENSE_COLOR} radius={[0, 0, 0, 0]} cursor="pointer" onClick={handleBarClick} isAnimationActive={false} />
              <Bar dataKey="minimum" name="Minimum" stackId="arr" fill={MINIMUM_COLOR} radius={[0, 0, 0, 0]} cursor="pointer" onClick={handleBarClick} isAnimationActive={false} />
              <Bar dataKey="volumeDriven" name="Volume-driven" stackId="arr" fill={VOLUME_COLOR} radius={[6, 6, 0, 0]} cursor="pointer" onClick={handleBarClick} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ARRDetailModal
        isOpen={selectedMonth != null}
        month={selectedMonth ?? ''}
        details={selectedMonth ? detailsByMonth[selectedMonth] : undefined}
        onClose={() => setSelectedMonth(null)}
      />
    </>
  );
}
