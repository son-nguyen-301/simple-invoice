import { NextResponse } from "next/server";
import { z } from "zod";

import { loginSchema } from "@/lib/auth/schema";
import { requestAccessToken } from "@/lib/auth/identity";
import { fetchOrgToken } from "@/lib/api/upstream-profile";
import { applySession } from "@/lib/auth/session";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const result = await requestAccessToken(
    parsed.data.username,
    parsed.data.password,
  );

  if (!result.ok) {
    switch (result.reason) {
      case "invalid_credentials":
        return NextResponse.json(
          { error: "invalid_credentials" },
          { status: 401 },
        );
      case "misconfigured":
        return NextResponse.json(
          { error: "server_misconfigured" },
          { status: 500 },
        );
      case "unavailable":
        return NextResponse.json(
          { error: "auth_unavailable" },
          { status: 502 },
        );

      default: {
        const _exhaustive: never = result.reason; // eslint-disable-line @typescript-eslint/no-unused-vars

        return NextResponse.json({ error: "server_error" }, { status: 500 });
      }
    }
  }

  // A valid session must always carry the org token (invariant).
  const profile = await fetchOrgToken(result.accessToken);

  if (!profile.ok) {
    return NextResponse.json({ error: "profile_unavailable" }, { status: 502 });
  }

  const response = NextResponse.json({ success: true });

  await applySession(
    response,
    {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      orgToken: profile.orgToken,
      accessExpiresAt: Date.now() + result.expiresIn * 1000,
    },
    { remember: parsed.data.remember },
  );

  return response;
}
