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
import { sendWelcomeEmail } from "@/lib/email"
import { enrollInGhl } from "@/lib/ghl"

export const dynamic = "force-dynamic"

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const schema = process.env.NEXT_PUBLIC_APP_SCHEMA || "calmkids"
  if (!url || !key) throw new Error("Supabase admin credentials not configured")
  return createClient(url, key, {
    db: { schema },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Stripe v20+ moved `current_period_end` from Subscription onto each
 * SubscriptionItem. Fall back to the legacy top-level field for older
 * webhook payloads still in flight from previous API versions.
 */
function getPeriodEnd(subscription: Stripe.Subscription): number {
  const item = subscription.items?.data?.[0] as any
  return (item?.current_period_end ?? (subscription as any).current_period_end ?? 0) as number
}

/**
 * Stripe v20+ moved `Invoice.subscription` to
 * `Invoice.parent.subscription_details.subscription`. Read the new
 * location first, fall back to the legacy top-level field.
 */
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const fromParent = (invoice as any).parent?.subscription_details?.subscription
  const legacy = (invoice as any).subscription
  const value = fromParent ?? legacy
  if (!value) return null
  return typeof value === "string" ? value : value.id ?? null
}

/**
 * Get-or-create a Supabase auth user keyed by email. On creation, also
 * generates a password-recovery link the user can click from their welcome
 * email to set a password and log in for the first time.
 */
async function getOrCreateUser(
  email: string,
  fullName: string
): Promise<{ userId?: string; setupLink?: string }> {
  const supabase = getSupabaseAdmin()
  try {
    const { data: existing } = await (supabase.auth as any).admin.getUserByEmail(email)
    if (existing?.user?.id) {
      return { userId: existing.user.id }
    }

    const { data: created, error: createErr } = await (supabase.auth as any).admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName || "" },
    })
    if (createErr || !created?.user?.id) {
      console.error("[webhook] auth.createUser failed:", createErr?.message)
      return {}
    }

    const newUserId = created.user.id

    // Explicitly create profile row in calmkids.profiles (was previously a trigger)
    const { error: profileErr } = await (supabase as any)
      .from("profiles")
      .insert({ id: newUserId, email, full_name: fullName || null })
    if (profileErr) {
      console.error("[webhook] profile insert failed:", profileErr.message)
    }

    // Generate a referral code for the new user (best-effort)
    const { error: refErr } = await (supabase as any).rpc("generate_referral_code", {
      p_user_id: newUserId,
    })
    if (refErr) {
      console.error("[webhook] referral code generation failed:", refErr.message)
    }

    // Route the recovery link through /auth/callback → /reset-password so
    // the new user can pick their initial password.
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/callback?next=/reset-password`
    const { data: linkData } = await (supabase.auth as any).admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    })
    return {
      userId: newUserId,
      setupLink: linkData?.properties?.action_link || undefined,
    }
  } catch (err: any) {
    console.error("[webhook] getOrCreateUser error:", err?.message)
    return {}
  }
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
        const customerEmail =
          session.customer_email || session.customer_details?.email || undefined
        const customerName = session.customer_details?.name || ""

        // Provision the auth user before writing the subscription
        let userId: string | undefined
        let setupLink: string | undefined
        if (customerEmail) {
          const result = await getOrCreateUser(customerEmail, customerName)
          userId = result.userId
          setupLink = result.setupLink
        }

        if (session.mode === "payment" && session.payment_intent) {
          // Lifetime one-time purchase
          const pi = await stripe.paymentIntents.retrieve(
            session.payment_intent as string,
            { expand: ["invoice.subscription"] }
          )
          if (pi.status === "succeeded") {
            const priceId = session.line_items
              ? (await stripe.checkout.sessions.listLineItems(session.id)).data[0]?.price?.id ?? ""
              : ""
            await upsertSubscription({
              stripeCustomerId:     session.customer as string,
              stripeSubscriptionId: null,
              priceId,
              status:               "active",
              planType:             "lifetime",
              currentPeriodEnd:     null,
              userId:               userId ?? session.metadata?.user_id ?? null,
            })
          }
        }

        // Welcome email + GHL enrollment (for both subscription and lifetime checkouts)
        if (customerEmail) {
          const [firstName, ...rest] = (customerName || "").split(" ")
          const lastName = rest.join(" ") || undefined

          sendWelcomeEmail(customerEmail, firstName || "", setupLink).catch((e) =>
            console.error("[webhook] welcome email failed:", e?.message || e)
          )

          enrollInGhl({
            email: customerEmail,
            firstName: firstName || undefined,
            lastName,
            priceId: session.metadata?.priceId || undefined,
            stripeCustomerId: session.customer as string,
            metadata: {
              schema: process.env.NEXT_PUBLIC_APP_SCHEMA || "calmkids",
              checkoutSessionId: session.id,
              refCode: (session.metadata as any)?.refCode || "",
            },
          }).catch((e) => console.error("[webhook] GHL enroll failed:", e?.message || e))
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
          currentPeriodEnd:     new Date(getPeriodEnd(sub) * 1000),
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
        const subId = getInvoiceSubscriptionId(invoice)
        if (subId) {
          const supabase = getSupabaseAdmin()
          await supabase
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subId)
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
