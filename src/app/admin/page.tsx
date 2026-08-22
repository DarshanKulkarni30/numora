import Link from "next/link";
import { entitlementsEnforce } from "@/lib/entitlements";
import { hasServiceRole, createServiceClient } from "@/lib/supabase/service";
import { fetchVercelDeployments } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

async function loadStats() {
  if (!hasServiceRole()) {
    return {
      users: null as number | null,
      reports7: null as number | null,
      reports30: null as number | null,
      blocked: null as number | null,
      openIssues: null as number | null,
      error: "Add SUPABASE_SERVICE_ROLE_KEY for live admin stats.",
    };
  }
  const svc = createServiceClient();
  const since7 = new Date(Date.now() - 7 * 864e5).toISOString();
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();

  const [
    authList,
    { count: reports7 },
    { count: reports30 },
    { count: blocked },
    { count: openIssues },
  ] = await Promise.all([
    svc.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    svc
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since7),
    svc
      .from("reports")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since30),
    svc
      .from("user_moderation")
      .select("*", { count: "exact", head: true })
      .not("blocked_at", "is", null),
    svc
      .from("admin_issues")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]),
  ]);

  return {
    users: authList.data?.users?.length ?? 0,
    reports7: reports7 ?? 0,
    reports30: reports30 ?? 0,
    blocked: blocked ?? 0,
    openIssues: openIssues ?? 0,
    error: authList.error?.message ?? null,
  };
}

export default async function AdminHomePage() {
  const stats = await loadStats();
  const vercel = await fetchVercelDeployments(3);
  const enforce = entitlementsEnforce();

  const cards = [
    { label: "Auth users (≤1000 listed)", value: stats.users ?? "—" },
    { label: "Reports (7d)", value: stats.reports7 ?? "—" },
    { label: "Reports (30d)", value: stats.reports30 ?? "—" },
    { label: "Blocked", value: stats.blocked ?? "—" },
    { label: "Open issues", value: stats.openIssues ?? "—" },
    {
      label: "Entitlements",
      value: enforce ? "ENFORCE" : "OPEN BETA",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-ink">Admin overview</h1>
        <p className="mt-2 text-sm text-ink-soft">
          NumoraWisdom operations console. Run the admin SQL migration and set
          service-role / Vercel env vars for full data.
        </p>
        {stats.error ? (
          <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {stats.error}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {c.label}
            </p>
            <p className="mt-2 brand text-2xl text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg text-ink">Recent Vercel deploys</h2>
          <Link
            href="/admin/vercel"
            className="text-sm text-gold-deep underline"
          >
            Full panel
          </Link>
        </div>
        {vercel.error ? (
          <p className="mt-2 text-sm text-ink-soft">{vercel.error}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {vercel.deployments.map((d) => (
              <li key={d.uid} className="flex flex-wrap gap-2 text-ink-soft">
                <span className="text-ink">{d.state}</span>
                <a
                  href={`https://${d.url}`}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {d.url}
                </a>
                <span>{new Date(d.created).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/admin/users" className="text-gold-deep underline">
          Users
        </Link>
        <Link href="/admin/issues" className="text-gold-deep underline">
          Issues
        </Link>
        <Link href="/admin/trends" className="text-gold-deep underline">
          Trends
        </Link>
        <Link href="/admin/research" className="text-gold-deep underline">
          Research
        </Link>
      </div>
    </div>
  );
}
