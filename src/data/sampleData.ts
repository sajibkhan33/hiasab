import { Transaction } from '@/types';

export const getSampleTransactions = (userId: string): Transaction[] => {
  const today = new Date();
  const format = (d: Date) => d.toISOString().split('T')[0];
  
  const dToday = format(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dYesterday = format(yesterday);
  
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const dThreeDaysAgo = format(threeDaysAgo);

  return [
    {
      id: 'tx-1',
      userId,
      type: 'income',
      amount: 45000,
      category: 'salary',
      categoryName: 'Monthly Salary',
      description: 'Monthly office salary credited',
      paymentMethod: 'bank',
      date: dThreeDaysAgo,
      time: '10:00',
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: 'tx-2',
      userId,
      type: 'expense',
      amount: 1200,
      category: 'grocery',
      categoryName: 'Groceries & Market',
      description: 'Rice, oil, eggs, and vegetables',
      paymentMethod: 'cash',
      date: dYesterday,
      time: '08:30',
      createdAt: Date.now() - 86400000 + 1000,
    },
    {
      id: 'tx-3',
      userId,
      type: 'expense',
      amount: 60,
      category: 'transport',
      categoryName: 'Transport & Commute',
      description: 'Commute to office',
      paymentMethod: 'cash',
      date: dToday,
      time: '09:15',
      createdAt: Date.now() - 15000000,
    },
    {
      id: 'tx-4',
      userId,
      type: 'expense',
      amount: 180,
      category: 'food',
      categoryName: 'Food & Meals',
      description: 'Lunch meal & water',
      paymentMethod: 'bkash',
      date: dToday,
      time: '13:30',
      createdAt: Date.now() - 7200000,
    },
    {
      id: 'tx-5',
      userId,
      type: 'income',
      amount: 3500,
      category: 'freelance',
      categoryName: 'Freelancing & Projects',
      description: 'Web development freelance project milestone',
      paymentMethod: 'nagad',
      date: dToday,
      time: '15:45',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'tx-6',
      userId,
      type: 'expense',
      amount: 40,
      category: 'coffee',
      categoryName: 'Snacks & Coffee',
      description: 'Afternoon coffee & cookies',
      paymentMethod: 'cash',
      date: dToday,
      time: '17:20',
      createdAt: Date.now() - 1800000,
    },
  ];
};
