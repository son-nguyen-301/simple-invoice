import { sealData, unsealData } from "iron-session";
import type { NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "session";

/** Persistent-cookie lifetime ceiling (7 days). The access token is refreshed
 *  silently underneath this; the cookie is the outer bound for "remember me". */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Guard below the browser's ~4096 B/cookie limit; if exceeded, escalate to a
 *  server-side store (Design C) rather than splitting cookies. */
const SESSION_COOKIE_MAX = 3800;

export type SessionData = {
  accessToken: string;
  refreshToken: string;
  orgToken: string;
  /** epoch ms; access-token expiry -> refresh TRIGGER (not a logout trigger). */
  accessExpiresAt: number;
};

export class SessionTooLargeError extends Error {
  constructor(size: number) {
    super(
      `Sealed session is ${size}B, over the ${SESSION_COOKIE_MAX}B limit. ` +
        `Migrate to a server-side session store (Design C).`,
    );
    this.name = "SessionTooLargeError";
  }
}

function password(): string {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters.");
  }

  return secret;
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/** Seal the session, throwing if the result would exceed the cookie limit. */
export async function sealSession(data: SessionData): Promise<string> {
  const sealed = await sealData(data, {
    password: password(),
    ttl: SESSION_MAX_AGE,
  });

  if (sealed.length > SESSION_COOKIE_MAX) {
    throw new SessionTooLargeError(sealed.length);
  }

  return sealed;
}

/** Read + decrypt the session from the request; null if absent/invalid. */
export async function readSession(
  request: NextRequest,
): Promise<SessionData | null> {
  const sealed = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sealed) {
    return null;
  }

  try {
    const data = await unsealData<SessionData>(sealed, {
      password: password(),
      ttl: SESSION_MAX_AGE,
    });

    // unsealData returns {} for an expired/invalid seal.
    return data && data.accessToken ? data : null;
  } catch {
    return null;
  }
}

/** Seal `data` and set the session cookie on the response. */
export async function applySession(
  response: NextResponse,
  data: SessionData,
  opts: { remember: boolean },
): Promise<void> {
  const sealed = await sealSession(data);

  response.cookies.set(SESSION_COOKIE, sealed, {
    ...cookieOptions,
    ...(opts.remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
}

/** Expire the session cookie on the response. */
export function clearSession(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
