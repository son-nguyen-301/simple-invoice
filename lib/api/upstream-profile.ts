import axios from "axios";

import { extractOrgToken } from "@/lib/api/org-token";
import { USERS_ME_PATH } from "@/lib/api/endpoints";
import { readValidUrl } from "@/lib/http";

export type OrgTokenResult =
  | { ok: true; orgToken: string }
  | {
      ok: false;
      reason: "unauthorized" | "missing" | "misconfigured" | "unavailable";
    };

/**
 * Fetch the user's profile upstream with the given access token and extract the
 * org token. A 401 here is the authoritative signal that the access token is
 * dead (used by the BFF to decide refresh-vs-relay).
 */
export async function fetchOrgToken(
  accessToken: string,
): Promise<OrgTokenResult> {
  const apiBaseUrl = readValidUrl(process.env.API_BASE_URL);

  if (!apiBaseUrl) {
    return { ok: false, reason: "misconfigured" };
  }

  let response;

  try {
    response = await axios.get(`${apiBaseUrl}/${USERS_ME_PATH}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      validateStatus: () => true,
    });
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  if (response.status === 401) {
    return { ok: false, reason: "unauthorized" };
  }

  if (response.status < 200 || response.status >= 300) {
    return { ok: false, reason: "unavailable" };
  }

  const orgToken = extractOrgToken(response.data);

  return orgToken ? { ok: true, orgToken } : { ok: false, reason: "missing" };
}
