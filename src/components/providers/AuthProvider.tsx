'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from "@/firebaseConfig";

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
    let docUnsub: (() => void) | null = null;
    const authUnsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setLoading(true);
          const ref = doc(db, 'users', fbUser.uid);
          // Real-time subscription to capture role as soon as it is saved
          docUnsub?.();
          docUnsub = onSnapshot(ref, (snap) => {
            const role = snap.exists() ? (snap.data()?.role as UserRole | undefined) : undefined;
            if (role) {
              setUser({ uid: fbUser.uid, email: fbUser.email, role });
              setLoading(false);
            } else {
              // Fallback to last selected role to prevent incorrect "not logged" messages
              try {
                const lastRole = typeof window !== 'undefined' ? (localStorage.getItem('lastRole') as UserRole | null) : null;
                if (lastRole && ['student','faculty','industry'].includes(lastRole)) {
                  setUser({ uid: fbUser.uid, email: fbUser.email, role: lastRole });
                } else {
                  setUser(null);
                }
              } catch {
                setUser(null);
              } finally {
                // Keep loading false so UI can proceed; snapshot will update when role is saved
                setLoading(false);
              }
            }
          }, (err) => {
            console.error('AuthProvider onSnapshot error:', err);
            setUser(null);
            setLoading(false);
          });
        } else {
          setUser(null);
          setLoading(false);
          docUnsub?.();
          docUnsub = null;
        }
      } catch (e) {
        console.error('AuthProvider error:', e);
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      authUnsub();
      docUnsub?.();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}