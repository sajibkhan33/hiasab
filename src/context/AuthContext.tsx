'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
}

const DEFAULT_DEMO_USER: User = {
  id: 'demo-user-sajib',
  name: 'Eng: Sajib Khan',
  email: 'sajib3323khan@gmail.com',
  currency: '$',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('daily_expense_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const hasLoggedOut = localStorage.getItem('daily_expense_has_logged_out');
        if (!hasLoggedOut) {
          setUser(DEFAULT_DEMO_USER);
          localStorage.setItem('daily_expense_user', JSON.stringify(DEFAULT_DEMO_USER));
        }
      }
    } catch (e) {
      console.error('Error loading user session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('daily_expense_user', JSON.stringify(data.user));
        localStorage.removeItem('daily_expense_has_logged_out');
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.warn('API login failed, using local session:', err);
    }

    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: email === 'sajib3323khan@gmail.com' ? 'Eng: Sajib Khan' : (email.split('@')[0] || 'User'),
      email,
      currency: '$',
    };
    setUser(fallbackUser);
    localStorage.setItem('daily_expense_user', JSON.stringify(fallbackUser));
    localStorage.removeItem('daily_expense_has_logged_out');
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('daily_expense_user', JSON.stringify(data.user));
        localStorage.removeItem('daily_expense_has_logged_out');
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.warn('API register failed, using local session:', err);
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Eng: Sajib Khan',
      email: email.trim(),
      currency: '$',
    };
    setUser(newUser);
    localStorage.setItem('daily_expense_user', JSON.stringify(newUser));
    localStorage.removeItem('daily_expense_has_logged_out');
    setIsLoading(false);
    return true;
  };

  const guestLogin = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem('daily_expense_user', JSON.stringify(DEFAULT_DEMO_USER));
    localStorage.removeItem('daily_expense_has_logged_out');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('daily_expense_user');
    localStorage.setItem('daily_expense_has_logged_out', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        guestLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
