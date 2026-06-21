import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { forwardToUpstream, type ForwardResult } from "@/lib/api/proxy";
import { fetchOrgToken } from "@/lib/api/upstream-profile";
import { refreshSession } from "@/lib/auth/refresh";
import {
  applySession,
  clearSession,
  readSession,
  type SessionData,
} from "@/lib/auth/session";

/** Refresh proactively if the access token expires within this window (ms). */
const REFRESH_SKEW_MS = 30_000;

/** 401 + `x-session-expired`: tells the client the session is dead, re-login. */
function expired(): NextResponse {
  const response = NextResponse.json(
    { error: "unauthenticated" },
    { status: 401 },
  );

  response.headers.set("x-session-expired", "1");

  return response;
}

/** A dead session: signal expiry AND clear the now-useless sealed cookie. */
function destroy(): NextResponse {
  const response = expired();

  clearSession(response);

  return response;
}

function relay(result: Extract<ForwardResult, { ok: true }>): NextResponse {
  return new NextResponse(result.body, {
    status: result.status,
    headers: result.contentType
      ? { "Content-Type": result.contentType }
      : undefined,
  });
}

function failure(result: Extract<ForwardResult, { ok: false }>): NextResponse {
  const status = result.reason === "misconfigured" ? 500 : 502;
  const error =
    result.reason === "misconfigured"
      ? "server_misconfigured"
      : "upstream_unavailable";

  return NextResponse.json({ error }, { status });
}

/**
 * Mint a fresh session from a refresh token: rotate the access/refresh tokens
 * and re-fetch the org token. Returns null when the session cannot be renewed
 * (refresh token dead or profile unreachable) - the caller must then destroy it.
 */
async function renewSession(refreshToken: string): Promise<SessionData | null> {
  const refreshed = await refreshSession(refreshToken);

  if (!refreshed.ok) {
    return null;
  }

  const profile = await fetchOrgToken(refreshed.accessToken);

  if (!profile.ok) {
    return null;
  }

  return {
    accessToken: refreshed.accessToken,
    refreshToken: refreshed.refreshToken,
    orgToken: profile.orgToken,
    accessExpiresAt: Date.now() + refreshed.expiresIn * 1000,
  };
}

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  let session = await readSession(request);

  if (!session) {
    return expired();
  }

  const { path } = await context.params;

  // Buffer the body ONCE: NextRequest body streams are single-use, and a
  // 401-recovery retry forwards the same request again.
  const requestBody =
    request.method !== "GET" && request.method !== "HEAD"
      ? Buffer.from(await request.arrayBuffer())
      : undefined;

  const forward = (current: SessionData) =>
    forwardToUpstream(
      request,
      path,
      { accessToken: current.accessToken, orgToken: current.orgToken },
      requestBody,
    );

  // When the session changes (refresh / stale-org), re-seal it onto the response.
  let resealed: SessionData | null = null;

  // Proactive refresh: renew a near-expired access token before forwarding.
  if (Date.now() >= session.accessExpiresAt - REFRESH_SKEW_MS) {
    const renewed = await renewSession(session.refreshToken);

    if (!renewed) {
      return destroy();
    }

    session = renewed;
    resealed = renewed;
  }

  let result = await forward(session);

  if (!result.ok) {
    return failure(result);
  }

  // Reactive recovery on an upstream 401.
  if (result.status === 401) {
    const probe = await fetchOrgToken(session.accessToken);

    if (probe.ok) {
      // Access token still valid -> org token was stale. Re-seal + retry once.
      session = { ...session, orgToken: probe.orgToken };
      resealed = session;
      result = await forward(session);
    } else if (probe.reason === "unauthorized") {
      // Access token dead -> renew via the refresh token, then retry once.
      const renewed = await renewSession(session.refreshToken);

      if (!renewed) {
        return destroy();
      }

      session = renewed;
      resealed = renewed;
      result = await forward(session);
    }
    // Any other probe failure -> fall through and relay the original 401 as-is.

    if (!result.ok) {
      return failure(result);
    }
  }

  const response = relay(result);

  if (resealed) {
    await applySession(response, resealed, { remember: true });
  }

  return response;
}

export function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return handle(request, context);
}

export function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return handle(request, context);
}
