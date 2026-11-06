import React, { useState, useEffect } from 'react';
import {
  FileBarChart2,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Loader2,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Reports = () => {
  const { currency } = useAuth();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [activeTab, setActiveTab] = useState('monthly'); // 'weekly', 'monthly', 'category'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await reportService.getSummary(selectedYear, selectedMonth);
      if (res.data.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to compile report summaries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedYear, selectedMonth]);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      await reportService.downloadCSV({
        startDate: new Date(selectedYear, selectedMonth - 1, 1).toISOString(),
        endDate: new Date(selectedYear, selectedMonth, 0).toISOString(),
      });
    } catch (err) {
      alert('Failed to download CSV export.');
    } finally {
      setExporting(false);
    }
  };

  const {
    summary = {},
    weeklyReport = [],
    monthlyComparison = [],
    categoryBreakdown = [],
  } = reportData || {};

  const {
    totalMonthSpent = 0,
    totalYearExpense = 0,
    totalYearIncome = 0,
    totalYearSavings = 0,
  } = summary;

  return (
    <Layout pageTitle="Financial Reports &amp; CSV Export">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Module 8 &bull; Reporting Engine
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Financial Audit &amp; Performance Reports</h2>
          <p className="text-xs text-indigo-200/80 mt-1">
            Weekly, monthly, and yearly cash flow breakdowns with downloadable CSV reports
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Year & Month filter controls */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 p-1.5 rounded-2xl">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-semibold px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1} className="bg-slate-900 text-white">
                  {name}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-white text-xs font-semibold px-2 py-1 focus:outline-hidden cursor-pointer"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export Expenses CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Selected Month Spend"
          amount={totalMonthSpent}
          currency={currency}
          icon={TrendingDown}
          color="rose"
          subtitle={`${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
        />

        <StatCard
          title="Annual Total Expense"
          amount={totalYearExpense}
          currency={currency}
          icon={FileBarChart2}
          color="purple"
          subtitle={`Full year ${selectedYear} outgoings`}
        />

        <StatCard
          title="Annual Total Income"
          amount={totalYearIncome}
          currency={currency}
          icon={TrendingUp}
          color="emerald"
          subtitle={`Full year ${selectedYear} receipts`}
        />

        <StatCard
          title="Net Annual Savings"
          amount={totalYearSavings}
          currency={currency}
          icon={TrendingUp}
          color={totalYearSavings >= 0 ? 'indigo' : 'rose'}
          subtitle={`Annual Net Margin for ${selectedYear}`}
          badgeText={totalYearSavings >= 0 ? 'Surplus' : 'Deficit'}
          badgeType={totalYearSavings >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {/* Report View Tabs: Monthly Comparison, Weekly Breakdown, Category Ledger */}
      <div className="mb-6 flex items-center gap-2 p-1 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-300/40 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'monthly'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Monthly Overview ({selectedYear})
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'weekly'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Weekly Breakdown ({MONTH_NAMES[selectedMonth - 1]})
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'category'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Category-Wise Breakdown
        </button>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-xs text-slate-400">Compiling financial charts...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Monthly Comparison Chart */}
          {activeTab === 'monthly' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Income vs Expense Timeline ({selectedYear})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      12-Month comparative analysis of inflow against outflow
                    </p>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                        formatter={(val) => [formatCurrency(val, currency), '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Summary Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
                  Monthly Performance Ledger ({selectedYear})
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Month</th>
                        <th className="py-3 px-4">Income</th>
                        <th className="py-3 px-4">Expense</th>
                        <th className="py-3 px-4">Net Savings</th>
                        <th className="py-3 px-4">Transactions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {monthlyComparison.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                            {row.month}
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(row.income, currency)}
                          </td>
                          <td className="py-3 px-4 font-semibold text-rose-600 dark:text-rose-400">
                            -{formatCurrency(row.expense, currency)}
                          </td>
                          <td className="py-3 px-4 font-bold">
                            <span
                              className={
                                row.savings >= 0
                                  ? 'text-indigo-600 dark:text-indigo-400'
                                  : 'text-rose-600'
                              }
                            >
                              {formatCurrency(row.savings, currency)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {row.expenseCount} entries
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Weekly Report */}
          {activeTab === 'weekly' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Weekly Spending Velocity ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Week-by-week distribution of expenses throughout the month
                  </p>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyReport} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
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
                      <Bar dataKey="amount" name="Spent Amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weekly Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weeklyReport.map((w, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center"
                  >
                    <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                      {w.week}
                    </span>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(w.amount, currency)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {w.count} transactions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Category Breakdown */}
          {activeTab === 'category' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Category Breakdown for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total spent: {formatCurrency(totalMonthSpent, currency)}
                  </p>
                </div>
              </div>

              {categoryBreakdown.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No expenses recorded in {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Share of Spend</th>
                        <th className="py-3.5 px-4">Transaction Count</th>
                        <th className="py-3.5 px-4">Avg Transaction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {categoryBreakdown.map((cat) => (
                        <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: `${getCategoryColor(cat.category)}18`,
                                color: getCategoryColor(cat.category),
                              }}
                            >
                              {cat.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {formatCurrency(cat.totalAmount, currency)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full"
                                  style={{ width: `${cat.percentage}%` }}
                                />
                              </div>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {cat.percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {cat.count} txns
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {formatCurrency(cat.avgAmount, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default Reports;
