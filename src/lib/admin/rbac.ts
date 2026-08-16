import { ADMIN_EMAILS } from "@/lib/entitlements/admin";

export type AdminRole = "superadmin" | "operator" | "support" | "billing";

export type AdminContext = {
  email: string;
  role: AdminRole;
  source: "bootstrap" | "table";
};

const ROLE_RANK: Record<AdminRole, number> = {
  support: 1,
  billing: 2,
  operator: 3,
  superadmin: 4,
};

export function can(
  role: AdminRole,
  action:
    | "read_users"
    | "block_users"
    | "write_notes"
    | "manage_issues"
    | "read_activity"
    | "read_audit"
    | "read_trends"
    | "read_billing"
    | "override_plan"
    | "read_vercel"
    | "manage_admins",
): boolean {
  switch (action) {
    case "read_users":
    case "write_notes":
    case "manage_issues":
    case "read_activity":
    case "read_trends":
      return ROLE_RANK[role] >= ROLE_RANK.support;
    case "read_billing":
      return role === "billing" || ROLE_RANK[role] >= ROLE_RANK.operator;
    case "block_users":
    case "read_audit":
    case "read_vercel":
      return ROLE_RANK[role] >= ROLE_RANK.operator;
    case "override_plan":
    case "manage_admins":
      return role === "superadmin";
    default:
      return false;
  }
}

export function bootstrapRole(email?: string | null): AdminRole | null {
  if (!email) return null;
  if (ADMIN_EMAILS.has(email.trim().toLowerCase())) return "superadmin";
  return null;
}
