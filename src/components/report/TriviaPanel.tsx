"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BirthDateTimeline } from "@/components/trivia/BirthDateTimeline";
import { CountryCards } from "@/components/trivia/CountryCards";
import { MatchGallery } from "@/components/trivia/MatchGallery";
import { MatchInsightPanel } from "@/components/trivia/MatchInsightPanel";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { TRIVIA_CITIES } from "@/lib/trivia/cities";
import {
  annotatePeople,
  buildDiscoveryNarratives,
  personDiscoveryKey,
} from "@/lib/trivia/discovery";
import {
  matchCities,
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

function sampleCitiesForDigit(digit: number, limit = 3) {
  return TRIVIA_CITIES.filter(
    (c) => reduceToSingleDigit(c.nameNumber) === digit,
  )
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);
}

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
  const countries = matchCountries({
    lifePath,
    destiny,
    psychic,
    limit: 8,
  });
  const cities = matchCities({
    lifePath,
    destiny,
    psychic,
    expression,
    vedicName,
    limit: 5,
  });

  const psychicN = reduceToSingleDigit(Number(psychic));
  const nameN = reduceToSingleDigit(Number(vedicName));
  const matrixRows = [
    { key: "psychic", label: "Psychic", digit: psychicN },
    { key: "name", label: "Vedic name", digit: nameN },
  ] as const;

  const highlightDigits = [...new Set([psychicN, nameN])].filter(
    (n) => Number.isFinite(n) && n >= 1 && n <= 9,
  );

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">
        Light trivia only: countries, cities, and personalities ranked against
        your core numbers (Life Path, Destiny, Psychic; cities also use
        Expression and Vedic name), plus people born on the same day and month.
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
          Every country whose Life Path, Destiny, and Psychic all match yours is
          listed. Date used is a commonly cited independence or formation
          day—not a political verdict.
        </p>
        <CountryCards
          rows={countries}
          emptyLabel="No close country match in the bank."
        />
      </div>

      <div>
        <h3 className="text-lg text-ink">
          Psychic / name × city name number
        </h3>
        <p className="mt-1 text-xs text-ink-soft">
          Your Psychic{" "}
          <span className="brand text-ink">{psychicN}</span> and Vedic name{" "}
          <span className="brand text-ink">{nameN}</span> against city name
          numbers 1–9. Highlighted cells are exact digit matches; sample cities
          are from the popular-city bank.
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

        {highlightDigits.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {highlightDigits.map((d) => {
              const samples = sampleCitiesForDigit(d, 4);
              const tags = [
                psychicN === d ? "Psychic" : null,
                nameN === d ? "Vedic name" : null,
              ].filter(Boolean);
              return (
                <li
                  key={d}
                  className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-2"
                >
                  <p className="text-ink">
                    City name number{" "}
                    <span className="brand">{d}</span>
                    <span className="text-ink-soft">
                      {" "}
                      · matches {tags.join(" + ")}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {samples.length
                      ? samples
                          .map((c) => `${c.name} (${c.country})`)
                          .join(" · ")
                      : "No sample cities for this digit."}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <div>
        <h3 className="text-lg text-ink">Top 5 compatible cities</h3>
        <p className="mt-1 text-xs text-ink-soft">
          City name numbers matched to Life Path, Destiny, Psychic, Expression,
          and Vedic name—reflective geography trivia, not relocation advice.
        </p>
        {cities.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="bg-mist/60 text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-medium">City</th>
                  <th className="px-3 py-2 font-medium">Country</th>
                  <th className="px-3 py-2 font-medium">Name number</th>
                  <th className="px-3 py-2 font-medium">Fits</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((c) => {
                  const n = reduceToSingleDigit(c.nameNumber);
                  const fits = [
                    n === psychicN ? "Psychic" : null,
                    n === nameN ? "Name" : null,
                    n === reduceToSingleDigit(Number(lifePath))
                      ? "Life Path"
                      : null,
                    n === reduceToSingleDigit(Number(destiny))
                      ? "Destiny"
                      : null,
                    n === reduceToSingleDigit(Number(expression))
                      ? "Expression"
                      : null,
                  ].filter(Boolean);
                  return (
                    <tr
                      key={`${c.name}|${c.country}`}
                      className="border-t border-[var(--line)]"
                    >
                      <td className="px-3 py-2 text-ink">{c.name}</td>
                      <td className="px-3 py-2 text-ink-soft">{c.country}</td>
                      <td className="brand px-3 py-2 text-ink">{c.nameNumber}</td>
                      <td className="px-3 py-2 text-xs text-ink-soft">
                        {fits.length ? fits.join(" · ") : "Near"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            No close city matches in the bank.
          </p>
        )}
      </div>
    </div>
  );
}
