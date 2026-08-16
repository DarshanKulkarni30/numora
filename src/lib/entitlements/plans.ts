/**
 * Product plans for NumoraWisdom (display + limits).
 * Stripe checkout is not wired yet — plan_id is stored for future billing.
 */

export type PlanId =
  | "free"
  | "week_pass"
  | "pack_3mo"
  | "pack_6mo"
  | "pack_12mo"
  | "pack_24mo"
  | "admin"
  | "open_beta";

export type PlanFeatures = {
  business: boolean;
  pdf: boolean;
  copy: boolean;
};

export type PlanDef = {
  id: PlanId;
  label: string;
  /** Total people slots including Self. */
  maxPeople: number;
  /** Max identity (name+DOB) edits after first confirm; null = unlimited. */
  identityEditLimit: number | null;
  features: PlanFeatures;
  /** USD display price; null = free / not sold. */
  priceUsd: number | null;
  blurb: string;
};

export const IDENTITY_EDIT_LIMIT_DEFAULT = 3;

export const PLANS: Record<PlanId, PlanDef> = {
  free: {
    id: "free",
    label: "Free",
    maxPeople: 1,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: false, pdf: false, copy: false },
    priceUsd: 0,
    blurb:
      "One Self profile, personal report, name/family/trivia explorers, and mobile fit. View-only reports.",
  },
  week_pass: {
    id: "week_pass",
    label: "Week Pass",
    maxPeople: 4,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: 20,
    blurb:
      "Family of 4 (including you) with full tools for 7 days, then back to Free. Includes PDF export.",
  },
  pack_3mo: {
    id: "pack_3mo",
    label: "3 months",
    maxPeople: 6,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: 15,
    blurb: "Full access for up to 6 profiles — from $5/mo when billed quarterly.",
  },
  pack_6mo: {
    id: "pack_6mo",
    label: "6 months",
    maxPeople: 6,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: 27,
    blurb: "Full access for up to 6 profiles (~10% off vs quarterly).",
  },
  pack_12mo: {
    id: "pack_12mo",
    label: "12 months",
    maxPeople: 6,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: 50,
    blurb: "Full access for up to 6 profiles for a year.",
  },
  pack_24mo: {
    id: "pack_24mo",
    label: "24 months",
    maxPeople: 6,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: 90,
    blurb: "Full access for up to 6 profiles for two years.",
  },
  admin: {
    id: "admin",
    label: "Admin",
    maxPeople: 32,
    identityEditLimit: null,
    features: { business: true, pdf: true, copy: true },
    priceUsd: null,
    blurb: "Internal testing — up to 32 profiles, all features.",
  },
  open_beta: {
    id: "open_beta",
    label: "Open beta",
    maxPeople: 6,
    identityEditLimit: IDENTITY_EDIT_LIMIT_DEFAULT,
    features: { business: true, pdf: true, copy: true },
    priceUsd: null,
    blurb: "Soft-launch testing — full tools while ENTITLEMENTS_ENFORCE is off.",
  },
};

export const SELLABLE_PLANS: PlanId[] = [
  "free",
  "week_pass",
  "pack_3mo",
  "pack_6mo",
  "pack_12mo",
  "pack_24mo",
];

export function planDef(id: PlanId): PlanDef {
  return PLANS[id] ?? PLANS.free;
}
