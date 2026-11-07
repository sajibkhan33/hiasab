'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Mail, 
  User as UserIcon,
  Zap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, register, guestLogin, isLoading } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name.trim()) {
        setError('অনুগ্রহ করে আপনার নাম লিখুন');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('সঠিক ইমেইল এড্রেস লিখুন');
        return;
      }
      try {
        await register(name, email, password);
      } catch (err) {
        setError('রেজিস্ট্রেশন করতে সমস্যা হয়েছে');
      }
    } else {
      if (!email.trim()) {
        setError('ইমেইল বা ইউজারনেম লিখুন');
        return;
      }
      try {
        await login(email, password);
      } catch (err) {
        setError('লগইন করতে সমস্যা হয়েছে');
      }
    }
  };

  const handleDemoLogin = () => {
    guestLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/30 mb-3">
            <Wallet className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            দৈনিক হিসাব
          </h1>
          <p className="mt-1 text-sm text-emerald-400 font-medium">
            Doinik Hisab • সবচেয়ে সহজ আয়-ব্যয় ট্র্যাকার
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/20">
          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">দ্রুত ট্রায়াল দেখতে চান?</p>
                <p className="text-[11px] text-emerald-700">১-ক্লিকেই ডেমো একাউন্টে প্রবেশ করুন</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 shrink-0"
            >
              ডেমো লগইন
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition ${
                !isRegister
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition ${
                isRegister
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              নতুন একাউন্ট (Register)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  আপনার পূর্ণ নাম (Full Name)
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isRegister}
                    placeholder="যেমন: সাকিব আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ইমেইল এড্রেস (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/30 transition transform active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>অপেক্ষা করুন...</span>
              ) : (
                <>
                  <span>{isRegister ? 'একাউন্ট খুলুন' : 'লগইন করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Features List */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>প্রতিদিনের আয় ও খরচের নির্ভুল হিসাব</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>মোবাইল ও পিসি সব ডিভাইসে সহজে ব্যবহারযোগ্য</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>১০০% নিরাপদ ও লোকাল স্টোরেজ ব্যাকআপ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
