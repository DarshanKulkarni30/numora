import { notFound } from "next/navigation";
import { LearningHashRedirect } from "@/components/learning/LearningHashRedirect";
import { getConcept, learningHref } from "@/lib/learning/curriculum";
import type { LearningMethodId } from "@/lib/learning/curriculum";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ method: string; concept: string }>;
};

/**
 * Legacy `/learning/{method}/{concept}` URLs land on the method page
 * at the matching #anchor (lesson + interactive together).
 */
export default async function LearningConceptRedirect({ params }: Props) {
  const { method: methodId, concept: conceptSlug } = await params;
  const found = getConcept(methodId, conceptSlug);
  if (!found) notFound();
  return (
    <LearningHashRedirect
      href={learningHref(
        found.method.id as LearningMethodId,
        found.concept.slug,
      )}
    />
  );
}
