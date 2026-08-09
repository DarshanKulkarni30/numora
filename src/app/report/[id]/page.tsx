import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ReportView } from "@/components/ReportView";
import type { NumerologyReport } from "@/lib/numerology/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: Props) {
  if (!isSupabaseConfigured()) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("reports")
    .select("report")
    .eq("id", id)
    .maybeSingle();

  if (error || !data?.report) notFound();

  const report = data.report as NumerologyReport;

  return (
    <div>
      <SiteHeader email={user?.email} />
      <ReportView report={report} watermarkEmail={user?.email ?? undefined} />
    </div>
  );
}
