'use client';

import React, { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '@/data/categories';
import { TransactionType, PaymentMethod } from '@/types';
import { 
  X, 
  Plus, 
  Minus, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  FileText, 
  CreditCard,
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

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
}

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

const EXPENSE_NOTES = [
  'চা ও বিস্কুট',
  'সকালের নাস্তা',
  'দুপুরের খাবার',
  'রিকশা ভাড়া',
  'বাস ভাড়া',
  'কাঁচাবাজার সদাই',
  'মোবাইল রিচার্জ',
  'ওষুধ ক্রয়',
  'বাসা ভাড়া',
  'ইন্টারনেট বিল',
];

const INCOME_NOTES = [
  'অফিসের বেতন',
  'ব্যবসার ক্যাশ বিক্রি',
  'ফ্রিল্যান্সিং পেমেন্ট',
  'টিউশনির ফি',
  'পুরনো ধার ফেরত',
  'উপহারের টাকা',
];

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  initialType = 'expense',
}) => {
  const { addTransaction } = useTransactions();
  
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categoryBn, setCategoryBn] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setIsSuccess(false);
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      // Auto select default category for type
      const defaultCat = DEFAULT_CATEGORIES.find((c) => c.type === initialType);
      if (defaultCat) {
        setCategory(defaultCat.id);
        setCategoryBn(defaultCat.nameBn);
      }
    }
  }, [isOpen, initialType]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const defaultCat = DEFAULT_CATEGORIES.find((c) => c.type === newType);
    if (defaultCat) {
      setCategory(defaultCat.id);
      setCategoryBn(defaultCat.nameBn);
    }
  };

  const handleCategorySelect = (catId: string, catNameBn: string) => {
    setCategory(catId);
    setCategoryBn(catNameBn);
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = Number(amount) || 0;
    setAmount((current + addValue).toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('সঠিক টাকার পরিমাণ দিন');
      return;
    }

    const selectedCat = DEFAULT_CATEGORIES.find((c) => c.id === category);

    addTransaction({
      type,
      amount: numAmount,
      category: category || (type === 'income' ? 'other_income' : 'other_expense'),
      categoryBn: categoryBn || selectedCat?.nameBn || (type === 'income' ? 'অন্যান্য আয়' : 'অন্যান্য খরচ'),
      description: description.trim() || (type === 'income' ? 'দৈনিক আয়' : 'দৈনিক খরচ'),
      paymentMethod,
      date,
      time,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAmount('');
      setDescription('');
      onClose();
    }, 700);
  };

  if (!isOpen) return null;

  const currentCategories = DEFAULT_CATEGORIES.filter((c) => c.type === type);
  const noteSuggestions = type === 'expense' ? EXPENSE_NOTES : INCOME_NOTES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header with Type Switcher */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              দৈনিক হিসাব যোগ করুন
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Income / Expense Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Minus className="w-4 h-4" />
              খরচ / ব্যয় (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Plus className="w-4 h-4" />
              আয় / জমা (Income)
            </button>
          </div>

          {/* Amount Input with Currency */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>টাকার পরিমাণ (Amount)</span>
              <span className="text-slate-400">টাকা লিখুন</span>
            </label>
            <div className="relative flex items-center">
              <span className={`absolute left-4 text-2xl font-black ${type === 'expense' ? 'text-rose-500' : 'text-emerald-500'}`}>
                ৳
              </span>
              <input
                type="number"
                step="any"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 text-3xl font-extrabold rounded-2xl border-2 transition outline-hidden ${
                  type === 'expense'
                    ? 'border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-900'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-emerald-900'
                }`}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[50, 100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
                >
                  +৳{val}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                >
                  মুছুন
                </button>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              খাত নির্বাচন করুন (Category)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {currentCategories.map((cat) => {
                const IconComponent = ICON_MAP[cat.icon] || Tag;
                const isSelected = category === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id, cat.nameBn)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                      isSelected
                        ? type === 'expense'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20 font-bold'
                          : 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? type === 'expense'
                            ? 'bg-rose-600 text-white'
                            : 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="truncate">{cat.nameBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description & Quick Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              বিবরণ / নোট (Description)
            </label>
            <input
              type="text"
              placeholder="যেমন: দুপুরের খাবার, রিকশা ভাড়া, ডিম ও চাল..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-slate-400 focus:outline-hidden"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {noteSuggestions.slice(0, 6).map((note) => (
                <button
                  key={note}
                  type="button"
                  onClick={() => setDescription(note)}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              পেমেন্ট মাধ্যম (Payment Method)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition ${
                    paymentMethod === pm.id
                      ? 'border-slate-800 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                তারিখ (Date)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                সময় (Time)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSuccess || !amount}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition flex items-center gap-2 ${
              isSuccess
                ? 'bg-emerald-600'
                : type === 'expense'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
            } ${!amount ? 'opacity-60 cursor-not-allowed' : 'active:scale-95'}`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                সংরক্ষণ হয়েছে!
              </>
            ) : (
              <span>হিসাব যোগ করুন</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
