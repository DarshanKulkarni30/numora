import {
  AdminDeactivateButton,
  AdminInviteForm,
} from "@/components/admin/AdminSettingsForms";
import { entitlementsEnforce } from "@/lib/entitlements";
import { hasServiceRole } from "@/lib/supabase/service";
import { createServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const enforce = entitlementsEnforce();
  const checks = [
    {
      label: "SUPABASE_SERVICE_ROLE_KEY",
      ok: hasServiceRole(),
    },
    {
      label: "VERCEL_TOKEN",
      ok: Boolean(process.env.VERCEL_TOKEN),
    },
    {
      label: "VERCEL_PROJECT_ID",
      ok: Boolean(process.env.VERCEL_PROJECT_ID),
    },
    {
      label: "ENTITLEMENTS_ENFORCE",
      ok: true,
      note: enforce ? "true (limits on)" : "false (open beta)",
    },
  ];

  let admins: Array<{
    email: string;
    role: string;
    active: boolean;
  }> = [];
  let error: string | null = null;

  if (hasServiceRole()) {
    try {
      const svc = createServiceClient();
      const { data, error: e } = await svc
        .from("admin_users")
        .select("email, role, active")
        .order("email");
      if (e) error = e.message;
      admins = data ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load admins";
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Settings</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Admin roster and environment readiness. Bootstrap email remains a
          fallback if the table is empty.
        </p>
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
        <h2 className="text-lg text-ink">Env checklist</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {checks.map((c) => (
            <li key={c.label}>
              <span className={c.ok ? "text-emerald-800" : "text-rose-800"}>
                {c.ok ? "OK" : "MISSING"}
              </span>{" "}
              {c.label}
              {c.note ? ` · ${c.note}` : ""}
            </li>
          ))}
        </ul>
      </section>

      <AdminInviteForm />

      {error ? <p className="text-sm text-rose-800">{error}</p> : null}

      <ul className="space-y-2 text-sm">
        {admins.map((a) => (
          <li
            key={a.email}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-white/60 px-3 py-2"
          >
            <span>
              <span className="text-ink">{a.email}</span> · {a.role} ·{" "}
              {a.active ? "active" : "inactive"}
            </span>
            <AdminDeactivateButton email={a.email} active={a.active} />
          </li>
        ))}
        {!admins.length ? (
          <li className="text-ink-soft">
            No rows in admin_users yet (bootstrap email still works).
          </li>
        ) : null}
      </ul>
    </div>
  );
}
