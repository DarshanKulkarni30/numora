import Link from "next/link";
import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";
import { LearningPager } from "@/components/learning/LearningPager";
import {
  LEARNING_METHODS,
  learningHref,
} from "@/lib/learning/curriculum";
import { hasLearningFullAccess } from "@/lib/learning/access";
import { type EntitlementRow } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function LearningHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let entitlementRow: EntitlementRow | null = null;
  if (user) {
    try {
      const { data: ent } = await supabase
        .from("user_entitlements")
        .select("plan_id, status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle();
      entitlementRow = (ent as EntitlementRow) ?? null;
    } catch {
      entitlementRow = null;
    }
  }
  const full = await hasLearningFullAccess(user?.email, entitlementRow);

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <h1 className="text-4xl text-ink">Learning</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          {BRAND_NAME} teaches how reflective numerology numbers are built—so
          reports feel clearer, not mysterious. Each method page keeps the
          lesson and its calculator together: read a concept, then try the math
          immediately below. Use Previous / Next to walk methods.
        </p>
      </header>

      <section>
        <Link
          href="/learning/what-is-numerology"
          className="btn-tactile block max-w-2xl rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5 text-left hover:-translate-y-px"
        >
          <p className="text-lg text-ink">What is numerology?</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Origins, how the math works, and short notes on each method—then a
            Psychic &amp; Destiny practice on that same page.
          </p>
        </Link>
      </section>

      <section id="practice" className="scroll-mt-24">
        <h2 className="text-xl text-ink">Practice: Psychic &amp; Destiny</h2>
        <p className="mt-1 text-sm leading-6 text-ink-soft">
          Free interactive on this page—enter a date, see both numbers step by
          step. Full method lessons (with a calculator under every concept) open
          below when you have Learning access.
        </p>
        <div className="mt-4">
          <DobPsychicDestinyDemo />
        </div>
      </section>

      <section>
        <h2 className="text-xl text-ink">Method lessons</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Open a method to scroll every concept with its interactive right
          underneath—no separate calculator page.
        </p>
        {!full ? (
          <p className="mt-2 text-sm text-ink-soft">
            Full method lessons require a paid plan (or admin access).{" "}
            <Link href="/pricing" className="text-gold-deep underline">
              View plans
            </Link>
          </p>
        ) : null}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_METHODS.map((m) => (
            <li key={m.id}>
              {full ? (
                <Link
                  href={learningHref(m.id)}
                  className="btn-tactile block rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-4 hover:-translate-y-px"
                >
                  <p className="font-medium text-ink">{m.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{m.subtitle}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {m.blurb}
                  </p>
                  <p className="mt-3 text-xs text-gold-deep">
                    Lessons + try-it on one page
                  </p>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-4 py-4 opacity-80">
                  <p className="font-medium text-ink">{m.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{m.subtitle}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    {m.blurb}
                  </p>
                  <p className="mt-3 text-xs text-gold-deep">
                    Included with full Learning
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <LearningPager pathname="/learning" />
    </div>
  );
}
