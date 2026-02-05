import { useState, useMemo } from 'react';
import { useSalesData } from '../../contexts/SalesDataContext';
import type { ARRByMonthPoint, ARRMonthDetail } from '../../data/salesMockData';
import { StackedARRChart } from './StackedARRChart';
import { SegmentMultiselect } from './SegmentMultiselect';

function filterDetailsBySegment(
  detailsByMonth: Record<string, ARRMonthDetail>,
  selectedSegments: string[]
): Record<string, ARRMonthDetail> {
  if (selectedSegments.length === 0) return detailsByMonth;
  const out: Record<string, ARRMonthDetail> = {};
  for (const [month, d] of Object.entries(detailsByMonth)) {
    out[month] = {
      license: d.license.filter((x) => selectedSegments.includes(x.segment)),
      minimum: d.minimum.filter((x) => selectedSegments.includes(x.segment)),
      volumeDriven: d.volumeDriven.filter((x) => selectedSegments.includes(x.segment)),
    };
  }
  return out;
}

function chartDataFromFilteredDetails(detailsByMonth: Record<string, ARRMonthDetail>, months: string[]): ARRByMonthPoint[] {
  return months.map((month) => {
    const d = detailsByMonth[month] ?? { license: [], minimum: [], volumeDriven: [] };
    return {
      month,
      license: d.license.reduce((s, x) => s + x.amount, 0),
      minimum: d.minimum.reduce((s, x) => s + x.amount, 0),
      volumeDriven: d.volumeDriven.reduce((s, x) => s + x.amount, 0),
    };
  });
}

const FORECAST_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ForecastTab() {
  const { loading, error, getForecastARR } = useSalesData();
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const { detailsByMonth: rawDetails } = useMemo(() => getForecastARR(), [getForecastARR]);
  const detailsByMonth = useMemo(
    () => filterDetailsBySegment(rawDetails, selectedSegments),
    [rawDetails, selectedSegments]
  );
  const chartData = useMemo(
    () => chartDataFromFilteredDetails(detailsByMonth, FORECAST_MONTHS),
    [detailsByMonth]
  );

  if (loading) return <div className="sales-overview"><p className="sales-page-subtitle">Loading…</p></div>;
  if (error) return <div className="sales-overview"><p className="sales-page-subtitle" style={{ color: 'var(--sales-accent)' }}>Error: {error}</p></div>;

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Forecast</h1>
        <p className="sales-page-subtitle">
          Estimated ARR by month, split by License, Minimum, and Volume-driven revenue. Click a bar to see client detail.
        </p>
      </header>
      <div className="sales-accounts-filters sales-chart-card">
        <div className="sales-accounts-filters-row">
          <SegmentMultiselect selectedSegments={selectedSegments} onChange={setSelectedSegments} />
        </div>
      </div>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <StackedARRChart data={chartData} detailsByMonth={detailsByMonth} />
      </div>
    </div>
  );
}
