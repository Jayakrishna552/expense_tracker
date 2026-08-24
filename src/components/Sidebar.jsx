import { NavLink } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/helpers';

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/transactions', label: 'Transactions', icon: <ListIcon /> },
  { to: '/reports', label: 'Reports', icon: <ChartIcon /> },
];

export default function Sidebar({ open, onClose }) {
  const { totals } = useExpenses();
  const balanceClass = totals.balance >= 0 ? 'positive' : 'negative';

  return (
    <aside className={`sidebar${open ? ' open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-mark">
            <LogoMark />
          </span>
          <span className="logo-text">
            Expense<span>Flow</span>
          </span>
        </div>
        <button type="button" className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Menu</p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-balance">
        <p>Total Balance</p>
        <strong className={balanceClass}>{formatCurrency(totals.balance)}</strong>
        <span>{totals.balance >= 0 ? 'You are on track' : 'Spending exceeds income'}</span>
      </div>
    </aside>
  );
}
