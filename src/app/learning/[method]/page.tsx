import Link from "next/link";
import { notFound } from "next/navigation";
import { LearningPaywall } from "@/components/learning/LearningInteractiveSlot";
import { VedicNumberExploreGrid } from "@/components/learning/VedicNumberExploreGrid";
import {
  getMethod,
  learningHref,
  type LearningMethodId,
} from "@/lib/learning/curriculum";
import {
  resolveEntitlements,
  type EntitlementRow,
} from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ method: string }>;
};

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
  const entitlements = resolveEntitlements(user?.email, entitlementRow);

  if (!entitlements.features.learningFull) {
    return <LearningPaywall title={`${method.title} Learning`} />;
  }

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-sm text-ink-soft">{method.subtitle}</p>
        <h1 className="mt-1 text-4xl text-ink">{method.title}</h1>
        <p className="mt-3 text-ink-soft">{method.blurb}</p>
      </header>

      {method.id === "vedic" ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-5">
          <VedicNumberExploreGrid />
        </section>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {method.concepts.map((c) => (
          <li key={c.slug}>
            <Link
              href={learningHref(method.id as LearningMethodId, c.slug)}
              className="btn-tactile block rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-4 hover:-translate-y-px"
            >
              <p className="font-medium text-ink">{c.title}</p>
              <p className="mt-2 text-sm text-ink-soft">{c.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
