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
  getConcept,
  learningHref,
  type LearningMethodId,
} from "@/lib/learning/curriculum";
import { type EntitlementRow } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { guideHref, type GuideTopic } from "@/lib/guides/content";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ method: string; concept: string }>;
};

export default async function LearningConceptPage({ params }: Props) {
  const { method: methodId, concept: conceptSlug } = await params;
  const found = getConcept(methodId, conceptSlug);
  if (!found) notFound();
  const { method, concept } = found;

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
    return <LearningPaywall title={concept.title} />;
  }

  const pathname = learningHref(method.id as LearningMethodId, concept.slug);
  const showVedicExplore =
    concept.slug === "psychic" || concept.slug === "destiny";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-sm text-ink-soft">
          <Link
            href={learningHref(method.id as LearningMethodId)}
            className="text-gold-deep underline"
          >
            {method.title}
          </Link>
        </p>
        <h1 className="mt-1 text-4xl text-ink">{concept.title}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">{concept.detail}</p>
      </header>

      <section className="rounded-2xl border border-[var(--line)] bg-mist/30 px-4 py-4 text-sm leading-7 text-ink-soft">
        <p className="font-medium text-ink">Practice on this page</p>
        <p className="mt-2">
          Use the interactive below right after reading the concept. Numbers in{" "}
          {method.title} are teaching tools—compare them with other methods in
          your report rather than treating any single digit as destiny.
        </p>
        {concept.guideTopic ? (
          <p className="mt-2">
            Digit meaning pages:{" "}
            <Link
              href={guideHref(concept.guideTopic as GuideTopic, "1")}
              className="text-gold-deep underline"
            >
              open guide for 1
            </Link>{" "}
            (change the number in the URL for 2–9).
          </p>
        ) : null}
      </section>

      <LearningInteractiveSlot kind={concept.interactive} />

      {showVedicExplore ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5">
          <VedicNumberExploreGrid />
        </section>
      ) : null}

      <LearningPager pathname={pathname} />
    </div>
  );
}
