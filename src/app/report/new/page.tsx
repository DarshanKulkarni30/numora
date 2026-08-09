import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportForm } from "@/components/ReportForm";
import type { PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function NewReportPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl text-ink">New reading</h1>
          <p className="mt-3 text-ink-soft">
            Choose a saved person from your profile, confirm the details, then
            generate.
          </p>
        </div>
        <div className="mt-10">
          <ReportForm people={(data ?? []) as PersonRecord[]} />
        </div>
      </main>
    </div>
  );
}
