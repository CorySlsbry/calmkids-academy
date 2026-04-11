/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session and returns the redirect URL.
 * Called from the landing page and /pricing page CTAs (via ReferralModal).
 *
 * Body:
 *   { priceId: string, mode?: 'subscription' | 'payment',
 *     refCode?: string, customerEmail?: string, applyReferralDiscount?: boolean }
 *
 * NOTE — Play Store Families Policy:
 *   This endpoint serves the PARENT-FACING WEB CHECKOUT only.
 *   The Android/Capacitor app does NOT use in-app billing — it loads the web
 *   app via a remote URL, so all payment flows go through Stripe web checkout.
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe, APP_URL } from "@/lib/stripe";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const REFERRAL_COUPON_ID = process.env.STRIPE_REFERRAL_COUPON_ID || "REFER2_20OFF";

const VALID_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_MONTHLY,
  process.env.STRIPE_PRICE_ANNUAL,
  process.env.STRIPE_PRICE_LIFETIME,
].filter(Boolean));

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      priceId,
      mode: modeFromBody,
      refCode: refCodeFromBody,
      customerEmail,
      applyReferralDiscount,
    } = body as {
      priceId?: string;
      mode?: string;
      refCode?: string;
      customerEmail?: string;
      applyReferralDiscount?: boolean;
    };

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }
    if (VALID_PRICE_IDS.size > 0 && !VALID_PRICE_IDS.has(priceId)) {
      return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
    }

    // Auto-select mode: Lifetime is a one-time payment; others are subscriptions
    const isLifetime = priceId === process.env.STRIPE_PRICE_LIFETIME;
    const mode = (modeFromBody as "subscription" | "payment") || (isLifetime ? "payment" : "subscription");
    if (mode !== "subscription" && mode !== "payment") {
      return NextResponse.json({ error: "invalid mode" }, { status: 400 });
    }

    const cookieRefCode = req.cookies.get("ref_code")?.value;
    const refCode = refCodeFromBody || cookieRefCode || undefined;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${APP_URL}/pricing`,
      billing_address_collection: "auto",
      metadata: {
        source: "web_checkout",
        payment_origin: "parent_web",
        priceId,
        refCode: refCode || "",
        schema: process.env.NEXT_PUBLIC_APP_SCHEMA || "calmkids",
      },
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail.trim();
    }

    if (applyReferralDiscount && refCode) {
      sessionParams.discounts = [{ coupon: REFERRAL_COUPON_ID }];
    } else {
      sessionParams.allow_promotion_codes = true;
    }

    if (mode === "subscription") {
      sessionParams.subscription_data = {
        trial_period_days: 14,
        metadata: { source: "web_checkout", payment_origin: "parent_web" },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] Error:", err?.message);
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 });
  }
}
