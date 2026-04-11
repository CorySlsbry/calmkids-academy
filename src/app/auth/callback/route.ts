/**
 * Supabase Auth Callback — CalmKids Academy
 * GET /auth/callback
 *
 * Handles the email-confirmation and magic-link redirect from Supabase.
 * On success, redirects to the home page (the parent can continue from there).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://calmkids-academy.vercel.app';

// Only allow same-origin relative paths to prevent open-redirect attacks
function safeNext(raw: string | null): string {
  if (!raw) return '/welcome';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/welcome';
  return raw;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = safeNext(searchParams.get('next'));

    if (!code) {
      console.error('[auth/callback] Missing auth code');
      return NextResponse.redirect(`${APP_URL}/?auth_error=missing_code`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[auth/callback] Exchange error:', error);
      return NextResponse.redirect(`${APP_URL}/?auth_error=invalid_code`);
    }

    // Successfully authenticated — honor the `next` hint (e.g. /reset-password
    // for password-recovery flows triggered from welcome emails)
    return NextResponse.redirect(`${APP_URL}${next}`);
  } catch (error) {
    console.error('[auth/callback] Exception:', error);
    return NextResponse.redirect(`${APP_URL}/?auth_error=callback_failed`);
  }
}
