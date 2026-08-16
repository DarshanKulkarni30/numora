import Link from "next/link";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminUsersPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "").trim().toLowerCase();

  if (!hasServiceRole()) {
    return (
      <div>
        <h1 className="text-3xl text-ink">Users</h1>
        <p className="mt-3 text-sm text-amber-900">
          Set SUPABASE_SERVICE_ROLE_KEY to list auth users.
        </p>
      </div>
    );
  }

  const svc = createServiceClient();
  const { data, error } = await svc.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  let users = data?.users ?? [];
  if (query) {
    users = users.filter((u) =>
      (u.email || "").toLowerCase().includes(query),
    );
  }

  const ids = users.map((u) => u.id);
  const [{ data: mods }, { data: ents }] = await Promise.all([
    ids.length
      ? svc.from("user_moderation").select("*").in("user_id", ids)
      : Promise.resolve({ data: [] as Array<{ user_id: string; blocked_at: string | null }> }),
    ids.length
      ? svc.from("user_entitlements").select("*").in("user_id", ids)
      : Promise.resolve({ data: [] as Array<{ user_id: string; plan_id: string }> }),
  ]);

  const modMap = new Map((mods ?? []).map((m) => [m.user_id, m]));
  const entMap = new Map((ents ?? []).map((e) => [e.user_id, e]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Users</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Auth users (first 200). Search filters this page.
        </p>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Filter by email"
          className="flex-1 rounded-xl border border-[var(--line)] bg-white/80 px-4 py-2 text-ink outline-none ring-gold focus:ring-2"
        />
        <button
          type="submit"
          className="rounded-full bg-sea px-5 py-2 text-sm text-paper hover:bg-sea-deep"
        >
          Search
        </button>
      </form>

      {error ? (
        <p className="text-sm text-rose-800">{error.message}</p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const mod = modMap.get(u.id);
              const ent = entMap.get(u.id);
              const blocked = Boolean(mod?.blocked_at);
              return (
                <tr key={u.id} className="border-t border-[var(--line)]">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                    >
                      {u.email || u.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-ink-soft">
                    {ent?.plan_id || "free"}
                  </td>
                  <td className="px-3 py-2">
                    {blocked ? (
                      <span className="text-rose-800">Blocked</span>
                    ) : (
                      <span className="text-emerald-800">Active</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-ink-soft">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
