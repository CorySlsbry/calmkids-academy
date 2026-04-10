/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session and returns the redirect URL.
 * Called from the landing page and /pricing page CTAs.
 *
 * Body:
 *   { priceId: string, mode: "subscription" | "payment" }
 *
 * NOTE — Play Store Families Policy:
 *   This endpoint serves the PARENT-FACING WEB CHECKOUT only.
 *   The Android/Capacitor app does NOT use in-app billing — it loads the web
 *   app via a remote URL, so all payment flows go through Stripe web checkout.
 *   This satisfies both Stripe ToS and Google Play Families Policy (no IAP
 *   inside the Android wrapper for web-based apps using remote URLs).
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, APP_URL } from "@/lib/stripe"
import Stripe from "stripe"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId, mode } = body as { priceId?: string; mode?: string }

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 })
    }
    if (mode !== "subscription" && mode !== "payment") {
      return NextResponse.json({ error: "mode must be 'subscription' or 'payment'" }, { status: 400 })
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: mode as "subscription" | "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${APP_URL}/pricing`,
      // Allow promotion codes so we can run parent referral discounts
      allow_promotion_codes: true,
      // Collect billing address for tax purposes (COPPA: this is the parent's address)
      billing_address_collection: "auto",
      metadata: {
        source: "web_checkout",
        // Play Store safety note stored in metadata for auditing
        payment_origin: "parent_web",
      },
    }

    // Add trial only for recurring subscriptions, not one-time lifetime
    if (mode === "subscription") {
      sessionParams.subscription_data = {
        trial_period_days: 14,
        metadata: { source: "web_checkout", payment_origin: "parent_web" },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("[checkout] Error:", err?.message)
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 })
  }
}
