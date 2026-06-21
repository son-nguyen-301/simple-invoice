import axios from "axios";
import type { NextRequest } from "next/server";

import { readValidUrl } from "@/lib/http";

/** Inbound headers safe to forward verbatim to the upstream. */
const FORWARDED_HEADERS = ["content-type", "operation-mode", "accept"];

export type ForwardResult =
  | {
      ok: true;
      status: number;
      // The upstream binary payload, relayed verbatim into a NextResponse.
      // Typed as BodyInit so the relay needs no cast at the Node/web boundary.
      body: BodyInit;
      contentType: string | null;
    }
  | { ok: false; reason: "misconfigured" | "unavailable" };

/**
 * Forward an inbound request to the upstream API gateway, attaching the auth
 * headers server-side and relaying the exact upstream status, body and
 * Content-Type. Never throws on an upstream error status.
 *
 * @param body - Optional pre-read request body buffer. When provided, it is
 *   used directly instead of reading from the (single-use) request stream.
 *   Callers that may invoke this function more than once for the same request
 *   (e.g. 401-recovery retries) MUST pre-read the body and pass it here so
 *   the stream is not consumed twice.
 */
export async function forwardToUpstream(
  request: NextRequest,
  pathSegments: string[],
  auth: { accessToken: string; orgToken?: string },
  body?: Buffer,
): Promise<ForwardResult> {
  const apiBaseUrl = readValidUrl(process.env.API_BASE_URL);

  if (!apiBaseUrl) {
    return { ok: false, reason: "misconfigured" };
  }

  const url = `${apiBaseUrl}/${pathSegments.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${auth.accessToken}`,
  };

  if (auth.orgToken) {
    headers["org-token"] = auth.orgToken;
  }

  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);

    if (value) {
      headers[name] = value;
    }
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const data = hasBody
    ? (body ?? Buffer.from(await request.arrayBuffer()))
    : undefined;

  let response;

  try {
    response = await axios.request({
      url,
      method: request.method,
      headers,
      data,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  const contentType = response.headers["content-type"];

  return {
    ok: true,
    status: response.status,
    body: response.data,
    contentType: typeof contentType === "string" ? contentType : null,
  };
}
