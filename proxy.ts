import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  const hasToken = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return hasToken
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  // Protected routes (everything else the matcher catches, i.e. "/").
  return hasToken
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/login"],
};
