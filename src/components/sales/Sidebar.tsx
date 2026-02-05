export type SalesTabId =
  | 'overview'
  | 'forecast'
  | 'pipeline'
  | 'accounts'
  | '2026q1'
  | '2026q2'
  | '2026q3'
  | '2026q4';

const TABS: { id: SalesTabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'accounts', label: 'Accounts' },
  { id: '2026q1', label: '2026 Q1' },
  { id: '2026q2', label: '2026 Q2' },
  { id: '2026q3', label: '2026 Q3' },
  { id: '2026q4', label: '2026 Q4' },
];

interface SidebarProps {
  activeTab: SalesTabId;
  onTabChange: (tab: SalesTabId) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="sales-sidebar">
      <div className="sales-sidebar-brand">
        <img src="/token-logo.png" alt="Token" className="sales-sidebar-logo" />
        <div>
          <div className="sales-sidebar-title">Sales</div>
          <div className="sales-sidebar-subtitle">Commercial Performance</div>
        </div>
      </div>
      <nav className="sales-sidebar-nav">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`sales-sidebar-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
