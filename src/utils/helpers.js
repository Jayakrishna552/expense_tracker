export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Other'];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Education',
  'Entertainment',
  'Health',
  'Other',
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const CATEGORY_COLORS = {
  Salary: '#10b981',
  Freelance: '#06b6d4',
  Business: '#8b5cf6',
  Investment: '#f59e0b',
  Food: '#f97316',
  Travel: '#0ea5e9',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Education: '#6366f1',
  Entertainment: '#a855f7',
  Health: '#14b8a6',
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#94a3b8';
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function calculateTotals(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const transaction of transactions) {
    const amount = Number(transaction.amount) || 0;
    if (transaction.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
    }
  }
  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
}

export function getCurrentMonthSummary(transactions) {
  const monthKey = todayISO().slice(0, 7);
  const monthTransactions = transactions.filter(
    (transaction) => (transaction.date || '').slice(0, 7) === monthKey,
  );
  const totals = calculateTotals(monthTransactions);
  return { ...totals, netChange: totals.balance, count: monthTransactions.length };
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function getMonthlyOverview(transactions, monthsCount = 6) {
  const overview = [];
  const now = new Date();
  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthKey(date.getFullYear(), date.getMonth());
    const monthTransactions = transactions.filter((t) => (t.date || '').slice(0, 7) === key);
    overview.push({
      key,
      label: MONTH_LABELS[date.getMonth()],
      ...calculateTotals(monthTransactions),
    });
  }
  return overview;
}

export function getExpensesByCategory(transactions) {
  const totalsMap = {};
  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue;
    const amount = Number(transaction.amount) || 0;
    totalsMap[transaction.category] = (totalsMap[transaction.category] || 0) + amount;
  }
  return Object.entries(totalsMap)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function sortTransactions(list, order = 'newest') {
  const sorted = [...list].sort((a, b) => {
    const dateDiff = (b.date || '').localeCompare(a.date || '');
    if (dateDiff !== 0) return dateDiff;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });
  if (order === 'oldest') sorted.reverse();
  return sorted;
}
