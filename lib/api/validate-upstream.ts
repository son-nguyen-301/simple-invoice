import { z } from "zod";

import { INVOICES_PATH } from "@/lib/api/endpoints";
import { createInvoicePayloadSchema } from "@/lib/invoices/create-payload-schema";

type ValidatedRoute = {
  method: string;
  path: string;
  schema: z.ZodType;
};

// Upstream routes whose request body we validate server-side before
// forwarding. Routes not listed here pass through unchanged.
const VALIDATED_ROUTES: ValidatedRoute[] = [
  { method: "POST", path: INVOICES_PATH, schema: createInvoicePayloadSchema },
];

export type ValidationResult = { ok: true } | { ok: false; issues: unknown };

export function validateUpstreamRequest(
  method: string,
  pathSegments: string[],
  body: Buffer | undefined,
): ValidationResult {
  const path = pathSegments.join("/");
  const match = VALIDATED_ROUTES.find(
    (route) => route.method === method && route.path === path,
  );

  if (!match) {
    return { ok: true };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(body ? body.toString("utf8") : "");
  } catch {
    return { ok: false, issues: { formErrors: ["Body is not valid JSON"] } };
  }

  const result = match.schema.safeParse(parsed);

  if (!result.success) {
    return { ok: false, issues: z.flattenError(result.error) };
  }

  return { ok: true };
}
