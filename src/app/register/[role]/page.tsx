"use client";

import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "@/firebaseConfig";

type UserRole = 'student' | 'faculty' | 'industry';

const roleDest: Record<UserRole, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  industry: '/industry/dashboard',
};

export default function RegisterByRolePage() {
  const { user } = useAuth();
  const params = useParams<{ role: UserRole }>();
  const router = useRouter();
  const role = useMemo<UserRole>(() => (['student','faculty','industry'].includes(params.role) ? params.role as UserRole : 'student'), [params.role]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), { role, email: cred.user.email, name }, { merge: true });
      router.push(roleDest[role]);
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-900">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
        <p className="text-gray-700 mt-2">Create your {role} account to access the portal.</p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-saffron-500 text-white px-4 py-2 rounded-md hover:bg-saffron-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : `Register as ${role}`}
            </button>
          </form>

      <div className="mt-6 text-sm text-gray-700 flex justify-between">
            <Link href={`/login/${role}`} className="text-primary-700 hover:underline">Already have an account? Login</Link>
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