'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TransactionProvider, useTransactions } from '@/context/TransactionContext';
import { Navbar } from '@/components/Navbar';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionList } from '@/components/TransactionList';
import { QuickAddModal } from '@/components/QuickAddModal';
import { EditTransactionModal } from '@/components/EditTransactionModal';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { LoginPage } from '@/components/LoginPage';
import { QUICK_EXPENSE_PRESETS } from '@/data/categories';
import { Transaction, TransactionType } from '@/types';
import { 
  Zap, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addTransaction } = useTransactions();

  const [mounted, setMounted] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm font-semibold">দৈনিক হিসাব লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenQuickAdd = (type: TransactionType = 'expense') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const handleQuickPreset = (preset: typeof QUICK_EXPENSE_PRESETS[0]) => {
    addTransaction({
      type: 'expense',
      amount: preset.amount,
      category: preset.category,
      categoryBn: preset.label,
      description: preset.label,
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onOpenQuickAdd={handleOpenQuickAdd} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              স্বাগতম, {user?.name || 'ব্যবহারকারী'}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              আজকে কোথায় কত টাকা খরচ বা আয় হয়েছে, এক ক্লিকেই সহজে নোট করুন।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleOpenQuickAdd('income')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>+ আয় লিখুন</span>
            </button>
            <button
              onClick={() => handleOpenQuickAdd('expense')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
            >
              <ArrowDownLeft className="w-4 h-4 text-rose-600" />
              <span>- খরচ লিখুন</span>
            </button>
          </div>
        </div>

        {/* 1-Tap Quick Daily Presets */}
        <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 p-4 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 shrink-0">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>১-ক্লিকে নিয়মিত খরচ যোগ করুন:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {QUICK_EXPENSE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleQuickPreset(preset)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-700 transition shadow-2xs active:scale-95 flex items-center gap-1.5"
                title={`${preset.label} খরচ যোগ করুন`}
              >
                <span>{preset.label}</span>
                <span className="font-bold text-rose-600">৳{preset.amount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Main Grid: Transactions & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Transaction List (Left 8 cols) */}
          <div className="lg:col-span-8">
            <TransactionList
              onOpenQuickAdd={() => handleOpenQuickAdd('expense')}
              onEditTransaction={(tx) => setEditingTransaction(tx)}
            />
          </div>

          {/* Right Sidebar (4 cols): Breakdown & Tips */}
          <div className="lg:col-span-4 space-y-6">
            <CategoryBreakdown />

            {/* Smart Daily Money Tips */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-100">দৈনিক হিসাব রাখার টিপস</h4>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>প্রতিটি ছোট খরচ (যেমন: চা, রিকশাভাড়া) সাথে সাথে লিখে রাখলে মাসের শেষে হিসাবের গরমিল হয় না।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>বিকাশ বা নগদে খরচ করলে পেমেন্ট মাধ্যম সিলেক্ট করুন, এতে ব্যাংক ও ক্যাশের ব্যালেন্স আলাদা জানা যাবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>প্রতি মাসের শুরুতে বেতন বা মূল আয় যোগ করে নিলে সারা মাসের বাজেট পরিকল্পনা সহজ হয়।</span>
                </li>
              </ul>
            </div>

            {/* Local Storage Privacy Badge */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>আপনার ডেটা সম্পূর্ণ নিরাপদ</span>
              </div>
              <p className="text-[11px] text-slate-400">
                সব তথ্য আপনার ব্রাউজার ও ডিভাইসে সংরক্ষিত থাকে।
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">দৈনিক হিসাব (Doinik Hisab)</p>
        <p className="mt-0.5 text-slate-400">সহজ, দ্রুত ও নির্ভরযোগ্য দৈনিক আয়-ব্যয় ট্র্যাকার</p>
      </footer>

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        initialType={quickAddType}
      />

      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Dashboard />
      </TransactionProvider>
    </AuthProvider>
  );
}
