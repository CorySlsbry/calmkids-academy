/**
 * scripts/setup-stripe.ts
 *
 * Idempotent Stripe product + price setup for CalmKids Academy.
 * Creates the product and three prices if they don't already exist.
 * Prints the IDs so you can add them to .env.local.
 *
 * Usage:
 *   npx tsx scripts/setup-stripe.ts
 *
 * Requires:
 *   STRIPE_SECRET_KEY in environment (or .env.local)
 */

import Stripe from "stripe"

// Load .env.local manually when running outside Next.js
import { config } from "dotenv"
config({ path: ".env.local" })

const SECRET_KEY = process.env.STRIPE_SECRET_KEY
if (!SECRET_KEY) {
  console.error("❌  STRIPE_SECRET_KEY not found in environment.")
  console.error("    Copy .env.example to .env.local and fill in your Stripe test key.")
  process.exit(1)
}

const stripe = new Stripe(SECRET_KEY, { apiVersion: "2024-12-18.acacia" })

const PRODUCT_NAME    = "CalmKids Academy"
const PRODUCT_ID_META = "calmkids-academy-product-v1"

async function getOrCreateProduct(): Promise<Stripe.Product> {
  // Search by metadata so we stay idempotent across re-runs
  const existing = await stripe.products.search({
    query: `metadata["setup_key"]:"${PRODUCT_ID_META}"`,
  })
  if (existing.data.length > 0) {
    console.log(`✓  Product already exists: ${existing.data[0].id}`)
    return existing.data[0]
  }

  const product = await stripe.products.create({
    name: PRODUCT_NAME,
    description:
      "Ad-free, COPPA-compliant educational screen time for children ages 2–8. " +
      "Mindfulness, phonics, and social-emotional learning (SEL) in 15-minute daily sessions.",
    metadata: {
      setup_key: PRODUCT_ID_META,
      app: "calmkids-academy",
      compliance: "COPPA",
      target_age: "2-8",
    },
    tax_code: "txcd_10103001", // Digital educational subscription
  })
  console.log(`✓  Created product: ${product.id}`)
  return product
}

interface PriceDef {
  lookup_key: string
  nickname: string
  unit_amount: number
  currency: string
  recurring: Stripe.PriceCreateParams.Recurring | null
  metadata: Record<string, string>
}

const PRICES: PriceDef[] = [
  {
    lookup_key: "calmkids-monthly",
    nickname: "CalmKids Monthly",
    unit_amount: 499, // $4.99 — per task spec says $4.99/mo for Standard
    currency: "usd",
    recurring: { interval: "month" },
    metadata: { plan_type: "monthly", billing_cycle: "monthly" },
  },
  {
    lookup_key: "calmkids-annual",
    nickname: "CalmKids Annual",
    unit_amount: 7900, // $79/yr — saves ~33% vs monthly
    currency: "usd",
    recurring: { interval: "year" },
    metadata: { plan_type: "annual", billing_cycle: "annual", savings_vs_monthly: "37%" },
  },
  {
    lookup_key: "calmkids-lifetime",
    nickname: "CalmKids Lifetime",
    unit_amount: 19900, // $199 one-time
    currency: "usd",
    recurring: null,
    metadata: { plan_type: "lifetime", billing_cycle: "one_time" },
  },
]

async function getOrCreatePrice(
  product: Stripe.Product,
  def: PriceDef
): Promise<Stripe.Price> {
  // Check by lookup_key — Stripe deduplicates these
  try {
    const existing = await stripe.prices.retrieve(def.lookup_key, {
      // lookup_key retrieval uses this form
    } as Parameters<typeof stripe.prices.retrieve>[1])
    console.log(`✓  Price already exists (${def.nickname}): ${existing.id}`)
    return existing
  } catch {
    // Not found — create it
  }

  const params: Stripe.PriceCreateParams = {
    product: product.id,
    nickname: def.nickname,
    unit_amount: def.unit_amount,
    currency: def.currency,
    lookup_key: def.lookup_key,
    metadata: def.metadata,
    // transfer_lookup_key: true  ← set when migrating lookup keys
  }
  if (def.recurring) {
    params.recurring = def.recurring
  }

  const price = await stripe.prices.create(params)
  console.log(`✓  Created price  (${def.nickname}): ${price.id}`)
  return price
}

async function main() {
  console.log("\n🔧  CalmKids Academy — Stripe Setup\n")

  const product = await getOrCreateProduct()

  const [monthly, annual, lifetime] = await Promise.all(
    PRICES.map((def) => getOrCreatePrice(product, def))
  )

  console.log("\n✅  Done. Add these to your .env.local:\n")
  console.log(`STRIPE_PRICE_MONTHLY="${monthly.id}"`)
  console.log(`STRIPE_PRICE_ANNUAL="${annual.id}"`)
  console.log(`STRIPE_PRICE_LIFETIME="${lifetime.id}"`)
  console.log()

  // Also print lookup keys for use in checkout
  console.log("Lookup keys (alternative to price IDs):")
  console.log(`  Monthly:  ${monthly.lookup_key}`)
  console.log(`  Annual:   ${annual.lookup_key}`)
  console.log(`  Lifetime: ${lifetime.lookup_key}`)
  console.log()
  console.log("⚠️  Remember to create the customer portal at:")
  console.log("   https://dashboard.stripe.com/settings/billing/portal")
  console.log()
}

main().catch((err) => {
  console.error("❌  Stripe setup failed:", err.message)
  process.exit(1)
})
