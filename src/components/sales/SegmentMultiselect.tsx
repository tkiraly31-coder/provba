import { useState, useRef, useEffect } from 'react';
import { SEGMENT_OPTIONS } from '../../data/salesMockData';

interface SegmentMultiselectProps {
  selectedSegments: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  className?: string;
}

export function SegmentMultiselect({
  selectedSegments,
  onChange,
  label = 'Segment',
  className = '',
}: SegmentMultiselectProps) {
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

  const toggleSegment = (seg: string) => {
    if (selectedSegments.length === 0) {
      // No segments selected (e.g. after Clear); user is checking this one
      onChange([seg]);
      return;
    }
    if (selectedSegments.includes(seg)) {
      const next = selectedSegments.filter((s) => s !== seg);
      onChange(next);
    } else {
      const next = [...selectedSegments, seg];
      onChange(next);
    }
  };

  const selectAll = () => onChange([...SEGMENT_OPTIONS]);
  const clearAll = () => onChange([]);

  const summary =
    selectedSegments.length === 0
      ? 'All'
      : selectedSegments.length === SEGMENT_OPTIONS.length
        ? 'All'
        : `${selectedSegments.length} selected`;

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
            {SEGMENT_OPTIONS.map((seg) => (
              <label key={seg} className="sales-segment-option">
                <input
                  type="checkbox"
                  checked={selectedSegments.length > 0 && selectedSegments.includes(seg)}
                  onChange={() => toggleSegment(seg)}
                  className="sales-segment-checkbox"
                />
                <span>{seg}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
