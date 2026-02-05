import { useState, useMemo } from 'react';
import { useSalesData } from '../../contexts/SalesDataContext';
import { PipelineACVChart } from './PipelineACVChart';
import { ClientWinsLineChart } from './ClientWinsLineChart';
import { SegmentMultiselect } from './SegmentMultiselect';

export function PipelineTab() {
  const { loading, error, getPipelineDeals, getACVByMonth, getDealsByMonth, getClientWins } = useSalesData();
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const allDeals = useMemo(() => getPipelineDeals(), [getPipelineDeals]);
  const deals = useMemo(() => {
    if (selectedSegments.length === 0) return allDeals;
    return allDeals.filter((d) => selectedSegments.includes(d.segment));
  }, [allDeals, selectedSegments]);
  const monthlyData = useMemo(() => getACVByMonth(deals), [deals, getACVByMonth]);
  const dealsByMonth = useMemo(() => getDealsByMonth(deals), [deals, getDealsByMonth]);
  const clientWinsData = useMemo(() => getClientWins(), [getClientWins]);

  if (loading) return <div className="sales-overview"><p className="sales-page-subtitle">Loading…</p></div>;
  if (error) return <div className="sales-overview"><p className="sales-page-subtitle" style={{ color: 'var(--sales-accent)' }}>Error: {error}</p></div>;

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Pipeline</h1>
        <p className="sales-page-subtitle">
          Forecast total ACV per month in 2026 by deal close date. Click a bar to see deal details.
        </p>
      </header>
      <div className="sales-accounts-filters sales-chart-card">
        <div className="sales-accounts-filters-row">
          <SegmentMultiselect selectedSegments={selectedSegments} onChange={setSelectedSegments} />
        </div>
      </div>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <PipelineACVChart monthlyData={monthlyData} dealsByMonth={dealsByMonth} />
      </div>
      <div className="sales-chart-wrap sales-chart-wrap-wide">
        <ClientWinsLineChart data={clientWinsData} />
      </div>
    </div>
  );
}
