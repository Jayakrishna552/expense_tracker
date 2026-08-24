import { useEffect, useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  todayISO,
} from '../utils/helpers';

const EMPTY_FORM = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: todayISO(),
  description: '',
};

function buildFormFromTransaction(transaction) {
  return {
    title: transaction.title || '',
    amount: transaction.amount !== undefined ? String(transaction.amount) : '',
    type: transaction.type || 'expense',
    category: transaction.category || '',
    date: transaction.date || todayISO(),
    description: transaction.description || '',
  };
}

export default function TransactionForm({ editingTransaction, onCancelEdit, onSaved }) {
  const { addTransaction, updateTransaction } = useExpenses();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingTransaction);

  useEffect(() => {
    if (editingTransaction) {
      setForm(buildFormFromTransaction(editingTransaction));
      setErrors({});
    }
  }, [editingTransaction]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleTypeChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      type: value,
      category: prev.type === value ? prev.category : '',
    }));
    setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    const amount = Number(form.amount);
    if (!form.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = 'Enter an amount greater than zero.';
    }
    if (!form.category) nextErrors.category = 'Please select a category.';
    if (!form.date) nextErrors.date = 'Please select a date.';
    return nextErrors;
  }

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount: Math.round(Number(form.amount) * 100) / 100,
      type: form.type,
      category: form.category,
      date: form.date,
      description: form.description.trim(),
    };

    if (isEditing) {
      updateTransaction(editingTransaction.id, payload);
      onCancelEdit?.();
    } else {
      addTransaction(payload);
    }

    resetForm();
    onSaved?.(payload.type === 'income' ? 'Income added' : 'Expense added');
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <section className="card form-card">
      <div className="card-header">
        <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <p>{isEditing ? 'Update the details below.' : 'Track a new income or expense.'}</p>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit} noValidate>
        <div className={`field${errors.title ? ' has-error' : ''}`}>
          <label htmlFor="tx-title">Title *</label>
          <input
            id="tx-title"
            name="title"
            type="text"
            placeholder="e.g. Grocery shopping"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="field-row">
          <div className={`field${errors.amount ? ' has-error' : ''}`}>
            <label htmlFor="tx-amount">Amount *</label>
            <input
              id="tx-amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>

          <div className="field">
            <label htmlFor="tx-type">Type *</label>
            <select id="tx-type" name="type" value={form.type} onChange={handleTypeChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className={`field${errors.category ? ' has-error' : ''}`}>
            <label htmlFor="tx-category">Category *</label>
            <select id="tx-category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className={`field${errors.date ? ' has-error' : ''}`}>
            <label htmlFor="tx-date">Date *</label>
            <input id="tx-date" name="date" type="date" value={form.date} onChange={handleChange} />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="tx-description">
            Description <small>(optional)</small>
          </label>
          <textarea
            id="tx-description"
            name="description"
            rows="2"
            placeholder="Add a short note..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
