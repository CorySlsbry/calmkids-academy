/**
 * POST /api/webhooks/stripe
 *
 * Receives and verifies Stripe webhook events.
 * Upserts subscription state to Supabase `subscriptions` table.
 *
 * Configure in Stripe Dashboard:
 *   Endpoint URL: https://calmkids-academy.app/api/webhooks/stripe
 *   Events to listen for:
 *     - checkout.session.completed
 *     - customer.subscription.created
 *     - customer.subscription.updated
 *     - customer.subscription.deleted
 *     - invoice.payment_failed
 *     - payment_intent.succeeded   (lifetime one-time purchase)
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, getPlanType, PlanType } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

export const dynamic = "force-dynamic"

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Supabase admin credentials not configured")
  return createClient(url, key)
}

async function upsertSubscription(params: {
  stripeCustomerId: string
  stripeSubscriptionId: string | null
  priceId: string
  status: string
  planType: PlanType
  currentPeriodEnd: Date | null
  userId?: string | null
}) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase.from("subscriptions").upsert(
    {
      stripe_customer_id:     params.stripeCustomerId,
      stripe_subscription_id: params.stripeSubscriptionId,
      price_id:               params.priceId,
      status:                 params.status,
      plan_type:              params.planType,
      current_period_end:     params.currentPeriodEnd?.toISOString() ?? null,
      ...(params.userId ? { user_id: params.userId } : {}),
      updated_at:             new Date().toISOString(),
    },
    { onConflict: "stripe_customer_id" }
  )
  if (error) console.error("[webhook] Supabase upsert error:", error.message)
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const body      = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err?.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── Checkout completed ──────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === "subscription" && session.subscription) {
          // Subscription checkout — handled fully by subscription.created event
          break
        }
        if (session.mode === "payment" && session.payment_intent) {
          // Lifetime one-time purchase
          const pi = await stripe.paymentIntents.retrieve(
            session.payment_intent as string,
            { expand: ["invoice.subscription"] }
          )
          if (pi.status === "succeeded") {
            const priceId  = session.line_items
              ? (await stripe.checkout.sessions.listLineItems(session.id)).data[0]?.price?.id ?? ""
              : ""
            await upsertSubscription({
              stripeCustomerId:     session.customer as string,
              stripeSubscriptionId: null,
              priceId,
              status:              "active",
              planType:            "lifetime",
              currentPeriodEnd:    null,
              userId:              session.metadata?.user_id ?? null,
            })
          }
        }
        break
      }

      // ── Subscription created / updated ──────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub  = event.data.object as Stripe.Subscription
        const item = sub.items.data[0]
        if (!item) break
        // Expand the price to get metadata
        const price = await stripe.prices.retrieve(item.price.id)
        await upsertSubscription({
          stripeCustomerId:     sub.customer as string,
          stripeSubscriptionId: sub.id,
          priceId:              item.price.id,
          status:               sub.status,
          planType:             getPlanType(price),
          currentPeriodEnd:     new Date(sub.current_period_end * 1000),
          userId:               sub.metadata?.user_id ?? null,
        })
        break
      }

      // ── Subscription cancelled ──────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        const supabase = getSupabaseAdmin()
        await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id)
        break
      }

      // ── Payment failed ──────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const supabase = getSupabaseAdmin()
          await supabase
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }
        break
      }

      // ── Lifetime payment intent succeeded ──────────────────────────────
      case "payment_intent.succeeded": {
        // Only act if this PI came from a checkout session (handled above)
        // Direct PI succeeded events are a no-op here
        break
      }

      default:
        // Unhandled event — return 200 to acknowledge receipt
        break
    }
  } catch (err: any) {
    console.error(`[webhook] Error handling ${event.type}:`, err?.message)
    // Return 200 to prevent Stripe retrying — log separately
    return NextResponse.json({ error: "Handler error", type: event.type }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}
