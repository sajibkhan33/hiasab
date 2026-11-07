'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Transaction, FilterOptions } from '@/types';
import { getSampleTransactions } from '@/data/sampleData';
import { useAuth } from './AuthContext';

interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  todayIncome: number;
  todayExpense: number;
  monthIncome: number;
  monthExpense: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  stats: TransactionStats;
  currentDate: string;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id' | 'userId'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  resetToSampleData: () => void;
  clearAllTransactions: () => void;
  exportToCSV: () => void;
}

const defaultFilters: FilterOptions = {
  period: 'all',
  type: 'all',
  category: 'all',
  search: '',
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  const storageKey = useMemo(() => {
    return user ? `daily_hisab_tx_${user.id}` : 'daily_hisab_tx_guest';
  }, [user]);

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Fetch transactions from MongoDB Atlas API, with localStorage fallback
  const fetchTransactions = useCallback(async () => {
    const userId = user?.id || 'guest';
    let localData: Transaction[] = [];

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        localData = JSON.parse(saved);
        setTransactions(localData);
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }

    try {
      const res = await fetch(`/api/transactions?userId=${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        if (data.transactions.length > 0) {
          setTransactions(data.transactions);
          localStorage.setItem(storageKey, JSON.stringify(data.transactions));
        } else if (localData.length === 0) {
          const samples = getSampleTransactions(userId);
          setTransactions(samples);
          localStorage.setItem(storageKey, JSON.stringify(samples));
        }
      }
    } catch (err) {
      console.warn('Could not fetch from MongoDB, using local data', err);
      if (localData.length === 0) {
        const samples = getSampleTransactions(userId);
        setTransactions(samples);
        localStorage.setItem(storageKey, JSON.stringify(samples));
      }
    } finally {
      setIsLoaded(true);
    }
  }, [user?.id, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch (err) {
      console.error('Failed to sync to localStorage:', err);
    }
  }, [transactions, storageKey, isLoaded]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    const today = currentDate || new Date().toISOString().split('T')[0];
    const tempId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const userId = user?.id || 'guest';

    const optimisticTx: Transaction = {
      ...data,
      id: tempId,
      userId,
      date: data.date || today,
      createdAt: Date.now(),
      time: data.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setTransactions((prev) => [optimisticTx, ...prev]);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticTx),
      });
      const resData = await res.json();
      if (resData.success && resData.transaction) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === tempId ? resData.transaction : t))
        );
      }
    } catch (err) {
      console.warn('MongoDB sync failed, saved in local storage:', err);
    }
  };

  const updateTransaction = async (id: string, data: Partial<Omit<Transaction, 'id' | 'userId'>>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );

    try {
      await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
    } catch (err) {
      console.warn('MongoDB update sync failed:', err);
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    try {
      await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('MongoDB delete sync failed:', err);
    }
  };

  const resetToSampleData = () => {
    const samples = getSampleTransactions(user?.id || 'guest');
    setTransactions(samples);
  };

  const clearAllTransactions = () => {
    setTransactions([]);
  };

  const filteredTransactions = useMemo(() => {
    const todayStr = currentDate;
    const currentYearMonth = todayStr ? todayStr.substring(0, 7) : '';

    return transactions.filter((tx) => {
      if (filterOptions.type !== 'all' && tx.type !== filterOptions.type) {
        return false;
      }

      if (filterOptions.category && filterOptions.category !== 'all' && tx.category !== filterOptions.category) {
        return false;
      }

      if (filterOptions.search.trim()) {
        const query = filterOptions.search.toLowerCase().trim();
        const desc = (tx.description || '').toLowerCase();
        const catName = (tx.categoryName || '').toLowerCase();
        const cat = (tx.category || '').toLowerCase();
        const amt = tx.amount.toString();
        if (!desc.includes(query) && !catName.includes(query) && !cat.includes(query) && !amt.includes(query)) {
          return false;
        }
      }

      if (!todayStr) return true;

      if (filterOptions.period === 'today') {
        return tx.date === todayStr;
      } else if (filterOptions.period === 'yesterday') {
        const d = new Date(todayStr);
        d.setDate(d.getDate() - 1);
        const yStr = d.toISOString().split('T')[0];
        return tx.date === yStr;
      } else if (filterOptions.period === 'this_week') {
        const d = new Date(todayStr);
        d.setDate(d.getDate() - 6);
        const sevenDaysAgoStr = d.toISOString().split('T')[0];
        return tx.date >= sevenDaysAgoStr && tx.date <= todayStr;
      } else if (filterOptions.period === 'this_month') {
        return tx.date.startsWith(currentYearMonth);
      } else if (filterOptions.period === 'custom') {
        if (filterOptions.startDate && tx.date < filterOptions.startDate) return false;
        if (filterOptions.endDate && tx.date > filterOptions.endDate) return false;
        return true;
      }

      return true;
    });
  }, [transactions, filterOptions, currentDate]);

  const stats = useMemo(() => {
    const todayStr = currentDate;
    const currentYearMonth = todayStr ? todayStr.substring(0, 7) : '';

    let totalIncome = 0;
    let totalExpense = 0;
    let todayIncome = 0;
    let todayExpense = 0;
    let monthIncome = 0;
    let monthExpense = 0;

    for (const tx of transactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
        if (todayStr && tx.date === todayStr) {
          todayIncome += amt;
        }
        if (currentYearMonth && tx.date.startsWith(currentYearMonth)) {
          monthIncome += amt;
        }
      } else {
        totalExpense += amt;
        if (todayStr && tx.date === todayStr) {
          todayExpense += amt;
        }
        if (currentYearMonth && tx.date.startsWith(currentYearMonth)) {
          monthExpense += amt;
        }
      }
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      todayIncome,
      todayExpense,
      monthIncome,
      monthExpense,
    };
  }, [transactions, currentDate]);

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Date', 'Time', 'Type', 'Category', 'Description', 'Payment Method', 'Amount'];
    const rows = transactions.map((tx) => [
      tx.date,
      tx.time || '',
      tx.type === 'income' ? 'Income' : 'Expense',
      tx.categoryName || tx.category,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.paymentMethod,
      tx.amount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daily_Tracker_${currentDate || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        filteredTransactions,
        stats,
        currentDate,
        filterOptions,
        setFilterOptions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        resetToSampleData,
        clearAllTransactions,
        exportToCSV,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
