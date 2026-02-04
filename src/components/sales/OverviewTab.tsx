import {
  getSalesKPIs,
  getForecastOverTime,
  getPipelineByStage,
  getDealDistribution,
} from '../../data/salesMockData';
import { OverviewKPICards } from './OverviewKPICards';
import { ForecastLineChart } from './ForecastLineChart';
import { PipelineBarChart } from './PipelineBarChart';
import { DealDonutChart } from './DealDonutChart';

export function OverviewTab() {
  const kpis = getSalesKPIs();
  const forecastData = getForecastOverTime();
  const pipelineData = getPipelineByStage();
  const dealData = getDealDistribution();

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Overview</h1>
        <p className="sales-page-subtitle">Sales performance and pipeline at a glance</p>
      </header>

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
          <DealDonutChart data={dealData} />
        </div>
      </div>
    </div>
  );
}
