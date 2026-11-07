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
      categoryBn: 'মাসিক বেতন',
      description: 'অফিসের মাসিক বেতন জমা হয়েছে',
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
      categoryBn: 'বাজার সদাই ও মুদি',
      description: 'চাল, ডাল, তেল ও ডিম ক্রয়',
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
      categoryBn: 'যাতায়াত ও গাড়ি ভাড়া',
      description: 'রিকশা ভাড়া অফিসে যাওয়ার সময়',
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
      categoryBn: 'খাবার ও নাস্তা',
      description: 'দুপুরের খাবার ও সালাদ',
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
      categoryBn: 'ফ্রিল্যান্সিং ও কাজ',
      description: 'একটি ওয়েব ডিজাইন প্রজেক্টের পেমেন্ট',
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
      category: 'tea',
      categoryBn: 'চা-নাস্তা ও আড্ডা',
      description: 'বিকালের স্পেশাল চা ও বিস্কুট',
      paymentMethod: 'cash',
      date: dToday,
      time: '17:20',
      createdAt: Date.now() - 1800000,
    },
  ];
};
