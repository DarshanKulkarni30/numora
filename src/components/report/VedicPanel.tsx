"use client";

import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { planetGuideHref } from "@/lib/guides/planets";
import { planetForVedic } from "@/lib/numerology/planets";

type JohariBits = {
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
  johariName?: string;
  johariCompound?: string;
  nameCompound?: string;
  rulingPlanet: string;
  destinyRulingPlanet?: string;
  johari?: JohariBits | null;
};

const EASE_LABEL: Record<string, string> = {
  easier: "Often easier",
  mixed: "Mixed",
  more_demanding: "More demanding",
};

const TONE_STYLE: Record<string, string> = {
  supportive: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  mixed: "border-amber-300/40 bg-amber-400/15 text-amber-50",
  stretch: "border-rose-300/40 bg-rose-500/15 text-rose-50",
};

export function VedicPanel({
  psychic,
  destiny,
  nameNumber,
  johariName,
  johariCompound,
  nameCompound,
  johari,
}: Props) {
  const cards = [
    { label: "Psychic", topic: "vedic-psychic" as const, value: psychic },
    { label: "Destiny", topic: "vedic-destiny" as const, value: destiny },
    { label: "Name", topic: "vedic-name" as const, value: nameNumber },
  ];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-ink via-[#1e293b] to-[#0f172a] p-6 text-paper">
      <p className="text-sm uppercase tracking-[0.2em] text-sand">Vedic numbers</p>
      <p className="mt-2 text-sm text-paper/75">
        Reflective panel (not a full kundli). Hover a number or planet · click
        opens a guide in a new tab.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => {
          const planet = planetForVedic(c.value);
          return (
            <div
              key={c.topic}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
              title={`Vedic ${c.label} ${c.value} · ${planet.name}`}
            >
              <p className="text-[10px] uppercase tracking-wider text-sand">
                {c.label}
              </p>
              <GuideNumberLink
                topic={c.topic}
                value={c.value}
                label={`Vedic ${c.label}`}
                className="brand mt-2 inline-block text-3xl text-paper hover:text-sand"
              />
              <div className="mt-3 flex justify-center">
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

      {johariName ? (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
          <p className="text-[10px] uppercase tracking-wider text-sand">
            Dual name numbers
          </p>
          <p className="mt-2 text-paper/90">
            Chaldean-aligned Vedic name{" "}
            <span className="brand text-lg text-paper">{nameNumber}</span>
            {nameCompound ? (
              <span className="text-paper/60"> (compound {nameCompound})</span>
            ) : null}
          </p>
          <p className="mt-1 text-paper/90">
            Johari Unit System name{" "}
            <span className="brand text-lg text-sand">{johariName}</span>
            {johariCompound ? (
              <span className="text-paper/60">
                {" "}
                (compound {johariCompound})
              </span>
            ) : null}
          </p>
          <p className="mt-2 text-xs text-paper/65">
            Letter maps differ (e.g. C and H). Both are shown so you can compare
            systems without mixing their rules.
          </p>
        </div>
      ) : null}

      {johari ? (
        <div className="mt-5 space-y-3 text-sm text-paper/85">
          <div
            className={`rounded-xl border px-3 py-2 ${
              TONE_STYLE[johari.harmony_tone] ?? TONE_STYLE.mixed
            }`}
          >
            <p className="font-medium">{johari.harmony_label}</p>
            <p className="mt-1 text-xs opacity-90">{johari.harmony_detail}</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-sand">
                Psychic ease
              </p>
              <p className="mt-1 text-paper">
                {EASE_LABEL[johari.psychic_ease] ?? johari.psychic_ease}
              </p>
              <p className="mt-1 text-xs text-paper/70">{johari.psychic_note}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-sand">
                Destiny ease
              </p>
              <p className="mt-1 text-paper">
                {EASE_LABEL[johari.destiny_ease] ?? johari.destiny_ease}
              </p>
              <p className="mt-1 text-xs text-paper/70">{johari.destiny_note}</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-sand">
              Birth-day compound
              {johari.birth_day_exalted ? " · exaltation-style" : ""}
            </p>
            <p className="mt-1 text-xs leading-5">{johari.birth_day_note}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-sand">
              Temperament chips
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {johari.doshas.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-sand/40 bg-sand/10 px-2.5 py-0.5 text-xs text-sand"
                >
                  {d}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-paper/70">
              {johari.temperament_summary}
            </p>
          </div>

          {johari.zero_note ? (
            <p className="text-xs text-paper/65">{johari.zero_note}</p>
          ) : null}
          <p className="text-xs text-paper/60">{johari.compat_note}</p>
        </div>
      ) : null}

      <div className="mt-5 space-y-2 text-sm text-paper/80">
        <p className="flex flex-wrap items-center gap-2">
          <span>Psychic ruling planet:</span>
          <PlanetIcon
            planet={planetForVedic(psychic)}
            size="sm"
            variant="dark"
            href={planetGuideHref("vedic", planetForVedic(psychic).id)}
          />
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span>Destiny ruling planet:</span>
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
