import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Settings,
  TrendingDown,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Layout from '../components/Layout';
import BudgetModal from '../components/BudgetModal';
import { budgetService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const BudgetManagement = () => {
  const { currency } = useAuth();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBudgetStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await budgetService.getStatus(selectedMonth, selectedYear);
      if (res.data.success) {
        setBudgetStatus(res.data);
      }
    } catch (err) {
      console.error('Error fetching budget status:', err);
      setError('Failed to fetch budget status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetStatus();
  }, [selectedMonth, selectedYear]);

  const {
    totalBudget = 0,
    totalSpent = 0,
    remainingBudget = 0,
    percentageUsed = 0,
    isWarning80 = false,
    isExceeded = false,
    categoryAnalysis = [],
    budgetExists = false,
    budgetDetails = null,
  } = budgetStatus || {};

  return (
    <Layout pageTitle="Budget Management &amp; Tracking">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-purple-900/40 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
              Module 6 Engine
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Monthly Spending Limits</h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Enforce financial discipline with active threshold warnings and category caps
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Month / Year Selector */}
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
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>{budgetExists ? 'Edit Budget' : 'Set Budget'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <p className="text-xs text-slate-400">Evaluating budget rules...</p>
        </div>
      ) : (
        <>
          {/* Overall Budget Progress Card */}
          <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {MONTH_NAMES[selectedMonth - 1]} {selectedYear} Overall Status
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {formatCurrency(totalSpent, currency)}{' '}
                  <span className="text-base font-normal text-slate-400">
                    of {totalBudget > 0 ? formatCurrency(totalBudget, currency) : 'No Budget Set'}
                  </span>
                </h3>
              </div>

              {/* Status Badge */}
              <div>
                {totalBudget === 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    <span>Unbudgeted Month</span>
                  </span>
                ) : isExceeded ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900/50">
                    <AlertCircle className="w-4 h-4" />
                    <span>Budget Exceeded ({percentageUsed}%)</span>
                  </span>
                ) : isWarning80 ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900/50">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Warning: 80% Consumed ({percentageUsed}%)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-900/50">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Within Budget ({percentageUsed}%)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isExceeded
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : isWarning80
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Total Spent</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {formatCurrency(totalSpent, currency)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Remaining Buffer</span>
                <span
                  className={`text-base font-bold ${
                    remainingBudget < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {remainingBudget >= 0
                    ? formatCurrency(remainingBudget, currency)
                    : `-${formatCurrency(Math.abs(remainingBudget), currency)} (Over)`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Consumption Ratio</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {percentageUsed}%
                </span>
              </div>
            </div>
          </div>

          {/* Category-Wise Budget Cards Grid */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Category Spending Allocations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Granular tracking for essential living expenses and discretionary categories
              </p>
            </div>
          </div>

          {categoryAnalysis.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800">
              <PiggyBank className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No category budgets configured for this month.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Setting category limits ensures you don't overspend on shopping, food, or entertainment.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                <span>Configure Category Limits</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryAnalysis.map((item) => (
                <div
                  key={item.category}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${getCategoryColor(item.category)}18`,
                          color: getCategoryColor(item.category),
                        }}
                      >
                        {item.category}
                      </span>

                      {item.isExceeded ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400">
                          Exceeded
                        </span>
                      ) : item.isWarning80 ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                          80% Warning
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                          Safe ({item.percentageUsed}%)
                        </span>
                      )}
                    </div>

                    <div className="mb-2">
                      <div className="flex items-baseline justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>Spent: {formatCurrency(item.spent, currency)}</span>
                        <span className="text-slate-400">
                          Limit:{' '}
                          {item.budgetLimit > 0
                            ? formatCurrency(item.budgetLimit, currency)
                            : 'Unset'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.isExceeded
                            ? 'bg-rose-500'
                            : item.isWarning80
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      {item.remaining >= 0 ? 'Remaining:' : 'Over by:'}
                    </span>
                    <span
                      className={`font-bold ${
                        item.remaining < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {formatCurrency(Math.abs(item.remaining), currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Budget Modal */}
      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBudgetStatus}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        existingBudget={budgetDetails}
      />
    </Layout>
  );
};

export default BudgetManagement;
