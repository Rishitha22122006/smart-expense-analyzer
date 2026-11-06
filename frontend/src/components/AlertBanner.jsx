import React from 'react';
import { AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const AlertBanner = ({
  isWarning80,
  isExceeded,
  totalBudget = 0,
  totalSpent = 0,
  percentageUsed = 0,
  currency = 'INR',
}) => {
  if (!isWarning80 && !isExceeded) return null;

  if (isExceeded) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-rose-800 dark:text-rose-200">
              Budget Exceeded Alert! ({percentageUsed}% Used)
            </h4>
            <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
              You have spent {formatCurrency(totalSpent, currency)} against your monthly budget of{' '}
              {formatCurrency(totalBudget, currency)}. Overspent by{' '}
              {formatCurrency(totalSpent - totalBudget, currency)}.
            </p>
          </div>
        </div>
        <Link
          to="/budget"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
        >
          <span>Adjust Budget</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  if (isWarning80) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-amber-800 dark:text-amber-200">
              Budget Warning: 80% Threshold Reached! ({percentageUsed}% Used)
            </h4>
            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
              You have utilized {percentageUsed}% of your budget ({formatCurrency(totalSpent, currency)} of{' '}
              {formatCurrency(totalBudget, currency)}). Only{' '}
              {formatCurrency(totalBudget - totalSpent, currency)} remaining for this month.
            </p>
          </div>
        </div>
        <Link
          to="/budget"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
        >
          <span>View Budget</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return null;
};

export default AlertBanner;
