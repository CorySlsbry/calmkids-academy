'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

const BRAND_ORANGE = '#B45309';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not send reset email. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
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
              Reset Password
            </h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 mb-6">
              <p className="font-medium mb-1">Check your email</p>
              <p>
                We&rsquo;ve sent a password reset link to <strong>{email}</strong>.
                Click the link in the email to set a new password.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-4">
            {!success && (
              <>
                <p className="text-sm text-gray-600">
                  Enter your email address and we&rsquo;ll send you a link to reset your password.
                </p>

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
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </>
            )}

            {success && (
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="w-full px-4 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: BRAND_ORANGE }}
              >
                Send Another Reset Link
              </button>
            )}
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
