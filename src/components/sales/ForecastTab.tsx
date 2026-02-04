import { useMemo } from 'react';
import { getForecastARRWithDetails } from '../../data/salesMockData';
import { StackedARRChart } from './StackedARRChart';

export function ForecastTab() {
  const { chartData, detailsByMonth } = useMemo(() => getForecastARRWithDetails(), []);

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Forecast</h1>
        <p className="sales-page-subtitle">
          Estimated ARR by month, split by License, Minimum, and Volume-driven revenue. Click a bar to see client detail.
        </p>
      </header>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <StackedARRChart data={chartData} detailsByMonth={detailsByMonth} />
      </div>
    </div>
  );
}
