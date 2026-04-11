'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

const BRAND_ORANGE = '#B45309';

function SignupContent() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Create account via server-side endpoint
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Step 2: Sign in
      const supabase = createBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created but sign-in failed: ' + signInError.message);
        setLoading(false);
        return;
      }

      // Step 3: Redirect to welcome
      router.push('/welcome');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl">
          {/* Branding */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: BRAND_ORANGE }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">CalmKids Academy</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create a Parent Account
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Track your child&rsquo;s progress and manage your subscription.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-1.5">
                Parent Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309] transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309] transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#B45309] focus:ring-1 focus:ring-[#B45309] transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: BRAND_ORANGE }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-gray-500">
              By signing up you agree to our{' '}
              <Link href="/terms" className="underline hover:text-gray-700 transition">Terms</Link> and{' '}
              <Link href="/privacy" className="underline hover:text-gray-700 transition">Privacy Policy</Link>.
            </p>
          </form>

          <div className="mt-5 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href="/login"
              className="font-medium transition"
              style={{ color: BRAND_ORANGE }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
