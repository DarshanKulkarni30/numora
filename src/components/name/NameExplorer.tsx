"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { NameMathPanels } from "@/components/name/NameMathPanels";
import { calculateChaldean } from "@/lib/numerology/chaldean";
import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import {
  joinGivenAndSurname,
  splitGivenAndSurname,
} from "@/lib/numerology/nameParts";
import {
  resolveNameSpelling,
  type NameSpellingMode,
} from "@/lib/numerology/nameSpelling";
import { ownerProminenceFromDob } from "@/lib/numerology/ownerAgeProminence";
import { AgeFocusNumberChips } from "@/components/AgeFocusNumberChips";
import { NameSpellingModePicker } from "@/components/name/NameSpellingModePicker";
import {
  gendersForProfile,
  SUGGESTED_NAMES,
} from "@/lib/numerology/nameSuggestions";
import { calculatePythagorean } from "@/lib/numerology/pythagorean";
import {
  TRIO_BAND_HINT,
  TRIO_BAND_ICON,
  TRIO_BAND_TAGS,
  TRIO_NOTE,
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
import { calculateVedic } from "@/lib/numerology/vedic";
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

const BAND_RANK: Record<TrioBand, number> = {
  amazing: 5,
  favourable: 4,
  neutral: 3,
  friction: 2,
  block: 1,
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

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function SuggestionMethodCell({
  number,
  band,
  label,
}: {
  number: number;
  band: TrioBand;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <p className="brand text-ink">{number}</p>
      <span
        className={`inline-flex max-w-[11rem] items-center gap-1 rounded-full border px-2 py-0.5 text-xs leading-tight ${BAND_STYLE[band]}`}
      >
        {TRIO_BAND_ICON[band]} {BAND_WORD[band]} · {label}
      </span>
    </div>
  );
}

function nameLayers(fullName: string, dob: string) {
  const pyth = calculatePythagorean(fullName, dob);
  const chald = calculateChaldean(fullName);
  const vedic = calculateVedic(fullName, dob);
  return {
    expression: pyth.expression,
    chaldean: chald.nameNumber,
    vedicName: vedic.nameNumber,
    unitName: vedic.unitSystemNameNumber,
    psychic: reduceToSingleDigit(vedic.psychic),
    destiny: reduceToSingleDigit(vedic.destiny),
    birthDay: reduceToSingleDigit(pyth.birthDay),
    lifePath: reduceToSingleDigit(pyth.lifePath),
  };
}

function executiveFor(
  system: TrioSystem,
  hit: ReturnType<typeof vedicTrio>,
  digitsLine: string,
  favNameDigits: number[],
): string {
  const fav =
    favNameDigits.length > 0
      ? `Name digits that often sit easier on this chart: ${favNameDigits.join(", ")}.`
      : "Few name digits land in the easier bands for this Birth×Destiny pair—compare the full table and use trial spellings carefully.";
  if (system === "vedic") {
    return `Vedic: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary} ${fav}`;
  }
  if (system === "chaldean") {
    return `Chaldean: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary} ${fav}`;
  }
  return `Pythagorean: ${digitsLine} lands in ${BAND_WORD[hit.band]} (${hit.label}). ${hit.summary}`;
}

export function NameExplorer({ people }: Props) {
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
  const [trialFirst, setTrialFirst] = useState("");
  const [trialLast, setTrialLast] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return splitGivenAndSurname(first?.full_name || first?.preferred_name || "")
      .surname;
  });
  const [spellingMode, setSpellingMode] = useState<NameSpellingMode>("full");
  const [nickname, setNickname] = useState("");
  const [tab, setTab] = useState<TrioSystem>("vedic");
  const [letterFilter, setLetterFilter] = useState<string>("All");

  const selected = selectable.find(
    (p) => `${p.sort_order}-${p.full_name}` === selectedKey,
  );

  const dob = selected?.date_of_birth ?? "";
  const profileFullName = selected?.full_name || selected?.preferred_name || "";

  const psychic = selected ? vedicPsychicFromDob(dob) : null;
  const destiny = selected ? vedicDestinyFromDob(dob) : null;
  const lifePath = selected ? lifePathFromDob(dob) : null;

  const prominence =
    selected && psychic != null && destiny != null
      ? ownerProminenceFromDob(dob, psychic, destiny)
      : null;

  const profileResolved = useMemo(
    () =>
      resolveNameSpelling({
        mode: spellingMode,
        fullName: profileFullName,
        nickname,
      }),
    [spellingMode, profileFullName, nickname],
  );

  const currentName = profileResolved.ready ? profileResolved.spelling : "";

  const current = useMemo(() => {
    if (!selected || !currentName) return null;
    return nameLayers(currentName, dob);
  }, [selected, currentName, dob]);

  const trialSnap = useMemo(() => {
    if (!selected || spellingMode === "nickname") return null;
    if (trialFirst.trim().length < 2) return null;
    const spelling =
      spellingMode === "first"
        ? trialFirst.trim()
        : joinGivenAndSurname(trialFirst, trialLast);
    return nameLayers(spelling, dob);
  }, [trialFirst, trialLast, selected, dob, spellingMode]);

  const activeLayers = trialSnap ?? current;
  const activeSpellingLabel = trialSnap
    ? spellingMode === "first"
      ? "Trial first name"
      : "Trial spelling"
    : profileResolved.label;
  const activeScoredSpelling = trialSnap
    ? spellingMode === "first"
      ? trialFirst.trim()
      : joinGivenAndSurname(trialFirst, trialLast)
    : currentName;

  const vedicHit =
    psychic != null && destiny != null && activeLayers
      ? vedicTrio(psychic, destiny, activeLayers.vedicName)
      : null;
  const chaldeanHit =
    psychic != null && destiny != null && activeLayers
      ? chaldeanTrio(psychic, destiny, activeLayers.chaldean)
      : null;
  const pythHit =
    activeLayers && lifePath != null
      ? pythagoreanTrio(
          activeLayers.birthDay,
          lifePath,
          activeLayers.expression,
        )
      : null;

  const activeHit =
    tab === "vedic" ? vedicHit : tab === "chaldean" ? chaldeanHit : pythHit;

  const nameDigitForTab =
    tab === "vedic"
      ? activeLayers
        ? reduceToSingleDigit(activeLayers.vedicName)
        : null
      : tab === "chaldean"
        ? activeLayers
          ? reduceToSingleDigit(activeLayers.chaldean)
          : null
        : activeLayers
          ? reduceToSingleDigit(activeLayers.expression)
          : null;

  const table =
    psychic != null && (tab === "vedic" || tab === "chaldean")
      ? tab === "vedic"
        ? vedicTableForBirth(psychic)
        : chaldeanTableForBirth(psychic)
      : null;

  const stripDigits = useMemo(() => {
    if (psychic == null || destiny == null) return [];
    if (tab === "pythagorean" && pythHit) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
        const hit = pythagoreanTrio(
          activeLayers?.birthDay ?? psychic,
          lifePath ?? destiny,
          n,
        );
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
  }, [psychic, destiny, tab, pythHit, activeLayers, lifePath]);

  const favNameDigits = stripDigits
    .filter((d) => d.band === "amazing" || d.band === "favourable")
    .map((d) => d.n);

  const suggestions = useMemo(() => {
    if (psychic == null || destiny == null || lifePath == null || !selected)
      return [];
    const allowed = new Set(gendersForProfile(selected.gender || ""));
    const currentFirst = (selected.preferred_name || currentName)
      .split(/\s+/)[0]
      ?.toLowerCase();

    return SUGGESTED_NAMES.filter((s) => allowed.has(s.gender))
      .map((s) => {
        const scored = joinGivenAndSurname(s.name, trialLast);
        const layers = nameLayers(scored, dob);
        const vedicN = reduceToSingleDigit(layers.vedicName);
        const chaldeanN = reduceToSingleDigit(layers.chaldean);
        const expressionN = reduceToSingleDigit(layers.expression);
        const vHit = vedicTrio(psychic, destiny, vedicN);
        const cHit = chaldeanTrio(psychic, destiny, chaldeanN);
        const pHit = pythagoreanTrio(
          layers.birthDay,
          lifePath,
          expressionN,
        );
        return {
          ...s,
          scoredName: scored,
          vedicNumber: vedicN,
          chaldeanNumber: chaldeanN,
          expressionNumber: expressionN,
          vedicBand: vHit.band,
          vedicLabel: vHit.label,
          chaldeanBand: cHit.band,
          chaldeanLabel: cHit.label,
          pythBand: pHit.band,
          pythLabel: pHit.label,
          /** Keep primary sort/filter on Vedic Birth×Destiny×Name. */
          band: vHit.band,
          label: vHit.label,
          rank: BAND_RANK[vHit.band],
        };
      })
      .filter((s) => s.name.toLowerCase() !== currentFirst)
      .filter((s) => s.band === "amazing" || s.band === "favourable")
      .sort((a, b) => {
        if (b.rank !== a.rank) return b.rank - a.rank;
        return a.name.localeCompare(b.name);
      });
  }, [psychic, destiny, lifePath, selected, dob, currentName, trialLast]);

  const suggestionLetters = useMemo(() => {
    const set = new Set(
      suggestions.map((s) => s.name.charAt(0).toUpperCase()).filter(Boolean),
    );
    return ["All", ...[...set].sort((a, b) => a.localeCompare(b))];
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    const letter =
      letterFilter === "All" || suggestionLetters.includes(letterFilter)
        ? letterFilter
        : "All";
    if (letter === "All") return suggestions;
    return suggestions.filter(
      (s) => s.name.charAt(0).toUpperCase() === letter,
    );
  }, [suggestions, letterFilter, suggestionLetters]);

  const summaries = useMemo(() => {
    if (!activeLayers || psychic == null || destiny == null || lifePath == null)
      return [];
    const v = vedicTrio(psychic, destiny, activeLayers.vedicName);
    const c = chaldeanTrio(psychic, destiny, activeLayers.chaldean);
    const p = pythagoreanTrio(
      activeLayers.birthDay,
      lifePath,
      activeLayers.expression,
    );
    const vFav = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => ({ n, band: vedicTrio(psychic, destiny, n).band }))
      .filter((x) => x.band === "amazing" || x.band === "favourable")
      .map((x) => x.n);
    const cFav = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((n) => ({ n, band: chaldeanTrio(psychic, destiny, n).band }))
      .filter((x) => x.band === "amazing" || x.band === "favourable")
      .map((x) => x.n);
    return [
      {
        system: "vedic" as const,
        title: "Vedic",
        subtitle: "Indian-style map" as const,
        body: executiveFor(
          "vedic",
          v,
          `Psychic ${psychic} · Destiny ${destiny} · Name ${activeLayers.vedicName}`,
          vFav,
        ),
      },
      {
        system: "chaldean" as const,
        title: "Chaldean",
        subtitle: undefined as string | undefined,
        body: executiveFor(
          "chaldean",
          c,
          `Birth ${psychic} · Destiny ${destiny} · Chaldean name ${activeLayers.chaldean}`,
          cFav,
        ),
      },
      {
        system: "pythagorean" as const,
        title: "Pythagorean",
        subtitle: undefined as string | undefined,
        body: executiveFor(
          "pythagorean",
          p,
          `Birth day ${activeLayers.birthDay} · Life Path ${lifePath} · Expression ${activeLayers.expression}`,
          p.favNames,
        ),
      },
    ];
  }, [activeLayers, psychic, destiny, lifePath]);

  return (
    <div className="space-y-8">
      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + DOB) to explore name
          fit.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="name-person"
                className="mb-1 block text-sm text-ink-soft"
              >
                Person from your profile
              </label>
              <select
                id="name-person"
                value={selectedKey}
                onChange={(e) => {
                  const next = selectable.find(
                    (p) => `${p.sort_order}-${p.full_name}` === e.target.value,
                  );
                  setSelectedKey(e.target.value);
                  setTrialFirst("");
                  setTrialLast(
                    splitGivenAndSurname(
                      next?.full_name || next?.preferred_name || "",
                    ).surname,
                  );
                  setLetterFilter("All");
                }}
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
              {selected && psychic != null && destiny != null && prominence ? (
                <div className="mt-3 space-y-2">
                  <AgeFocusNumberChips
                    psychic={psychic}
                    destiny={destiny}
                    nameNumber={
                      activeLayers
                        ? reduceToSingleDigit(activeLayers.vedicName)
                        : null
                    }
                    prominence={prominence}
                  />
                  <p className="text-sm text-ink-soft">
                    Fixed from DOB {selected.date_of_birth}
                    {lifePath != null ? (
                      <>
                        {" "}
                        · Life Path{" "}
                        <span className="brand text-ink">{lifePath}</span>
                      </>
                    ) : null}
                    . Name digit uses{" "}
                    <span className="font-medium text-ink">
                      {activeSpellingLabel}
                    </span>
                    {currentName ? (
                      <>
                        {" "}
                        (
                        <span className="font-medium text-ink">{currentName}</span>
                        )
                      </>
                    ) : null}
                    . Trial below overrides when shown and filled.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <NameSpellingModePicker
                idPrefix="name-explore"
                mode={spellingMode}
                onModeChange={(m) => {
                  setSpellingMode(m);
                  if (m === "nickname") setTrialFirst("");
                }}
                nickname={nickname}
                onNicknameChange={setNickname}
              />
              {spellingMode === "full" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name-trial-first"
                      className="mb-1 block text-sm text-ink-soft"
                    >
                      Trial first name
                    </label>
                    <input
                      id="name-trial-first"
                      type="text"
                      value={trialFirst}
                      onChange={(e) => setTrialFirst(e.target.value)}
                      placeholder="Type a first name"
                      className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name-trial-last"
                      className="mb-1 block text-sm text-ink-soft"
                    >
                      Trial last name
                    </label>
                    <input
                      id="name-trial-last"
                      type="text"
                      value={trialLast}
                      onChange={(e) => setTrialLast(e.target.value)}
                      placeholder="Surname"
                      className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-ink-soft sm:col-span-2">
                    Optional trial full spelling. Leave first blank to use the
                    profile full name. Reflective only—not legal naming advice.
                    {trialFirst.trim().length >= 2 ? (
                      <>
                        {" "}
                        Scoring{" "}
                        <span className="font-medium text-ink">
                          {joinGivenAndSurname(trialFirst, trialLast)}
                        </span>
                        .
                      </>
                    ) : null}
                  </p>
                </div>
              ) : null}
              {spellingMode === "first" ? (
                <div>
                  <label
                    htmlFor="name-trial-first-only"
                    className="mb-1 block text-sm text-ink-soft"
                  >
                    Trial first name (optional)
                  </label>
                  <input
                    id="name-trial-first-only"
                    type="text"
                    value={trialFirst}
                    onChange={(e) => setTrialFirst(e.target.value)}
                    placeholder="Try another first name"
                    className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
                    autoComplete="off"
                  />
                  <p className="mt-1.5 text-xs text-ink-soft">
                    Leave blank to score the profile given name. No surname in
                    this mode.
                    {trialFirst.trim().length >= 2 ? (
                      <>
                        {" "}
                        Scoring{" "}
                        <span className="font-medium text-ink">
                          {trialFirst.trim()}
                        </span>
                        .
                      </>
                    ) : null}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {activeLayers ? (
            <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <thead className="bg-mist/60 text-ink-soft">
                  <tr>
                    <th className="px-3 py-2 font-medium">Layer</th>
                    <th className="px-3 py-2 font-medium">Current</th>
                    <th className="px-3 py-2 font-medium">
                      {trialSnap ? "Trial" : "—"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Expression (Pythagorean)", "expression"],
                      ["Chaldean name", "chaldean"],
                      ["Vedic name", "vedicName"],
                      ["Unit name map", "unitName"],
                    ] as const
                  ).map(([label, key]) => (
                    <tr key={key} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2 text-ink-soft">{label}</td>
                      <td className="brand px-3 py-2 text-ink">
                        {current?.[key] ?? "—"}
                      </td>
                      <td className="brand px-3 py-2 text-ink">
                        {trialSnap ? trialSnap[key] : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <NameMathPanels fullName={activeScoredSpelling || currentName} />

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
                  className={`flex-1 rounded-full px-3 py-2 text-sm transition-all duration-150 ${
                    tab === id
                      ? "bg-ink text-paper shadow-sm"
                      : "text-ink-soft hover:-translate-y-px hover:text-ink hover:shadow-sm active:translate-y-0 active:shadow-none"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeHit ? (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 ${BAND_STYLE[activeHit.band]}`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-80">
                  {trialSnap ? "Trial cell" : "Current cell"} · {tab}
                </p>
                <p className="mt-1 font-medium">
                  {BAND_WORD[activeHit.band]} · {activeHit.label}
                </p>
                <p className="mt-1 text-sm leading-6">{activeHit.summary}</p>
              </div>
            ) : null}

            <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
              <p className="text-sm font-medium text-ink">
                Name digits 1–9 for this Birth × Destiny
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                If many look Heavy, that is the chart for this DOB—not a
                broken calculator. Prefer highlighted easier digits when
                experimenting with spellings.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {stripDigits.map(({ n, band, label }) => {
                  const isYou = nameDigitForTab === n;
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
              {favNameDigits.length ? (
                <p className="mt-3 text-sm text-ink">
                  Often easier name digits:{" "}
                  <span className="brand">{favNameDigits.join(", ")}</span>
                </p>
              ) : (
                <p className="mt-3 text-sm text-ink-soft">
                  Few “easier” digits on this chart—use Neutral/Friction with
                  care, or compare methods below.
                </p>
              )}
            </div>

            {tab === "pythagorean" && pythHit ? (
              <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm text-ink-soft">
                <p className="font-medium text-ink">
                  Pythagorean name fit (no Destiny×Name grid)
                </p>
                <p className="mt-1 text-xs">
                  Uses odd/even birth+path mix plus birth-day → Expression
                  alignment—same five-band scale, different method.
                </p>
                <p className="mt-3 font-medium text-ink">{pythHit.patternLabel}</p>
                <p className="mt-1">{pythHit.patternEffect}</p>
                <p className="mt-2">{pythHit.alignNote}</p>
              </div>
            ) : table && destiny != null ? (
              <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                <p className="mb-2 text-sm font-medium text-ink">
                  Full Birth {psychic} table · rows = Destiny · columns = Name
                </p>
                <p className="mb-3 text-xs text-ink-soft">
                  Your Destiny row and name column are tinted; the outlined
                  cell is the active name. Hover icons for traditional tags.
                </p>
                <table className="w-full min-w-[22rem] border-collapse text-center text-[11px]">
                  <thead>
                    <tr>
                      <th className="border-b border-[var(--line)] p-1 text-left font-medium text-ink">
                        D \ N
                      </th>
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                        <th
                          key={n}
                          className={`border-b border-[var(--line)] p-1 font-medium text-ink ${
                            n === nameDigitForTab ? "bg-ink/5" : ""
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
                              destinyN === destiny &&
                              nameN === nameDigitForTab;
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
              <p className="mt-3">{TRIO_NOTE}</p>
            </div>
          </div>

          <section>
            <h2 className="text-xl text-ink">Suggested names</h2>
            <p className="mt-1 text-sm text-ink-soft">
              First names from the curated bank, scored with the last name
              above (gender filtered). Listed when Vedic Birth×Destiny×Name is
              Amazing or Favourable; Chaldean and Pythagorean numbers and bands
              are shown for comparison. Vedic uses an Indian-style letter map.
              Change the last name to see marriage or legal-surname options.
              Reflective ideas only—not baby-naming or legal advice.
            </p>
            {suggestions.length ? (
              <>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {suggestionLetters.map((letter) => {
                    const active = letterFilter === letter;
                    const count =
                      letter === "All"
                        ? suggestions.length
                        : suggestions.filter(
                            (s) => s.name.charAt(0).toUpperCase() === letter,
                          ).length;
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setLetterFilter(letter)}
                        className={`rounded-full border px-2.5 py-1 text-xs transition-all duration-150 ${
                          active
                            ? "border-ink bg-ink text-paper shadow-sm"
                            : "border-[var(--line)] bg-white/70 text-ink-soft hover:-translate-y-px hover:bg-white hover:text-ink hover:shadow-sm active:translate-y-0 active:shadow-none"
                        }`}
                      >
                        {letter}
                        <span className="ml-1 opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Showing {filteredSuggestions.length} of {suggestions.length}{" "}
                  good matches
                  {letterFilter !== "All" ? ` · letter ${letterFilter}` : ""}.
                </p>
                <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
                  <table className="w-full min-w-[40rem] text-left text-sm">
                    <thead className="bg-mist/60 text-ink-soft">
                      <tr>
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Gender</th>
                        <th className="px-3 py-2 font-medium">
                          Vedic
                          <span className="mt-0.5 block text-[0.65rem] font-normal opacity-80">
                            Indian-style map
                          </span>
                        </th>
                        <th className="px-3 py-2 font-medium">Chaldean</th>
                        <th className="px-3 py-2 font-medium">Pythagorean</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSuggestions.map((s) => (
                        <tr
                          key={s.name}
                          className="border-t border-[var(--line)]"
                        >
                          <td className="px-3 py-2 text-ink">
                            <button
                              type="button"
                              className="text-gold-deep underline underline-offset-2 transition hover:text-ink"
                              onClick={() => setTrialFirst(s.name)}
                            >
                              {s.scoredName}
                            </button>
                          </td>
                          <td className="px-3 py-2 capitalize text-ink-soft">
                            {s.gender}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <SuggestionMethodCell
                              number={s.vedicNumber}
                              band={s.vedicBand}
                              label={s.vedicLabel}
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <SuggestionMethodCell
                              number={s.chaldeanNumber}
                              band={s.chaldeanBand}
                              label={s.chaldeanLabel}
                            />
                          </td>
                          <td className="px-3 py-2 align-top">
                            <SuggestionMethodCell
                              number={s.expressionNumber}
                              band={s.pythBand}
                              label={s.pythLabel}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredSuggestions.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-soft">
                    No good matches for letter {letterFilter}. Pick another
                    letter or All.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                No Amazing/Favourable names in the bank for this chart yet.
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl text-ink">Executive summary by method</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Based on {trialSnap ? "the trial name" : "the current profile name"}{" "}
              with this birth date.
            </p>
            <ul className="mt-4 space-y-3">
              {summaries.map((s) => (
                <li
                  key={s.system}
                  className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
                >
                  <p className="text-sm font-medium text-ink">
                    {s.title}
                    {s.subtitle ? (
                      <span className="ml-2 text-xs font-normal text-ink-soft">
                        ({s.subtitle})
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
