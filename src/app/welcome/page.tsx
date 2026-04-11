"use client"

/**
 * /welcome — Post-payment confirmation page
 * Shown after a successful Stripe Checkout redirect.
 * Reads session_id from query param to confirm payment and personalize messaging.
 */

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Leaf, ArrowRight, Download, Star } from "lucide-react"
import { Suspense } from "react"

function WelcomeContent() {
  const params          = useSearchParams()
  const sessionId       = params.get("session_id")
  const [plan, setPlan] = useState<"monthly" | "annual" | "lifetime" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.planType) setPlan(data.planType)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8]">
        <div className="text-[#374151] animate-pulse">Confirming your purchase…</div>
      </div>
    )
  }

  const isLifetime = plan === "lifetime"

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[#B45309] rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <span className="font-bold text-[#1F2937] text-lg">CalmKids Academy</span>
        </div>

        {/* Success badge */}
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-[#065F46]" aria-hidden="true" />
        </div>

        {isLifetime ? (
          <>
            <h1 className="font-black text-[#1F2937] text-3xl mb-3">
              You're in forever.
            </h1>
            <p className="text-[#374151] text-lg leading-relaxed mb-6">
              Your lifetime access to CalmKids Academy is confirmed. Your child can
              start their first lesson right now — no expiration, no renewal, ever.
            </p>
            <div className="bg-[#D1FAE5] border border-[#6EE7B7] rounded-2xl p-5 mb-6 text-left">
              <p className="font-bold text-[#065F46] mb-2">What "lifetime" means:</p>
              <ul className="space-y-1.5 text-sm text-[#065F46]">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  All current content — unlocked forever
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  All future curriculum updates included
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Up to 4 child profiles
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  No recurring charges — ever
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-black text-[#1F2937] text-3xl mb-3">
              Welcome to CalmKids Academy!
            </h1>
            <p className="text-[#374151] text-lg leading-relaxed mb-6">
              Your{" "}
              {plan === "annual" ? "annual" : "14-day free trial"}{" "}
              is confirmed. Your child can start their first lesson right now.
            </p>
            {plan !== "annual" && (
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4 mb-6 text-sm text-[#92400E]">
                Your trial runs for 14 days. You won't be charged until the trial ends.
                Cancel anytime with 1 tap in Google Play — no calls, no email hoops.
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <a
            href="https://play.google.com/store/apps/details?id=com.coryslsbry.calmkidsacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#B45309] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#92400E] transition-colors min-h-[56px] text-base"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            Download the App
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#0F766E] text-[#0F766E] font-bold px-8 py-4 rounded-2xl hover:bg-[#CCFBF1] transition-colors min-h-[44px] text-sm"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-6 text-[#6B7280] text-xs">
          Confirmation email sent. Questions? Email{" "}
          <a href="mailto:hello@calmkids-academy.app" className="text-[#0F766E] underline">
            hello@calmkids-academy.app
          </a>
        </p>
      </div>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF8]">
        <div className="text-[#374151]">Loading…</div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  )
}
