'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

/**
 * /reset-password — CalmKids Academy
 *
 * Lands here from /auth/callback after Supabase exchanges the password
 * recovery code for a session. The user picks a new password and is then
 * sent to /welcome to start using the app.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data?.session) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError('Invalid or expired reset link. Please request a new one.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setPassword('');
    setConfirm('');
    setTimeout(() => {
      router.push('/welcome');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="text-[#B45309] text-2xl font-extrabold">CalmKids Academy</span>
          </Link>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <h1 className="text-[#1F2937] text-xl font-extrabold mb-2">Set your password</h1>
          <p className="text-[#6B7280] text-sm mb-6">
            Pick a password for your CalmKids Academy account so you can sign back in any time.
          </p>

          {tokenValid === null && (
            <p className="text-[#6B7280] text-sm">Loading…</p>
          )}

          {tokenValid === false && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {tokenValid === true && success && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
              Password updated. Redirecting…
            </div>
          )}

          {tokenValid === true && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20 transition"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B45309] focus:ring-2 focus:ring-[#B45309]/20 transition"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl font-bold text-white bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Saving…' : 'Save password'}
              </button>
            </form>
          )}
        </div>
        <p className="text-[#9CA3AF] text-xs text-center mt-6">
          CalmKids Academy · published by Salisbury Bookkeeping LLC
        </p>
      </div>
    </div>
  );
}
