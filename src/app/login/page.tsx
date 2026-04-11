'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

const BRAND_ORANGE = '#B45309';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      window.location.href = '/welcome';
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
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: BRAND_ORANGE }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">CalmKids Academy</span>
            </div>
            <p className="text-sm text-gray-600">
              Sign in to manage your subscription and your child&rsquo;s progress.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <div className="text-sm">
              <span className="text-gray-600">Don&rsquo;t have an account yet? </span>
              <Link
                href="/signup"
                className="font-medium transition"
                style={{ color: BRAND_ORANGE }}
              >
                Create one
              </Link>
            </div>
            <div>
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
