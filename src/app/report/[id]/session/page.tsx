import { notFound, redirect } from "next/navigation";
import { ReadingRoom } from "@/components/session/ReadingRoom";
import { applyLivingTiming } from "@/lib/numerology/livingTiming";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import type { NumerologyReport } from "@/lib/numerology/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReportSessionPage({ params }: Props) {
  if (!isSupabaseConfigured()) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/report/${id}/session`);

  const { data, error } = await supabase
    .from("reports")
    .select("report")
    .eq("id", id)
    .maybeSingle();

  if (error || !data?.report) notFound();

  const live = applyLivingTiming(data.report as NumerologyReport);
  const reading = buildEnhancedReading(live, { reportId: id });
  const name =
    live.person.preferred_name?.trim() || live.person.full_name;

  return (
    <ReadingRoom
      reading={reading}
      displayName={name}
      exitHref={`/report/${id}/enhanced`}
      detailedHref={`/report/${id}`}
    />
  );
}
