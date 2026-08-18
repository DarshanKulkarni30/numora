import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { BRAND_NAME } from "@/lib/site";

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
        <section className="relative grid min-h-[78vh] items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-rise">
            <p className="brand text-4xl text-ink md:text-6xl lg:text-7xl">
              {BRAND_NAME}
            </p>
            <h1 className="mt-4 max-w-xl text-3xl leading-tight text-ink md:text-4xl">
              Discover the story hidden in your numbers.
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-8 text-ink-soft">
              Private readings from your name and birth date—for reflection, not
              prediction.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={email ? "/report/new" : "/login?next=/report/new"}
                className="rounded-full bg-sea px-6 py-3 text-paper shadow-sm transition hover:bg-sea-deep"
              >
                Begin a reading
              </Link>
              <Link
                href={email ? "/dashboard" : "/login"}
                className="rounded-full border-2 border-emerald bg-white/70 px-6 py-3 text-ink transition hover:bg-emerald/10"
              >
                {email ? "Your dashboard" : "Sign in with email"}
              </Link>
            </div>
          </div>

          <div className="animate-rise-delay relative flex items-center justify-center">
            <div className="animate-drift absolute h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
            <div className="animate-drift absolute h-40 w-40 translate-x-10 translate-y-8 rounded-full bg-emerald/20 blur-3xl" />
            <div className="animate-ring relative">
              <Image
                src="/nw-mark.png?v=6"
                alt={`${BRAND_NAME} mark — NW monogram`}
                width={420}
                height={420}
                className="relative z-10 h-auto w-full max-w-md drop-shadow-sm"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 border-t border-[var(--line)] pt-14 md:grid-cols-3">
          {[
            [
              "Four traditions",
              "Pythagorean core numbers, Chaldean name vibration, Vedic psychic and destiny, and Lo Shu grid planes—side by side for reflection.",
            ],
            [
              "Saved privately",
              "Sign in with Google or an email magic link. Your profiles and readings stay in your account.",
            ],
            [
              "Free to start",
              "One Self profile, full personal report, name/family/trivia explorers, and mobile fit. Premium unlocks more family slots, business tools, and PDF export.",
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
