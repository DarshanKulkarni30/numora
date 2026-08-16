import { LearningHashRedirect } from "@/components/learning/LearningHashRedirect";

export const dynamic = "force-dynamic";

/** Old standalone calculator URL → practice block on Learning home. */
export default function BirthDestinyTryRedirect() {
  return <LearningHashRedirect href="/learning#practice" />;
}
