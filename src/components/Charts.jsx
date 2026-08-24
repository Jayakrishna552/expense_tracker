import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { getCategoryColor, getExpensesByCategory, getMonthlyOverview } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  titleFont: { family: 'Inter' },
  bodyFont: { family: 'Inter' },
  padding: 10,
  cornerRadius: 8,
  boxPadding: 4,
};

const EMPTY_CHART = {
  labels: ['No data'],
  datasets: [
    {
      data: [1],
      backgroundColor: ['rgba(148, 163, 184, 0.25)'],
      borderWidth: 0,
    },
  ],
};

const DOUGHNUT_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyleWidth: 10,
        padding: 14,
        font: { family: 'Inter', size: 12 },
      },
    },
    tooltip: TOOLTIP_STYLE,
  },
};

export function ExpenseByCategoryChart() {
  const { transactions } = useExpenses();
  const expensesByCategory = getExpensesByCategory(transactions);

  if (expensesByCategory.length === 0) {
    return <Doughnut data={EMPTY_CHART} options={DOUGHNUT_OPTIONS} />;
  }

  const data = {
    labels: expensesByCategory.map((item) => item.category),
    datasets: [
      {
        data: expensesByCategory.map((item) => item.total),
        backgroundColor: expensesByCategory.map((item) => getCategoryColor(item.category)),
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        hoverOffset: 6,
      },
    ],
  };

  return <Doughnut data={data} options={DOUGHNUT_OPTIONS} />;
}

export function IncomeVsExpenseChart() {
  const { totals, theme } = useExpenses();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';
  const tickColor = isDark ? '#94a3b8' : '#64748b';

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [totals.totalIncome, totals.totalExpenses],
        backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(239, 68, 68, 0.75)'],
        hoverBackgroundColor: ['#10b981', '#ef4444'],
        borderRadius: 10,
        maxBarThickness: 72,
      },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: TOOLTIP_STYLE },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: 'Inter' } },
          },
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { family: 'Inter' } },
          },
        },
      }}
    />
  );
}

export function MonthlyTrendChart({ monthsCount = 6 }) {
  const { transactions, theme } = useExpenses();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const overview = getMonthlyOverview(transactions, monthsCount);

  const data = {
    labels: overview.map((month) => month.label),
    datasets: [
      {
        label: 'Income',
        data: overview.map((month) => month.totalIncome),
        borderColor: '#10b981',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 3,
      },
      {
        label: 'Expenses',
        data: overview.map((month) => month.totalExpenses),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
        pointRadius: 3,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyleWidth: 10,
              padding: 14,
              font: { family: 'Inter' },
            },
          },
          tooltip: TOOLTIP_STYLE,
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: tickColor, font: { family: 'Inter' } },
          },
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { family: 'Inter' } },
          },
        },
      }}
    />
  );
}
