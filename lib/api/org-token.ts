import { z } from "zod";

// The org token lives at memberships[0].token, under either a `data` envelope
// or the root. Parse tolerantly (loose) so unrelated upstream shape changes
// degrade to "no token" rather than throwing.
const MembershipArray = z.array(
  z.object({ token: z.string().optional() }).loose(),
);

const OrgTokenSchema = z
  .object({
    data: z
      .object({ memberships: MembershipArray.optional() })
      .loose()
      .optional(),
    memberships: MembershipArray.optional(),
  })
  .loose();

export function extractOrgToken(body: unknown): string | null {
  const parsed = OrgTokenSchema.safeParse(body);

  if (!parsed.success) {
    return null;
  }

  const memberships = parsed.data.data?.memberships ?? parsed.data.memberships;
  const token = memberships?.[0]?.token;

  return token && token.length > 0 ? token : null;
}
