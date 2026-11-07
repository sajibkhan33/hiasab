'use client';

import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '@/data/categories';
import { Transaction } from '@/types';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  RotateCcw,
  PlusCircle,
  Tag,
  Utensils,
  ShoppingBag,
  Car,
  Coffee,
  Smartphone,
  Home,
  HeartPulse,
  Shirt,
  Users,
  MoreHorizontal,
  Briefcase,
  Store,
  Laptop,
  GraduationCap,
  Gift,
  Coins
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  ShoppingBag,
  Car,
  Coffee,
  Smartphone,
  Home,
  HeartPulse,
  Shirt,
  Users,
  MoreHorizontal,
  Briefcase,
  Store,
  Laptop,
  GraduationCap,
  Gift,
  Coins,
};

interface TransactionListProps {
  onOpenQuickAdd: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onOpenQuickAdd,
  onEditTransaction,
}) => {
  const {
    filteredTransactions,
    filterOptions,
    setFilterOptions,
    deleteTransaction,
    exportToCSV,
    resetToSampleData,
    currentDate,
  } = useTransactions();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getCategoryIcon = (categoryId: string) => {
    const cat = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return Tag;
    return ICON_MAP[cat.icon] || Tag;
  };

  const getPaymentLabel = (method: string) => {
    const found = PAYMENT_METHODS.find((p) => p.id === method);
    return found ? found.label : method;
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('en-US');
  };

  const formatDateLabel = (dateStr: string) => {
    if (!currentDate) return dateStr;
    if (dateStr === currentDate) return 'Today';
    const y = new Date(currentDate);
    y.setDate(y.getDate() - 1);
    const yesterdayStr = y.toISOString().split('T')[0];
    if (dateStr === yesterdayStr) return 'Yesterday';
    return dateStr;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Transaction History
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {filteredTransactions.length} records
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Detailed view of all daily incomes & expenses</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Download CSV / Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={resetToSampleData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Reload sample transactions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>

        {/* Filter Period Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'this_week', label: 'Last 7 Days' },
            { id: 'this_month', label: 'This Month' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setFilterOptions((prev) => ({
                  ...prev,
                  period: tab.id as any,
                }))
              }
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition ${
                filterOptions.period === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Type & Category Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by note, category, or amount..."
              value={filterOptions.search}
              onChange={(e) =>
                setFilterOptions((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:outline-hidden transition"
            />
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-4 flex rounded-xl border border-slate-200 bg-slate-50/50 p-1 text-xs font-semibold">
            <button
              onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'all' }))}
              className={`flex-1 py-1 rounded-lg text-center transition ${
                filterOptions.type === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'income' }))}
              className={`flex-1 py-1 rounded-lg text-center transition ${
                filterOptions.type === 'income'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'expense' }))}
              className={`flex-1 py-1 rounded-lg text-center transition ${
                filterOptions.type === 'expense'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={filterOptions.category}
              onChange={(e) =>
                setFilterOptions((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="all">All Categories</option>
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.type === 'income' ? '🟢' : '🔴'} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Filter className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Transactions Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No transactions match your current filters. Add a new record using the button below.
            </p>
            <button
              onClick={onOpenQuickAdd}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/80 transition group"
              >
                {/* Left side: Icon & Title & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isIncome
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-slate-900 truncate">
                        {tx.description || tx.categoryName || tx.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {tx.categoryName || tx.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateLabel(tx.date)}
                      </span>
                      {tx.time && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {tx.time}
                        </span>
                      )}
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] text-slate-500 font-medium">
                        {getPaymentLabel(tx.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Amount & Quick Actions */}
                <div className="flex items-center gap-3 shrink-0 pl-2">
                  <div className="text-right">
                    <div
                      className={`text-base sm:text-lg font-black tracking-tight flex items-center justify-end gap-0.5 ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      <span>{isIncome ? '+' : '-'}</span>
                      <span>$</span>
                      <span>{formatMoney(tx.amount)}</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      {isIncome ? 'Credit / Income' : 'Debit / Expense'}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      title="Edit transaction"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === tx.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="px-2 py-0.5 text-[11px] font-bold text-white bg-rose-600 rounded hover:bg-rose-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(tx.id)}
                        title="Delete record"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
