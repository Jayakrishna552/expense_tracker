import { useMemo, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import SearchFilter from '../components/SearchFilter';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { useExpenses } from '../context/ExpenseContext';
import { sortTransactions } from '../utils/helpers';

export default function Transactions() {
  const { transactions, deleteTransaction } = useExpenses();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        query === '' ||
        transaction.title.toLowerCase().includes(query) ||
        (transaction.description || '').toLowerCase().includes(query);
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
    return sortTransactions(filtered, sortOrder);
  }, [transactions, search, typeFilter, categoryFilter, sortOrder]);

  const handleConfirmDelete = () => {
    if (pendingDelete) deleteTransaction(pendingDelete.id);
    setPendingDelete(null);
  };

  const handleCloseModal = (confirmed) => {
    if (confirmed) handleConfirmDelete();
    else setPendingDelete(null);
  };

  return (
    <div className="page transactions-page">
      <div className="transactions-layout">
        <TransactionForm
          editingTransaction={editingTransaction}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <section className="transactions-content" aria-label="All transactions">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            type={typeFilter}
            onTypeChange={setTypeFilter}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sort={sortOrder}
            onSortChange={setSortOrder}
          />

          <TransactionList
            transactions={filteredTransactions}
            emptyTitle={
              transactions.length === 0
                ? 'No transactions yet'
                : 'No matching transactions'
            }
            emptyMessage={
              transactions.length === 0
                ? 'Add your first income or expense to start tracking.'
                : 'Try adjusting your search or filters.'
            }
            onEdit={(transaction) => {
              setEditingTransaction(transaction);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={(transaction) => setPendingDelete(transaction)}
          />
        </section>
      </div>

      <ConfirmModal transaction={pendingDelete} onCancel={handleCloseModal} />
    </div>
  );
}
