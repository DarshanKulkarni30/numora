import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReportOpenPage({ params }: Props) {
  if (!isSupabaseConfigured()) redirect("/login");

  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("reports")
    .select("id, preferred_name, full_name")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const name = data.preferred_name || data.full_name;

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-xl px-5 pb-20 pt-10 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
          Reading ready
        </p>
        <h1 className="mt-3 text-4xl text-ink">{name}</h1>
        <p className="mt-4 text-ink-soft">
          Same numbers, two ways to read. Enhanced is the through-line. Detailed
          is the full catalog.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/report/${id}/session`}
            className="btn-tactile rounded-full bg-ink px-6 py-3 text-paper"
          >
            Present in reading room
          </Link>
          <Link
            href={`/report/${id}/enhanced`}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-6 py-3 text-ink"
          >
            Open enhanced report
          </Link>
          <Link
            href={`/report/${id}`}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-6 py-3 text-ink"
          >
            Open detailed report
          </Link>
        </div>
      </main>
    </div>
  );
}
