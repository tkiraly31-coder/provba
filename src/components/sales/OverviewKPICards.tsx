function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export interface OverviewKPIData {
  /** Current ARR (for the "as of" month) */
  currentARR: number;
  /** Month this ARR value refers to, e.g. "February 2026" */
  currentARRMonthLabel: string;
  /** Previous month name for comparison, e.g. "January 2026" */
  currentARRCompareMonth: string;
  /** Percent change vs previous month (optional) */
  currentARRDelta?: number;
  forecastYearEndARR: number;
  closedWonClients: number;
  forecastYearEndClientsWon: number;
  ytdInYearRevenue: number;
  currentPipelineValue: number;
}

function DeltaBadge({
  delta,
  compareLabel,
}: {
  delta?: number;
  compareLabel: string;
}) {
  if (delta == null) {
    return (
      <span className="sales-kpi-delta" style={{ color: 'var(--sales-muted)' }}>
        vs {compareLabel}
      </span>
    );
  }
  const up = delta >= 0;
  return (
    <span className={`sales-kpi-delta ${up ? 'up' : 'down'}`}>
      {up ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% vs {compareLabel}
    </span>
  );
}

interface CardProps {
  label: string;
  value: string | number;
  delta?: number;
  compareLabel?: string;
  showCompare?: boolean;
  /** Optional subtitle under the label (e.g. "February 2026") */
  labelSubtitle?: string;
}

function Card({ label, value, delta, compareLabel = '', showCompare = false, labelSubtitle }: CardProps) {
  return (
    <div className="sales-kpi-card">
      <div className="sales-kpi-label">
        {label}
        {labelSubtitle != null && labelSubtitle !== '' && (
          <span className="sales-kpi-label-subtitle"> ({labelSubtitle})</span>
        )}
      </div>
      <div className="sales-kpi-value">{value}</div>
      {showCompare && <DeltaBadge delta={delta} compareLabel={compareLabel} />}
    </div>
  );
}

interface OverviewKPICardsProps {
  data: OverviewKPIData;
}

export function OverviewKPICards({ data }: OverviewKPICardsProps) {
  return (
    <div className="sales-kpi-grid">
      <Card
        label="Current ARR"
        value={formatCurrency(data.currentARR)}
        delta={data.currentARRDelta}
        compareLabel={data.currentARRCompareMonth}
        labelSubtitle={data.currentARRMonthLabel}
        showCompare
      />
      <Card label="Forecast Year-End ARR" value={formatCurrency(data.forecastYearEndARR)} />
      <Card label="Closed-Won Clients" value={data.closedWonClients} />
      <Card label="Forecast Year-End Clients Won" value={data.forecastYearEndClientsWon} />
      <Card label="YTD In-Year Revenue" value={formatCurrency(data.ytdInYearRevenue)} />
      <Card label="Current Pipeline Value" value={formatCurrency(data.currentPipelineValue)} />
    </div>
  );
}
