import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | CalmKids Academy',
  description:
    'CalmKids Academy terms of service — the agreement between parents and Salisbury Bookkeeping LLC.',
};

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-black mb-2 text-[#1F2937]">Terms of Service</h1>
          <p className="text-sm text-[#6B7280] mb-8">Last updated: April 10, 2026</p>

          <div className="space-y-6 text-[#374151] text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">1. Acceptance</h2>
              <p>
                By creating a CalmKids Academy account or using the service on behalf of a
                child in your care, you agree to these Terms of Service. CalmKids Academy
                is operated by Salisbury Bookkeeping LLC. Accounts may only be created by a
                parent or legal guardian aged 18 or over.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                2. Parent Account and Parental Responsibility
              </h2>
              <p>
                You confirm that you are the parent or legal guardian of every child whose
                profile you create. You are responsible for supervising your child&apos;s
                use of the app, selecting age-appropriate activities, and managing session
                length. CalmKids Academy is a supplemental educational tool — not a
                substitute for parental supervision, professional instruction, or
                medical/psychological advice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">3. Subscription & Billing</h2>
              <p>
                CalmKids Academy is offered as a monthly subscription ($4.99/mo), an annual
                subscription ($79/yr), or a one-time lifetime purchase ($199). Monthly and
                annual plans include a 14-day free trial. Subscriptions renew automatically
                at the stated rate until canceled. You can cancel anytime through Google
                Play (for subscriptions purchased via the parent web interface). All
                payments are processed by Stripe on the parent-facing web interface — the
                Android app does not use in-app billing.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">4. 30-Day Money-Back Guarantee</h2>
              <p>
                If CalmKids Academy isn&apos;t a good fit for your family, email us within
                30 days of your first paid charge for a full refund — no questions, no
                exit survey. Applies to all plans including Lifetime.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">5. Acceptable Use</h2>
              <p>
                You agree not to: (a) share account credentials outside your household;
                (b) attempt to reverse engineer, decompile, or scrape the service;
                (c) use the service to harass or harm others;
                (d) circumvent technical protections; or (e) use the service in any way
                that violates applicable law. We reserve the right to suspend accounts
                that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">6. Content</h2>
              <p>
                All curriculum, activities, animations, audio, illustrations, and written
                content are created or licensed by us. There is no user-generated content
                — children cannot post, upload, chat, or communicate with other users.
                The app is a closed, one-way content experience designed for safety.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">7. Intellectual Property</h2>
              <p>
                CalmKids Academy, the CalmKids name and logo, all curriculum content, and
                the parent dashboard are the exclusive property of Salisbury Bookkeeping
                LLC. Your subscription grants you a limited, revocable, non-transferable
                license to use the service for personal, non-commercial family use. You
                may not redistribute, resell, or publicly perform any content from the app.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">8. Termination</h2>
              <p>
                You may cancel your account at any time. We may suspend or terminate
                accounts that violate these terms, fail payment, or request account
                closure. On termination, access to the service ends immediately; refunds
                for the current billing period are offered at our discretion or per the
                30-day guarantee above.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">9. Disclaimer</h2>
              <p>
                CalmKids Academy is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis. We make no warranties that the service will be
                uninterrupted, error-free, or achieve any specific educational or
                behavioral outcome. The activities are designed to support — not
                replace — direct caregiver engagement, professional early-childhood
                education, or medical care.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">
                10. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, Salisbury Bookkeeping LLC and
                CalmKids Academy shall not be liable for indirect, incidental, special,
                consequential, or punitive damages. Our total liability for any claims
                related to the service is limited to the total amount you paid us in the
                12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">11. Governing Law</h2>
              <p>
                These terms are governed by the laws of the State of Delaware, without
                regard to conflict-of-law principles. Any dispute not resolved informally
                shall be brought exclusively in the state or federal courts located in
                Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">12. Changes</h2>
              <p>
                We may update these terms from time to time. We will email active parent
                account holders at least 14 days before any material change takes effect.
                Continued use of the service after the effective date constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#1F2937] mb-2">13. Contact</h2>
              <p>
                Questions about these terms? Email{' '}
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
                CalmKids Academy is published by Salisbury Bookkeeping LLC.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
