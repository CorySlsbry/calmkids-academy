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
