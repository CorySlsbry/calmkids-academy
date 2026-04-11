/**
 * Email Service via Resend — CalmKids Academy
 * Handles transactional emails sent to the parent account holder.
 * Never emails children. Never includes advertising.
 */

import { Resend } from 'resend';

// Lazy-initialize Resend so the module can be imported at build time
// even when RESEND_API_KEY is not yet set in the environment.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || '');
  }
  return _resend;
}

const FROM_EMAIL =
  process.env.EMAIL_FROM || 'CalmKids Academy <hello@calmkids-academy.app>';
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://calmkids-academy.vercel.app';

// ── Templates ─────────────────────────────────────────────

function welcomeEmailHtml(name: string, setupLink?: string): string {
  const greeting = name ? `, ${name}` : '';
  const ctaHref = setupLink || APP_URL;
  const ctaLabel = setupLink ? 'Set Your Password' : 'Open CalmKids Academy';
  const setupBlurb = setupLink
    ? `<p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">
         Click below to set your password and unlock your account. The link is good for the next 24 hours.
       </p>`
    : '';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFDF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <span style="color:#B45309;font-size:24px;font-weight:800;">CalmKids Academy</span>
    </div>
    <div style="background:#ffffff;border:1px solid #E5E7EB;border-radius:16px;padding:32px;">
      <h1 style="color:#1F2937;font-size:22px;margin:0 0 12px;font-weight:800;">
        Welcome to CalmKids Academy${greeting}.
      </h1>
      ${setupBlurb}
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Your ad-free learning app for ages 2–8 is ready. Every activity has been
        designed around three pillars: phonics &amp; early literacy, mindfulness
        &amp; calm, and social-emotional learning — delivered in short 15-minute
        daily sessions.
      </p>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;">
        No ads. No tracking. No upsells shown to your child. COPPA-compliant
        from the ground up.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${ctaHref}"
           style="display:inline-block;background:#B45309;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">
          ${ctaLabel}
        </a>
      </div>
      <p style="color:#6B7280;font-size:13px;line-height:1.6;margin:20px 0 0;">
        Have questions or feedback? Just reply to this email — we read every one.
      </p>
      <hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />
      <p style="color:#6B7280;font-size:12px;margin:0;">
        30-day money-back guarantee on every plan. Cancel anytime with 1 tap in
        Google Play.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:11px;text-align:center;margin-top:20px;">
      CalmKids Academy · published by Salisbury Bookkeeping LLC ·
      <a href="${APP_URL}" style="color:#0F766E;">calmkids-academy.app</a>
    </p>
  </div>
</body>
</html>`;
}

function passwordResetEmailHtml(resetLink: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FFFDF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <span style="color:#B45309;font-size:24px;font-weight:800;">CalmKids Academy</span>
    </div>
    <div style="background:#ffffff;border:1px solid #E5E7EB;border-radius:16px;padding:32px;">
      <h1 style="color:#1F2937;font-size:22px;margin:0 0 16px;font-weight:800;">
        Reset your CalmKids Academy password
      </h1>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;">
        We received a request to reset the password on your CalmKids Academy account.
        Click the button below to choose a new one. This link is good for the next hour.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${resetLink}"
           style="display:inline-block;background:#B45309;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">
          Reset Password
        </a>
      </div>
      <p style="color:#6B7280;font-size:13px;line-height:1.6;margin:20px 0 0;text-align:center;">
        Didn&rsquo;t request this? You can safely ignore this email &mdash; your password won&rsquo;t change.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:11px;text-align:center;margin-top:20px;">
      CalmKids Academy &middot; published by Salisbury Bookkeeping LLC
    </p>
  </div>
</body>
</html>`;
}

// ── Send Functions ────────────────────────────────────────

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset your CalmKids Academy password',
      html: passwordResetEmailHtml(resetLink),
    });
  } catch (err) {
    console.error('[email] Failed to send password reset email:', err);
  }
}

export async function sendWelcomeEmail(to: string, name: string = '', setupLink?: string) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to CalmKids Academy — your ad-free learning app for ages 2–8',
      html: welcomeEmailHtml(name, setupLink),
    });
  } catch (err) {
    console.error('[email] Failed to send welcome email:', err);
  }
}

/**
 * Generic helper for ad-hoc transactional sends (used by referral flow).
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (err) {
    console.error('[email] Failed to send email:', err);
  }
}

/**
 * Friend-invite email sent from the ReferralModal flow.
 * Called by /api/referrals/send-invites.
 */
export function inviteFriendEmailHtml(opts: {
  inviterEmail: string;
  appName: string;
  link: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FFFDF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <span style="color:#B45309;font-size:24px;font-weight:800;">CalmKids Academy</span>
    </div>
    <div style="background:#ffffff;border:1px solid #E5E7EB;border-radius:16px;padding:32px;">
      <h1 style="color:#1F2937;font-size:22px;margin:0 0 12px;font-weight:800;">${opts.inviterEmail} sent you 20% off ${opts.appName}</h1>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Your friend thinks your kids will love ${opts.appName} — the ad-free, COPPA-safe learning app for ages 2&ndash;8.
      </p>
      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 20px;">
        They sent you a personal invite that comes with <strong style="color:#B45309;">20% off for life</strong>. No code required &mdash; it&rsquo;s applied automatically at checkout.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${opts.link}" style="display:inline-block;background:#B45309;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:15px;">
          Claim 20% off &rarr;
        </a>
      </div>
      <p style="color:#6B7280;font-size:12px;line-height:1.6;margin:24px 0 0;">
        If you didn&rsquo;t expect this email, you can safely ignore it.
      </p>
    </div>
    <p style="color:#9CA3AF;font-size:11px;text-align:center;margin-top:20px;">
      CalmKids Academy &middot; published by Salisbury Bookkeeping LLC
    </p>
  </div>
</body>
</html>`;
}
