'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserRole = 'student' | 'faculty' | 'industry';

export type AuthUser = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  organization?: string;
  phone?: string;
  bio?: string;
  profileComplete: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetch the current session from the server-side JWT cookie. */
  const fetchMe = React.useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const json = await res.json();
        setUser(json.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  // On mount: check if there is an active session
  useEffect(() => {
    setLoading(true);
    fetchMe().finally(() => setLoading(false));
  }, [fetchMe]);

  /** Sign out: clear the server-side cookie, then reset local state. */
  const logout = React.useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore network errors — clear local state regardless
    }
    setUser(null);
  }, []);

  /** Manually re-fetch the user (e.g. after profile update). */
  const refreshUser = React.useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const value = useMemo(
    () => ({ user, loading, logout, refreshUser }),
    [user, loading, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}