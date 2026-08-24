import { Link } from 'react-router-dom';
import BalanceCard from '../components/BalanceCard';
import { MonthlyTrendChart } from '../components/Charts';
import TransactionList from '../components/TransactionList';
import { useExpenses } from '../context/ExpenseContext';
import {
  formatCurrency,
  sortTransactions,
} from '../utils/helpers';

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="17" cy="14.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function Dashboard() {
  const { transactions, totals, monthlySummary } = useExpenses();

  const recentTransactions = sortTransactions(transactions).slice(0, 5);
  const month = new Date().toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="page dashboard-page">
      <section className="stats-grid" aria-label="Financial overview">
        <BalanceCard
          label="Total Balance"
          value={formatCurrency(totals.balance)}
          hint={totals.balance >= 0 ? 'Income minus expenses' : 'You are overspending'}
          variant={totals.balance >= 0 ? 'balance' : 'balance negative'}
          icon={<WalletIcon />}
        />
        <BalanceCard
          label="Total Income"
          value={formatCurrency(totals.totalIncome)}
          hint="All time earnings"
          variant="income"
          icon={<TrendUpIcon />}
        />
        <BalanceCard
          label="Total Expenses"
          value={formatCurrency(totals.totalExpenses)}
          hint="All time spending"
          variant="expense"
          icon={<TrendDownIcon />}
        />
        <BalanceCard
          label={`${month} Net`}
          value={formatCurrency(monthlySummary.netChange)}
          hint={`${monthlySummary.count} transaction${monthlySummary.count === 1 ? '' : 's'} this month`}
          variant="month"
          icon={<CalendarIcon />}
        />
      </section>

      <div className="dashboard-grid">
        <section aria-label="Recent transactions" className="recent-section">
          <div className="section-heading">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="link-arrow">
              View all
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
          <TransactionList
            transactions={recentTransactions}
            emptyTitle="No transactions yet"
            emptyMessage="Add your first income or expense to see it here."
          >
            <Link to="/transactions" className="btn btn-primary btn-sm">
              Add a transaction
            </Link>
          </TransactionList>
        </section>

        <section className="card chart-card" aria-label="Monthly expense trend">
          <div className="card-header">
            <h2>Monthly Overview</h2>
            <p>Income vs expenses, last 6 months</p>
          </div>
          <div className="chart-container">
            <MonthlyTrendChart monthsCount={6} />
          </div>
          <p className="chart-note">
            {month} spending: <strong>{formatCurrency(monthlySummary.totalExpenses)}</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
