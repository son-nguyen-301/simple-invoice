import { z } from "zod";

/** Inbound POST /api/login request body. Reusable client-side for a future login form. */
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  remember: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Outbound OAuth2 password-grant payload. Validating this before the network call
 * turns a missing/blank env credential into a clear server error instead of a
 * confusing upstream 400.
 */
export const oauthTokenRequestSchema = z.object({
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  grant_type: z.literal("password"),
  scope: z.literal("openid"),
  username: z.string().min(1),
  password: z.string().min(1),
});

export type OAuthTokenRequest = z.infer<typeof oauthTokenRequestSchema>;

/** Outbound OAuth2 refresh-token grant payload. */
export const oauthRefreshRequestSchema = z.object({
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  grant_type: z.literal("refresh_token"),
  refresh_token: z.string().min(1),
});

export type OAuthRefreshRequest = z.infer<typeof oauthRefreshRequestSchema>;
