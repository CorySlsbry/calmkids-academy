"use client"

/**
 * /pricing — Dedicated pricing page with Hormozi framing
 * Anchor → Bonus Stack → Risk Reversal → CTA
 */

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2, Shield, Gift, Users, BookOpen, Award, Download,
  ArrowRight, Leaf, Star, XCircle
} from "lucide-react"
import { ReferralModal } from "@/components/ReferralModal"

const PRICE_IDS = {
  monthly:  process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY  ?? "",
  annual:   process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL   ?? "",
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME ?? "",
}

export default function PricingPage() {
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null)

  function PricingCTA({ priceEnvKey, label, className }: {
    priceEnvKey: "monthly" | "annual" | "lifetime"
    label: string
    className?: string
  }) {
    const priceId = PRICE_IDS[priceEnvKey]
    return (
      <button
        type="button"
        onClick={() => {
          if (!priceId) {
            alert("Pricing not configured yet. Please check back soon!")
            return
          }
          setPendingPriceId(priceId)
        }}
        disabled={!priceId}
        className={className}
        aria-label={label}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B45309] rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-bold text-[#1F2937] text-sm">CalmKids Academy</span>
          </Link>
          <Link href="/" className="text-[#0F766E] text-sm font-medium hover:underline">
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="px-4 py-14">
        <div className="max-w-5xl mx-auto">

          {/* Headline + anchor */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-black text-[#1F2937] text-[clamp(1.75rem,4vw,3rem)] mb-4 leading-tight">
              Less than one therapy session. For the whole family. Forever.
            </h1>
            <p className="text-[#374151] text-lg leading-relaxed">
              A single session with a pediatric therapist costs $150–$250. Music lessons run $80–$120/month.
              ABCmouse charges $12.99/month. CalmKids Academy starts at $4.99/month — and includes
              mindfulness, literacy, and SEL for up to 4 children.
            </p>
          </div>

          {/* Bonus stack */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10 max-w-3xl mx-auto">
            <h2 className="font-bold text-[#1F2937] text-lg mb-4 text-center">
              Every plan includes all of this:
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Shield,   text: "Zero ads, ever — not even 'educational' ads" },
                { icon: Users,    text: "Up to 4 child profiles (Standard: 1, Family: 4)" },
                { icon: BookOpen, text: "52-week phonics + SEL + mindfulness curriculum" },
                { icon: Award,    text: "Parent progress dashboard + weekly email reports" },
                { icon: Download, text: "Offline mode — 3 sessions cached automatically" },
                { icon: Gift,     text: "28 weeks of printable activity workbooks (PDF)" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#065F46] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-[#374151] text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing tiers */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">

            {/* Monthly */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
              <h3 className="font-bold text-[#1F2937] text-xl mb-1">Monthly</h3>
              <p className="text-4xl font-black text-[#1F2937] mb-1">
                $4.99<span className="text-base font-normal text-[#4B5563]">/mo</span>
              </p>
              <p className="text-[#4B5563] text-sm mb-5">
                Billed monthly · Cancel 1-tap in Google Play
              </p>
              <ul className="space-y-2 text-sm text-[#374151] mb-6 flex-1">
                {["14-day free trial", "1 child profile", "All curriculum content", "Offline mode"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#065F46] flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingCTA
                priceEnvKey="monthly"
                label="Start Free Trial"
                className="w-full bg-gray-100 text-[#1F2937] font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors min-h-[44px]"
              />
            </div>

            {/* Annual — best value highlighted */}
            <div className="bg-[#FEF3C7] rounded-2xl border-2 border-[#B45309] p-6 flex flex-col relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#B45309] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  SAVE 33% vs MONTHLY
                </span>
              </div>
              <h3 className="font-bold text-[#1F2937] text-xl mb-1">Annual</h3>
              <p className="text-4xl font-black text-[#B45309] mb-1">
                $79<span className="text-base font-normal text-[#4B5563]">/yr</span>
              </p>
              <p className="text-[#4B5563] text-sm mb-1">= $6.58/month · Billed once a year</p>
              <p className="text-[#065F46] text-xs font-semibold mb-5">
                Save $21 vs monthly billing
              </p>
              <ul className="space-y-2 text-sm text-[#374151] mb-6 flex-1">
                {["14-day free trial", "Up to 2 child profiles", "All curriculum content", "Offline mode", "Printable workbooks"].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#065F46] flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingCTA
                priceEnvKey="annual"
                label="Start Free Trial"
                className="w-full bg-[#B45309] text-white font-bold py-3 rounded-xl hover:bg-[#92400E] transition-colors min-h-[44px]"
              />
            </div>

            {/* Lifetime */}
            <div className="bg-[#1F2937] rounded-2xl p-6 flex flex-col text-white relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[#065F46] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  BEST TOTAL VALUE
                </span>
              </div>
              <h3 className="font-bold text-white text-xl mb-1">Lifetime</h3>
              <p className="text-4xl font-black text-white mb-1">
                $199<span className="text-base font-normal text-gray-400"> one-time</span>
              </p>
              <p className="text-gray-400 text-sm mb-1">No recurring charges · Ever</p>
              <div className="bg-[#374151] rounded-lg px-3 py-2 text-xs text-[#D1FAE5] mb-5">
                Breaks even after 40 months vs monthly.<br />
                Saves $400+ over 5 years.
              </div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6 flex-1">
                {[
                  "Up to 4 child profiles — forever",
                  "All current + future curriculum",
                  "Offline mode",
                  "Printable workbooks",
                  "Priority email support",
                  "No renewal reminders. No upsells.",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <PricingCTA
                priceEnvKey="lifetime"
                label="Get Lifetime Access"
                className="w-full bg-white text-[#1F2937] font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          {/* Lifetime value math */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 max-w-2xl mx-auto text-center">
            <h2 className="font-bold text-[#1F2937] mb-4">The lifetime math</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#4B5563]">Monthly × 5 years</p>
                <p className="text-2xl font-black text-[#991B1B]">$299</p>
              </div>
              <div>
                <p className="text-[#4B5563]">Annual × 5 years</p>
                <p className="text-2xl font-black text-[#D97706]">$395</p>
              </div>
              <div>
                <p className="text-[#4B5563]">Lifetime (one-time)</p>
                <p className="text-2xl font-black text-[#065F46]">$199</p>
              </div>
            </div>
          </div>

          {/* Risk reversal */}
          <div className="bg-[#CCFBF1] border-2 border-[#0F766E] rounded-2xl p-6 max-w-2xl mx-auto text-center mb-10">
            <Shield className="w-10 h-10 text-[#0F766E] mx-auto mb-3" aria-hidden="true" />
            <h2 className="font-bold text-[#1F2937] mb-2">30-day money-back guarantee</h2>
            <p className="text-[#374151] text-sm leading-relaxed">
              If your child doesn't love it — or if it just isn't a good fit — email us within
              30 days for a full refund. No questions. Cancel anytime through Google Play with 1 tap.
            </p>
          </div>

          {/* COPPA reminder */}
          <p className="text-center text-[#4B5563] text-xs max-w-xl mx-auto">
            All payments are processed by Stripe on the parent-facing web interface.
            The CalmKids Academy Android app does not use in-app billing — no charges
            occur inside the app per Google Play Families Policy requirements.
            COPPA-compliant · No child data collected · Zero ads.
          </p>
        </div>
      </main>

      <ReferralModal
        open={pendingPriceId !== null}
        onClose={() => setPendingPriceId(null)}
        priceId={pendingPriceId}
        appName="CalmKids Academy"
      />
    </div>
  )
}
