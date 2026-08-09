import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportForm } from "@/components/ReportForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function NewReportPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <SiteHeader email={user?.email} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl text-ink">New reading</h1>
          <p className="mt-3 text-ink-soft">
            Enter the birth-certificate name and full date of birth. Optional
            fields personalize tone only.
          </p>
        </div>
        <div className="mt-10">
          <ReportForm />
        </div>
      </main>
    </div>
  );
}
