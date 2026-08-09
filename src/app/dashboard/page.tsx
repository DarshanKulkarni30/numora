import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ReportsList,
  type DashboardReport,
} from "@/components/dashboard/ReportsList";
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
    .select(
      "id, full_name, preferred_name, date_of_birth, age, report_type, created_at, snapshot",
    )
    .order("created_at", { ascending: false });

  const list = (reports ?? []) as DashboardReport[];

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
            className="rounded-full bg-ink px-5 py-2.5 text-paper hover:bg-sea-deep"
          >
            New report
          </Link>
        </div>

        <div className="mt-10">
          <ReportsList initialReports={list} />
        </div>
      </main>
    </div>
  );
}
