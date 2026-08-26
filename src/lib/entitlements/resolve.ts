import { isAdminEmail } from "./admin";
import { planDef, type PlanFeatures, type PlanId } from "./plans";

export type EntitlementRow = {
  plan_id: string | null;
  status: string | null;
  current_period_end: string | null;
};

export type Entitlements = {
  planId: PlanId;
  label: string;
  maxPeople: number;
  /** Family members beyond Self. */
  maxFamily: number;
  identityEditLimit: number | null;
  features: PlanFeatures;
  enforce: boolean;
  isAdmin: boolean;
};

/** When false (default), signed-in users get open-beta access; admin always full. */
export function entitlementsEnforce(): boolean {
  const raw = process.env.ENTITLEMENTS_ENFORCE?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/**
 * Pre-launch testing: allow selecting and copying report text.
 * Set NEXT_PUBLIC_ALLOW_REPORT_COPY=false at product launch to restore
 * Free-plan copy protection.
 */
export function reportCopyUnlocked(): boolean {
  const raw = process.env.NEXT_PUBLIC_ALLOW_REPORT_COPY?.trim().toLowerCase();
  if (raw === "0" || raw === "false" || raw === "no") return false;
  return true;
}

function isActivePaid(
  row: EntitlementRow | null | undefined,
): { planId: PlanId } | null {
  if (!row?.plan_id) return null;
  const status = (row.status || "").toLowerCase();
  if (status && status !== "active" && status !== "trialing") return null;
  if (row.current_period_end) {
    const end = Date.parse(row.current_period_end);
    if (!Number.isNaN(end) && end < Date.now()) return null;
  }
  const id = row.plan_id as PlanId;
  if (
    id === "week_pass" ||
    id === "pack_3mo" ||
    id === "pack_6mo" ||
    id === "pack_12mo" ||
    id === "pack_24mo"
  ) {
    return { planId: id };
  }
  return null;
}

export function resolveEntitlements(
  email?: string | null,
  row?: EntitlementRow | null,
): Entitlements {
  const enforce = entitlementsEnforce();
  const admin = isAdminEmail(email);

  if (admin) {
    const def = planDef("admin");
    return {
      planId: "admin",
      label: def.label,
      maxPeople: def.maxPeople,
      maxFamily: Math.max(0, def.maxPeople - 1),
      identityEditLimit: def.identityEditLimit,
      features: { ...def.features },
      enforce,
      isAdmin: true,
    };
  }

  if (!enforce) {
    const def = planDef("open_beta");
    return {
      planId: "open_beta",
      label: def.label,
      maxPeople: def.maxPeople,
      maxFamily: Math.max(0, def.maxPeople - 1),
      identityEditLimit: def.identityEditLimit,
      features: { ...def.features },
      enforce,
      isAdmin: false,
    };
  }

  const paid = isActivePaid(row);
  const planId: PlanId = paid?.planId ?? "free";
  const def = planDef(planId);
  return {
    planId,
    label: def.label,
    maxPeople: def.maxPeople,
    maxFamily: Math.max(0, def.maxPeople - 1),
    identityEditLimit: def.identityEditLimit,
    features: { ...def.features },
    enforce,
    isAdmin: false,
  };
}
