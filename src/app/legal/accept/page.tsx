import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AcceptTermsForm } from "@/components/legal/AcceptTermsForm";
import { CURRENT_TERMS_VERSION, TERMS_TITLE } from "@/lib/legal/terms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AcceptTermsPage({ searchParams }: Props) {
  if (!isSupabaseConfigured()) redirect("/login");

  const { next: nextParam } = await searchParams;
  const next =
    nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/legal/accept?next=${next}`)}`);

  let alreadyAccepted = false;
  try {
    const { data } = await supabase
      .from("user_terms_acceptance")
      .select("terms_version")
      .eq("user_id", user.id)
      .maybeSingle();
    alreadyAccepted = data?.terms_version === CURRENT_TERMS_VERSION;
  } catch {
    alreadyAccepted = false;
  }
  if (alreadyAccepted) redirect(next);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
      <div className="mx-auto max-w-lg space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Required once · version {CURRENT_TERMS_VERSION}
          </p>
          <h1 className="mt-2 text-3xl text-ink">Accept Terms of Use</h1>
          <p className="mt-3 text-sm text-ink-soft">
            Before using NumoraWisdom, please review and accept our Terms. They
            prohibit copying, scraping, or replicating proprietary tables,
            visuals, report layouts, and Learning materials.
          </p>
        </header>

        <p className="text-sm">
          <Link href="/legal/terms" className="text-gold-deep underline">
            Read full {TERMS_TITLE}
          </Link>
        </p>

        <Suspense fallback={<p className="text-ink-soft">Loading…</p>}>
          <AcceptTermsForm nextPath={next} />
        </Suspense>
      </div>
    </main>
  );
}
