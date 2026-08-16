import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LearningInteractiveSlot,
  LearningPaywall,
} from "@/components/learning/LearningInteractiveSlot";
import { LearningPager } from "@/components/learning/LearningPager";
import { VedicNumberExploreGrid } from "@/components/learning/VedicNumberExploreGrid";
import { hasLearningFullAccess } from "@/lib/learning/access";
import {
  getMethod,
  learningHref,
  type LearningMethodId,
} from "@/lib/learning/curriculum";
import { type EntitlementRow } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { guideHref, type GuideTopic } from "@/lib/guides/content";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ method: string }>;
};

/** One scrollable lesson page: each concept’s copy, then its interactive. */
export default async function LearningMethodPage({ params }: Props) {
  const { method: methodId } = await params;
  const method = getMethod(methodId);
  if (!method) notFound();

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

  if (!full) {
    return <LearningPaywall title={`${method.title} Learning`} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <p className="text-sm text-ink-soft">{method.subtitle}</p>
        <h1 className="mt-1 text-4xl text-ink">{method.title}</h1>
        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-soft">
          Origins
        </p>
        <p className="mt-1 text-sm leading-7 text-ink-soft">{method.origin}</p>
        <p className="mt-3 text-sm leading-7 text-ink-soft">{method.detail}</p>
      </header>

      <nav
        className="rounded-2xl border border-[var(--line)] bg-mist/30 px-4 py-3"
        aria-label={`${method.title} lessons`}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
          On this page
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {method.concepts.map((c) => (
            <li key={c.slug}>
              <a
                href={`#${c.slug}`}
                className="text-gold-deep underline decoration-gold/40 underline-offset-2"
              >
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {method.id === "vedic" ? (
        <section
          id="explore-meanings"
          className="scroll-mt-24 space-y-3 rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5"
        >
          <VedicNumberExploreGrid />
        </section>
      ) : null}

      {method.concepts.map((concept) => (
        <section
          key={concept.slug}
          id={concept.slug}
          className="scroll-mt-24 space-y-4 border-t border-[var(--line)] pt-8"
        >
          <div>
            <h2 className="text-2xl text-ink">{concept.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              {concept.detail}
            </p>
            {concept.guideTopic ? (
              <p className="mt-2 text-xs text-ink-soft">
                Digit guides:{" "}
                <Link
                  href={guideHref(concept.guideTopic as GuideTopic, "1")}
                  className="text-gold-deep underline"
                >
                  open 1
                </Link>{" "}
                (change the URL for 2–9).
              </p>
            ) : null}
          </div>
          {concept.interactive !== "none" ? (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-soft">
                Try it here
              </p>
              <LearningInteractiveSlot kind={concept.interactive} />
            </div>
          ) : (
            <p className="text-sm text-ink-soft">
              This idea shows on your report chart—no separate calculator. Open a
              saved report after you understand Psychic and Destiny above.
            </p>
          )}
        </section>
      ))}

      <LearningPager pathname={learningHref(method.id as LearningMethodId)} />
    </div>
  );
}
