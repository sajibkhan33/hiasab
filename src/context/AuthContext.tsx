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
  id: 'demo-user-id',
  name: 'সাকিব আহমেদ',
  email: 'sakib@example.com',
  currency: '৳',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('doinik_hisab_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const hasLoggedOut = localStorage.getItem('doinik_hisab_has_logged_out');
        if (!hasLoggedOut) {
          setUser(DEFAULT_DEMO_USER);
          localStorage.setItem('doinik_hisab_user', JSON.stringify(DEFAULT_DEMO_USER));
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
        localStorage.setItem('doinik_hisab_user', JSON.stringify(data.user));
        localStorage.removeItem('doinik_hisab_has_logged_out');
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.warn('API login failed, falling back to local session:', err);
    }

    // Fallback local
    const fallbackUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'ব্যবহারকারী',
      email,
      currency: '৳',
    };
    setUser(fallbackUser);
    localStorage.setItem('doinik_hisab_user', JSON.stringify(fallbackUser));
    localStorage.removeItem('doinik_hisab_has_logged_out');
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
        localStorage.setItem('doinik_hisab_user', JSON.stringify(data.user));
        localStorage.removeItem('doinik_hisab_has_logged_out');
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.warn('API register failed, falling back to local session:', err);
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'ব্যবহারকারী',
      email: email.trim(),
      currency: '৳',
    };
    setUser(newUser);
    localStorage.setItem('doinik_hisab_user', JSON.stringify(newUser));
    localStorage.removeItem('doinik_hisab_has_logged_out');
    setIsLoading(false);
    return true;
  };

  const guestLogin = () => {
    setUser(DEFAULT_DEMO_USER);
    localStorage.setItem('doinik_hisab_user', JSON.stringify(DEFAULT_DEMO_USER));
    localStorage.removeItem('doinik_hisab_has_logged_out');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('doinik_hisab_user');
    localStorage.setItem('doinik_hisab_has_logged_out', 'true');
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
