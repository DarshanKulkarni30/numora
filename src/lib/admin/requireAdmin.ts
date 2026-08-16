import { createClient } from "@/lib/supabase/server";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";
import {
  bootstrapRole,
  can,
  type AdminContext,
  type AdminRole,
} from "@/lib/admin/rbac";

export async function resolveAdminContext(
  email?: string | null,
): Promise<AdminContext | null> {
  if (!email) return null;
  const key = email.trim().toLowerCase();

  if (hasServiceRole()) {
    try {
      const svc = createServiceClient();
      const { data } = await svc
        .from("admin_users")
        .select("email, role, active")
        .eq("email", key)
        .maybeSingle();
      if (data?.active && data.role) {
        return {
          email: key,
          role: data.role as AdminRole,
          source: "table",
        };
      }
    } catch {
      // table may not exist yet
    }
  }

  const boot = bootstrapRole(key);
  if (boot) {
    return { email: key, role: boot, source: "bootstrap" };
  }
  return null;
}

export async function requireAdmin(
  action?: Parameters<typeof can>[1],
): Promise<
  | { ok: true; admin: AdminContext }
  | { ok: false; status: number; error: string }
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { ok: false, status: 401, error: "Sign in required." };
    }
    const admin = await resolveAdminContext(user.email);
    if (!admin) {
      return { ok: false, status: 403, error: "Forbidden." };
    }
    if (action && !can(admin.role, action)) {
      return { ok: false, status: 403, error: "Insufficient admin role." };
    }
    return { ok: true, admin };
  } catch {
    return { ok: false, status: 503, error: "Auth unavailable." };
  }
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const ctx = await resolveAdminContext(user?.email);
    return Boolean(ctx);
  } catch {
    return false;
  }
}
