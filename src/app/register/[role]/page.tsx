"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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

export default function RegisterByRolePage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const { refreshUser } = useAuth();

  const role = useMemo<UserRole>(
    () => (['student', 'faculty', 'industry'].includes(params.role) ? (params.role as UserRole) : 'student'),
    [params.role]
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Registration failed. Please try again.');
        return;
      }

      // Sync AuthProvider state before navigating so the dashboard sees the user immediately
      await refreshUser();

      // JWT cookie is already set by the server — navigate to dashboard
      router.push(roleDest[role]);
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
            Register as {roleLabel[role]}
          </h1>
          <p className="text-gray-700 mt-2">
            Create your {role} account to access the portal.
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Your Name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={submitting}
              className="w-full bg-saffron-500 text-white px-4 py-2 rounded-md hover:bg-saffron-600 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : `Register as ${roleLabel[role]}`}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <Link href={`/login/${role}`} className="text-primary-700 hover:underline">
              Already have an account? Login
            </Link>
            <div className="space-x-2">
              <Link href="/register/student" className="hover:underline">Student</Link>
              <span>•</span>
              <Link href="/register/faculty" className="hover:underline">Faculty</Link>
              <span>•</span>
              <Link href="/register/industry" className="hover:underline">Industry</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}