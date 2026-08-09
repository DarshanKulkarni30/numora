import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, full_name, preferred_name, date_of_birth, age, report_type, created_at, snapshot")
    .order("created_at", { ascending: false });

  return (
    <div>
      <SiteHeader email={user?.email} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-ink">Your readings</h1>
            <p className="mt-2 text-ink-soft">
              Signed in as {user?.email}. Reports stay private to this account.
            </p>
          </div>
          <Link
            href="/report/new"
            className="rounded-full bg-sea px-5 py-2.5 text-paper hover:bg-sea-deep"
          >
            New report
          </Link>
        </div>

        <div className="mt-10 space-y-3">
          {(reports ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-6 py-12 text-center text-ink-soft">
              No saved readings yet.{" "}
              <Link href="/report/new" className="text-sea-deep underline">
                Create your first report
              </Link>
              .
            </div>
          ) : (
            (reports ?? []).map((r) => {
              const snap = r.snapshot as { life_path?: string } | null;
              return (
                <Link
                  key={r.id}
                  href={`/report/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-4 transition hover:bg-white/80"
                >
                  <div>
                    <p className="text-lg text-ink">
                      {r.preferred_name || r.full_name}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {r.date_of_birth} · Age {r.age} · {r.report_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="brand text-2xl text-sea-deep">
                      {snap?.life_path ?? "—"}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
