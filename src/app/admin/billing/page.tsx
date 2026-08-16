import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";
import { PLANS, SELLABLE_PLANS } from "@/lib/entitlements";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY for billing overview.
      </p>
    );
  }
  const svc = createServiceClient();
  const { data, error } = await svc.from("user_entitlements").select("*");

  const counts = new Map<string, number>();
  for (const id of SELLABLE_PLANS) counts.set(id, 0);
  for (const row of data ?? []) {
    const id = row.plan_id || "free";
    counts.set(id, (counts.get(id) || 0) + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Billing</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Read-only entitlements. Stripe checkout is not connected — use plan
          override on a user detail page (superadmin).
        </p>
      </div>
      {error ? <p className="text-sm text-rose-800">{error.message}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...counts.entries()].map(([id, n]) => (
          <div
            key={id}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {PLANS[id as keyof typeof PLANS]?.label || id}
            </p>
            <p className="mt-2 brand text-2xl text-ink">{n}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-[var(--line)] bg-mist/40 px-4 py-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">Stripe (later)</p>
        <p className="mt-1">
          When checkout ships, this panel will show customers, subscriptions,
          and invoices. Until then, prepaid packs are assigned manually and
          audited.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Plan</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Period end</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.user_id} className="border-t border-[var(--line)]">
                <td className="px-3 py-2">
                  <a
                    href={`/admin/users/${r.user_id}`}
                    className="underline"
                  >
                    {r.user_id.slice(0, 8)}…
                  </a>
                </td>
                <td className="px-3 py-2">{r.plan_id}</td>
                <td className="px-3 py-2">{r.status}</td>
                <td className="px-3 py-2 text-ink-soft">
                  {r.current_period_end
                    ? new Date(r.current_period_end).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
            {!data?.length ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-ink-soft">
                  No entitlement rows yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
