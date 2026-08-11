"use client";

import Link from "next/link";
import {
  buildCompatibilityMatrix,
  COMPAT_DISCLAIMER,
  TONE_HINT,
  type CompatTone,
} from "@/lib/numerology/compatibility";
import {
  lifePathFromDob,
  masterNumberNote,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { calculateVedic } from "@/lib/numerology/vedic";
import {
  buildVedicCompatibilityMatrix,
  VEDIC_COMPAT_NOTE,
} from "@/lib/numerology/vedicCompatibility";
import { isValidDob } from "@/lib/profile/date";
import type { PersonRecord } from "@/lib/profile/options";

type Props = {
  people: PersonRecord[];
};

const TONE_COLOR: Record<CompatTone, string> = {
  Amazing: "bg-emerald-100 text-emerald-950 border-emerald-300",
  Favourable: "bg-teal-50 text-teal-900 border-teal-200",
  Neutral: "bg-slate-50 text-slate-800 border-slate-200",
  Challenging: "bg-amber-50 text-amber-950 border-amber-200",
};

function TonePill({ tone }: { tone: CompatTone }) {
  return (
    <span
      title={TONE_HINT[tone]}
      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${TONE_COLOR[tone]}`}
    >
      {tone}
    </span>
  );
}

function pythagoreanPairTones(selfRaw: number, otherRaw: number) {
  const self = reduceToSingleDigit(selfRaw);
  const other = reduceToSingleDigit(otherRaw);
  const row = buildCompatibilityMatrix(self).find(
    (r) => r.partnerLifePath === other,
  );
  return (
    row ?? {
      partnerLifePath: other,
      romantic: "Neutral" as CompatTone,
      business: "Neutral" as CompatTone,
      friendship: "Neutral" as CompatTone,
    }
  );
}

function vedicPairTones(selfRaw: number, otherRaw: number) {
  const self = reduceToSingleDigit(selfRaw);
  const other = reduceToSingleDigit(otherRaw);
  const row = buildVedicCompatibilityMatrix(self).find(
    (r) => r.partnerLifePath === other,
  );
  return (
    row ?? {
      partnerLifePath: other,
      romantic: "Neutral" as CompatTone,
      business: "Neutral" as CompatTone,
      friendship: "Neutral" as CompatTone,
    }
  );
}

function ChannelList({
  tones,
  hideRomantic,
}: {
  tones: {
    romantic: CompatTone;
    business: CompatTone;
    friendship: CompatTone;
  };
  hideRomantic: boolean;
}) {
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {!hideRomantic ? (
        <li className="flex items-center justify-between gap-2">
          <span className="text-ink-soft">Romantic</span>
          <TonePill tone={tones.romantic} />
        </li>
      ) : null}
      <li className="flex items-center justify-between gap-2">
        <span className="text-ink-soft">
          {hideRomantic ? "Team / class" : "Business"}
        </span>
        <TonePill tone={tones.business} />
      </li>
      <li className="flex items-center justify-between gap-2">
        <span className="text-ink-soft">Friendship</span>
        <TonePill tone={tones.friendship} />
      </li>
    </ul>
  );
}

function personName(p: PersonRecord) {
  return p.preferred_name || p.full_name || "Unnamed";
}

export function FamilyCompatibility({ people }: Props) {
  const self = people.find(
    (p) => p.is_self && isValidDob(p.date_of_birth),
  );
  const spouses = people.filter(
    (p) =>
      !p.is_self &&
      p.relationship === "Spouse/Partner" &&
      isValidDob(p.date_of_birth),
  );
  const children = people.filter(
    (p) =>
      !p.is_self &&
      p.relationship === "Child" &&
      isValidDob(p.date_of_birth),
  );

  if (!self) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-10 text-center text-sm text-ink-soft">
        Add your Self profile with a date of birth to see family compatibility.{" "}
        <Link href="/profile" className="text-gold-deep underline">
          Open profile
        </Link>
      </div>
    );
  }

  if (spouses.length === 0 && children.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-10 text-center text-sm text-ink-soft">
        Save a Spouse/Partner or Child on your profile (with DOB) to compare
        with you. Live view only—not saved as a report.{" "}
        <Link href="/profile" className="text-gold-deep underline">
          Open profile
        </Link>
      </div>
    );
  }

  const selfLp = lifePathFromDob(self.date_of_birth);
  const selfPsychic = vedicPsychicFromDob(self.date_of_birth);
  const selfDestiny = vedicDestinyFromDob(self.date_of_birth);
  const selfName = self.full_name?.trim()
    ? calculateVedic(self.full_name, self.date_of_birth).nameNumber
    : null;
  const selfLpNote = masterNumberNote(selfLp);

  const pairs = [
    ...spouses.map((p) => ({ person: p, kind: "Spouse/Partner" as const })),
    ...children.map((p) => ({ person: p, kind: "Child" as const })),
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-4">
        <p className="text-sm text-ink-soft">
          Comparing{" "}
          <span className="font-medium text-ink">{personName(self)} (You)</span>{" "}
          — Life Path <span className="brand text-ink">{selfLp}</span>
          {selfLpNote ? (
            <span className="text-ink-soft">
              {" "}
              (table uses {reduceToSingleDigit(selfLp)})
            </span>
          ) : null}
          , Psychic <span className="brand text-ink">{selfPsychic}</span>,
          Destiny <span className="brand text-ink">{selfDestiny}</span>
          {selfName != null ? (
            <>
              , Name <span className="brand text-ink">{selfName}</span>
            </>
          ) : null}
          .
        </p>
        <p className="mt-2 text-xs leading-5 text-ink-soft">
          {VEDIC_COMPAT_NOTE}
        </p>
      </div>

      {pairs.map(({ person, kind }) => {
        const otherLp = lifePathFromDob(person.date_of_birth);
        const otherPsychic = vedicPsychicFromDob(person.date_of_birth);
        const otherDestiny = vedicDestinyFromDob(person.date_of_birth);
        const otherName = person.full_name?.trim()
          ? calculateVedic(person.full_name, person.date_of_birth).nameNumber
          : null;
        const py = pythagoreanPairTones(selfLp, otherLp);
        const moolank = vedicPairTones(selfPsychic, otherPsychic);
        const bhagyank = vedicPairTones(selfDestiny, otherDestiny);
        const namank =
          selfName != null && otherName != null
            ? vedicPairTones(selfName, otherName)
            : null;
        const hideRomantic = kind === "Child";

        return (
          <section
            key={`${kind}-${person.sort_order}-${person.full_name}`}
            className="rounded-2xl border border-[var(--line)] bg-white/55 p-5"
          >
            <h2 className="text-xl text-ink">
              You × {personName(person)}{" "}
              <span className="text-base text-ink-soft">({kind})</span>
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Their DOB {person.date_of_birth} · Life Path{" "}
              <span className="brand text-ink">{otherLp}</span> · Psychic{" "}
              <span className="brand text-ink">{otherPsychic}</span> · Destiny{" "}
              <span className="brand text-ink">{otherDestiny}</span>
              {otherName != null ? (
                <>
                  {" "}
                  · Name <span className="brand text-ink">{otherName}</span>
                </>
              ) : null}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Pythagorean · Life Path</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  You {selfLp} × them {otherLp}
                </p>
                <ChannelList tones={py} hideRomantic={hideRomantic} />
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Vedic · Psychic (Moolank)</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  You {selfPsychic} × them {otherPsychic}
                </p>
                <ChannelList tones={moolank} hideRomantic={hideRomantic} />
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Vedic · Destiny (Bhagyank)</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  You {selfDestiny} × them {otherDestiny}
                </p>
                <ChannelList tones={bhagyank} hideRomantic={hideRomantic} />
              </div>

              {namank ? (
                <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                  <h3 className="text-ink">Vedic · Name (Namank)</h3>
                  <p className="mt-1 text-xs text-ink-soft">
                    You {selfName} × them {otherName}
                  </p>
                  <ChannelList tones={namank} hideRomantic={hideRomantic} />
                </div>
              ) : null}
            </div>
          </section>
        );
      })}

      <p className="text-sm leading-6 text-ink-soft">{COMPAT_DISCLAIMER}</p>
    </div>
  );
}
