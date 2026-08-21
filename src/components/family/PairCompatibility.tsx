"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CompatCompass } from "@/components/report/CompatCompass";
import {
  buildCompatibilityMatrix,
  COMPAT_DISCLAIMER,
  TONE_HINT,
  type CompatTone,
} from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import {
  buildPairBondModel,
  pairTraitShort,
  pairYearThemeLine,
  type PairYearCell,
} from "@/lib/numerology/pairBond";
import { buildCoupleReport } from "@/lib/numerology/coupleReport";
import { CoupleScorePanel } from "@/components/family/CoupleScorePanel";
import { buildVedicCompatibilityMatrix } from "@/lib/numerology/vedicCompatibility";
import {
  formatDobInput,
  isValidDob,
  normalizeDobToSlash,
} from "@/lib/profile/date";
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

const YEAR_FILL: Record<number, string> = {
  1: "bg-amber-100 text-amber-950 border-amber-200",
  2: "bg-sky-100 text-sky-950 border-sky-200",
  3: "bg-violet-100 text-violet-950 border-violet-200",
  4: "bg-stone-100 text-stone-900 border-stone-300",
  5: "bg-orange-100 text-orange-950 border-orange-200",
  6: "bg-rose-100 text-rose-950 border-rose-200",
  7: "bg-indigo-100 text-indigo-950 border-indigo-200",
  8: "bg-emerald-100 text-emerald-950 border-emerald-200",
  9: "bg-gold/20 text-ink border-gold/40",
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

function channelTones(
  selfRaw: number,
  otherRaw: number,
  vedic = false,
): { romantic: CompatTone; business: CompatTone; friendship: CompatTone } {
  const self = reduceToSingleDigit(selfRaw);
  const other = reduceToSingleDigit(otherRaw);
  const matrix = vedic
    ? buildVedicCompatibilityMatrix(self)
    : buildCompatibilityMatrix(self);
  const row = matrix.find((r) => r.partnerLifePath === other);
  return (
    row ?? {
      romantic: "Neutral",
      business: "Neutral",
      friendship: "Neutral",
    }
  );
}

function personName(p: PersonRecord) {
  return p.preferred_name || p.full_name || "Unnamed";
}

function personKey(p: PersonRecord, index: number) {
  return p.id ?? `${p.relationship}-${p.sort_order}-${p.full_name}-${index}`;
}

function DigitCell({
  digit,
  year,
  active,
  marriage,
  onSelect,
}: {
  digit: number;
  year: number;
  active: boolean;
  marriage: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={`${year} · Personal Year ${digit}`}
      className={`btn-tactile flex min-w-[2.35rem] flex-col items-center rounded-lg border px-1.5 py-1 text-center ${
        YEAR_FILL[digit] ?? "bg-white text-ink"
      } ${active ? "ring-2 ring-gold-deep" : ""} ${
        marriage ? "outline outline-2 outline-offset-1 outline-ink/40" : ""
      }`}
    >
      <span className="brand text-sm font-semibold leading-none">{digit}</span>
      <span className="mt-0.5 text-[9px] leading-none opacity-70">{year}</span>
    </button>
  );
}

export function PairCompatibility({ people }: Props) {
  const eligible = useMemo(
    () => people.filter((p) => isValidDob(p.date_of_birth)),
    [people],
  );

  const [keyA, setKeyA] = useState(() =>
    eligible[0] ? personKey(eligible[0], 0) : "",
  );
  const [keyB, setKeyB] = useState(() => {
    const spouse = eligible.findIndex((p) => p.relationship === "Spouse/Partner");
    if (spouse >= 0) return personKey(eligible[spouse], spouse);
    return eligible[1] ? personKey(eligible[1], 1) : "";
  });
  const [togetherRaw, setTogetherRaw] = useState("");
  const [focusYear, setFocusYear] = useState<number | null>(null);

  const indexed = useMemo(
    () =>
      eligible.map((p, i) => ({
        person: p,
        key: personKey(p, i),
      })),
    [eligible],
  );

  const selA = indexed.find((x) => x.key === keyA)?.person;
  const selB = indexed.find((x) => x.key === keyB)?.person;

  const togetherNorm = normalizeDobToSlash(togetherRaw);
  const togetherOk = togetherNorm ? isValidDob(togetherNorm) : false;

  const model = useMemo(() => {
    if (!selA || !selB || keyA === keyB) return null;
    return buildPairBondModel({
      a: {
        key: keyA,
        label: personName(selA),
        relationship: selA.relationship || "Person",
        dateOfBirth: normalizeDobToSlash(selA.date_of_birth)!,
        fullName: selA.full_name,
      },
      b: {
        key: keyB,
        label: personName(selB),
        relationship: selB.relationship || "Person",
        dateOfBirth: normalizeDobToSlash(selB.date_of_birth)!,
        fullName: selB.full_name,
      },
      togetherSince: togetherOk ? togetherNorm : null,
      windowYears: 4,
    });
  }, [selA, selB, keyA, keyB, togetherOk, togetherNorm]);

  const couple = useMemo(() => {
    if (!selA || !selB || keyA === keyB) return null;
    return buildCoupleReport(
      {
        label: personName(selA),
        fullName: selA.full_name || personName(selA),
        dateOfBirth: normalizeDobToSlash(selA.date_of_birth)!,
      },
      {
        label: personName(selB),
        fullName: selB.full_name || personName(selB),
        dateOfBirth: normalizeDobToSlash(selB.date_of_birth)!,
      },
    );
  }, [selA, selB, keyA, keyB]);

  const focusCell: PairYearCell | null =
    model?.timeline.find((c) => c.calendarYear === focusYear) ?? null;

  if (eligible.length < 2) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-10 text-center text-sm text-ink-soft">
        Add at least two people with dates of birth on your profile to compare a
        pair.{" "}
        <Link href="/profile" className="text-gold-deep underline">
          Open profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Choose any two people
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink-soft">Person A</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
              value={keyA}
              onChange={(e) => setKeyA(e.target.value)}
            >
              {indexed.map(({ person, key }) => (
                <option key={key} value={key}>
                  {personName(person)} ({person.relationship || "—"})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-ink-soft">Person B</span>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
              value={keyB}
              onChange={(e) => setKeyB(e.target.value)}
            >
              {indexed.map(({ person, key }) => (
                <option key={key} value={key} disabled={key === keyA}>
                  {personName(person)} ({person.relationship || "—"})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="text-ink-soft">
            Marriage / together since (optional) · DD/MM/YYYY
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            value={togetherRaw}
            onChange={(e) => setTogetherRaw(formatDobInput(e.target.value))}
            className="mt-1 w-full max-w-xs rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
          />
        </label>
        {togetherRaw && !togetherOk ? (
          <p className="mt-1 text-xs text-amber-800">
            Enter a valid past date to unlock the bond timeline and impact view.
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-5 text-ink-soft">{COMPAT_DISCLAIMER}</p>
      </div>

      {!model || keyA === keyB ? (
        <p className="text-sm text-ink-soft">Select two different people.</p>
      ) : (
        <>
          {couple ? <CoupleScorePanel report={couple} /> : null}
          <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
            <h2 className="brand text-xl text-ink">
              {model.a.label} × {model.b.label}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {model.a.relationship} · LP {model.a.lifePath} · Psychic{" "}
              {model.a.psychic} · Destiny {model.a.destiny}
              {model.a.nameNumber != null ? ` · Name ${model.a.nameNumber}` : ""}
              <br />
              {model.b.relationship} · LP {model.b.lifePath} · Psychic{" "}
              {model.b.psychic} · Destiny {model.b.destiny}
              {model.b.nameNumber != null ? ` · Name ${model.b.nameNumber}` : ""}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(() => {
                const lp = channelTones(model.a.lifePath, model.b.lifePath);
                const psy = channelTones(model.a.psychic, model.b.psychic, true);
                const des = channelTones(model.a.destiny, model.b.destiny, true);
                const nam =
                  model.a.nameNumber != null && model.b.nameNumber != null
                    ? channelTones(model.a.nameNumber, model.b.nameNumber, true)
                    : null;
                return (
                  <>
              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Life Path</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {model.a.lifePath} × {model.b.lifePath}{" "}
                  <TonePill tone={model.lifePathTone} />
                </p>
                <CompatCompass
                  selfNumber={model.a.lifePath}
                  partner={model.b.lifePath}
                  romantic={lp.romantic}
                  business={lp.business}
                  friendship={lp.friendship}
                  hideRomantic={model.hideRomantic}
                  size={180}
                  compact
                  systemLabel="Life Path"
                />
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Vedic Psychic</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {model.a.psychic} × {model.b.psychic}{" "}
                  <TonePill tone={model.psychicTone} />
                </p>
                <CompatCompass
                  selfNumber={model.a.psychic}
                  partner={model.b.psychic}
                  romantic={psy.romantic}
                  business={psy.business}
                  friendship={psy.friendship}
                  hideRomantic={model.hideRomantic}
                  size={180}
                  compact
                  vedicArcLabels
                  vedicPlanet
                  systemLabel="Psychic"
                />
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                <h3 className="text-ink">Vedic Destiny</h3>
                <p className="mt-1 text-xs text-ink-soft">
                  {model.a.destiny} × {model.b.destiny}{" "}
                  <TonePill tone={model.destinyTone} />
                </p>
                <CompatCompass
                  selfNumber={model.a.destiny}
                  partner={model.b.destiny}
                  romantic={des.romantic}
                  business={des.business}
                  friendship={des.friendship}
                  hideRomantic={model.hideRomantic}
                  size={180}
                  compact
                  vedicArcLabels
                  vedicPlanet
                  systemLabel="Destiny"
                />
              </div>
              {nam &&
              model.a.nameNumber != null &&
              model.b.nameNumber != null ? (
                <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
                  <h3 className="text-ink">Vedic Name</h3>
                  <p className="mt-1 text-xs text-ink-soft">
                    {model.a.nameNumber} × {model.b.nameNumber}{" "}
                    <TonePill tone={model.nameTone!} />
                  </p>
                  <CompatCompass
                    selfNumber={model.a.nameNumber}
                    partner={model.b.nameNumber}
                    romantic={nam.romantic}
                    business={nam.business}
                    friendship={nam.friendship}
                    hideRomantic={model.hideRomantic}
                    size={180}
                    compact
                    vedicArcLabels
                    vedicPlanet
                    systemLabel="Name"
                  />
                </div>
              ) : null}
                  </>
                );
              })()}
            </div>
          </div>

          {model.togetherSince && model.timeline.length ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-paper via-white to-mist/40 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gold-deep">
                  Bond · {model.togetherSince}
                </p>
                <p className="brand mt-1 text-2xl text-ink">
                  Bond number {model.bondNumber}{" "}
                  <span className="text-base font-normal text-ink-soft">
                    · {model.bondTrait}
                  </span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {model.yearsMarried != null
                    ? `${model.yearsMarried} calendar year(s) since the bond date · `
                    : null}
                  Bond year follows the anniversary month/day — not a replacement
                  Personal Year.
                </p>
                <p className="mt-2 text-xs leading-5 text-ink-soft">
                  {model.disclaimer}
                </p>
              </div>

              {model.impact ? (
                <div className="rounded-2xl border border-[var(--line)] bg-white/75 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                    What changed around the bond
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[var(--line)] bg-mist/30 px-3 py-3">
                      <p className="text-xs font-medium text-ink">{model.a.label}</p>
                      <p className="mt-1 text-sm text-ink">
                        Before → {model.impact.a.dominantBefore.join(", ") || "—"}
                      </p>
                      <p className="text-sm text-ink">
                        After → {model.impact.a.dominantAfter.join(", ") || "—"}
                      </p>
                      {model.impact.a.marriageYearDigit != null ? (
                        <p className="mt-1 text-xs text-ink-soft">
                          Bond year Personal Year{" "}
                          {model.impact.a.marriageYearDigit}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-xl border border-[var(--line)] bg-mist/30 px-3 py-3">
                      <p className="text-xs font-medium text-ink">{model.b.label}</p>
                      <p className="mt-1 text-sm text-ink">
                        Before → {model.impact.b.dominantBefore.join(", ") || "—"}
                      </p>
                      <p className="text-sm text-ink">
                        After → {model.impact.b.dominantAfter.join(", ") || "—"}
                      </p>
                      {model.impact.b.marriageYearDigit != null ? (
                        <p className="mt-1 text-xs text-ink-soft">
                          Bond year Personal Year{" "}
                          {model.impact.b.marriageYearDigit}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {model.impact.bullets.map((line) => (
                      <li
                        key={line.slice(0, 48)}
                        className="max-w-[65ch] text-sm leading-6 text-ink"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-2xl border border-[var(--line)] bg-white/75 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                  Dual year timeline · before / after{" "}
                  {model.marriageYear}
                </p>
                <p className="mt-1 text-[11px] text-ink-soft">
                  Tap a year cell for digits and pair tone. Marriage year is
                  outlined.
                </p>

                <div className="mt-4 space-y-3 overflow-x-auto pb-1">
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-24 shrink-0 text-xs text-ink-soft">
                      {model.a.label}
                    </span>
                    {model.timeline.map((c) => (
                      <DigitCell
                        key={`a-${c.calendarYear}`}
                        digit={c.aYear}
                        year={c.calendarYear}
                        active={focusYear === c.calendarYear}
                        marriage={c.isMarriageYear}
                        onSelect={() =>
                          setFocusYear((y) =>
                            y === c.calendarYear ? null : c.calendarYear,
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-24 shrink-0 text-xs text-ink-soft">
                      {model.b.label}
                    </span>
                    {model.timeline.map((c) => (
                      <DigitCell
                        key={`b-${c.calendarYear}`}
                        digit={c.bYear}
                        year={c.calendarYear}
                        active={focusYear === c.calendarYear}
                        marriage={c.isMarriageYear}
                        onSelect={() =>
                          setFocusYear((y) =>
                            y === c.calendarYear ? null : c.calendarYear,
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-24 shrink-0 text-xs text-ink-soft">Bond</span>
                    {model.timeline.map((c) => (
                      <DigitCell
                        key={`bond-${c.calendarYear}`}
                        digit={c.bondYear ?? 0}
                        year={c.calendarYear}
                        active={focusYear === c.calendarYear}
                        marriage={c.isMarriageYear}
                        onSelect={() =>
                          setFocusYear((y) =>
                            y === c.calendarYear ? null : c.calendarYear,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>

                {focusCell ? (
                  <div className="mt-4 rounded-xl border border-[var(--line)] bg-mist/45 px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                      {focusCell.calendarYear}
                      {focusCell.isMarriageYear ? " · bond year" : ""} ·{" "}
                      {focusCell.phase}
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      {model.a.label}: PY {focusCell.aYear} (
                      {pairTraitShort(focusCell.aYear)})
                    </p>
                    <p className="text-sm text-ink">
                      {model.b.label}: PY {focusCell.bYear} (
                      {pairTraitShort(focusCell.bYear)})
                    </p>
                    {focusCell.bondYear != null ? (
                      <p className="text-sm text-ink">
                        Bond year {focusCell.bondYear} (
                        {pairTraitShort(focusCell.bondYear)})
                      </p>
                    ) : null}
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      Pair tone <TonePill tone={focusCell.pairTone} />
                    </p>
                    <p className="mt-2 max-w-[65ch] text-xs leading-5 text-ink-soft">
                      {pairYearThemeLine(focusCell.aYear)}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-center text-[11px] text-ink-soft">
                    Tap any year to see both Personal Years and the pair tone
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-6 text-sm text-ink-soft">
              Add a marriage / together-since date to see the dual Personal Year
              timeline, bond number, and before→after impact in digits—not a
              generic comment.
            </div>
          )}
        </>
      )}
    </div>
  );
}
