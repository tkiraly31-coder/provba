import type { SalesKPIs } from '../../data/salesMockData';

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return `£${value}`;
}

function DeltaBadge({ delta }: { delta?: number }) {
  if (delta == null) return null;
  const up = delta >= 0;
  return (
    <span className={`sales-kpi-delta ${up ? 'up' : 'down'}`}>
      {up ? '↑' : '↓'} {Math.abs(delta)}% vs last week
    </span>
  );
}

interface CardProps {
  label: string;
  value: string | number;
  delta?: number;
}

function Card({ label, value, delta }: CardProps) {
  return (
    <div className="sales-kpi-card">
      <div className="sales-kpi-label">{label}</div>
      <div className="sales-kpi-value">{value}</div>
      <DeltaBadge delta={delta} />
    </div>
  );
}

interface OverviewKPICardsProps {
  data: SalesKPIs;
}

export function OverviewKPICards({ data }: OverviewKPICardsProps) {
  return (
    <div className="sales-kpi-grid">
      <Card
        label="Forecast ARR"
        value={formatCurrency(data.forecastARR)}
        delta={data.forecastARRDelta}
      />
      <Card
        label="Pipeline Value"
        value={formatCurrency(data.pipelineValue)}
        delta={data.pipelineValueDelta}
      />
      <Card label="Closed Won" value={data.closedWon} delta={data.closedWonDelta} />
      <Card label="Win Rate" value={`${data.winRate}%`} delta={data.winRateDelta} />
    </div>
  );
}
