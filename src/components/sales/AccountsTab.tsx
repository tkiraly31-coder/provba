import { useState, useMemo } from 'react';
import { useSalesData } from '../../contexts/SalesDataContext';
import { SegmentMultiselect } from './SegmentMultiselect';

interface AccountsFilters {
  dealName: string;
  closeDate: string;
  segments: string[];
  acvMin: string;
  acvMax: string;
  transactionsMin: string;
  transactionsMax: string;
  dealOwner: string;
}

const DEAL_OWNERS = ['', 'Alex Morgan', 'Jordan Smith', 'Sam Taylor', 'Casey Lee', 'Riley Brown'];
const CLOSE_MONTHS = [
  '', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
  '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d}/${months[parseInt(m!, 10) - 1]}/${y}`;
}

function formatACV(value: number): string {
  if (value >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `£${(value / 1_000).toFixed(0)}K`;
  return `£${value}`;
}

export function AccountsTab() {
  const { getClientDealsList } = useSalesData();
  const deals = useMemo(() => getClientDealsList(), [getClientDealsList]);

  const [filters, setFilters] = useState<AccountsFilters>({
    dealName: '',
    closeDate: '',
    segments: [],
    acvMin: '',
    acvMax: '',
    transactionsMin: '',
    transactionsMax: '',
    dealOwner: '',
  });

  const filteredDeals = useMemo(() => {
    return deals.filter((d) => {
      if (filters.dealName.trim()) {
        if (!d.dealName.toLowerCase().includes(filters.dealName.trim().toLowerCase())) return false;
      }
      if (filters.closeDate) {
        const dealMonth = d.closeDate.slice(0, 7);
        if (dealMonth !== filters.closeDate) return false;
      }
      if (filters.segments.length > 0 && !filters.segments.includes(d.segment)) return false;
      if (filters.acvMin) {
        const min = parseInt(filters.acvMin, 10);
        if (!Number.isNaN(min) && d.acv < min) return false;
      }
      if (filters.acvMax) {
        const max = parseInt(filters.acvMax, 10);
        if (!Number.isNaN(max) && d.acv > max) return false;
      }
      if (filters.transactionsMin) {
        const min = parseInt(filters.transactionsMin, 10);
        if (!Number.isNaN(min) && d.estimatedTransactionsPerMonth < min) return false;
      }
      if (filters.transactionsMax) {
        const max = parseInt(filters.transactionsMax, 10);
        if (!Number.isNaN(max) && d.estimatedTransactionsPerMonth > max) return false;
      }
      if (filters.dealOwner && d.dealOwner !== filters.dealOwner) return false;
      return true;
    });
  }, [deals, filters]);

  const updateFilter = <K extends keyof AccountsFilters>(key: K, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="sales-overview">
      <header className="sales-page-header">
        <h1 className="sales-page-title">Accounts</h1>
        <p className="sales-page-subtitle">
          All client deals. Use the filters above to narrow by deal name, close date, segment, ACV, transactions, or owner.
        </p>
      </header>

      <div className="sales-accounts-filters sales-chart-card">
        <div className="sales-accounts-filters-row">
          <div className="sales-filter-field">
            <label className="sales-filter-label">Deal name</label>
            <input
              type="text"
              className="sales-filter-input"
              placeholder="Search..."
              value={filters.dealName}
              onChange={(e) => updateFilter('dealName', e.target.value)}
            />
          </div>
          <div className="sales-filter-field">
            <label className="sales-filter-label">Close date</label>
            <select
              className="sales-filter-select"
              value={filters.closeDate}
              onChange={(e) => updateFilter('closeDate', e.target.value)}
            >
              <option value="">All</option>
              {CLOSE_MONTHS.filter(Boolean).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <SegmentMultiselect
            selectedSegments={filters.segments}
            onChange={(segments) => updateFilter('segments', segments)}
          />
          <div className="sales-filter-field">
            <label className="sales-filter-label">ACV min (£)</label>
            <input
              type="number"
              className="sales-filter-input sales-filter-input-num"
              placeholder="Min"
              value={filters.acvMin}
              onChange={(e) => updateFilter('acvMin', e.target.value)}
              min={0}
            />
          </div>
          <div className="sales-filter-field">
            <label className="sales-filter-label">ACV max (£)</label>
            <input
              type="number"
              className="sales-filter-input sales-filter-input-num"
              placeholder="Max"
              value={filters.acvMax}
              onChange={(e) => updateFilter('acvMax', e.target.value)}
              min={0}
            />
          </div>
          <div className="sales-filter-field">
            <label className="sales-filter-label">Est. txns/mo min</label>
            <input
              type="number"
              className="sales-filter-input sales-filter-input-num"
              placeholder="Min"
              value={filters.transactionsMin}
              onChange={(e) => updateFilter('transactionsMin', e.target.value)}
              min={0}
            />
          </div>
          <div className="sales-filter-field">
            <label className="sales-filter-label">Est. txns/mo max</label>
            <input
              type="number"
              className="sales-filter-input sales-filter-input-num"
              placeholder="Max"
              value={filters.transactionsMax}
              onChange={(e) => updateFilter('transactionsMax', e.target.value)}
              min={0}
            />
          </div>
          <div className="sales-filter-field">
            <label className="sales-filter-label">Deal owner</label>
            <select
              className="sales-filter-select"
              value={filters.dealOwner}
              onChange={(e) => updateFilter('dealOwner', e.target.value)}
            >
              {DEAL_OWNERS.map((o) => (
                <option key={o || 'all'} value={o}>{o || 'All'}</option>
              ))}
            </select>
          </div>
          <div className="sales-filter-field sales-filter-actions">
            <button
              type="button"
              className="sales-filter-clear"
              onClick={() => setFilters({
                dealName: '',
                closeDate: '',
                segments: [],
                acvMin: '',
                acvMax: '',
                transactionsMin: '',
                transactionsMax: '',
                dealOwner: '',
              })}
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      <div className="sales-accounts-table-wrap sales-chart-card">
        <div className="sales-accounts-table-meta">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
        <div className="sales-accounts-table-scroll">
          <table className="sales-accounts-table">
            <thead>
              <tr>
                <th>Deal name</th>
                <th>Close date</th>
                <th>Segment</th>
                <th>ACV</th>
                <th>Est. txns/month</th>
                <th>Deal owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="sales-accounts-empty">No deals match the current filters.</td>
                </tr>
              ) : (
                filteredDeals.map((d) => (
                  <tr key={d.id}>
                    <td className="sales-accounts-cell-name">{d.dealName}</td>
                    <td>{formatDate(d.closeDate)}</td>
                    <td>{d.segment}</td>
                    <td className="sales-accounts-cell-acv">{formatACV(d.acv)}</td>
                    <td>{d.estimatedTransactionsPerMonth.toLocaleString()}</td>
                    <td>{d.dealOwner}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
