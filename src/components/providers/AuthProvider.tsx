'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "@/firebaseConfig";
// Firestore has been removed. Role is now fetched from MongoDB via /api/users.

type UserRole = 'student' | 'faculty' | 'industry';

type AuthUser = {
  uid: string;
  email?: string | null;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setLoading(true);

          // 1. Try to fetch the user role from MongoDB
          let role: UserRole | null = null;
          try {
            const res = await fetch(`/api/users?uid=${encodeURIComponent(fbUser.uid)}`);
            if (res.ok) {
              const json = await res.json();
              const fetchedRole = json.user?.role;
              if (fetchedRole && ['student', 'faculty', 'industry'].includes(fetchedRole)) {
                role = fetchedRole as UserRole;
              }
            }
          } catch {
            // Network error — fall through to localStorage fallback
          }

          // 2. Fallback: use the last selected role from localStorage
          if (!role) {
            try {
              const lastRole = typeof window !== 'undefined'
                ? (localStorage.getItem('lastRole') as UserRole | null)
                : null;
              if (lastRole && ['student', 'faculty', 'industry'].includes(lastRole)) {
                role = lastRole;
              }
            } catch {
              // localStorage may be unavailable in some contexts
            }
          }

          if (role) {
            setUser({ uid: fbUser.uid, email: fbUser.email, role });
          } else {
            // User exists in Firebase Auth but has no MongoDB profile yet
            // (e.g., first login before profile creation)
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('AuthProvider error:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}