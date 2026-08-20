import type { NameEra } from "./nameHistory";

export const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
  "Other",
] as const;

export const PURPOSE_OPTIONS = [
  "Self-reflection",
  "Relationships",
  "Career",
  "Family guidance",
  "General curiosity",
] as const;

export const RELATIONSHIP_OPTIONS = [
  "Spouse/Partner",
  "Child",
  "Parent",
  "Sibling",
  "Other relative",
] as const;

export type GenderOption = (typeof GENDER_OPTIONS)[number];
export type PurposeOption = (typeof PURPOSE_OPTIONS)[number];
export type RelationshipOption = (typeof RELATIONSHIP_OPTIONS)[number];

export type PersonRecord = {
  id?: string;
  is_self: boolean;
  relationship: string;
  full_name: string;
  preferred_name: string;
  date_of_birth: string;
  gender: string;
  purpose: string;
  sort_order: number;
  /** Later legal / marriage names. Birth-certificate full_name stays natal. */
  name_history?: NameEra[];
  /** Changes to full_name / DOB after first confirm (server-managed). */
  identity_edit_count?: number;
  identity_confirmed_at?: string | null;
};

export function guessNameFromUser(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): { fullName: string; preferredName: string } {
  const meta = user.user_metadata ?? {};
  const fromMeta = String(
    meta.full_name || meta.name || meta.preferred_username || "",
  ).trim();
  if (fromMeta) {
    const first = fromMeta.split(/\s+/)[0] || fromMeta;
    return { fullName: fromMeta, preferredName: first };
  }
  const email = user.email?.trim() || "";
  if (!email) return { fullName: "", preferredName: "" };
  const local = email.split("@")[0] || "";
  const pretty = local
    .replace(/[._-]+/g, " ")
    .replace(/\d+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    fullName: pretty || local,
    preferredName: (pretty.split(/\s+/)[0] || pretty || local).trim(),
  };
}
