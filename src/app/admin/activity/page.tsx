import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY to view activity.
      </p>
    );
  }
  const svc = createServiceClient();
  const { data, error } = await svc
    .from("app_activity_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Activity</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Product events (login, reports, profile saves).
        </p>
      </div>
      {error ? <p className="text-sm text-rose-800">{error.message}</p> : null}
      <ul className="space-y-2 text-sm">
        {(data ?? []).map((e) => (
          <li
            key={e.id}
            className="rounded-lg border border-[var(--line)] bg-white/60 px-3 py-2 text-ink-soft"
          >
            <span className="text-ink">{e.event_type}</span>
            {e.user_id ? (
              <>
                {" "}
                ·{" "}
                <a
                  href={`/admin/users/${e.user_id}`}
                  className="underline"
                >
                  {e.user_id.slice(0, 8)}…
                </a>
              </>
            ) : null}
            {e.path ? ` · ${e.path}` : ""} ·{" "}
            {new Date(e.created_at).toLocaleString()}
          </li>
        ))}
        {!data?.length ? (
          <li className="text-ink-soft">No events yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
