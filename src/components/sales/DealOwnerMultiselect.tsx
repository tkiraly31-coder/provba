import { useState, useRef, useEffect } from 'react';

interface DealOwnerMultiselectProps {
  owners: string[];
  selectedOwners: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  className?: string;
}

export function DealOwnerMultiselect({
  owners,
  selectedOwners,
  onChange,
  label = 'Deal owner',
  className = '',
}: DealOwnerMultiselectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOwner = (owner: string) => {
    if (selectedOwners.length === 0) {
      onChange([owner]);
      return;
    }
    if (selectedOwners.includes(owner)) {
      const next = selectedOwners.filter((o) => o !== owner);
      onChange(next);
    } else {
      const next = [...selectedOwners, owner];
      onChange(next);
    }
  };

  const selectAll = () => onChange([...owners]);
  const clearAll = () => onChange([]);

  const summary =
    selectedOwners.length === 0
      ? 'All'
      : selectedOwners.length === owners.length
        ? 'All'
        : `${selectedOwners.length} selected`;

  if (owners.length === 0) return null;

  return (
    <div className={`sales-filter-field sales-segment-multiselect ${className}`} ref={containerRef}>
      <label className="sales-filter-label">{label}</label>
      <button
        type="button"
        className="sales-filter-select sales-segment-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {summary}
      </button>
      {open && (
        <div className="sales-segment-dropdown" role="listbox">
          <div className="sales-segment-dropdown-actions">
            <button type="button" className="sales-segment-dropdown-btn" onClick={selectAll}>
              All
            </button>
            <button type="button" className="sales-segment-dropdown-btn" onClick={clearAll}>
              Clear
            </button>
          </div>
          <div className="sales-segment-dropdown-list">
            {owners.map((owner) => (
              <label key={owner} className="sales-segment-option">
                <input
                  type="checkbox"
                  checked={selectedOwners.length > 0 && selectedOwners.includes(owner)}
                  onChange={() => toggleOwner(owner)}
                  className="sales-segment-checkbox"
                />
                <span>{owner}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
