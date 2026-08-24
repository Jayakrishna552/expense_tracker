import TransactionItem from './TransactionItem';

function EmptyState({ icon, title, message, children }) {
  return (
    <div className="card empty-state">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
      {children}
    </div>
  );
}

const ReceiptIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
);

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
  emptyTitle = 'No transactions yet',
  emptyMessage = 'Add your first income or expense to start tracking your finances.',
  children,
}) {
  if (transactions.length === 0) {
    return (
      <EmptyState icon={ReceiptIcon} title={emptyTitle} message={emptyMessage}>
        {children}
      </EmptyState>
    );
  }

  return (
    <div className="card table-card">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Category</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
