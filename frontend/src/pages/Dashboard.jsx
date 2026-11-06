import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Receipt,
  FileBarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import AlertBanner from '../components/AlertBanner';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';
import { analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const PIE_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f97316',
  '#10b981',
  '#06b6d4',
  '#a855f7',
  '#eab308',
  '#ef4444',
  '#64748b',
];

const Dashboard = () => {
  const { user, currency } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await analyticsService.getDashboard();
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Unable to load dashboard data. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !data) {
    return (
      <Layout pageTitle="Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[55vh]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gathering financial telemetry...
          </p>
        </div>
      </Layout>
    );
  }

  const {
    totalIncome = 0,
    totalExpenses = 0,
    availableBalance = 0,
    currentMonthIncome = 0,
    currentMonthExpenses = 0,
    monthlySavings = 0,
    totalBudget = 0,
    budgetRemaining = 0,
    budgetUsedPercentage = 0,
    isBudgetWarning = false,
    isBudgetExceeded = false,
    categoryChartData = [],
    monthlyChartData = [],
    recentExpenses = [],
    recentIncomes = [],
  } = data || {};

  return (
    <Layout pageTitle="Dashboard Overview">
      {/* Budget threshold warning or exceeded alert banner */}
      <AlertBanner
        isWarning80={isBudgetWarning}
        isExceeded={isBudgetExceeded}
        totalBudget={totalBudget}
        totalSpent={currentMonthExpenses}
        percentageUsed={budgetUsedPercentage}
        currency={currency}
      />

      {/* Top Banner with Quick Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-3xl border border-slate-800 shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Hello, {user?.name || 'Explorer'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1">
            Here is your spending analysis and financial pulse for this month.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

          <button
            onClick={() => setIncomeModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Income</span>
          </button>

          <button
            onClick={fetchDashboardData}
            title="Refresh statistics"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Income"
          amount={totalIncome}
          currency={currency}
          icon={Wallet}
          color="emerald"
          subtitle={`This Month: ${formatCurrency(currentMonthIncome, currency)}`}
          badgeText="All-Time Inflow"
          badgeType="positive"
        />

        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          currency={currency}
          icon={TrendingDown}
          color="rose"
          subtitle={`This Month: ${formatCurrency(currentMonthExpenses, currency)}`}
          badgeText="All-Time Outflow"
          badgeType="negative"
        />

        <StatCard
          title="Available Balance"
          amount={availableBalance}
          currency={currency}
          icon={TrendingUp}
          color={availableBalance >= 0 ? 'indigo' : 'rose'}
          subtitle={
            availableBalance >= 0
              ? 'Net liquid financial reserve'
              : 'Caution: Net balance in deficit'
          }
          badgeText={availableBalance >= 0 ? 'Positive Net' : 'Deficit'}
          badgeType={availableBalance >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title="Monthly Savings"
          amount={monthlySavings}
          currency={currency}
          icon={PiggyBank}
          color="purple"
          subtitle={
            totalBudget > 0
              ? `Budget: ${formatCurrency(budgetRemaining, currency)} left`
              : 'Set a budget to track limits'
          }
          badgeText={
            currentMonthIncome > 0
              ? `${Math.round((monthlySavings / currentMonthIncome) * 100)}% Saved`
              : 'No Income'
          }
          badgeType={monthlySavings >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {/* Charts Section: Monthly Income vs Expense & Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Expense & Income Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Cash Flow Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Income vs Expenses for the past 6 months
              </p>
            </div>
            <Link
              to="/reports"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Full Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCurrency(value, currency), '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No monthly telemetry available.
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current month spending by category
            </p>
          </div>

          <div className="h-60 w-full relative flex items-center justify-center">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [formatCurrency(val, currency), 'Spent']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-slate-400">
                No expenses logged for this month yet.
              </div>
            )}
          </div>

          {/* Quick Category Legend List */}
          {categoryChartData.length > 0 && (
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-1">
              {categoryChartData.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                    />
                    <span className="text-slate-700 dark:text-slate-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.value, currency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: Expenses & Incomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Recent Expenses
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Latest outgoing expenditures
                </p>
              </div>
            </div>
            <Link
              to="/expenses"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((exp) => (
                <div key={exp._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs"
                      style={{
                        backgroundColor: `${getCategoryColor(exp.category)}18`,
                        color: getCategoryColor(exp.category),
                      }}
                    >
                      {exp.category ? exp.category.charAt(0) : 'E'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {exp.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{exp.category}</span>
                        <span>&bull;</span>
                        <span>{formatDate(exp.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount, currency)}
                    </span>
                    <p className="text-[10px] text-slate-400">{exp.paymentMethod}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-400">
                No expense transactions logged yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Incomes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Recent Income Credits
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Latest cash inflows and deposits
                </p>
              </div>
            </div>
            <Link
              to="/income"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentIncomes.length > 0 ? (
              recentIncomes.map((inc) => (
                <div key={inc._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs"
                      style={{
                        backgroundColor: `${getCategoryColor(inc.category)}18`,
                        color: getCategoryColor(inc.category),
                      }}
                    >
                      {inc.category ? inc.category.charAt(0) : 'I'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {inc.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{inc.category}</span>
                        <span>&bull;</span>
                        <span>{formatDate(inc.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(inc.amount, currency)}
                    </span>
                    <p className="text-[10px] text-slate-400">{inc.paymentMethod}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-slate-400">
                No income transactions logged yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExpenseModal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <IncomeModal
        isOpen={incomeModalOpen}
        onClose={() => setIncomeModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </Layout>
  );
};

export default Dashboard;
