import type { PipelineDeal } from '../../data/salesMockData';

interface DealsModalProps {
  isOpen: boolean;
  title: string;
  /** When set, used as the full modal header instead of "Deals closing in {title}" */
  headerTitle?: string;
  deals: PipelineDeal[];
  onClose: () => void;
}

function formatACV(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function DealsModal({ isOpen, title, headerTitle, deals, onClose }: DealsModalProps) {
  if (!isOpen) return null;

  const modalTitle = headerTitle ?? `Deals closing in ${title}`;

  return (
    <div className="sales-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="sales-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="deals-modal-title"
      >
        <div className="sales-modal-header">
          <h2 id="deals-modal-title" className="sales-modal-title">
            {modalTitle}
          </h2>
          <button
            type="button"
            className="sales-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="sales-modal-body">
          {deals.length === 0 ? (
            <p className="sales-modal-empty">No deals in this month.</p>
          ) : (
            <>
              <table className="sales-modal-table">
                <thead>
                  <tr>
                    <th>Deal name</th>
                    <th>ACV</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id}>
                      <td className="sales-modal-cell-name">{deal.name}</td>
                      <td className="sales-modal-cell-acv">{formatACV(deal.acv)}</td>
                      <td>{deal.stage ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="sales-modal-summary">
                Total ACV: {formatACV(deals.reduce((s, d) => s + d.acv, 0))} ({deals.length} deal{deals.length !== 1 ? 's' : ''})
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
