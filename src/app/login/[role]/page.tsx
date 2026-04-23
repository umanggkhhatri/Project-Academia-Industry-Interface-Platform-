"use client";

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

type UserRole = 'student' | 'faculty' | 'industry';

const roleDest: Record<UserRole, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  industry: '/industry/dashboard',
};

const roleLabel: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Faculty',
  industry: 'Industry Partner',
};

export default function LoginByRolePage() {
  const { user, loading, refreshUser } = useAuth();
  const params = useParams<{ role: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = useMemo<UserRole>(
    () => (['student', 'faculty', 'industry'].includes(params.role) ? (params.role as UserRole) : 'student'),
    [params.role]
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to the correct dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace(roleDest[user.role]);
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password, role }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Login failed. Please check your credentials.');
        return;
      }

      // Sync AuthProvider state before navigating so the dashboard sees the user immediately
      await refreshUser();

      // Redirect: honour ?redirect= param, otherwise use role-based destination
      const returnTo = searchParams.get('redirect') ?? roleDest[json.user.role as UserRole] ?? '/';
      router.replace(returnTo);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-900">
            Login as {roleLabel[role]}
          </h1>
          <p className="text-gray-700 mt-2">
            Access your {role} portal using your email and password.
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={submitting}
              className="w-full bg-[#0056A3] hover:bg-[#003D73] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : `Login as ${roleLabel[role]}`}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <Link href={`/register/${role}`} className="text-primary-700 hover:underline">
              Create an account
            </Link>
            <div className="space-x-2">
              <Link href="/login/student" className="hover:underline">Student</Link>
              <span>•</span>
              <Link href="/login/faculty" className="hover:underline">Faculty</Link>
              <span>•</span>
              <Link href="/login/industry" className="hover:underline">Industry</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}