"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TONE_HINT, type CompatTone } from "@/lib/numerology/compatibility";
import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { MOBILE_NOTE, parseMobile } from "@/lib/numerology/mobileNumber";
import { MobileDigitSplit } from "@/components/mobile/MobileDigitSplit";
import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import {
  TRIO_BAND_HINT,
  TRIO_BAND_ICON,
  TRIO_BAND_TAGS,
  chaldeanTableForBirth,
  chaldeanTrio,
  pythagoreanTrio,
  trioCodeBand,
  trioCodeLabel,
  vedicTableForBirth,
  vedicTrio,
  type TrioBand,
  type TrioSystem,
} from "@/lib/numerology/trioMatrix";
import { vedicPairTone } from "@/lib/numerology/vedicCompatibility";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  people: PersonRecord[];
};

const BAND_WORD: Record<TrioBand, string> = {
  amazing: "Amazing",
  favourable: "Favourable",
  neutral: "Neutral",
  friction: "Friction",
  block: "Heavy",
};

const BAND_STYLE: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

const BAND_CELL: Record<TrioBand, string> = {
  amazing: "bg-emerald-100 text-emerald-950",
  favourable: "bg-teal-50 text-teal-900",
  neutral: "bg-slate-50 text-slate-700",
  friction: "bg-amber-50 text-amber-950",
  block: "bg-rose-50 text-rose-900",
};

const TONE_STYLE: Record<CompatTone, string> = {
  Amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  Favourable: "border-teal-200 bg-teal-50 text-teal-950",
  Neutral: "border-slate-200 bg-slate-50 text-slate-800",
  Challenging: "border-amber-300 bg-amber-50 text-amber-950",
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function pythBirthDayFromDob(dob: string): number {
  const { day } = parseDob(dob);
  return reduceToSingleDigit(reduceNumber(day));
}

function executiveFor(
  system: TrioSystem,
  hit: ReturnType<typeof vedicTrio>,
  digitsLine: string,
  favDigits: number[],
): string {
  const fav =
    favDigits.length > 0
      ? `Mobile cores that often sit easier on this chart: ${favDigits.join(", ")}.`
      : "Few mobile cores land in the easier bands for this Birth×Destiny pair—compare the full table.";
  if (system === "vedic") {
    return `Vedic: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary} ${fav}`;
  }
  if (system === "chaldean") {
    return `Chaldean: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary} ${fav}`;
  }
  return `Pythagorean: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary}`;
}

export function MobileExplorer({ people }: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKey, setSelectedKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? `${first.sort_order}-${first.full_name}` : "";
  });
  const [trial, setTrial] = useState("");
  const [tab, setTab] = useState<TrioSystem>("vedic");

  const selected = selectable.find(
    (p) => `${p.sort_order}-${p.full_name}` === selectedKey,
  );

  const dob = selected?.date_of_birth ?? "";
  const psychic = selected ? vedicPsychicFromDob(dob) : null;
  const destiny = selected ? vedicDestinyFromDob(dob) : null;
  const lifePath = selected ? lifePathFromDob(dob) : null;
  const birthDay = selected ? pythBirthDayFromDob(dob) : null;

  const parsed = useMemo(() => parseMobile(trial), [trial]);
  const mobile = parsed.ok ? parsed : null;

  const vedicHit =
    psychic != null && destiny != null && mobile
      ? vedicTrio(psychic, destiny, mobile.core)
      : null;
  const vedicHitLast4 =
    psychic != null && destiny != null && mobile?.last4
      ? vedicTrio(psychic, destiny, mobile.last4.core)
      : null;
  const chaldeanHit =
    psychic != null && destiny != null && mobile
      ? chaldeanTrio(psychic, destiny, mobile.core)
      : null;
  const chaldeanHitLast4 =
    psychic != null && destiny != null && mobile?.last4
      ? chaldeanTrio(psychic, destiny, mobile.last4.core)
      : null;
  const pythHit =
    birthDay != null && lifePath != null && mobile
      ? pythagoreanTrio(birthDay, lifePath, mobile.core)
      : null;
  const pythHitLast4 =
    birthDay != null && lifePath != null && mobile?.last4
      ? pythagoreanTrio(birthDay, lifePath, mobile.last4.core)
      : null;

  const activeHit =
    tab === "vedic" ? vedicHit : tab === "chaldean" ? chaldeanHit : pythHit;
  const activeHitLast4 =
    tab === "vedic"
      ? vedicHitLast4
      : tab === "chaldean"
        ? chaldeanHitLast4
        : pythHitLast4;

  const table =
    psychic != null && (tab === "vedic" || tab === "chaldean")
      ? tab === "vedic"
        ? vedicTableForBirth(psychic)
        : chaldeanTableForBirth(psychic)
      : null;

  const stripDigits = useMemo(() => {
    if (psychic == null || destiny == null) return [];
    if (tab === "pythagorean" && birthDay != null && lifePath != null) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const hit = pythagoreanTrio(birthDay, lifePath, n);
        return { n, band: hit.band, label: hit.label };
      });
    }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
      const hit =
        tab === "chaldean"
          ? chaldeanTrio(psychic, destiny, n)
          : vedicTrio(psychic, destiny, n);
      return { n, band: hit.band, label: hit.label };
    });
  }, [psychic, destiny, tab, birthDay, lifePath]);

  const favDigits = stripDigits
    .filter((d) => d.band === "amazing" || d.band === "favourable")
    .map((d) => d.n);

  const psychicPairFull =
    psychic != null && mobile ? vedicPairTone(psychic, mobile.core) : null;
  const destinyPairFull =
    destiny != null && mobile ? vedicPairTone(destiny, mobile.core) : null;
  const psychicPairLast4 =
    psychic != null && mobile?.last4
      ? vedicPairTone(psychic, mobile.last4.core)
      : null;
  const destinyPairLast4 =
    destiny != null && mobile?.last4
      ? vedicPairTone(destiny, mobile.last4.core)
      : null;

  const summaries = useMemo(() => {
    if (!mobile || psychic == null || destiny == null || lifePath == null || birthDay == null)
      return [];
    const last4 = mobile.last4;
    const v = vedicTrio(psychic, destiny, mobile.core);
    const c = chaldeanTrio(psychic, destiny, mobile.core);
    const p = pythagoreanTrio(birthDay, lifePath, mobile.core);
    const vL = last4 ? vedicTrio(psychic, destiny, last4.core) : null;
    const cL = last4 ? chaldeanTrio(psychic, destiny, last4.core) : null;
    const pL = last4
      ? pythagoreanTrio(birthDay, lifePath, last4.core)
      : null;
    const vFav = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => ({ n, band: vedicTrio(psychic, destiny, n).band }))
      .filter((x) => x.band === "amazing" || x.band === "favourable")
      .map((x) => x.n);
    const cFav = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => ({ n, band: chaldeanTrio(psychic, destiny, n).band }))
      .filter((x) => x.band === "amazing" || x.band === "favourable")
      .map((x) => x.n);
    const last4Note = (bandLabel: string) =>
      last4
        ? ` Full core ${mobile.core} · last-4 core ${last4.core} (${bandLabel}). Both matter for compatibility.`
        : "";
    return [
      {
        system: "vedic" as const,
        title: "Vedic",
        body:
          executiveFor(
            "vedic",
            v,
            `Psychic ${psychic} · Destiny ${destiny} · full mobile ${mobile.core}`,
            vFav,
          ) +
          (vL
            ? last4Note(
                `${BAND_WORD[vL.band]} · ${vL.label}`,
              )
            : ""),
      },
      {
        system: "chaldean" as const,
        title: "Chaldean",
        body:
          executiveFor(
            "chaldean",
            c,
            `Birth ${psychic} · Destiny ${destiny} · full mobile ${mobile.core}`,
            cFav,
          ) +
          (cL
            ? last4Note(`${BAND_WORD[cL.band]} · ${cL.label}`)
            : ""),
      },
      {
        system: "pythagorean" as const,
        title: "Pythagorean",
        body:
          executiveFor(
            "pythagorean",
            p,
            `Birth day ${birthDay} · Life Path ${lifePath} · full mobile ${mobile.core}`,
            p.favNames,
          ) +
          (pL
            ? last4Note(`${BAND_WORD[pL.band]} · ${pL.label}`)
            : ""),
      },
    ];
  }, [mobile, psychic, destiny, lifePath, birthDay]);

  return (
    <div className="space-y-8">
      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + DOB) to explore
          mobile fit.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="mobile-person"
                className="mb-1 block text-sm text-ink-soft"
              >
                Person from your profile
              </label>
              <select
                id="mobile-person"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
              >
                {selectable.map((p) => (
                  <option
                    key={`${p.sort_order}-${p.full_name}`}
                    value={`${p.sort_order}-${p.full_name}`}
                  >
                    {personLabel(p)}
                  </option>
                ))}
              </select>
              {selected && psychic != null && destiny != null ? (
                <p className="mt-2 text-sm text-ink-soft">
                  Fixed from DOB {selected.date_of_birth}: Psychic{" "}
                  <span className="brand text-ink">{psychic}</span> · Destiny{" "}
                  <span className="brand text-ink">{destiny}</span>
                  {lifePath != null ? (
                    <>
                      {" "}
                      · Life Path{" "}
                      <span className="brand text-ink">{lifePath}</span>
                    </>
                  ) : null}
                  . Only the mobile core changes when you type a number.
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="mobile-trial"
                className="mb-1 block text-sm text-ink-soft"
              >
                Mobile number
              </label>
              <input
                id="mobile-trial"
                type="tel"
                inputMode="numeric"
                value={trial}
                onChange={(e) => setTrial(e.target.value)}
                placeholder="National number only, e.g. 98765 43210"
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
                autoComplete="off"
              />
              <p className="mt-2 text-xs text-ink-soft">
                8–12 digits, no country code. Spaces or dashes are fine.
                Reflective experiment only—not telecom advice.
              </p>
              {trial.trim() && !parsed.ok ? (
                <p className="mt-2 text-sm text-rose-800">{parsed.error}</p>
              ) : null}
            </div>
          </div>

          {mobile ? (
            <MobileDigitSplit mobile={mobile} emphasizeLast4 part="split" />
          ) : null}

          <div>
            <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
              {(
                [
                  ["vedic", "Vedic"],
                  ["chaldean", "Chaldean"],
                  ["pythagorean", "Pythagorean"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                    tab === id
                      ? "bg-ink text-paper shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeHit ? (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                  Result status
                </p>
                <div
                  className={`rounded-2xl border-2 px-5 py-4 shadow-sm ${BAND_STYLE[activeHit.band]}`}
                >
                  <p className="text-[10px] uppercase tracking-wider opacity-80">
                    Full total · core {mobile?.core} · {tab}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {TRIO_BAND_ICON[activeHit.band]}{" "}
                    {BAND_WORD[activeHit.band]}
                  </p>
                  <p className="mt-1 text-base font-medium opacity-90">
                    {activeHit.label}
                  </p>
                  <p className="mt-2 text-sm leading-6">{activeHit.summary}</p>
                  <p className="mt-2 text-xs opacity-80">
                    {TRIO_BAND_HINT[activeHit.band]}
                  </p>
                </div>
                {activeHitLast4 && mobile?.last4 ? (
                  <div
                    className={`rounded-2xl border px-5 py-4 ${BAND_STYLE[activeHitLast4.band]}`}
                  >
                    <p className="text-[10px] uppercase tracking-wider opacity-80">
                      Last 4 · core {mobile.last4.core} · {tab}
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {TRIO_BAND_ICON[activeHitLast4.band]}{" "}
                      {BAND_WORD[activeHitLast4.band]}
                    </p>
                    <p className="mt-1 text-sm font-medium opacity-90">
                      {activeHitLast4.label}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {activeHitLast4.summary}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : trial.trim() === "" ? (
              <p className="mt-4 text-sm text-ink-soft">
                Type a national mobile number to see the Birth×Destiny×mobile
                result status here.
              </p>
            ) : null}
          </div>

          {psychicPairFull && destinyPairFull && mobile ? (
            <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
              <p className="text-sm font-medium text-ink">
                Day-to-day pair tones (full + last 4)
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Both the full-number core and the last-4 core are used for
                compatibility—how each sits next to Psychic (birth day) and
                Destiny.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex flex-wrap items-center gap-2">
                  <span className="text-ink-soft">
                    Psychic {psychic} → full {mobile.core}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${TONE_STYLE[psychicPairFull]}`}
                    title={TONE_HINT[psychicPairFull]}
                  >
                    {psychicPairFull}
                  </span>
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  <span className="text-ink-soft">
                    Destiny {destiny} → full {mobile.core}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${TONE_STYLE[destinyPairFull]}`}
                    title={TONE_HINT[destinyPairFull]}
                  >
                    {destinyPairFull}
                  </span>
                </li>
                {psychicPairLast4 && destinyPairLast4 && mobile.last4 ? (
                  <>
                    <li className="flex flex-wrap items-center gap-2">
                      <span className="text-ink-soft">
                        Psychic {psychic} → last-4 {mobile.last4.core}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${TONE_STYLE[psychicPairLast4]}`}
                        title={TONE_HINT[psychicPairLast4]}
                      >
                        {psychicPairLast4}
                      </span>
                    </li>
                    <li className="flex flex-wrap items-center gap-2">
                      <span className="text-ink-soft">
                        Destiny {destiny} → last-4 {mobile.last4.core}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs ${TONE_STYLE[destinyPairLast4]}`}
                        title={TONE_HINT[destinyPairLast4]}
                      >
                        {destinyPairLast4}
                      </span>
                    </li>
                  </>
                ) : null}
              </ul>
            </div>
          ) : null}

          {mobile ? (
            <MobileDigitSplit mobile={mobile} emphasizeLast4 part="detail" />
          ) : null}

          {psychic != null && destiny != null ? (
            <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
              <p className="text-sm font-medium text-ink">
                Mobile cores 1–9 for this Birth × Destiny
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                If many look Heavy, that is the chart for this DOB—not a broken
                calculator.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {stripDigits.map(({ n, band, label }) => {
                  const isYou = mobile?.core === n;
                  return (
                    <span
                      key={n}
                      title={`${label} → ${BAND_WORD[band]}`}
                      className={`inline-flex min-w-[3.25rem] flex-col items-center rounded-lg border px-2 py-1.5 text-xs ${BAND_STYLE[band]} ${
                        isYou ? "ring-2 ring-ink ring-inset" : ""
                      }`}
                    >
                      <span className="font-medium">{n}</span>
                      <span className="opacity-80">
                        {TRIO_BAND_ICON[band]} {BAND_WORD[band]}
                      </span>
                    </span>
                  );
                })}
              </div>
              {favDigits.length ? (
                <p className="mt-3 text-sm text-ink">
                  Often easier mobile cores:{" "}
                  <span className="brand">{favDigits.join(", ")}</span>
                </p>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">
                  Few “easier” digits on this chart—use Neutral/Friction with
                  care, or compare methods below.
                </p>
              )}
            </div>
          ) : null}

          <div>
            {tab === "pythagorean" && pythHit ? (
              <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm text-ink-soft">
                <p className="font-medium text-ink">
                  Pythagorean mobile fit (no Destiny×Name grid)
                </p>
                <p className="mt-1 text-xs">
                  Uses odd/even birth+path mix plus birth-day → mobile-core
                  alignment—same five-band scale, different method.
                </p>
                <p className="mt-3 font-medium text-ink">{pythHit.patternLabel}</p>
                <p className="mt-1">{pythHit.patternEffect}</p>
                <p className="mt-2">{pythHit.alignNote}</p>
              </div>
            ) : table && destiny != null && mobile ? (
              <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                <p className="mb-2 text-sm font-medium text-ink">
                  Full Birth {psychic} table · rows = Destiny · columns = Mobile
                  core
                </p>
                <p className="mb-3 text-xs text-ink-soft">
                  Your Destiny row and mobile column are tinted; the outlined
                  cell is this number.
                </p>
                <table className="w-full min-w-[22rem] border-collapse text-center text-[11px]">
                  <thead>
                    <tr>
                      <th className="border-b border-[var(--line)] p-1 text-left font-medium text-ink">
                        D \ M
                      </th>
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                        <th
                          key={n}
                          className={`border-b border-[var(--line)] p-1 font-medium text-ink ${
                            n === mobile.core ? "bg-ink/5" : ""
                          }`}
                        >
                          {n}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, di) => {
                      const destinyN = di + 1;
                      return (
                        <tr key={destinyN}>
                          <td
                            className={`border-b border-[var(--line)] p-1 text-left font-medium text-ink ${
                              destinyN === destiny ? "bg-ink/5" : ""
                            }`}
                          >
                            {destinyN}
                          </td>
                          {row.map((code, ni) => {
                            const nameN = ni + 1;
                            const isYou =
                              destinyN === destiny && nameN === mobile.core;
                            const band = trioCodeBand(code);
                            const label = trioCodeLabel(code);
                            const tip = `${label} → ${BAND_WORD[band]}: ${TRIO_BAND_HINT[band]}`;
                            return (
                              <td
                                key={nameN}
                                title={tip}
                                className={`border-b border-[var(--line)] p-1 ${BAND_CELL[band]} ${
                                  isYou
                                    ? "ring-2 ring-ink ring-inset font-semibold"
                                    : ""
                                }`}
                              >
                                <span aria-label={tip}>
                                  {TRIO_BAND_ICON[band]}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
              <p className="font-medium text-ink">
                Five-band scale (best → heavier)
              </p>
              <ul className="mt-2 space-y-1.5">
                {(Object.keys(TRIO_BAND_HINT) as TrioBand[]).map((b) => (
                  <li key={b}>
                    <span className="mr-1.5 inline-block min-w-[1.5rem] text-center font-medium text-ink">
                      {TRIO_BAND_ICON[b]}
                    </span>
                    <strong className="text-ink">{BAND_WORD[b]}</strong> —{" "}
                    {TRIO_BAND_HINT[b]}{" "}
                    <span className="opacity-80">
                      (tags: {TRIO_BAND_TAGS[b].join(", ")})
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3">{MOBILE_NOTE}</p>
            </div>
          </div>

          {summaries.length ? (
            <section>
              <h2 className="text-xl text-ink">Executive summary by method</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Based on this mobile core with the selected birth date.
              </p>
              <ul className="mt-4 space-y-3">
                {summaries.map((s) => (
                  <li
                    key={s.system}
                    className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
                  >
                    <p className="text-sm font-medium text-ink">{s.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
