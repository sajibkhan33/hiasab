'use client';

import React, { useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { DEFAULT_CATEGORIES } from '@/data/categories';
import { PieChart, TrendingDown, ArrowRight } from 'lucide-react';

export const CategoryBreakdown: React.FC = () => {
  const { filteredTransactions } = useTransactions();

  // Aggregate expenses by category
  const breakdown = useMemo(() => {
    const expenseTx = filteredTransactions.filter((tx) => tx.type === 'expense');
    const totalExp = expenseTx.reduce((sum, tx) => sum + tx.amount, 0);

    const map: Record<string, { amount: number; nameBn: string; count: number }> = {};

    for (const tx of expenseTx) {
      const catKey = tx.category;
      if (!map[catKey]) {
        const found = DEFAULT_CATEGORIES.find((c) => c.id === catKey);
        map[catKey] = {
          amount: 0,
          nameBn: tx.categoryBn || found?.nameBn || catKey,
          count: 0,
        };
      }
      map[catKey].amount += tx.amount;
      map[catKey].count += 1;
    }

    const items = Object.entries(map).map(([id, val]) => ({
      id,
      nameBn: val.nameBn,
      amount: val.amount,
      count: val.count,
      percentage: totalExp > 0 ? Math.round((val.amount / totalExp) * 100) : 0,
    }));

    // Sort descending by amount
    items.sort((a, b) => b.amount - a.amount);
    return { items, totalExp };
  }, [filteredTransactions]);

  const COLORS = [
    'bg-rose-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-slate-500',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              কোথায় কত খরচ হয়েছে?
            </h4>
            <p className="text-[11px] text-slate-500">খাতভিত্তিক ব্যয়ের অনুপাত</p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-600 px-2.5 py-1 bg-rose-50 rounded-full">
          মোট: ৳{breakdown.totalExp.toLocaleString('bn-BD')}
        </span>
      </div>

      {breakdown.items.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          বর্তমান ফিল্টারে কোনো ব্যয়ের রেকর্ড নেই
        </div>
      ) : (
        <div className="space-y-3.5">
          {breakdown.items.slice(0, 5).map((item, idx) => {
            const colorClass = COLORS[idx % COLORS.length];

            return (
              <div key={item.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                    <span className="truncate">{item.nameBn}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.count} বার)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      ৳{item.amount.toLocaleString('bn-BD')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${Math.max(item.percentage, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
