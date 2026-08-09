import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <div>
      <SiteHeader email={email} />
      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="relative grid min-h-[78vh] items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <p className="brand text-5xl text-sea-deep md:text-7xl">Numerora</p>
            <h1 className="mt-4 max-w-xl text-3xl leading-tight text-ink md:text-4xl">
              Quiet clarity from your name and birth date
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-ink-soft">
              Pythagorean, Chaldean, Vedic, and Lo Shu insights woven into one
              private, on-screen reading—for reflection, not prediction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={email ? "/report/new" : "/login?next=/report/new"}
                className="rounded-full bg-sea px-6 py-3 text-paper transition hover:bg-sea-deep"
              >
                Begin a reading
              </Link>
              <Link
                href={email ? "/dashboard" : "/login"}
                className="rounded-full border border-[var(--line)] bg-white/50 px-6 py-3 text-ink transition hover:bg-white"
              >
                {email ? "Your dashboard" : "Sign in with email"}
              </Link>
            </div>
          </div>

          <div className="animate-rise-delay relative">
            <div className="animate-drift absolute -right-4 -top-6 h-40 w-40 rounded-full bg-sea/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-gradient-to-br from-[#1f6f78] via-[#14545b] to-[#122028] p-8 text-paper shadow-[0_30px_80px_var(--glow)]">
              <p className="text-sm uppercase tracking-[0.25em] text-sand">
                Sample snapshot
              </p>
              <p className="brand mt-6 text-5xl">Life Path</p>
              <p className="mt-2 text-7xl font-light">7</p>
              <p className="mt-6 max-w-sm text-sm leading-7 text-paper/80">
                According to numerology traditions, this may indicate a season of
                thoughtful study and inward clarity—possibilities, never
                certainties.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 border-t border-[var(--line)] pt-14 md:grid-cols-3">
          {[
            [
              "Four traditions",
              "Pythagorean core numbers, Chaldean name vibration, Vedic psychic & destiny, and Lo Shu grid planes.",
            ],
            [
              "Saved privately",
              "Magic-link sign-in keeps your readings in your account—ready when you return.",
            ],
            [
              "View-only free tier",
              "On-screen reports with copy protection. PDF export is planned for a later paid plan.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <h2 className="text-xl text-ink">{title}</h2>
              <p className="mt-2 leading-7 text-ink-soft">{copy}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
