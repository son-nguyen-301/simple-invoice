import type { BrowserContext } from "@playwright/test";

import { sealSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function seedSession(context: BrowserContext): Promise<void> {
  const value = await sealSession({
    accessToken: "e2e-access",
    refreshToken: "e2e-refresh",
    orgToken: "e2e-org",
    accessExpiresAt: Date.now() + 60 * 60 * 1000,
  });

  await context.addCookies([
    {
      name: SESSION_COOKIE,
      value,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}
