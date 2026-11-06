import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { analyticsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const Analytics = () => {
  const { currency } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSmartAnalysis = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await analyticsService.getSmartAnalysis();
      if (res.data.success) {
        setAnalysisData(res.data.analysis);
      }
    } catch (err) {
      console.error('Error fetching smart analysis:', err);
      setError('Failed to compute smart analytics calculations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartAnalysis();
  }, []);

  if (loading && !analysisData) {
    return (
      <Layout pageTitle="Smart Expense Analytics">
        <div className="p-16 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Running smart expense algorithms &amp; rule-based engine...
          </p>
        </div>
      </Layout>
    );
  }

  const {
    totalCurrentMonthExpenses = 0,
    totalPrevMonthExpenses = 0,
    highestCategory = { name: 'None', amount: 0, percentage: 0 },
    averageDailySpending = 0,
    monthOverMonthDiff = 0,
    monthOverMonthPercentage = 0,
    unusualExpenses = [],
    estimatedNextMonthExpenses = 0,
    recommendations = [],
  } = analysisData || {};

  return (
    <Layout pageTitle="Smart Spending Analysis">
      {/* Header Banner */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Modules 5 &amp; 7 &bull; Capstone Analysis Engine
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Smart Spending Analysis &amp; Advisory
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-2xl">
          Algorithmic calculations for highest spending categories, average daily velocity, month-over-month trends, anomaly detection, and automated smart advice.
        </p>
      </div>

      {/* Module 5: 6 Key Mathematical Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* 1. Total Monthly Expenses */}
        <StatCard
          title="Total Monthly Expenses"
          amount={totalCurrentMonthExpenses}
          currency={currency}
          icon={TrendingDown}
          color="rose"
          subtitle="Total recorded expenses for current calendar month"
          badgeText="Module 5.1"
          badgeType="neutral"
        />

        {/* 2. Highest Spending Category */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Highest Spending Category
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
              {highestCategory.name}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
              {highestCategory.percentage}% of total
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Total Spent: {formatCurrency(highestCategory.amount, currency)}
          </p>
        </div>

        {/* 3. Average Daily Spending */}
        <StatCard
          title="Average Daily Spending"
          amount={averageDailySpending}
          currency={currency}
          icon={Clock}
          color="indigo"
          subtitle={`Spending velocity: ~${formatCurrency(averageDailySpending, currency)} per day`}
          badgeText="Daily Burn Rate"
          badgeType="neutral"
        />

        {/* 4. Month-Over-Month Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current vs Previous Month
            </span>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
                monthOverMonthDiff > 0 ? 'bg-rose-600 shadow-rose-500/20' : 'bg-emerald-600 shadow-emerald-500/20'
              }`}
            >
              {monthOverMonthDiff > 0 ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {monthOverMonthPercentage >= 0
                ? `+${monthOverMonthPercentage}%`
                : `${monthOverMonthPercentage}%`}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                monthOverMonthDiff > 0
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              {monthOverMonthDiff >= 0 ? 'Increased' : 'Decreased'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last Month: {formatCurrency(totalPrevMonthExpenses, currency)} (Diff:{' '}
            {formatCurrency(Math.abs(monthOverMonthDiff), currency)})
          </p>
        </div>

        {/* 5. Unusual Spending Threshold Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Unusual Spending Flagged
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {unusualExpenses.length} Flagged
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                unusualExpenses.length > 0
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              {unusualExpenses.length > 0 ? 'Anomalies Detected' : 'Normal'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Transactions exceeding 1.8x monthly transaction mean
          </p>
        </div>

        {/* 6. Estimated Next Month Spending */}
        <StatCard
          title="Projected Next Month Expenses"
          amount={estimatedNextMonthExpenses}
          currency={currency}
          icon={TrendingUp}
          color="purple"
          subtitle="Forecast based on historical 3-month moving average"
          badgeText="Forecast"
          badgeType="neutral"
        />
      </div>

      {/* Unusual Spending Anomaly Table */}
      <div className="mb-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unusual Spending Threshold Detection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transactions statistically higher than your average expenditure pattern
              </p>
            </div>
          </div>
        </div>

        {unusualExpenses.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No unusual spending detected this month!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              All transactions are within consistent and reasonable limits relative to your average.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Transaction Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Anomaly Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {unusualExpenses.map((anom) => (
                  <tr
                    key={anom._id}
                    className="hover:bg-amber-50/40 dark:hover:bg-amber-950/10 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {anom.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${getCategoryColor(anom.category)}18`,
                          color: getCategoryColor(anom.category),
                        }}
                      >
                        {anom.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {formatDate(anom.date)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600 dark:text-rose-400 text-sm">
                      {formatCurrency(anom.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/40">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                        <span>{anom.reason}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Module 7: Smart Recommendations (Rule-Based Expert System) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Module 7: Rule-Based Smart Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Expert rule engine generating actionable tips to curb excess spend and boost savings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => {
            const isDanger = rec.type === 'danger';
            const isWarning = rec.type === 'warning';
            const isSuccess = rec.type === 'success';

            return (
              <div
                key={rec.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isDanger
                    ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                    : isWarning
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                    : isSuccess
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                    : 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isDanger ? (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rec.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isDanger
                        ? 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                        : isWarning
                        ? 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : isSuccess
                        ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                        : 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                    }`}
                  >
                    {rec.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {rec.description}
                </p>

                {rec.action && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Suggested Action:</span>
                    <span className="font-normal text-slate-700 dark:text-slate-300">
                      {rec.action}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
