export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'bank' | 'rocket' | 'other';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  categoryName?: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
}

export interface FilterOptions {
  period: 'today' | 'yesterday' | 'this_week' | 'this_month' | 'all' | 'custom';
  type: 'all' | 'income' | 'expense';
  category: string;
  search: string;
  startDate?: string;
  endDate?: string;
}
