// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext(null);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for active Supabase session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('agri_auth_token', session.access_token);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('agri_auth_token', session.access_token);
        } else {
          localStorage.removeItem('agri_auth_token');
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Demo / Local Dev Farmer Mode
      const storedToken = localStorage.getItem('agri_auth_token');
      if (storedToken) {
        setUser({
          id: storedToken.replace('demo-token-', '') || '00000000-0000-0000-0000-000000000001',
          email: 'farmer@demo.agriassist.in',
          user_metadata: { full_name: 'Kisan Kumar (Farmer)' },
          role: 'farmer',
        });
      } else {
        // Default initialized demo session
        localStorage.setItem('agri_auth_token', 'demo-token-farmer-001');
        setUser({
          id: 'farmer-001',
          email: 'farmer@demo.agriassist.in',
          user_metadata: { full_name: 'Kisan Kumar (Farmer)' },
          role: 'farmer',
        });
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }
    // Demo login handler
    const demoToken = email.includes('admin') ? 'demo-token-admin-001' : 'demo-token-farmer-001';
    localStorage.setItem('agri_auth_token', demoToken);
    setUser({
      id: demoToken.replace('demo-token-', ''),
      email,
      user_metadata: { full_name: email.split('@')[0] },
      role: email.includes('admin') ? 'admin' : 'farmer',
    });
    return { user };
  };

  const register = async (email, password, fullName) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      return data;
    }
    const demoToken = 'demo-token-' + Date.now();
    localStorage.setItem('agri_auth_token', demoToken);
    setUser({
      id: demoToken.replace('demo-token-', ''),
      email,
      user_metadata: { full_name: fullName },
      role: 'farmer',
    });
    return { user };
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agri_auth_token');
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        logout,
        resetPassword,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin' || user?.email?.includes('admin'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
