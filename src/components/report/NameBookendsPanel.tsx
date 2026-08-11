"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { guideHref } from "@/lib/guides/content";
import { planetGuideHref } from "@/lib/guides/planets";
import {
  analyzeNameBookends,
  groupBlurb,
  type NameLetterPoint,
} from "@/lib/numerology/nameBookends";

type Props = {
  fullName: string;
};

function LetterTile({
  point,
  onTip,
}: {
  point: NameLetterPoint;
  onTip: (tip: string | null) => void;
}) {
  const blurb = groupBlurb(point.group);
  const tip = [
    `${point.label}: ${point.letter}`,
    `Chaldean group ${point.group} · ${point.planet.name}`,
    blurb ? `${blurb.theme}. ${blurb.approach}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        href={guideHref("name-cornerstone", point.group)}
        target="_blank"
        rel="noopener noreferrer"
        title={`Click for more about name letter group ${point.group}`}
        onMouseEnter={() => onTip(tip)}
        onMouseLeave={() => onTip(null)}
        onFocus={() => onTip(tip)}
        onBlur={() => onTip(null)}
        className="flex aspect-square w-full max-w-[9rem] flex-col items-center justify-center rounded-xl border border-amber-200/80 bg-amber-50 px-2 text-center text-amber-950 outline-none transition hover:border-gold/50 hover:bg-white focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className="text-[10px] uppercase tracking-wider opacity-80">
          {point.label}
        </span>
        <span className="brand mt-1 text-3xl leading-none">{point.letter}</span>
        <span className="mt-1 text-[11px] text-amber-900/80">
          Group {point.group}
        </span>
        {blurb ? (
          <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug opacity-80">
            {blurb.theme}
          </span>
        ) : null}
      </Link>
      <PlanetIcon
        planet={point.planet}
        size="sm"
        href={planetGuideHref("vedic", point.planet.id)}
      />
    </div>
  );
}

export function NameBookendsPanel({ fullName }: Props) {
  const [tip, setTip] = useState<string | null>(null);
  const bookends = useMemo(() => analyzeNameBookends(fullName), [fullName]);
  const points = [
    bookends.cornerstone,
    bookends.capstone,
    bookends.firstVowel,
  ].filter((p): p is NameLetterPoint => p != null);

  if (!bookends.firstName || points.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-8 text-center text-sm text-ink-soft">
        Add a Latin-letter first name to see Cornerstone, Capstone, and First
        vowel bookends.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        First-name bookends for{" "}
        <span className="font-medium text-ink">{bookends.firstName}</span>{" "}
        (from the full name in this reading). Cornerstone = how beginnings may
        feel; Capstone = how completions may feel; First vowel = an inner-drive
        cue. Groups use Chaldean 1–8 letter values—reflective only.
      </p>

      <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
        {points.map((p) => (
          <LetterTile key={p.role} point={p} onTip={setTip} />
        ))}
      </div>

      <ChartTipPanel
        tip={tip}
        empty="Hover a letter tile for its group theme, or click to open the group guide."
      />

      <p className="text-xs text-ink-soft">
        Belief-based spelling cues for the name used here—not predictions,
        medical advice, or fixed character labels.
      </p>
    </div>
  );
}
