"use client";

import { useMemo, useState } from "react";
import {
  rankNameSpellings,
  type RankedSpelling,
} from "@/lib/numerology/nameAdvisor";
import {
  joinGivenAndSurname,
  splitGivenAndSurname,
} from "@/lib/numerology/nameParts";
import type { TrioBand } from "@/lib/numerology/trioMatrix";
import { TRIO_BAND_ICON } from "@/lib/numerology/trioMatrix";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  people: PersonRecord[];
};

const BAND_STYLE: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

const SOURCE_LABEL: Record<RankedSpelling["source"], string> = {
  current: "Current",
  spelling: "Spelling",
  bank: "Name bank",
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

export function NameAdvisorExplorer({ people }: Props) {
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

  const selected = selectable.find(
    (p) => `${p.sort_order}-${p.full_name}` === selectedKey,
  );
  const natal = selected?.full_name || selected?.preferred_name || "";
  const split = splitGivenAndSurname(natal);

  const [given, setGiven] = useState(split.given);
  const [surname, setSurname] = useState(split.surname);

  const result = useMemo(() => {
    if (!selected || !isValidDob(selected.date_of_birth) || !given.trim()) {
      return null;
    }
    return rankNameSpellings({
      fullName: natal,
      dateOfBirth: selected.date_of_birth,
      gender: selected.gender,
      trialGiven: given,
      trialSurname: surname,
    });
  }, [selected, natal, given, surname]);

  if (!selectable.length) {
    return (
      <p className="text-sm text-ink-soft">
        Add a profile with a full name and date of birth to rank spellings.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
        <h2 className="text-xl text-ink">Ranked name advisor</h2>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          Spellings of this given name are ranked against Birth×Destiny (Vedic)
          and Birth Day×Life Path×Expression (Pythagorean). The name bank only
          appears when a first name lands in an easier band. Reflective only —
          not legal naming advice.
        </p>

        <label className="mt-4 block text-sm">
          <span className="text-ink-soft">Person</span>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
            value={selectedKey}
            onChange={(e) => {
              const next = selectable.find(
                (p) => `${p.sort_order}-${p.full_name}` === e.target.value,
              );
              setSelectedKey(e.target.value);
              const parts = splitGivenAndSurname(
                next?.full_name || next?.preferred_name || "",
              );
              setGiven(parts.given);
              setSurname(parts.surname);
            }}
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
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink-soft">Given name to rank</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
              value={given}
              onChange={(e) => setGiven(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-soft">Surname (held still)</span>
            <input
              className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </label>
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/70">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Vedic</th>
                <th className="px-4 py-3">Expression</th>
                <th className="px-4 py-3">Chaldean</th>
              </tr>
            </thead>
            <tbody>
              {result.ranked.map((row) => (
                <tr
                  key={`${row.source}-${row.fullName}`}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{row.fullName}</p>
                    <p className="text-xs text-ink-soft">{row.note}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {SOURCE_LABEL[row.source]}
                  </td>
                  <td className="px-4 py-3">
                    <Band number={row.vedicName} band={row.vedicBand} />
                  </td>
                  <td className="px-4 py-3">
                    <Band number={row.expression} band={row.pythBand} />
                  </td>
                  <td className="px-4 py-3">
                    <Band number={row.chaldean} band={row.chaldeanBand} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs leading-5 text-ink-soft">
            {result.disclaimer} Trial full name:{" "}
            {joinGivenAndSurname(result.given, result.surname)}.
          </p>
        </div>
      ) : (
        <p className="text-sm text-ink-soft">Enter a given name to rank.</p>
      )}
    </div>
  );
}

function Band({ number, band }: { number: number; band: TrioBand }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${BAND_STYLE[band]}`}
    >
      {number} · {TRIO_BAND_ICON[band]} {band}
    </span>
  );
}
