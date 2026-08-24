import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Header({ title, onMenuClick }) {
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="icon-btn menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="header-titles">
          <h1>{title}</h1>
          <p>{todayLabel}</p>
        </div>
      </div>
      <div className="header-actions">
        <Link to="/transactions" className="btn btn-primary btn-sm header-add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Transaction
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
