"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BirthDateTimeline } from "@/components/trivia/BirthDateTimeline";
import { CountryCards } from "@/components/trivia/CountryCards";
import { MatchGallery } from "@/components/trivia/MatchGallery";
import { MatchInsightPanel } from "@/components/trivia/MatchInsightPanel";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import {
  annotatePeople,
  buildDiscoveryNarratives,
  personDiscoveryKey,
} from "@/lib/trivia/discovery";
import {
  matchCitiesByPnDnNn,
  matchCountries,
  matchPeople,
  matchPeopleByDayMonth,
} from "@/lib/trivia/match";

type Props = {
  lifePath: string;
  destiny: string;
  psychic: string;
  expression: string;
  vedicName: string;
  dateOfBirth: string;
};

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function TriviaPanel({
  lifePath,
  destiny,
  psychic,
  expression,
  vedicName,
  dateOfBirth,
}: Props) {
  const target = {
    lifePath: Number(lifePath),
    destiny: Number(destiny),
    psychic: Number(psychic),
    dob: dateOfBirth,
  };
  const people = annotatePeople(
    target,
    matchPeople({ lifePath, destiny, psychic, limit: 5 }),
  );
  const birthdayTwins = annotatePeople(
    target,
    matchPeopleByDayMonth(dateOfBirth, 5),
  );
  const narratives = buildDiscoveryNarratives(target);
  const [selectedMatchKey, setSelectedMatchKey] = useState<string | null>(null);
  const selectedDiscovery = useMemo(() => {
    const pool = [...people, ...birthdayTwins];
    const fromSelection = selectedMatchKey
      ? pool.find((row) => personDiscoveryKey(row.person) === selectedMatchKey)
      : undefined;
    return fromSelection ?? people[0] ?? birthdayTwins[0] ?? null;
  }, [people, birthdayTwins, selectedMatchKey]);
  const resolvedMatchKey = selectedDiscovery
    ? personDiscoveryKey(selectedDiscovery.person)
    : null;
  const countryMatch = matchCountries({
    lifePath,
    destiny,
    psychic,
    nearLimit: 3,
  });
  const cityGroups = matchCitiesByPnDnNn({
    psychic,
    destiny,
    vedicName,
    perLayer: 5,
  });

  const psychicN = reduceToSingleDigit(Number(psychic));
  const destinyN = reduceToSingleDigit(Number(destiny));
  const nameN = reduceToSingleDigit(Number(vedicName));
  const matrixRows = [
    { key: "psychic", label: "Psychic (PN)", digit: psychicN },
    { key: "destiny", label: "Destiny (DN)", digit: destinyN },
    { key: "name", label: "Name (NN)", digit: nameN },
  ] as const;

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">
        Light trivia only: countries that share all three numbers (Life Path,
        Destiny, Psychic), plus five cities each for Psychic, Destiny, and Name.
        Not predictions or endorsements.{" "}
        <Link
          href="/trivia"
          className="text-gold-deep underline underline-offset-2 hover:text-ink"
        >
          Open full Trivia explorer
        </Link>{" "}
        for the complete lists, filters, and profile-based top 10s.
      </p>

      <div>
        <h3 className="text-lg text-ink">Top 5 similar personalities</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Match gallery — same tones, not a shared fate. Tap a card for the
          likeness note.
        </p>
        {people.length ? (
          <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
            <MatchGallery
              rows={people}
              selectedKey={resolvedMatchKey}
              onSelect={setSelectedMatchKey}
              compact
              emptyLabel="No close matches in the current bank."
            />
            <MatchInsightPanel
              narratives={narratives}
              selected={selectedDiscovery}
              compact
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            No close matches in the current bank.
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg text-ink">Born on the same day &amp; month</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Calendar day and month only (year ignored). Reflective coincidence—not
          destiny.
        </p>
        <BirthDateTimeline
          rows={birthdayTwins}
          selectedKey={resolvedMatchKey}
          onSelect={setSelectedMatchKey}
          viewerDob={dateOfBirth}
          compact
        />
      </div>

      <div>
        <h3 className="text-lg text-ink">Matching countries</h3>
        <p className="mt-1 text-xs text-ink-soft">
          {countryMatch.mode === "triad"
            ? `Every country whose Life Path, Destiny, and Psychic all match yours (${countryMatch.rows.length}).`
            : "No full three-number match in the bank — showing the next closest 2–3."}{" "}
          Date used is a commonly cited independence or formation day—not a
          political verdict.
        </p>
        <CountryCards
          rows={countryMatch.rows}
          emptyLabel="No country match in the bank."
        />
      </div>

      <div>
        <h3 className="text-lg text-ink">PN / DN / NN × city name number</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Psychic <span className="brand text-ink">{psychicN}</span>, Destiny{" "}
          <span className="brand text-ink">{destinyN}</span>, and Name{" "}
          <span className="brand text-ink">{nameN}</span> against city name
          numbers 1–9. Five sample cities per matching digit.
        </p>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
          <table className="w-full min-w-[28rem] text-center text-sm">
            <thead className="bg-mist/60 text-ink-soft">
              <tr>
                <th className="px-2 py-2 text-left font-medium">You ↓ / City →</th>
                {DIGITS.map((d) => (
                  <th key={d} className="px-1.5 py-2 font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.key} className="border-t border-[var(--line)]">
                  <td className="px-2 py-2 text-left text-ink">
                    {row.label}{" "}
                    <span className="brand text-ink">{row.digit}</span>
                  </td>
                  {DIGITS.map((d) => {
                    const hit = row.digit === d;
                    return (
                      <td
                        key={d}
                        className={`px-1.5 py-2 ${
                          hit
                            ? "bg-emerald-50 font-semibold text-emerald-900"
                            : "text-ink-soft/40"
                        }`}
                        title={
                          hit
                            ? `${row.label} ${row.digit} matches city name number ${d}`
                            : undefined
                        }
                      >
                        {hit ? "●" : "·"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cityGroups.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {cityGroups.map((group) => (
              <li
                key={group.digit}
                className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-2"
              >
                <p className="text-ink">
                  {group.labels.join(" · ")}{" "}
                  <span className="brand">{group.digit}</span>
                </p>
                <p className="mt-1 text-xs text-ink-soft">
                  {group.cities.length
                    ? group.cities
                        .map((c) => `${c.name} (${c.country})`)
                        .join(" · ")
                    : "No sample cities for this digit."}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
