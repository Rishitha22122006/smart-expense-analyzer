import React, { useState, useEffect } from 'react';
import { X, Loader2, PiggyBank, Plus, Trash2 } from 'lucide-react';
import { budgetService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CURRENCY_SYMBOLS } from '../utils/formatters';

const DEFAULT_CATEGORIES = [
  'Housing & Rent',
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Others',
];

const BudgetModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentMonth = new Date().getMonth() + 1,
  currentYear = new Date().getFullYear(),
  existingBudget = null,
}) => {
  const { currency } = useAuth();
  const [totalBudget, setTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingBudget) {
      setTotalBudget(existingBudget.totalBudget || '');
      setCategoryBudgets(
        existingBudget.categoryBudgets && existingBudget.categoryBudgets.length > 0
          ? existingBudget.categoryBudgets.map((cb) => ({
              category: cb.category,
              amount: cb.amount,
            }))
          : DEFAULT_CATEGORIES.slice(0, 5).map((cat) => ({
              category: cat,
              amount: '',
            }))
      );
    } else {
      setTotalBudget('');
      setCategoryBudgets(
        DEFAULT_CATEGORIES.slice(0, 5).map((cat) => ({
          category: cat,
          amount: '',
        }))
      );
    }
    setError('');
  }, [existingBudget, isOpen]);

  if (!isOpen) return null;

  const handleCategoryAmountChange = (index, value) => {
    setCategoryBudgets((prev) => {
      const updated = [...prev];
      updated[index].amount = value;
      return updated;
    });
  };

  const handleCategoryNameChange = (index, value) => {
    setCategoryBudgets((prev) => {
      const updated = [...prev];
      updated[index].category = value;
      return updated;
    });
  };

  const addCategoryRow = () => {
    const existing = categoryBudgets.map((c) => c.category);
    const nextAvailable = DEFAULT_CATEGORIES.find((c) => !existing.includes(c)) || 'Others';
    setCategoryBudgets((prev) => [...prev, { category: nextAvailable, amount: '' }]);
  };

  const removeCategoryRow = (index) => {
    setCategoryBudgets((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateCategorySum = () => {
    return categoryBudgets.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!totalBudget || Number(totalBudget) < 0) {
      return setError('Please provide a valid total budget amount.');
    }

    try {
      setLoading(true);
      const sanitizedCategories = categoryBudgets
        .filter((cb) => cb.category && Number(cb.amount) > 0)
        .map((cb) => ({
          category: cb.category,
          amount: Number(cb.amount),
        }));

      await budgetService.setBudget({
        month: currentMonth,
        year: currentYear,
        totalBudget: Number(totalBudget),
        categoryBudgets: sanitizedCategories,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget settings.');
    } finally {
      setLoading(false);
    }
  };

  const categorySum = calculateCategorySum();
  const totalBudgetNum = Number(totalBudget) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-indigo-500" />
              Configure Monthly Budget
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set monthly spending targets and category-specific allowances
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Overall Monthly Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Overall Monthly Budget Limit ({CURRENCY_SYMBOLS[currency] || '₹'}) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                {CURRENCY_SYMBOLS[currency] || '₹'}
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              You will receive automatic alerts when spending approaches 80% or breaches 100%.
            </p>
          </div>

          {/* Category Budgets */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category-Wise Budget Limits (Optional)
              </label>
              <button
                type="button"
                onClick={addCategoryRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {categoryBudgets.map((cb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={cb.category}
                    onChange={(e) => handleCategoryNameChange(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <div className="relative w-36">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                      {CURRENCY_SYMBOLS[currency] || '₹'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={cb.amount}
                      onChange={(e) => handleCategoryAmountChange(idx, e.target.value)}
                      placeholder="Amount"
                      className="w-full pl-7 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCategoryRow(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Sum check */}
            <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Total Allocated Across Categories:
              </span>
              <span
                className={`font-bold ${
                  totalBudgetNum > 0 && categorySum > totalBudgetNum
                    ? 'text-rose-500'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {CURRENCY_SYMBOLS[currency] || '₹'}
                {categorySum.toLocaleString()} / {CURRENCY_SYMBOLS[currency] || '₹'}
                {totalBudgetNum.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
