'use client';

import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '@/data/categories';
import { Transaction, TransactionType, PaymentMethod } from '@/types';
import { X, Check } from 'lucide-react';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { updateTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryBn, setCategoryBn] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setCategoryBn(transaction.categoryBn || '');
      setDescription(transaction.description || '');
      setPaymentMethod(transaction.paymentMethod || 'cash');
      setDate(transaction.date);
      setTime(transaction.time || '');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const currentCategories = DEFAULT_CATEGORIES.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('সঠিক টাকার পরিমাণ দিন');
      return;
    }

    const selectedCat = DEFAULT_CATEGORIES.find((c) => c.id === category);

    updateTransaction(transaction.id, {
      type,
      amount: numAmount,
      category,
      categoryBn: categoryBn || selectedCat?.nameBn || category,
      description: description.trim(),
      paymentMethod,
      date,
      time,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">হিসাব পরিবর্তন বা সংশোধন</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const defaultCat = DEFAULT_CATEGORIES.find((c) => c.type === 'expense');
                if (defaultCat) {
                  setCategory(defaultCat.id);
                  setCategoryBn(defaultCat.nameBn);
                }
              }}
              className={`py-2 rounded-lg transition ${
                type === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              খরচ (Expense)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                const defaultCat = DEFAULT_CATEGORIES.find((c) => c.type === 'income');
                if (defaultCat) {
                  setCategory(defaultCat.id);
                  setCategoryBn(defaultCat.nameBn);
                }
              }}
              className={`py-2 rounded-lg transition ${
                type === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              আয় (Income)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">টাকার পরিমাণ (৳)</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xl font-bold focus:outline-hidden"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">খাত (Category)</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const found = DEFAULT_CATEGORIES.find((c) => c.id === e.target.value);
                if (found) setCategoryBn(found.nameBn);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
            >
              {currentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameBn}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">বিবরণ / নোট</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">পেমেন্ট মাধ্যম</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">তারিখ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">সময়</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition"
            >
              আপডেট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
