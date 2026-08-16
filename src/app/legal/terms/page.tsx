import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { TERMS_SECTIONS, TERMS_TITLE } from "@/lib/legal/terms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  let email: string | undefined;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email ?? undefined;
    } catch {
      email = undefined;
    }
  }

  return (
    <div>
      <SiteHeader email={email} />
      <main className="mx-auto max-w-2xl px-5 pb-20 pt-6">
        <p className="text-xs uppercase tracking-wider text-ink-soft">
          Legal draft — not lawyer-certified
        </p>
        <h1 className="mt-2 text-3xl text-ink">{TERMS_TITLE}</h1>
        <div className="mt-8 space-y-6">
          {TERMS_SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg text-ink">{s.heading}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink-soft">
          <Link href="/legal/accept" className="text-gold-deep underline">
            Accept Terms to continue
          </Link>
        </p>
      </main>
    </div>
  );
}
