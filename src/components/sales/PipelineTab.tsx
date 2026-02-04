import { useMemo } from 'react';
import {
  getPipelineDeals2026,
  getACVByMonth2026,
  getDealsByMonth2026,
  getClientWinsOverTime,
} from '../../data/salesMockData';
import { PipelineACVChart } from './PipelineACVChart';
import { ClientWinsLineChart } from './ClientWinsLineChart';

export function PipelineTab() {
  const deals = useMemo(() => getPipelineDeals2026(), []);
  const monthlyData = useMemo(() => getACVByMonth2026(deals), [deals]);
  const dealsByMonth = useMemo(() => getDealsByMonth2026(deals), [deals]);
  const clientWinsData = useMemo(() => getClientWinsOverTime(), []);

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Pipeline</h1>
        <p className="sales-page-subtitle">
          Forecast total ACV per month in 2026 by deal close date. Click a bar to see deal details.
        </p>
      </header>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <PipelineACVChart monthlyData={monthlyData} dealsByMonth={dealsByMonth} />
      </div>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <ClientWinsLineChart data={clientWinsData} />
      </div>
    </div>
  );
}
