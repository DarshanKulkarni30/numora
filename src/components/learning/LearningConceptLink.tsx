import Link from "next/link";
import {
  learningHref,
  REPORT_LEARNING_LINKS,
} from "@/lib/learning/curriculum";

type Props = {
  /** Key from REPORT_LEARNING_LINKS (often same as GuideTopic). */
  conceptKey: string;
  className?: string;
};

export function LearningConceptLink({ conceptKey, className }: Props) {
  const entry = REPORT_LEARNING_LINKS[conceptKey];
  if (!entry) return null;
  return (
    <Link
      href={learningHref(entry.method, entry.concept)}
      className={
        className ??
        "text-xs text-gold-deep/90 underline decoration-gold/40 underline-offset-2 hover:text-gold-deep"
      }
    >
      {entry.label}
    </Link>
  );
}
