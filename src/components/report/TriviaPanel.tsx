"use client";

import Link from "next/link";
import { CountryNumberStat } from "@/components/trivia/CountryNumberStat";
import { CountryWikiMap } from "@/components/trivia/CountryWikiMap";
import {
  matchCountries,
  matchPeople,
  matchPeopleByDayMonth,
} from "@/lib/trivia/match";

type Props = {
  lifePath: string;
  destiny: string;
  dateOfBirth: string;
};

export function TriviaPanel({ lifePath, destiny, dateOfBirth }: Props) {
  const people = matchPeople({ lifePath, destiny, limit: 5 });
  const birthdayTwins = matchPeopleByDayMonth(dateOfBirth, 5);
  const countries = matchCountries({ lifePath, destiny, limit: 1 });
  const topCountry = countries[0];

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">
        Light trivia only: top matches whose birth or independence / formation
        dates share your Pythagorean Life Path or Vedic Destiny number, plus
        people born on the same day and month. Not predictions or endorsements.{" "}
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
        {people.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-mist/60 text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Known for</th>
                  <th className="px-3 py-2 font-medium">DOB</th>
                  <th className="px-3 py-2 font-medium">Life Path</th>
                  <th className="px-3 py-2 font-medium">Destiny</th>
                  <th className="px-3 py-2 font-medium">Psychic</th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.name} className="border-t border-[var(--line)]">
                    <td className="px-3 py-2 text-ink">{p.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{p.note}</td>
                    <td className="px-3 py-2 text-ink-soft">{p.dob}</td>
                    <td className="brand px-3 py-2 text-ink">{p.lifePath}</td>
                    <td className="brand px-3 py-2 text-ink">{p.destiny}</td>
                    <td className="brand px-3 py-2 text-ink">{p.psychic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        {birthdayTwins.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-mist/60 text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Known for</th>
                  <th className="px-3 py-2 font-medium">DOB</th>
                  <th className="px-3 py-2 font-medium">Life Path</th>
                  <th className="px-3 py-2 font-medium">Destiny</th>
                  <th className="px-3 py-2 font-medium">Psychic</th>
                </tr>
              </thead>
              <tbody>
                {birthdayTwins.map((p) => (
                  <tr key={`bday-${p.name}`} className="border-t border-[var(--line)]">
                    <td className="px-3 py-2 text-ink">{p.name}</td>
                    <td className="px-3 py-2 text-ink-soft">{p.note}</td>
                    <td className="px-3 py-2 text-ink-soft">{p.dob}</td>
                    <td className="brand px-3 py-2 text-ink">{p.lifePath}</td>
                    <td className="brand px-3 py-2 text-ink">{p.destiny}</td>
                    <td className="brand px-3 py-2 text-ink">{p.psychic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            No one in the current bank shares this day and month.
          </p>
        )}
      </div>

      <div>
        <h3 className="text-lg text-ink">Top matching country</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Date used is a commonly cited independence or formation day—not a
          political verdict.
        </p>
        {topCountry ? (
          <div className="mt-3 flex max-w-lg gap-3 rounded-xl border border-[var(--line)] bg-white/50 p-3">
            <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w80/${topCountry.iso2}.png`}
                alt={`${topCountry.name} flag`}
                width={80}
                height={53}
                className="h-auto w-full rounded border border-[var(--line)]"
                loading="lazy"
              />
              <CountryWikiMap
                name={topCountry.name}
                iso2={topCountry.iso2}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-ink">{topCountry.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                Founding / independence: {topCountry.dob}
              </p>
              <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                <CountryNumberStat
                  kind="lifePath"
                  value={topCountry.lifePath}
                  countryName={topCountry.name}
                />
                <CountryNumberStat
                  kind="destiny"
                  value={topCountry.destiny}
                  countryName={topCountry.name}
                />
                <CountryNumberStat
                  kind="psychic"
                  value={topCountry.psychic}
                  countryName={topCountry.name}
                />
              </dl>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            No close country match in the bank.
          </p>
        )}
      </div>
    </div>
  );
}
