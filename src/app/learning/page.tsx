import Link from "next/link";
import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";
import {
  LEARNING_METHODS,
  learningHref,
} from "@/lib/learning/curriculum";
import {
  resolveEntitlements,
  type EntitlementRow,
} from "@/lib/entitlements";
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
  const entitlements = resolveEntitlements(user?.email, entitlementRow);
  const full = entitlements.features.learningFull;

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <h1 className="text-4xl text-ink">Learning</h1>
        <p className="mt-3 text-ink-soft">
          {BRAND_NAME} teaches how reflective numerology numbers are built—so
          reports feel clearer, not mysterious. Start with the introduction,
          try a free birth calculator, then open method hubs when you have full
          Learning access.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/learning/what-is-numerology"
          className="btn-tactile rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5 text-left hover:-translate-y-px"
        >
          <p className="text-lg text-ink">What is numerology?</p>
          <p className="mt-2 text-sm text-ink-soft">
            Methods used in {BRAND_NAME}: Pythagorean, Chaldean, Vedic
            (Indian-style), Lo Shu, and timing cycles.
          </p>
        </Link>
        <Link
          href="/learning/try/birth-destiny"
          className="btn-tactile rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5 text-left hover:-translate-y-px"
        >
          <p className="text-lg text-ink">Try: Psychic &amp; Destiny</p>
          <p className="mt-2 text-sm text-ink-soft">
            Free interactive—enter a date of birth and see both numbers step by
            step.
          </p>
        </Link>
      </section>

      <section>
        <h2 className="text-xl text-ink">Try it now</h2>
        <p className="mt-1 text-sm text-ink-soft">
          A taste of the Learning section—full method pages unlock with a plan.
        </p>
        <div className="mt-4">
          <DobPsychicDestinyDemo />
        </div>
      </section>

      <section>
        <h2 className="text-xl text-ink">Methods</h2>
        {!full ? (
          <p className="mt-2 text-sm text-ink-soft">
            Full concept pages and name master tables require a paid plan.{" "}
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
                  <p className="mt-2 text-sm text-ink-soft">{m.blurb}</p>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-4 py-4 opacity-80">
                  <p className="font-medium text-ink">{m.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{m.subtitle}</p>
                  <p className="mt-2 text-sm text-ink-soft">{m.blurb}</p>
                  <p className="mt-3 text-xs text-gold-deep">
                    Included with full Learning
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
