import { Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense Categories
  {
    id: 'food',
    name: 'Food & Meals',
    type: 'expense',
    icon: 'Utensils',
    color: 'bg-amber-500 text-amber-500',
  },
  {
    id: 'grocery',
    name: 'Groceries & Market',
    type: 'expense',
    icon: 'ShoppingBag',
    color: 'bg-emerald-500 text-emerald-500',
  },
  {
    id: 'transport',
    name: 'Transport & Commute',
    type: 'expense',
    icon: 'Car',
    color: 'bg-blue-500 text-blue-500',
  },
  {
    id: 'coffee',
    name: 'Snacks & Coffee',
    type: 'expense',
    icon: 'Coffee',
    color: 'bg-orange-500 text-orange-500',
  },
  {
    id: 'recharge',
    name: 'Mobile & Internet',
    type: 'expense',
    icon: 'Smartphone',
    color: 'bg-purple-500 text-purple-500',
  },
  {
    id: 'rent_bills',
    name: 'House Rent & Utilities',
    type: 'expense',
    icon: 'Home',
    color: 'bg-rose-500 text-rose-500',
  },
  {
    id: 'medical',
    name: 'Healthcare & Medicine',
    type: 'expense',
    icon: 'HeartPulse',
    color: 'bg-red-500 text-red-500',
  },
  {
    id: 'shopping',
    name: 'Shopping & Clothes',
    type: 'expense',
    icon: 'Shirt',
    color: 'bg-indigo-500 text-indigo-500',
  },
  {
    id: 'family',
    name: 'Family & Children',
    type: 'expense',
    icon: 'Users',
    color: 'bg-pink-500 text-pink-500',
  },
  {
    id: 'other_expense',
    name: 'Other Expense',
    type: 'expense',
    icon: 'MoreHorizontal',
    color: 'bg-slate-500 text-slate-500',
  },

  // Income Categories
  {
    id: 'salary',
    name: 'Monthly Salary',
    type: 'income',
    icon: 'Briefcase',
    color: 'bg-green-600 text-green-600',
  },
  {
    id: 'business',
    name: 'Business & Sales',
    type: 'income',
    icon: 'Store',
    color: 'bg-teal-600 text-teal-600',
  },
  {
    id: 'freelance',
    name: 'Freelancing & Projects',
    type: 'income',
    icon: 'Laptop',
    color: 'bg-cyan-600 text-cyan-600',
  },
  {
    id: 'tuition',
    name: 'Tuition & Consulting',
    type: 'income',
    icon: 'GraduationCap',
    color: 'bg-violet-600 text-violet-600',
  },
  {
    id: 'gift',
    name: 'Bonus & Gifts',
    type: 'income',
    icon: 'Gift',
    color: 'bg-yellow-500 text-yellow-500',
  },
  {
    id: 'other_income',
    name: 'Other Income',
    type: 'income',
    icon: 'Coins',
    color: 'bg-emerald-600 text-emerald-600',
  },
];

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: 'Banknote', color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'bkash', label: 'bKash', icon: 'Smartphone', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'nagad', label: 'Nagad', icon: 'Flame', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'bank', label: 'Bank Account', icon: 'Landmark', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'rocket', label: 'Rocket', icon: 'Rocket', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: 'other', label: 'Card / Other', icon: 'CreditCard', color: 'bg-gray-100 text-gray-700 border-gray-300' },
];

export const QUICK_EXPENSE_PRESETS = [
  { label: 'Tea & Snacks', category: 'coffee', amount: 30 },
  { label: 'Lunch Meal', category: 'food', amount: 150 },
  { label: 'Commute Fare', category: 'transport', amount: 60 },
  { label: 'Daily Groceries', category: 'grocery', amount: 650 },
  { label: 'Mobile Recharge', category: 'recharge', amount: 100 },
];
