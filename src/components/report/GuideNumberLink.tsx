"use client";

import Link from "next/link";
import { guideHref, type GuideTopic } from "@/lib/guides/content";
import { plainJob, plainTrait } from "@/lib/numerology/layeredCopy";

type Props = {
  topic: GuideTopic;
  value: string | number;
  label: string;
  /** Visible text; defaults to value */
  display?: string;
  className?: string;
};

export function GuideNumberLink({
  topic,
  value,
  label,
  display,
  className,
}: Props) {
  const href = guideHref(topic, value);
  const shown = display ?? String(value);
  // A tooltip that only says "click for more" wastes the hover. Lead with what
  // the number actually means and one thing to try, then the navigation hint.
  const digit = Number(String(value).replace(/\D/g, ""));
  const meaning = Number.isFinite(digit) && digit > 0 ? plainTrait(digit) : null;
  const job = Number.isFinite(digit) && digit > 0 ? plainJob(digit) : null;
  const tip = meaning
    ? `${label} ${shown}: ${meaning}. Try: ${job}. Click to open the full guide.`
    : `${label} ${shown} — click to open the full guide.`;
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={tip}
      aria-label={tip}
      className={
        className ??
        "brand text-lg text-ink underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
      }
    >
      {shown}
    </Link>
  );
}
