import { NextResponse } from "next/server";

import { clearSession } from "@/lib/auth/session";

/**
 * Clears the session cookie server-side (it is httpOnly, so the browser cannot).
 * Used for an explicit "Sign out". A dead-session redirect is driven by the BFF
 * via the x-session-expired header, not by this route.
 */
export function POST(): NextResponse {
  const response = NextResponse.json({ success: true });

  clearSession(response);

  return response;
}
