/**
 * GET /api/checkout/session?session_id=xxx
 * Returns plan type for a completed Stripe checkout session.
 * Used by the /welcome page to show the correct confirmation message.
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, getPlanType } from "@/lib/stripe"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price"],
    })

    const price    = session.line_items?.data[0]?.price
    const planType = price ? getPlanType(price) : "monthly"

    return NextResponse.json({ planType, status: session.status })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
