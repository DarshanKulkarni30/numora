import Link from "next/link";
import { redirect } from "next/navigation";
import { ReportsList, type DashboardReport } from "@/components/dashboard/ReportsList";
import { DailyLoopCard } from "@/components/today/DailyLoopCard";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

import { isValidDob } from "@/lib/profile/date";

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
  const dailyFrom = list.find((r) => isValidDob(r.date_of_birth));

  return (
    <div>
      <SiteHeader email={user?.email} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl text-ink">Your readings</h1>
            <p className="mt-2 text-ink-soft">
              Signed in as {user?.email}. Filter by person name, select
              readings to delete, and keep reports private to this account.
            </p>
          </div>
          <Link
            href="/report/new"
            className="btn-tactile rounded-full bg-ink px-5 py-2.5 text-paper"
          >
            New report
          </Link>
        </div>

        {dailyFrom ? (
          <div className="mt-8">
            <DailyLoopCard
              natalName={dailyFrom.full_name}
              dateOfBirth={dailyFrom.date_of_birth}
              compact
            />
            <p className="mt-2 text-sm text-ink-soft">
              <Link href="/today" className="text-gold-deep underline">
                Open the seven-day loop
              </Link>
            </p>
          </div>
        ) : null}

        <div className="mt-10">
          <ReportsList initialReports={list} />
        </div>
      </main>
    </div>
  );
}
