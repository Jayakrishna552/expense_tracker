import { useMemo } from 'react';
import { ExpenseByCategoryChart, IncomeVsExpenseChart, MonthlyTrendChart } from '../components/Charts';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, getCategoryColor, getExpensesByCategory } from '../utils/helpers';

function EmptyHint({ children }) {
  return <p className="chart-note muted">{children}</p>;
}

export default function Reports() {
  const { totals, transactions, monthlySummary } = useExpenses();
  const expensesByCategory = useMemo(() => getExpensesByCategory(transactions), [transactions]);
  const totalExpenseBase = totals.totalExpenses || 1;

  return (
    <div className="page reports-page">
      <section className="charts-grid" aria-label="Financial charts">
        <div className="card chart-card">
          <div className="card-header">
            <h2>Expenses by Category</h2>
            <p>Where your money goes</p>
          </div>
          <div className="chart-container tall">
            <ExpenseByCategoryChart />
          </div>
          {expensesByCategory.length === 0 ? (
            <EmptyHint>Add expense transactions to see the breakdown.</EmptyHint>
          ) : (
            <ul className="category-breakdown">
              {expensesByCategory.slice(0, 4).map((item) => (
                <li key={item.category}>
                  <span className="dot" style={{ backgroundColor: getCategoryColor(item.category) }} />
                  <span className="name">{item.category}</span>
                  <span className="value">{formatCurrency(item.total)}</span>
                  <span className="share">{Math.round((item.total / totalExpenseBase) * 100)}%</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card chart-card">
          <div className="card-header">
            <h2>Income vs Expenses</h2>
            <p>All time comparison</p>
          </div>
          <div className="chart-container tall">
            <IncomeVsExpenseChart />
          </div>
          <p className="chart-note">
            Savings rate:{' '}
            <strong>{totals.totalIncome > 0 ? Math.round((totals.balance / totals.totalIncome) * 100) : 0}%</strong> of
            income kept
          </p>
        </div>

        <div className="card chart-card wide">
          <div className="card-header">
            <h2>Monthly Expense Overview</h2>
            <p>Last 6 months trend</p>
          </div>
          <div className="chart-container">
            <MonthlyTrendChart monthsCount={6} />
          </div>
          <EmptyHint>
            This month you have {monthlySummary.count} transaction
            {monthlySummary.count === 1 ? '' : 's'} recorded.
          </EmptyHint>
        </div>
      </section>

      {expensesByCategory.length > 4 && (
        <section className="card table-card" aria-label="Full expense breakdown">
          <table className="transactions-table breakdown-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Spent</th>
                <th>Share of Expenses</th>
              </tr>
            </thead>
            <tbody>
              {expensesByCategory.map((item) => (
                <tr key={item.category}>
                  <td data-label="Category">
                    <span className="tx-cell">
                      <span className="tx-dot" style={{ backgroundColor: getCategoryColor(item.category) }} />
                      <strong>{item.category}</strong>
                    </span>
                  </td>
                  <td data-label="Total Spent">{formatCurrency(item.total)}</td>
                  <td data-label="Share">{Math.round((item.total / totalExpenseBase) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
