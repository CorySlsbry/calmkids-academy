/**
 * Stripe API helper — CalmKids Academy
 *
 * Server-side only. Import this file in API routes and server components.
 * Never import in client components.
 *
 * Exports:
 *   - stripe        — raw Stripe instance (apiVersion 2024-12-18.acacia)
 *   - getPlanType() — derive PlanType from a Stripe.Price
 *   - APP_URL       — for Checkout redirect URLs
 *   - PlanType      — "monthly" | "annual" | "lifetime"
 */

import Stripe from "stripe";

export type PlanType = "monthly" | "annual" | "lifetime";

/** Derive plan type from price metadata or recurring interval */
export function getPlanType(price: Stripe.Price): PlanType {
  const meta = price.metadata?.plan_type;
  if (meta === "lifetime") return "lifetime";
  if (meta === "annual" || price.recurring?.interval === "year") return "annual";
  return "monthly";
}

/** App URL — used for Checkout success/cancel redirects */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://calmkids-academy.vercel.app";

/** Raw Stripe client — lazily instantiated so build-time env vars aren't required */
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set.");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as any,
      typescript: true,
    });
  }
  return _stripe;
}

/** Convenience alias — lazily instantiated Stripe client */
export const stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripe() as any)[prop];
  },
});

/**
 * Idempotent: ensures a 20%-off-forever coupon exists in Stripe with the given id.
 * First call on a fresh Stripe account creates it; subsequent calls are no-ops.
 * Used by the referral flow so the discount can be applied at checkout
 * without a manual dashboard step.
 */
const _ensuredCoupons = new Set<string>();
export async function ensureReferralCoupon(stripeClient: Stripe, couponId: string): Promise<void> {
  if (_ensuredCoupons.has(couponId)) return;
  try {
    await stripeClient.coupons.retrieve(couponId);
    _ensuredCoupons.add(couponId);
    return;
  } catch (err: any) {
    if (err?.statusCode !== 404 && err?.code !== "resource_missing") {
      throw err;
    }
  }
  await stripeClient.coupons.create({
    id: couponId,
    percent_off: 20,
    duration: "forever",
    name: "Refer 2 Friends — 20% Off Forever",
    metadata: { source: "refer2_flow" },
  });
  _ensuredCoupons.add(couponId);
}
