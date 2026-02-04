import { useState, useMemo } from 'react';

export interface FilterState {
  client: string[];
  regulatoryType: string[];
  transactionType: string[];
  merchant: string[];
  merchantJurisdiction: string[];
  merchantIndustry: string[];
  useCase: string[];
  tpp: string[];
  currency: string[];
  sourceBankJurisdiction: string[];
  transactionCategory: string[];
  transactionSubType: string[];
}

interface VolumeFiltersProps {
  filters: FilterState;
  uniqueValues: {
    [K in keyof FilterState]: string[];
  };
  onFilterChange: (filterKey: keyof FilterState, values: string[]) => void;
  onClearFilters: () => void;
}

const filterConfig: { key: keyof FilterState; label: string }[] = [
  { key: 'client', label: 'Client' },
  { key: 'regulatoryType', label: 'Regulatory type' },
  { key: 'transactionType', label: 'Transaction type' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'merchantJurisdiction', label: 'Merchant jurisdiction' },
  { key: 'merchantIndustry', label: 'Merchant industry' },
  { key: 'useCase', label: 'Use case' },
  { key: 'tpp', label: 'TPP' },
  { key: 'currency', label: 'Currency' },
  { key: 'sourceBankJurisdiction', label: 'Source bank jurisdiction' },
  { key: 'transactionCategory', label: 'Transaction category' },
  { key: 'transactionSubType', label: 'Transaction sub type' },
];

export const VolumeFilters = ({ filters, uniqueValues, onFilterChange, onClearFilters }: VolumeFiltersProps) => {
  const [search, setSearch] = useState('');

  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return uniqueValues;
    const q = search.toLowerCase().trim();
    const out = {} as typeof uniqueValues;
    for (const k of Object.keys(uniqueValues) as (keyof FilterState)[]) {
      out[k] = uniqueValues[k].filter((v) => String(v).toLowerCase().includes(q));
    }
    return out;
  }, [uniqueValues, search]);

  return (
    <div className="filterPanel">
      <div className="filterPanelHeader">
        <h3 className="filterPanelTitle">Filters</h3>
        {activeFilterCount > 0 && (
          <button type="button" className="btn btnPrimary" onClick={onClearFilters} title="Clear all">
            Clear
          </button>
        )}
      </div>

      <input
        type="text"
        className="filterSearch"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search filter options"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filterConfig.map(({ key, label }) => (
          <div key={key} className="filterRow">
            <label className="filterLabel" htmlFor={`filter-${key}`}>
              {label}
            </label>
            <select
              id={`filter-${key}`}
              className="select"
              multiple
              value={filters[key]}
              onChange={(e) => {
                const options = Array.from(e.target.options);
                const selectedValues = options.filter((o) => o.selected).map((o) => o.value);
                onFilterChange(key, selectedValues);
              }}
            >
              {filteredOptions[key]?.length === 0 ? (
                <option value="">No matches</option>
              ) : (
                filteredOptions[key]?.map((value) => (
                  <option key={value} value={value}>
                    {value || '(empty)'}
                  </option>
                ))
              )}
            </select>
            {filters[key].length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'block' }}>
                {filters[key].length} selected
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`filterClearBtn ${activeFilterCount > 0 ? 'active' : ''}`}
        onClick={onClearFilters}
      >
        Clear all filters
      </button>
    </div>
  );
};
