'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Wallet, LogOut, Plus, UserCircle2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenQuickAdd: (defaultType?: 'income' | 'expense') => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAdd, onOpenLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  Daily Tracker
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Daily Income & Expense Manager</p>
            </div>
          </div>

          {/* Action buttons & user profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                {/* Fast Action Buttons */}
                <button
                  onClick={() => onOpenQuickAdd('income')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                  title="Add Income"
                >
                  <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                  + Income
                </button>

                <button
                  onClick={() => onOpenQuickAdd('expense')}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                  title="Add Expense"
                >
                  <ArrowDownCircle className="w-4 h-4 text-rose-600" />
                  - Expense
                </button>

                <button
                  onClick={() => onOpenQuickAdd()}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-600/30 transition transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Record</span>
                </button>

                {/* User Info & Logout */}
                <div className="flex items-center pl-2 border-l border-slate-200 gap-2">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 leading-none">
                      {user?.name || 'Eng: Sajib Khan'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {user?.email || 'sajib3323khan@gmail.com'}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>

                  <button
                    onClick={logout}
                    title="Log out"
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
