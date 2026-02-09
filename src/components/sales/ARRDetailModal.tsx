import type { ARRMonthDetail } from '../../data/salesMockData';

interface ARRDetailModalProps {
  isOpen: boolean;
  month: string;
  details: ARRMonthDetail | undefined;
  onClose: () => void;
}

function formatAmount(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function ARRDetailModal({ isOpen, month, details, onClose }: ARRDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="sales-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="sales-modal sales-modal-arr"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="arr-detail-modal-title"
      >
        <div className="sales-modal-header">
          <h2 id="arr-detail-modal-title" className="sales-modal-title">
            ARR detail – {month}
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
          {!details ? (
            <p className="sales-modal-empty">No detail for this month.</p>
          ) : (
            <>
              <section className="sales-arr-detail-section">
                <h3 className="sales-arr-detail-heading">License</h3>
                <table className="sales-modal-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.license.map((row, i) => (
                      <tr key={i}>
                        <td className="sales-modal-cell-name">{row.clientName}</td>
                        <td className="sales-modal-cell-acv">{formatAmount(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="sales-arr-detail-section">
                <h3 className="sales-arr-detail-heading">Minimum</h3>
                <table className="sales-modal-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.minimum.map((row, i) => (
                      <tr key={i}>
                        <td className="sales-modal-cell-name">{row.clientName}</td>
                        <td className="sales-modal-cell-acv">{formatAmount(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="sales-arr-detail-section">
                <h3 className="sales-arr-detail-heading">Volume-driven</h3>
                <table className="sales-modal-table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Transactions</th>
                      <th>Price point</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.volumeDriven.map((row, i) => (
                      <tr key={i}>
                        <td className="sales-modal-cell-name">{row.clientName}</td>
                        <td>{row.transactions.toLocaleString()}</td>
                        <td>{formatPrice(row.pricePoint)}</td>
                        <td className="sales-modal-cell-acv">{formatAmount(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
