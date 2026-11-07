'use client';

import React from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar, 
  PiggyBank,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { stats } = useTransactions();
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('bn-BD');
  };

  const todayBalance = stats.todayIncome - stats.todayExpense;
  const isTodayPositive = todayBalance >= 0;

  return (
    <div className="space-y-4">
      {/* 3 Main Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-xl shadow-slate-900/10">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              মোট ব্যালেন্স (Current Balance)
            </span>
            <PiggyBank className="w-5 h-5 text-emerald-400 opacity-80" />
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400">৳</span>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {formatMoney(stats.balance)}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              সব আয় ও খরচ বাদ দিয়ে বর্তমান জমা টাকা
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <span>এই মাসের জমা: ৳{formatMoney(stats.monthIncome - stats.monthExpense)}</span>
            <span className="text-emerald-400 font-semibold">হিসাব আপডেট</span>
          </div>
        </div>

        {/* Total & Today Income Card */}
        <div className="rounded-2xl bg-white border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                মোট আয় (Total Income)
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                +
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-600">৳</span>
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatMoney(stats.totalIncome)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                আজকের আয়:
              </span>
              <span className="font-bold text-emerald-600">
                + ৳{formatMoney(stats.todayIncome)}
              </span>
            </div>
          </div>
        </div>

        {/* Total & Today Expense Card */}
        <div className="rounded-2xl bg-white border border-rose-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                মোট খরচ (Total Expense)
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                -
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-rose-600">৳</span>
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatMoney(stats.totalExpense)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                আজকের মোট খরচ:
              </span>
              <span className="font-bold text-rose-600">
                - ৳{formatMoney(stats.todayExpense)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Banner Bar */}
      <div className={`rounded-xl p-3.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm border transition ${
        isTodayPositive 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
          : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          {isTodayPositive ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="font-medium">
            আজকের পরিস্থিতি: 
            {stats.todayIncome === 0 && stats.todayExpense === 0 ? (
              <span className="ml-1 text-slate-600">আজকে এখনো কোনো নতুন লেনদেন যোগ করেননি।</span>
            ) : isTodayPositive ? (
              <span className="ml-1 font-semibold text-emerald-700">
                আজকের আয়ের তুলনায় খরচ নিয়ন্ত্রণে আছে! আজকের নীট জমা ৳{formatMoney(todayBalance)}
              </span>
            ) : (
              <span className="ml-1 font-semibold text-amber-800">
                আজকে আয়ের চেয়ে খরচ ৳{formatMoney(Math.abs(todayBalance))} বেশি হয়েছে।
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
            আজকের আয়: ৳{formatMoney(stats.todayIncome)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
            আজকের ব্যয়: ৳{formatMoney(stats.todayExpense)}
          </span>
        </div>
      </div>
    </div>
  );
};
