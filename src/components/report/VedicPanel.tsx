"use client";

import Link from "next/link";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { planetGuideHref } from "@/lib/guides/planets";
import { PathStory } from "@/components/report/PathStory";
import {
  bnDnTransition,
  nameOnBnDnPath,
  twoNameMapsCopy,
  VEDIC_LAYER_MAP,
} from "@/lib/numerology/bnDnPath";
import { planetForVedic } from "@/lib/numerology/planets";
import { vedicNumberProfile } from "@/lib/numerology/vedicNumberProfile";
import { vedicDigitTheme } from "@/lib/numerology/vedicNumberThemes";
import { oppositesForReport } from "@/lib/numerology/vedicSquare";

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
  natalNameNumber?: string;
  rulingPlanet: string;
  destinyRulingPlanet?: string;
  unitSystem?: UnitSystemBits | null;
};

const EASE_LABEL: Record<string, string> = {
  easier: "Often easier day-to-day",
  mixed: "Mixed day-to-day",
  more_demanding: "More demanding day-to-day",
};

const CARD_SUB: Record<string, string> = {
  Psychic: "Birth number · default wiring",
  Destiny: "Life curriculum · who you are growing into",
  Name: "Outer face · name in force",
};

export function VedicPanel({
  psychic,
  destiny,
  nameNumber,
  unitName,
  unitCompound,
  nameCompound,
  natalNameNumber,
  unitSystem,
}: Props) {
  const cards = [
    { label: "Psychic", topic: "vedic-psychic" as const, value: psychic },
    { label: "Destiny", topic: "vedic-destiny" as const, value: destiny },
    { label: "Name", topic: "vedic-name" as const, value: nameNumber },
  ];

  const oppositePairs = oppositesForReport(psychic, destiny, nameNumber);
  const psychicProfile = vedicNumberProfile(psychic);
  const path = bnDnTransition(psychic, destiny);
  const nameRole = nameOnBnDnPath(psychic, destiny, nameNumber);
  const maps = twoNameMapsCopy(
    nameNumber,
    unitName,
    nameCompound,
    unitCompound,
  );

  return (
    <div className="rounded-2xl border border-[var(--sys-vedic-border)] bg-gradient-to-br from-ink via-[#1e293b] to-[#0f172a] p-6 text-paper">
      <p className="text-sm uppercase tracking-[0.2em] text-sand">
        Vedic numbers
      </p>
      <p className="mt-2 text-sm text-paper/75">
        Three layers from day, full date, and name spelling. Birth is the
        starting tone, Destiny is the long walk, Name is how you are introduced.
        Tap a number for its character guide.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => {
          const planet = planetForVedic(c.value);
          const theme =
            c.label === "Psychic" || c.label === "Destiny"
              ? vedicDigitTheme(c.value)
              : null;
          return (
            <div
              key={c.topic}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
              title={`${c.label} ${c.value} · ${planet.name}${
                theme ? ` · ${theme.keyword}` : ""
              }`}
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
              {theme ? (
                <p className="mt-1 text-xs font-medium text-sand">
                  {theme.keyword}
                </p>
              ) : null}
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          {
            label: "Psychic",
            value: psychic,
            role: "psychic" as const,
          },
          {
            label: "Destiny",
            value: destiny,
            role: "destiny" as const,
          },
        ].map(({ label, value, role }) => {
          const t = vedicDigitTheme(value);
          return (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm"
            >
              <p className="text-[10px] uppercase tracking-wider text-sand">
                {label} · {t.keyword}
              </p>
              <p className="mt-1 text-xs leading-5 text-paper/75">
                {role === "psychic" ? t.psychicFocus : t.destinyFocus}
              </p>
              <p className="mt-2 text-[11px] text-paper/60">
                Strengths: {t.strengths.slice(0, 2).join(" · ")}
              </p>
              <p className="mt-1 text-[11px] text-paper/60">
                Watch: {t.watchouts[0]}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <p className="text-[10px] uppercase tracking-wider text-sand">
          How the three layers work
        </p>
        <p className="mt-1 text-xs text-paper/65">
          Read them as a path, not a score: Birth → Destiny, with Name as the
          vehicle.
        </p>
        <ol className="mt-3 space-y-2">
          {VEDIC_LAYER_MAP.map((layer, i) => (
            <li
              key={layer.id}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wider text-sand">
                {i + 1}. {layer.shortTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-paper/90">
                {layer.represents}
              </p>
              <p className="mt-1 text-[11px] italic text-paper/60">
                {layer.feelsLike}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 rounded-xl border border-sand/30 bg-sand/10 px-4 py-3 text-sm">
        <p className="text-[10px] uppercase tracking-wider text-sand">
          Your Birth → Destiny path
        </p>
        <p className="mt-1 font-medium text-paper">
          Psychic {path.bn} → Destiny {path.dn}
        </p>
        <div className="mt-3">
          <PathStory
            dark
            feel={path.feel}
            atmosphere={path.atmosphere}
            invitation={path.invitation}
            looksLike={path.looksLike}
            helps={path.helps}
            watch={path.watch}
            student={path.student}
            expert={path.expert}
          />
        </div>
        <p className="mt-3 text-[11px] text-paper/60">
          Weather language only — not a forecast of events or a verdict on
          worth.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <p className="text-[10px] uppercase tracking-wider text-sand">
          What Name adds
        </p>
        <p className="mt-1 font-medium text-paper">{nameRole.headline}</p>
        <p className="mt-1 text-xs leading-5 text-paper/80">{nameRole.detail}</p>
        {natalNameNumber && natalNameNumber !== nameNumber ? (
          <p className="mt-2 text-[11px] leading-5 text-paper/65">
            Birth-certificate NN {natalNameNumber} stays as a root layer. The
            triangle above uses the name in force now ({nameNumber}). Psychic
            and Destiny do not change with a name.
          </p>
        ) : null}
      </div>

      {maps ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-sand">
            Two ways to count the same name
          </p>
          <p className="mt-1 font-medium text-paper">{maps.headline}</p>
          <p className="mt-1 text-xs leading-5 text-paper/80">{maps.detail}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-paper/90">
              <span className="block text-[10px] uppercase tracking-wider text-sand">
                Main Vedic chart
              </span>
              <span className="brand text-lg text-paper">{nameNumber}</span>
              {nameCompound ? (
                <span className="mt-0.5 block text-[11px] text-paper/60">
                  Letters add to {nameCompound}, then reduce
                </span>
              ) : null}
              <span className="mt-1 block text-[11px] text-paper/55">
                Used in the Birth → Destiny story above
              </span>
            </p>
            <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-paper/90">
              <span className="block text-[10px] uppercase tracking-wider text-sand">
                Second letter chart
              </span>
              <span className="brand text-lg text-sand">
                {unitName ?? maps.otherLabel}
              </span>
              {unitCompound ? (
                <span className="mt-0.5 block text-[11px] text-paper/60">
                  Letters add to {unitCompound}, then reduce
                </span>
              ) : null}
              <span className="mt-1 block text-[11px] text-paper/55">
                Cross-check only — some letters score differently
              </span>
            </p>
          </div>
        </div>
      ) : null}

      <details className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <summary className="cursor-pointer text-sand">
          Extra: opposite pairs, easy/careful numbers, school notes
        </summary>
        <div className="mt-3 space-y-4 text-paper/85">
          {oppositePairs.length > 0 ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-sand">
                Balancing pairs
              </p>
              <p className="mt-1 text-xs text-paper/65">
                Number pairs that often pull in opposite directions—useful to
                notice, not a judgment.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
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
                      target="_blank"
                      rel="noopener noreferrer"
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

          <div>
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
              {psychicProfile.neutral.map((n) => (
                <span
                  key={`n-${n}`}
                  className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-xs text-paper/85"
                >
                  Neutral · {n}
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
              Destiny {destiny}: study tones often linked —{" "}
              {destinyProfileOneLiner(destiny)} (atmosphere cue, not purchase
              advice).
            </p>
          </div>

          {unitSystem ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-sand">
                    Birth-day rhythm
                  </p>
                  <p className="mt-1 text-xs">
                    {EASE_LABEL[unitSystem.psychic_ease] ??
                      unitSystem.psychic_ease}
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
            </>
          ) : null}
        </div>
      </details>

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
