import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | CalmKids Academy',
  description:
    'CalmKids Academy privacy policy — COPPA-compliant, no tracking of children, no third-party data sharing.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FFFDF8] text-[#1F2937] min-h-screen">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-gray-200 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B45309] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-[#1F2937] text-sm">CalmKids Academy</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#0F766E] hover:underline font-medium transition"
          >
            &larr; Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black mb-2 text-[#1F2937]">Privacy Policy</h1>
          <p className="text-sm text-[#6B7280] mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-[#374151] text-sm leading-relaxed">
            <section className="bg-[#CCFBF1] border-2 border-[#0F766E] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#065F46] mb-2">
                COPPA Compliance — Built for Children Ages 2–8
              </h2>
              <p className="mb-3 text-[#065F46]">
                CalmKids Academy is designed for children ages 2–8. We comply with the
                Children&apos;s Online Privacy Protection Act (COPPA). We do not knowingly
                collect personal information from children under 13.
              </p>
              <p className="text-[#065F46]">
                Parents create and manage all accounts. No advertising, no tracking pixels
                targeting children, no third-party data sharing involving children, and no
                behavioral profiling of minors — ever.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                1. Information We Collect
              </h2>
              <p>
                We collect only what&apos;s needed to run the service for the parent account holder:
                email address, subscription status, billing information (processed and
                stored by Stripe, not by us), and anonymous usage analytics. We do not
                collect personal information from children — no names, addresses, photos,
                voice recordings, or contact details from minors. Child profiles use
                nicknames chosen by the parent and contain no identifying data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                2. How We Use Your Information
              </h2>
              <p>
                We use the parent&apos;s email to send account-related messages (receipts,
                billing updates, password resets, service announcements). We use aggregated,
                anonymous usage analytics (session length, activity completion rates) to
                improve the curriculum. We never use your data — or your child&apos;s activity —
                to serve ads or sell to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                3. What We Do NOT Do
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>We do not show ads to children — ever.</li>
                <li>We do not use tracking pixels, fingerprinting, or ad-tech SDKs.</li>
                <li>We do not sell, rent, or share personal information with data brokers.</li>
                <li>We do not require children to provide any personal information to use the app.</li>
                <li>We do not access your device microphone, camera, contacts, or location.</li>
                <li>We do not build behavioral profiles on children.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">4. Data Security</h2>
              <p>
                All data is encrypted in transit using TLS 1.3 and at rest using AES-256.
                Our database is hosted on Supabase with row-level security policies so each
                parent account can only access its own data. Payment processing is handled
                by Stripe, which is PCI DSS Level 1 compliant — we never see or store your
                full card number.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                5. Third-Party Services
              </h2>
              <p>
                We use a minimal set of vendors, none of which interact with child-facing
                screens: Stripe (payments), Supabase (database and auth), Vercel (hosting),
                and Resend (transactional email to the parent). None of these services are
                used to profile or advertise to children.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                6. Parental Rights and Controls
              </h2>
              <p>
                As a parent or legal guardian, you may at any time request a copy of the data
                associated with your account, correct inaccurate information, or permanently
                delete your account and all associated child profiles. To do so, email us at
                the contact address below. We will honor verified requests within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">7. Data Retention</h2>
              <p>
                Parent account data is retained while your subscription is active and for 30
                days after cancellation to allow for reactivation. After 30 days, the account
                and all associated child profiles are permanently deleted. You may request
                immediate deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                8. Changes to This Policy
              </h2>
              <p>
                If we update this privacy policy, we will email all active parent account
                holders at least 14 days before the changes take effect. Material changes
                affecting how we handle information from or about children will always be
                emailed in advance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">9. Contact</h2>
              <p>
                Questions or parental-rights requests? Email us at{' '}
                <a
                  href="mailto:cory@salisburybookkeeping.com"
                  className="text-[#0F766E] hover:underline font-medium"
                >
                  cory@salisburybookkeeping.com
                </a>
                . We respond to every parent inquiry within 2 business days.
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-[#6B7280] text-xs">
                CalmKids Academy is published by Salisbury Bookkeeping LLC. This privacy
                policy complies with the Children&apos;s Online Privacy Protection Act
                (COPPA), the Google Play Families Policy, and Apple&apos;s Kids Category
                requirements.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
