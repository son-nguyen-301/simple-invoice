import { refreshAccessToken } from "@/lib/auth/identity";

export type RefreshResult =
  | { ok: true; accessToken: string; refreshToken: string; expiresIn: number }
  | { ok: false };

/**
 * In-flight refresh promises keyed by the refresh token. The gateway rotates
 * the refresh token with no grace window, so two concurrent refreshes of the
 * same token would have the second fail with invalid_grant. Sharing one
 * in-flight call avoids that. Ephemeral, per-instance state.
 */
const inflight = new Map<string, Promise<RefreshResult>>();

export function refreshSession(refreshToken: string): Promise<RefreshResult> {
  const existing = inflight.get(refreshToken);

  if (existing) {
    return existing;
  }

  const promise = (async (): Promise<RefreshResult> => {
    const result = await refreshAccessToken(refreshToken);

    if (!result.ok) {
      return { ok: false };
    }

    return {
      ok: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
  })().finally(() => {
    inflight.delete(refreshToken);
  });

  inflight.set(refreshToken, promise);

  return promise;
}
