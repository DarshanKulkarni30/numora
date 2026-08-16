import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY to view audit log.
      </p>
    );
  }
  const svc = createServiceClient();
  const { data, error } = await svc
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(150);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Audit log</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Admin mutations (block, notes, plan overrides, issues).
        </p>
      </div>
      {error ? <p className="text-sm text-rose-800">{error.message}</p> : null}
      <ul className="space-y-2 text-sm">
        {(data ?? []).map((e) => (
          <li
            key={e.id}
            className="rounded-lg border border-[var(--line)] bg-white/60 px-3 py-2"
          >
            <p className="text-ink">
              {e.action}{" "}
              <span className="text-ink-soft">by {e.actor_email}</span>
            </p>
            <p className="text-xs text-ink-soft">
              {e.target_user_id ? `target ${e.target_user_id} · ` : ""}
              {new Date(e.created_at).toLocaleString()}
            </p>
          </li>
        ))}
        {!data?.length ? (
          <li className="text-ink-soft">No audit entries yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
