import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  PieChart,
  BellRing,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  Wallet,
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                SMART EXPENSE ANALYZER
              </span>
              <span className="text-[10px] uppercase font-semibold text-purple-400 tracking-widest block">
                Capstone CSE Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Intermediate-Level CSE Capstone Project &bull; MERN Stack</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Take Smart Control of Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personal Spending & Budgets
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, beginner-friendly financial management system with rule-based spending analysis, unusual transaction anomaly detection, and automated budget threshold alerts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-base transition-all"
            >
              <span>Demo Quick Sign In</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-slate-400">Pure MERN Stack</p>
            </div>
            <div>
              <p className="text-2xl font-black text-purple-400">80% &amp; 100%</p>
              <p className="text-xs text-slate-400">Budget Threshold Alerts</p>
            </div>
            <div>
              <p className="text-2xl font-black text-indigo-400">Rule-Based</p>
              <p className="text-xs text-slate-400">Smart Spend Analyzer</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">CSV Export</p>
              <p className="text-xs text-slate-400">Weekly/Monthly Reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Engineered with Core Capstone Modules
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Clean architecture, modular controllers, and practical algorithms designed for academic presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Spend Analysis</h3>
              <p className="text-sm text-slate-400">
                Calculates daily spending velocity, flags unusual spending spikes using average-based thresholds, and forecasts next month's obligations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Budget Guard System</h3>
              <p className="text-sm text-slate-400">
                Set overall and category limits. Visual meters give early 80% amber warnings and 100% over-budget alerts to prevent overspending.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive Visualizations</h3>
              <p className="text-sm text-slate-400">
                Dynamic Recharts graphs including monthly cash flow comparison, category distribution pie charts, and weekly spending breakdowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Income &amp; Expense Hub</h3>
              <p className="text-sm text-slate-400">
                Multi-category management, payment method tracking (UPI, Cards, Cash), search filters, and automatic available balance tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">One-Click CSV Export</h3>
              <p className="text-sm text-slate-400">
                Download structured expense reports in standard CSV format for audits, Excel manipulation, or submission.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">JWT Security &amp; Isolation</h3>
              <p className="text-sm text-slate-400">
                Bcrypt password hashing, secure JWT authentication tokens, and strict user data isolation so each user only sees their own finances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400">
          Smart Expense Analyzer &bull; Personal Finance Tracking and Smart Spending Analysis System
        </p>
        <p className="mt-1">
          Designed for B.Tech Computer Science &amp; Engineering Capstone Project
        </p>
      </footer>
    </div>
  );
};

export default Landing;
