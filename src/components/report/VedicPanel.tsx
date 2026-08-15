"use client";

import Link from "next/link";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { planetGuideHref } from "@/lib/guides/planets";
import { planetForVedic } from "@/lib/numerology/planets";
import { vedicNumberProfile } from "@/lib/numerology/vedicNumberProfile";
import { oppositesForReport } from "@/lib/numerology/vedicSquare";
import { TrioFitPanel } from "@/components/report/TrioFitPanel";

type UnitSystemBits = {
  birth_day_note: string;
  birth_day_exalted: boolean;
  temperament_summary: string;
  doshas: string[];
  harmony_label: string;
  harmony_detail: string;
  harmony_tone: string;
  psychic_ease: string;
  destiny_ease: string;
  psychic_note: string;
  destiny_note: string;
  zero_note: string | null;
  compat_note: string;
};

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
  unitName?: string;
  unitCompound?: string;
  nameCompound?: string;
  rulingPlanet: string;
  destinyRulingPlanet?: string;
  unitSystem?: UnitSystemBits | null;
};

const EASE_LABEL: Record<string, string> = {
  easier: "Often easier day-to-day",
  mixed: "Mixed day-to-day",
  more_demanding: "More demanding day-to-day",
};

const TONE_STYLE: Record<string, string> = {
  supportive: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  mixed: "border-amber-300/40 bg-amber-400/15 text-amber-50",
  stretch: "border-rose-300/40 bg-rose-500/15 text-rose-50",
};

const CARD_SUB: Record<string, string> = {
  Psychic: "From your birth day",
  Destiny: "From your full birth date",
  Name: "From your name letters",
};

export function VedicPanel({
  psychic,
  destiny,
  nameNumber,
  unitName,
  unitCompound,
  nameCompound,
  unitSystem,
}: Props) {
  const cards = [
    { label: "Psychic", topic: "vedic-psychic" as const, value: psychic },
    { label: "Destiny", topic: "vedic-destiny" as const, value: destiny },
    { label: "Name", topic: "vedic-name" as const, value: nameNumber },
  ];

  const oppositePairs = oppositesForReport(psychic, destiny, nameNumber);
  const psychicProfile = vedicNumberProfile(psychic);

  return (
    <div className="rounded-2xl border border-[var(--sys-vedic-border)] bg-gradient-to-br from-ink via-[#1e293b] to-[#0f172a] p-6 text-paper">
      <p className="text-sm uppercase tracking-[0.2em] text-sand">
        Vedic numbers
      </p>
      <p className="mt-2 text-sm text-paper/75">
        Three core digits from day, full date, and name. Tap a number for its
        character guide (planet, easy/careful with others, tone).
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => {
          const planet = planetForVedic(c.value);
          return (
            <div
              key={c.topic}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
              title={`${c.label} ${c.value} · ${planet.name}`}
            >
              <p className="text-[10px] uppercase tracking-wider text-sand">
                {c.label}
              </p>
              <p className="mt-0.5 text-[10px] text-paper/55">
                {CARD_SUB[c.label]}
              </p>
              <GuideNumberLink
                topic={c.topic}
                value={c.value}
                label={`Vedic ${c.label}`}
                className="brand mt-2 inline-block text-3xl text-paper hover:text-sand"
              />
              <p className="mt-2 text-[10px] text-paper/50">
                Tap for character
              </p>
              <div className="mt-2 flex justify-center">
                <PlanetIcon
                  planet={planet}
                  size="sm"
                  variant="dark"
                  href={planetGuideHref("vedic", planet.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <TrioFitPanel
          compactVedicOnly
          variant="dark"
          vedicBirth={psychic}
          vedicDestiny={destiny}
          vedicName={nameNumber}
          chaldeanName={nameNumber}
          pythBirth={psychic}
          pythDestiny={destiny}
          pythName={nameNumber}
        />
      </div>

      {unitSystem ? (
        <div
          className={`mt-5 rounded-xl border px-3 py-2 ${
            TONE_STYLE[unitSystem.harmony_tone] ?? TONE_STYLE.mixed
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider opacity-80">
            How your three Vedic numbers fit
          </p>
          <p className="mt-1 font-medium">{unitSystem.harmony_label}</p>
          <p className="mt-1 text-xs opacity-90">{unitSystem.harmony_detail}</p>
        </div>
      ) : null}

      {oppositePairs.length > 0 ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-sand">
            Balancing pairs
          </p>
          <p className="mt-1 text-xs text-paper/65">
            Number pairs that often pull in opposite directions—useful to
            notice, not a judgment.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {oppositePairs.map((pair) => {
              const tags = [
                pair.inPsychic ? "Psychic" : null,
                pair.inDestiny ? "Destiny" : null,
                pair.inName ? "Name" : null,
              ].filter(Boolean);
              return (
                <Link
                  key={`${pair.a}-${pair.b}`}
                  href={`/guide/vedic-square/${pair.a}`}
                  className="btn-tactile max-w-full rounded-xl border border-sand/35 bg-sand/10 px-3 py-2 text-left transition hover:bg-sand/20"
                  title={pair.theme}
                >
                  <span className="font-medium text-sand">
                    {pair.a} ↔ {pair.b}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-paper/70">
                    {pair.planets}
                    {tags.length ? ` · ${tags.join(" · ")}` : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <p className="text-[10px] uppercase tracking-wider text-sand">
          Easy / careful with other numbers
        </p>
        <p className="mt-1 text-xs text-paper/65">
          Based on Psychic {psychic}—who you may find easier or harder to
          sync with day to day.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {psychicProfile.friendly.map((n) => (
            <span
              key={`f-${n}`}
              className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-100"
            >
              Often easy · {n}
            </span>
          ))}
          {psychicProfile.challenging.map((n) => (
            <span
              key={`c-${n}`}
              className="rounded-full border border-rose-300/35 bg-rose-500/15 px-2 py-0.5 text-xs text-rose-100"
            >
              Needs care · {n}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-paper/60">
          Destiny {destiny}: {destinyProfileOneLiner(destiny)}
        </p>
      </div>

      {unitName ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-sand">
            Two name counts
          </p>
          <p className="mt-1 text-xs text-paper/65">
            Same name, two letter maps—shown together so you can compare.
          </p>
          <p className="mt-2 text-paper/90">
            Map A{" "}
            <span className="brand text-lg text-paper">{nameNumber}</span>
            {nameCompound ? (
              <span className="text-paper/60"> (before reduce {nameCompound})</span>
            ) : null}
          </p>
          <p className="mt-1 text-paper/90">
            Map B{" "}
            <span className="brand text-lg text-sand">{unitName}</span>
            {unitCompound ? (
              <span className="text-paper/60">
                {" "}
                (before reduce {unitCompound})
              </span>
            ) : null}
          </p>
        </div>
      ) : null}

      {unitSystem ? (
        <details className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <summary className="cursor-pointer text-sand">More detail</summary>
          <div className="mt-3 space-y-3 text-paper/85">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-sand">
                  Birth-day rhythm
                </p>
                <p className="mt-1 text-xs">
                  {EASE_LABEL[unitSystem.psychic_ease] ?? unitSystem.psychic_ease}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-sand">
                  Life-path rhythm
                </p>
                <p className="mt-1 text-xs">
                  {EASE_LABEL[unitSystem.destiny_ease] ??
                    unitSystem.destiny_ease}
                </p>
              </div>
            </div>
            <p className="text-xs leading-5">{unitSystem.birth_day_note}</p>
            {unitSystem.doshas.length ? (
              <div className="flex flex-wrap gap-1.5">
                {unitSystem.doshas.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-sand/40 bg-sand/10 px-2.5 py-0.5 text-xs text-sand"
                  >
                    {d}
                  </span>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-paper/70">
              {unitSystem.temperament_summary}
            </p>
            {unitSystem.zero_note ? (
              <p className="text-xs text-paper/65">{unitSystem.zero_note}</p>
            ) : null}
          </div>
        </details>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-paper/80">
        <p className="flex flex-wrap items-center gap-2">
          <span>Birth-day planet:</span>
          <PlanetIcon
            planet={planetForVedic(psychic)}
            size="sm"
            variant="dark"
            href={planetGuideHref("vedic", planetForVedic(psychic).id)}
          />
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span>Full-date planet:</span>
          <PlanetIcon
            planet={planetForVedic(destiny)}
            size="sm"
            variant="dark"
            href={planetGuideHref("vedic", planetForVedic(destiny).id)}
          />
        </p>
      </div>
    </div>
  );
}

function destinyProfileOneLiner(destiny: string): string {
  const p = vedicNumberProfile(destiny);
  return `${p.color} · ${p.gem}`;
}
