/**
 * POST /api/portal
 *
 * Creates a Stripe Customer Portal session for the authenticated parent.
 * Redirects to the portal where they can manage their subscription,
 * update payment methods, view invoices, or cancel.
 *
 * Body (optional):
 *   { customerId?: string }
 *
 * The Stripe Customer Portal must be enabled in your Stripe Dashboard:
 *   https://dashboard.stripe.com/settings/billing/portal
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, APP_URL } from "@/lib/stripe"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from Supabase session
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set() {},
          remove() {},
        },
      }
    )

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Look up the Stripe customer ID from our subscriptions table
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    // Allow passing customerId explicitly (for direct calls from settings page)
    const body = await req.json().catch(() => ({}))
    const stripeCustomerId: string | undefined =
      sub?.stripe_customer_id ?? body?.customerId

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No active subscription found for this account." },
        { status: 404 }
      )
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${APP_URL}/dashboard/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    console.error("[portal] Error:", err?.message)
    return NextResponse.json({ error: err?.message ?? "Internal error" }, { status: 500 })
  }
}
