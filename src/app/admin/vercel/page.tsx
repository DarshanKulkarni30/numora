import { fetchVercelDeployments } from "@/lib/admin/vercel";

export const dynamic = "force-dynamic";

export default async function AdminVercelPage() {
  const vercel = await fetchVercelDeployments(15);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Vercel</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Platform health for NumoraWisdom hosting. Set{" "}
          <code className="text-xs">VERCEL_TOKEN</code>,{" "}
          <code className="text-xs">VERCEL_PROJECT_ID</code>, and optional{" "}
          <code className="text-xs">VERCEL_TEAM_ID</code>.
        </p>
      </div>

      <a
        href={vercel.dashboardUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-block text-sm text-gold-deep underline"
      >
        Open Vercel dashboard
      </a>

      {vercel.error ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {vercel.error}
        </p>
      ) : null}

      <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
        <h2 className="text-lg text-ink">Recent deployments</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {vercel.deployments.map((d) => (
            <li key={d.uid} className="flex flex-wrap gap-2 text-ink-soft">
              <span className="font-medium text-ink">{d.state}</span>
              <span>{d.target || "preview"}</span>
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
          {!vercel.deployments.length && !vercel.error ? (
            <li>No deployments returned.</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-xl border border-dashed border-[var(--line)] bg-mist/40 px-4 py-4 text-sm text-ink-soft">
        <p className="font-medium text-ink">Hobby / Pro upgrade cues</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Watch build minutes and bandwidth in the Vercel dashboard.</li>
          <li>
            Move to Pro when concurrent builds, commerce webhooks, or team
            seats become limiting.
          </li>
          <li>
            Usage APIs vary by plan — this panel always links out for authoritative
            limits.
          </li>
        </ul>
      </section>
    </div>
  );
}
