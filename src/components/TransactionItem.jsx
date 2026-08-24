import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers';

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { title, description, category, date, type, amount } = transaction;
  const isIncome = type === 'income';
  const color = getCategoryColor(category);

  return (
    <tr className={isIncome ? 'is-income' : 'is-expense'}>
      <td data-label="Transaction">
        <div className="tx-cell">
          <span className="tx-dot" style={{ backgroundColor: color }} />
          <div className="tx-text">
            <strong>{title}</strong>
            {description && <small>{description}</small>}
          </div>
        </div>
      </td>
      <td data-label="Category">
        <span className="category-chip" style={{ color, backgroundColor: `${color}1f` }}>
          {category}
        </span>
      </td>
      <td data-label="Date">{formatDate(date)}</td>
      <td data-label="Type">
        <span className={`type-badge ${type}`}>{isIncome ? 'Income' : 'Expense'}</span>
      </td>
      <td data-label="Amount" className={`amount-cell ${isIncome ? 'positive' : 'negative'}`}>
        {isIncome ? '+' : '-'}
        {formatCurrency(amount)}
      </td>
      <td data-label="Actions">
        <div className="row-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${title}`}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${title}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
