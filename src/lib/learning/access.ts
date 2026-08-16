import { resolveAdminContext } from "@/lib/admin/requireAdmin";
import {
  resolveEntitlements,
  type EntitlementRow,
} from "@/lib/entitlements";

/** Full Learning access: paid/open-beta plan features, or any product admin. */
export async function hasLearningFullAccess(
  email?: string | null,
  row?: EntitlementRow | null,
): Promise<boolean> {
  const entitlements = resolveEntitlements(email, row);
  if (entitlements.features.learningFull) return true;
  const admin = await resolveAdminContext(email);
  return Boolean(admin);
}
