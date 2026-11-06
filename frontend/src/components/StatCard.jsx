import React from 'react';
import { formatCurrency } from '../utils/formatters';

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-100 dark:border-indigo-900/50',
    iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-100 dark:border-purple-900/50',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-100 dark:border-emerald-900/50',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-100 dark:border-amber-900/50',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-100 dark:border-rose-900/50',
    iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
  },
};

const StatCard = ({
  title,
  amount,
  currency = 'INR',
  icon: Icon,
  color = 'indigo',
  subtitle,
  badgeText,
  badgeType = 'neutral',
}) => {
  const styles = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${styles.iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {typeof amount === 'number' ? formatCurrency(amount, currency) : amount}
        </h3>
        {badgeText && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              badgeType === 'positive'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : badgeType === 'negative'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
