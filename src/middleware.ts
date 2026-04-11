import { type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

/**
 * Middleware — refreshes the Supabase session on every request so that
 * server components get fresh auth cookies. CalmKids Academy doesn't
 * gate any routes in middleware; all pages are public (checkout, privacy,
 * terms, pricing, home) except API endpoints that check auth themselves.
 */
export async function middleware(request: NextRequest) {
  const { response } = await refreshSession(request);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
