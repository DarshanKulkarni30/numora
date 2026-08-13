"use client";

import Link from "next/link";
import { guideHref, type GuideTopic } from "@/lib/guides/content";

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
  const tip = `Click for more about ${label} ${shown}`;
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
