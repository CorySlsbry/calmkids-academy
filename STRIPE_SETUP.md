# Stripe Setup — CalmKids Academy

> All payment flows happen on the **parent-facing web interface**.
> The Android/Capacitor app does NOT use in-app billing — it loads the web app
> via a remote URL, so Stripe web checkout handles all transactions.
> This satisfies both Stripe ToS and Google Play Families Policy.

---

## Pricing tiers

| Plan     | Price     | Billing       | Stripe mode    | Env var                       |
|----------|-----------|---------------|----------------|-------------------------------|
| Monthly  | $4.99/mo  | Monthly       | `subscription` | `STRIPE_PRICE_MONTHLY`        |
| Annual   | $79/yr    | Yearly        | `subscription` | `STRIPE_PRICE_ANNUAL`         |
| Lifetime | $199      | One-time      | `payment`      | `STRIPE_PRICE_LIFETIME`       |

Monthly and Annual both include a **14-day free trial** (no credit card at signup).
Lifetime is a one-time payment with no trial.

---

## Step 1 — Get your API keys

1. Create an account at [stripe.com](https://stripe.com) (if you don't have one)
2. In the Stripe Dashboard → **Developers → API keys**:
   - Copy **Publishable key** (`pk_test_...` for test, `pk_live_...` for production)
   - Copy **Secret key** (`sk_test_...` or `sk_live_...`)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

---

## Step 2 — Create products and prices

Run the idempotent setup script:

```bash
npx tsx scripts/setup-stripe.ts
```

This creates:
- 1 Product: "CalmKids Academy"
- 3 Prices: Monthly ($4.99/mo), Annual ($79/yr), Lifetime ($199 one-time)

The script prints the price IDs — add them to `.env.local`:

```
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_LIFETIME=price_...
```

Also add the public-facing price IDs for the client-side pricing page:

```
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_...
```

The script is **idempotent** — safe to run multiple times. If the product or prices already exist, it skips creation and just prints the existing IDs.

---

## Step 3 — Set up the webhook

1. In Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://calmkids-academy.app/api/webhooks/stripe`
   (Use your actual deployment URL)
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
4. Copy the **Signing secret** (`whsec_...`) and add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

For **local development**, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the whsec_ it prints and use that as STRIPE_WEBHOOK_SECRET locally
```

---

## Step 4 — Enable the Customer Portal

Parents can manage their subscription (update card, cancel, view invoices) via the portal.

1. Stripe Dashboard → **Settings → Billing → Customer portal**
2. Enable the portal
3. Configure:
   - Allow cancellation: **Yes**
   - Allow payment method updates: **Yes**
   - Show invoice history: **Yes**
   - Business information: fill in your name + support email
4. Save

The portal is called via `POST /api/portal` from the parent dashboard settings page.

---

## Step 5 — Test the flow

Use these Stripe test card numbers:

| Card number         | Result                        |
|---------------------|-------------------------------|
| `4242 4242 4242 4242` | Payment succeeds              |
| `4000 0000 0000 3220` | 3D Secure authentication      |
| `4000 0000 0000 9995` | Payment declined (funds)      |
| `4100 0000 0000 0019` | Payment blocked (fraud)       |

Use any future expiry date (e.g., `12/34`) and any 3-digit CVC.

---

## Play Store Families Policy — billing compliance

**CRITICAL**: Google Play requires that apps in the Families/Kids category do NOT
process payments inside the Android app using Play Store billing or any in-app
purchase mechanism targeting children.

CalmKids Academy complies by:

1. The Android app loads the web app via a remote URL (`capacitor.config.ts → server.url`)
2. All checkout flows redirect to `stripe.com/pay/...` in the device browser
3. No Play Store billing APIs are used
4. No `android.permission.BILLING` is declared in `AndroidManifest.xml`
5. No payment UI exists inside the Android/Capacitor WebView

This means:
- Parents complete checkout on the web (Stripe-hosted page or in-browser)
- The Android app checks subscription status from the Supabase `subscriptions` table
- Google Play does NOT take a 15–30% commission on these transactions

See `PLAY_STORE_DEPLOYMENT.md` for the full Play Store submission checklist.

---

## Environment variables summary

```bash
# Required for payments to work
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Set after running scripts/setup-stripe.ts
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_LIFETIME=price_...

# Public — used in client-side /pricing page
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_...

# App URL — used in Checkout redirect URLs
NEXT_PUBLIC_APP_URL=https://calmkids-academy.app
```

---

## Going live checklist

- [ ] Swap `sk_test_` → `sk_live_` (and matching `pk_live_`)
- [ ] Re-run `npx tsx scripts/setup-stripe.ts` against live mode to create live prices
- [ ] Update `STRIPE_PRICE_*` env vars with live price IDs
- [ ] Create a new webhook endpoint in Stripe Dashboard for the live URL
- [ ] Update `STRIPE_WEBHOOK_SECRET` with the live webhook signing secret
- [ ] Test a real $4.99 charge with a real card before publishing to Play Store
- [ ] Verify webhook delivery in Stripe Dashboard → Webhooks → [endpoint] → Recent deliveries
