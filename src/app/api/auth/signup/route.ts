/**
 * Server-side Signup Endpoint
 * POST /api/auth/signup
 *
 * Creates a Supabase auth user with email auto-confirmed (no confirmation
 * email round-trip), then explicitly creates a row in `calmkids.profiles`
 * and generates a referral code. Subscription state is created later by
 * the Stripe webhook against the `calmkids.subscriptions` table.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: authData, error: authError } =
      await (supabase.auth as any).admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in." },
          { status: 409 }
        );
      }
      console.error("Auth create error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData?.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Create profile row in calmkids.profiles (was previously a trigger)
    const { error: profileErr } = await (supabase as any)
      .from("profiles")
      .insert({ id: userId, email, full_name: fullName });

    if (profileErr) {
      // Rollback the auth user — profile is required
      await (supabase.auth as any).admin.deleteUser(userId);
      console.error("Profile create error:", profileErr);
      return NextResponse.json(
        { error: "Failed to create user profile: " + profileErr.message },
        { status: 500 }
      );
    }

    // Generate a referral code for the new user (best-effort, non-fatal)
    const { error: refErr } = await (supabase as any).rpc("generate_referral_code", {
      p_user_id: userId,
    });
    if (refErr) {
      console.error("Referral code generation error (non-fatal):", refErr);
    }

    return NextResponse.json({
      success: true,
      user: { id: userId, email: authData.user.email },
    });
  } catch (err) {
    console.error("Unexpected signup error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
