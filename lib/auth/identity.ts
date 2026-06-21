import axios from "axios";
import { z } from "zod";

import { readValidUrl } from "@/lib/http";
import {
  oauthRefreshRequestSchema,
  oauthTokenRequestSchema,
} from "@/lib/auth/schema";

/** OAuth2 token endpoint path (not environment-specific). */
export const TOKEN_PATH = "/t/101digital.core/oauth2/token";

/** A successful token grant carries these fields (extra fields ignored). */
const tokenResponseSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
  })
  .loose();

export type AuthResult =
  | {
      ok: true;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }
  | {
      ok: false;
      reason: "invalid_credentials" | "misconfigured" | "unavailable";
    };

/**
 * Shared response-parsing logic for both the password grant and the
 * refresh-token grant. Maps HTTP status codes and validates the token fields.
 */
function parseTokenResponse(response: {
  status: number;
  data: unknown;
}): AuthResult {
  // The documented failure is 400 invalid_grant (bad credentials / dead token).
  if (response.status === 400) {
    return { ok: false, reason: "invalid_credentials" };
  }

  if (response.status < 200 || response.status >= 300) {
    return { ok: false, reason: "unavailable" };
  }

  const parsed = tokenResponseSchema.safeParse(response.data);

  if (parsed.success) {
    return {
      ok: true,
      accessToken: parsed.data.access_token,
      refreshToken: parsed.data.refresh_token,
      expiresIn: parsed.data.expires_in,
    };
  }

  return { ok: false, reason: "unavailable" };
}

/**
 * Exchange user credentials for an access token via the OAuth2 password grant.
 * Validates the outbound payload (catching missing/blank env config) before
 * making the network call.
 */
export async function requestAccessToken(
  username: string,
  password: string,
): Promise<AuthResult> {
  const authBaseUrl = readValidUrl(process.env.AUTH_BASE_URL);

  if (!authBaseUrl) {
    return { ok: false, reason: "misconfigured" };
  }

  const payload = oauthTokenRequestSchema.safeParse({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "password",
    scope: "openid",
    username,
    password,
  });

  if (!payload.success) {
    return { ok: false, reason: "misconfigured" };
  }

  let response;

  try {
    response = await axios.post(
      `${authBaseUrl}${TOKEN_PATH}`,
      new URLSearchParams(payload.data).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true,
      },
    );
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  return parseTokenResponse(response);
}

/**
 * Exchange a refresh token for a fresh access token via the OAuth2
 * refresh-token grant. The gateway rotates the refresh token (a new one comes
 * back; the old one dies immediately), so callers MUST persist the returned
 * refreshToken. A 400 means the refresh token is dead -> treat as terminal.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthResult> {
  const authBaseUrl = readValidUrl(process.env.AUTH_BASE_URL);

  if (!authBaseUrl) {
    return { ok: false, reason: "misconfigured" };
  }

  const payload = oauthRefreshRequestSchema.safeParse({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  if (!payload.success) {
    return { ok: false, reason: "misconfigured" };
  }

  let response;

  try {
    response = await axios.post(
      `${authBaseUrl}${TOKEN_PATH}`,
      new URLSearchParams(payload.data).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true,
      },
    );
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  return parseTokenResponse(response);
}
