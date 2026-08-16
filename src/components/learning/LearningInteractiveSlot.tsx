"use client";

import Link from "next/link";
import { DobLifePathDemo } from "@/components/learning/DobLifePathDemo";
import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";
import { NameNumberDemo } from "@/components/learning/NameNumberDemo";
import { PersonalYearDemo } from "@/components/learning/PersonalYearDemo";
import type { LearningInteractive } from "@/lib/learning/curriculum";

export function LearningInteractiveSlot({
  kind,
}: {
  kind: LearningInteractive;
}) {
  if (kind === "none") return null;
  if (kind === "dob-psychic-destiny") return <DobPsychicDestinyDemo />;
  if (kind === "dob-life-path") return <DobLifePathDemo />;
  if (kind === "name-pythagorean")
    return <NameNumberDemo mapId="pythagorean" />;
  if (kind === "name-chaldean") return <NameNumberDemo mapId="chaldean" />;
  if (kind === "personal-year") return <PersonalYearDemo />;
  return null;
}

export function LearningPaywall({ title }: { title?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-6 py-10 text-center">
      <h2 className="text-2xl text-ink">{title ?? "Full Learning"}</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        Method hubs, concept pages, and name master-table demos are included
        with Week Pass and prepaid packs. Free plans keep the introduction and
        the Psychic / Destiny calculator.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/pricing"
          className="btn-tactile inline-block rounded-full bg-sea px-6 py-3 text-paper hover:bg-sea-deep"
        >
          View plans
        </Link>
        <Link
          href="/learning/try/birth-destiny"
          className="btn-tactile inline-block rounded-full border border-[var(--line)] bg-white/80 px-6 py-3 text-ink"
        >
          Try free calculator
        </Link>
      </div>
    </div>
  );
}
