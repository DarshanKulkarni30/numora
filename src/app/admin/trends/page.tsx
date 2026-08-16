import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

function bucketByDay(
  rows: Array<{ created_at: string }>,
  days: number,
): { label: string; count: number }[] {
  const map = new Map<string, number>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}

function BarChart({
  title,
  series,
}: {
  title: string;
  series: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...series.map((s) => s.count));
  return (
    <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h2 className="text-lg text-ink">{title}</h2>
      <div className="mt-4 flex h-40 items-end gap-1">
        {series.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-sea/80"
              style={{ height: `${(s.count / max) * 100}%`, minHeight: s.count ? 4 : 0 }}
              title={`${s.label}: ${s.count}`}
            />
            <span className="text-[8px] text-ink-soft">
              {s.label.slice(5)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminTrendsPage() {
  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY for trends.
      </p>
    );
  }
  const svc = createServiceClient();
  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: reports }, { data: people }] = await Promise.all([
    svc
      .from("reports")
      .select("created_at")
      .gte("created_at", since),
    svc
      .from("people")
      .select("created_at")
      .gte("created_at", since),
  ]);

  const reportSeries = bucketByDay(reports ?? [], 30);
  const peopleSeries = bucketByDay(people ?? [], 30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Trends</h1>
        <p className="mt-2 text-sm text-ink-soft">Last 30 days.</p>
      </div>
      <BarChart title="Reports / day" series={reportSeries} />
      <BarChart title="People rows created / day" series={peopleSeries} />
    </div>
  );
}
