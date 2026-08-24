import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { calculateTotals, createId, getCurrentMonthSummary } from '../utils/helpers';

const ExpenseContext = createContext(null);

const TRANSACTIONS_KEY = 'expenseflow:transactions';
const THEME_KEY = 'expenseflow:theme';

function loadTransactions() {
  try {
    const stored = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'dark' || stored === 'light' ? stored : 'light';
}

export function ExpenseProvider({ children }) {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const addTransaction = (values) => {
    const newTransaction = {
      id: createId(),
      createdAt: Date.now(),
      ...values,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id, values) => {
    setTransactions((prev) =>
      prev.map((transaction) => (transaction.id === id ? { ...transaction, ...values } : transaction)),
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const monthlySummary = useMemo(() => getCurrentMonthSummary(transactions), [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      theme,
      totals,
      monthlySummary,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      toggleTheme,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, theme],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within an ExpenseProvider');
  return context;
}
