import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Calendar,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import Layout from '../components/Layout';
import IncomeModal from '../components/IncomeModal';
import StatCard from '../components/StatCard';
import { incomeService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';

const INCOME_CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Part-time',
  'Allowance',
  'Gifts',
  'Other',
];

const IncomeManagement = () => {
  const { currency } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalAllTimeIncome, setTotalAllTimeIncome] = useState(0);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        limit: 100,
      };

      const res = await incomeService.getAll(params);
      if (res.data.success) {
        setIncomes(res.data.incomes || []);
        setTotalAllTimeIncome(res.data.totalAllTimeIncome || 0);
      }
    } catch (err) {
      console.error('Error fetching income:', err);
      setError('Failed to load income records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchIncomes();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, category]);

  const handleEdit = (income) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await incomeService.delete(id);
      setDeleteConfirmId(null);
      fetchIncomes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete income.');
    } finally {
      setDeleting(false);
    }
  };

  // Compute current month income
  const now = new Date();
  const currentMonthIncomes = incomes.filter((item) => {
    const d = new Date(item.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const currentMonthTotal = currentMonthIncomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Layout pageTitle="Income Management">
      {/* Top Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-3xl border border-emerald-900/40 shadow-md">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Income Streams &amp; Inflows</h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Track salaries, client retainers, dividends, and other incoming revenue
          </p>
        </div>

        <button
          onClick={() => {
            setEditingIncome(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Income</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="All-Time Total Inflow"
          amount={totalAllTimeIncome}
          currency={currency}
          icon={Wallet}
          color="emerald"
          subtitle="Cumulative earnings recorded"
        />

        <StatCard
          title="Current Month Income"
          amount={currentMonthTotal}
          currency={currency}
          icon={TrendingUp}
          color="indigo"
          subtitle={`Earnings for ${now.toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        />

        <StatCard
          title="Active Income Records"
          amount={incomes.length}
          currency={currency}
          icon={ArrowUpRight}
          color="purple"
          subtitle="Total verified deposits"
          badgeText="Verified"
          badgeType="positive"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute inset-y-0 left-3 my-auto pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search income title, notes..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Sources' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Income Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
            <p className="text-xs text-slate-400">Loading income ledger...</p>
          </div>
        ) : incomes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No income entries match your search criteria.
            </p>
            <button
              onClick={() => {
                setEditingIncome(null);
                setModalOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record your first income deposit</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Income Source</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {incomes.map((inc) => (
                  <tr
                    key={inc._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {inc.title}
                      </p>
                      {inc.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {inc.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${getCategoryColor(inc.category)}18`,
                          color: getCategoryColor(inc.category),
                        }}
                      >
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {formatDate(inc.date)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {inc.paymentMethod || 'Bank Transfer'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      +{formatCurrency(inc.amount, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(inc)}
                          title="Edit income"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(inc._id)}
                          title="Delete income"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Income Record?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              Are you sure you want to remove this income deposit? This will recalculate your net balance.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Income Modal */}
      <IncomeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIncome(null);
        }}
        onSuccess={fetchIncomes}
        initialData={editingIncome}
      />
    </Layout>
  );
};

export default IncomeManagement;
