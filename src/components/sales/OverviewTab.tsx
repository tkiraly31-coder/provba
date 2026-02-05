import { useState, useMemo } from 'react';
import { useSalesData } from '../../contexts/SalesDataContext';
import { OverviewKPICards } from './OverviewKPICards';
import { ForecastLineChart } from './ForecastLineChart';
import { PipelineBarChart } from './PipelineBarChart';
import { DealDonutChart } from './DealDonutChart';
import { SegmentMultiselect } from './SegmentMultiselect';

export function OverviewTab() {
  const { loading, error, getKPIs, getForecastLine, getPipelineStages, getDealDist } = useSalesData();
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const kpis = useMemo(() => getKPIs(), [getKPIs]);
  const forecastData = useMemo(
    () => getForecastLine(selectedSegments.length > 0 ? selectedSegments : undefined),
    [selectedSegments, getForecastLine]
  );
  const pipelineData = useMemo(() => getPipelineStages(), [getPipelineStages]);
  const dealData = useMemo(
    () => getDealDist(selectedSegments.length > 0 ? selectedSegments : undefined),
    [selectedSegments, getDealDist]
  );

  if (loading) {
    return (
      <div className="sales-overview">
        <p className="sales-page-subtitle">Loading data from Google Sheets…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="sales-overview">
        <p className="sales-page-subtitle" style={{ color: 'var(--sales-accent)' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Overview</h1>
        <p className="sales-page-subtitle">Sales performance and pipeline at a glance</p>
      </header>

      <div className="sales-accounts-filters sales-chart-card">
        <div className="sales-accounts-filters-row">
          <SegmentMultiselect selectedSegments={selectedSegments} onChange={setSelectedSegments} />
        </div>
      </div>

      <OverviewKPICards data={kpis} />

      <div className="sales-charts-row">
        <div className="sales-chart-wrap sales-chart-wrap-wide">
          <ForecastLineChart data={forecastData} />
        </div>
      </div>

      <div className="sales-charts-row sales-charts-row-half">
        <div className="sales-chart-wrap">
          <PipelineBarChart data={pipelineData} />
        </div>
        <div className="sales-chart-wrap">
          <DealDonutChart key={selectedSegments.slice().sort().join(',')} data={dealData} />
        </div>
      </div>
    </div>
  );
}
