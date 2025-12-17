// "use client";

// import { useAuth } from '@/components/providers/AuthProvider';
// import Link from 'next/link';
// import { useParams, useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useMemo, useState } from 'react';
// import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { auth, db, googleProvider } from "@/firebaseConfig";

// type UserRole = 'student' | 'faculty' | 'industry';

// const roleDest: Record<UserRole, string> = {
//   student: '/student/dashboard',
//   faculty: '/faculty/dashboard',
//   industry: '/industry/dashboard',
// };

// export default function LoginByRolePage() {
//   const { user } = useAuth();
//   const params = useParams<{ role: UserRole }>();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const role = useMemo<UserRole>(() => (['student','faculty','industry'].includes(params.role) ? params.role as UserRole : 'student'), [params.role]);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user && user.role === role) {
//       router.replace(roleDest[role]);
//     }
//   }, [user, role, router]);

//   const saveRoleIfMissing = async (uid: string, role: UserRole, email?: string | null) => {
//     const ref = doc(db, 'users', uid);
//     const snap = await getDoc(ref);
//     if (!snap.exists()) {
//       await setDoc(ref, { role, email: email ?? null }, { merge: true });
//     } else {
//       const existingRole = snap.data()?.role as UserRole | undefined;
//       if (!existingRole) {
//         await setDoc(ref, { role }, { merge: true });
//       }
//     }
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const cred = await signInWithEmailAndPassword(auth, email, password);
//       await saveRoleIfMissing(cred.user.uid, role, cred.user.email);
//       const redirect = searchParams.get('redirect');
//       router.push(redirect ?? roleDest[role]);
//     } catch (err) {
//       console.error(err);
//       alert('Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onGoogle = async () => {
//     setLoading(true);
//     try {
//       const cred = await signInWithPopup(auth, googleProvider);
//       await saveRoleIfMissing(cred.user.uid, role, cred.user.email);
//       const redirect = searchParams.get('redirect');
//       router.push(redirect ?? roleDest[role]);
//     } catch (err) {
//       console.error(err);
//       alert('Google sign-in failed.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="py-16">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-primary-900">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
//         <p className="text-gray-700 mt-2">Access your {role} portal using your email and password.</p>
//         </div>

//         <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
//           <form onSubmit={onSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
//                 placeholder="••••••••"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#0056A3] hover:bg-[#003D73] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60"
//             >
//               {loading ? 'Signing in...' : `Login as ${role}`}
//             </button>
//             <button
//               type="button"
//               onClick={onGoogle}
//               disabled={loading}
//               className="mt-3 w-full bg-white border border-gray-300 text-[#0056A3] hover:bg-gray-50 px-4 py-2 rounded-md transition-colors disabled:opacity-60"
//             >
//               Continue with Google
//             </button>
//           </form>

//       <div className="mt-6 text-sm text-gray-700 flex justify-between">
//             <Link href={`/register/${role}`} className="text-primary-700 hover:underline">Create an account</Link>
//             <div className="space-x-2">
//               <Link href="/login/student" className="hover:underline">Student</Link>
//               <span>•</span>
//               <Link href="/login/faculty" className="hover:underline">Faculty</Link>
//               <span>•</span>
//               <Link href="/login/industry" className="hover:underline">Industry</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from "@/firebaseConfig";

type UserRole = 'student' | 'faculty' | 'industry';

const roleDest: Record<UserRole, string> = {
  student: '/student/dashboard',
  faculty: '/faculty/dashboard',
  industry: '/industry/dashboard',
};

export default function LoginByRolePage() {
  const { user } = useAuth();
  const params = useParams<{ role: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const role = useMemo<UserRole>(() => {
    return ['student', 'faculty', 'industry'].includes(params.role)
      ? (params.role as UserRole)
      : 'student';
  }, [params.role]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, always redirect to the user's saved role dashboard
  useEffect(() => {
    if (user?.role) {
      router.replace(roleDest[user.role]);
    }
  }, [user, router]);

  // Handle redirect-based Google sign-in results
  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          try { localStorage.setItem('lastRole', role); } catch {}
          const resolvedRole = await resolveUserRole(result.user.uid, role, result.user.email);
          const redirect = searchParams.get('redirect');
          router.replace(redirect ?? roleDest[resolvedRole]);
        }
      } catch (err) {
        console.error('Google redirect result error:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRoleIfMissing = async (uid: string, role: UserRole, email?: string | null) => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { role, email: email ?? null }, { merge: true });
    } else if (!snap.data()?.role) {
      await setDoc(ref, { role }, { merge: true });
    }
  };

  const resolveUserRole = async (uid: string, fallbackRole: UserRole, email?: string | null): Promise<UserRole> => {
    const ref = doc(db, 'users', uid);
    let storedRole: UserRole | undefined;
    try {
      const snap = await getDoc(ref);
      storedRole = snap.exists() ? (snap.data()?.role as UserRole | undefined) : undefined;
    } catch (e) {
      console.error('Fetching role failed (check Firestore rules):', e);
    }
    const finalRole = storedRole ?? fallbackRole;
    if (!storedRole) {
      try {
        await setDoc(ref, { role: finalRole, email: email ?? null }, { merge: true });
      } catch (e) {
        console.error('Saving role failed (check Firestore rules):', e);
      }
    }
    return finalRole;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      try { localStorage.setItem('lastRole', role); } catch {}
      const resolvedRole = await resolveUserRole(cred.user.uid, role, cred.user.email);
      const redirect = searchParams.get('redirect');
      router.replace(redirect ?? roleDest[resolvedRole]);
    } catch (err) {
      console.error('Email/password sign-in error:', err);
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      // Improve reliability: prompt account selection
      try { googleProvider.setCustomParameters({ prompt: 'select_account' }); } catch {}

      let cred;
      try {
        cred = await signInWithPopup(auth, googleProvider);
      } catch (popupErr) {
        const code = (popupErr as { code?: string })?.code;
        // Fallback to redirect for popup-blocked or internal errors
        if (code === 'auth/popup-blocked' || code === 'auth/internal-error') {
          try { localStorage.setItem('lastRole', role); } catch {}
          await signInWithRedirect(auth, googleProvider);
          return; // Redirect flow will be handled in getRedirectResult effect
        }
        throw popupErr;
      }

      try { localStorage.setItem('lastRole', role); } catch {}
      const resolvedRole = await resolveUserRole(cred.user.uid, role, cred.user.email);
      const redirect = searchParams.get('redirect');
      router.replace(redirect ?? roleDest[resolvedRole]);
    } catch (err) {
      console.error('Google sign-in failed:', err);
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-900">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h1>
          <p className="text-gray-700 mt-2">
            Access your {role} portal using your email and password.
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md p-3">
              {error}
            </div>
          )}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056A3] hover:bg-[#003D73] text-white px-4 py-2 rounded-md transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : `Login as ${role}`}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-3 w-full bg-white border border-gray-300 text-[#0056A3] hover:bg-gray-50 px-4 py-2 rounded-md transition-colors disabled:opacity-60"
            >
              Continue with Google
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