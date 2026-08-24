import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../utils/helpers';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function SearchFilter({
  search,
  onSearchChange,
  type,
  onTypeChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  const hasActiveFilters =
    search.trim() !== '' || type !== 'all' || category !== 'all' || sort !== 'newest';

  const handleReset = () => {
    onSearchChange('');
    onTypeChange('all');
    onCategoryChange('all');
    onSortChange('newest');
  };

  const categoryOptions =
    type === 'income' ? INCOME_CATEGORIES : type === 'expense' ? EXPENSE_CATEGORIES : ALL_CATEGORIES;

  return (
    <section className="card search-filter" aria-label="Search and filter transactions">
      <div className="search-box">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search transactions"
        />
      </div>

      <select value={type} onChange={(event) => onTypeChange(event.target.value)} aria-label="Filter by type">
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label="Filter by category"
      >
        <option value="all">All Categories</option>
        {categoryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(event) => onSortChange(event.target.value)} aria-label="Sort order">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {hasActiveFilters && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleReset}>
          Reset
        </button>
      )}
    </section>
  );
}
