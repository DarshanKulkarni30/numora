"use client";

import Link from "next/link";
import { matchCountries, matchPeople } from "@/lib/trivia/match";

type Props = {
  lifePath: string;
  destiny: string;
};

export function TriviaPanel({ lifePath, destiny }: Props) {
  const people = matchPeople({ lifePath, destiny, limit: 5 });
  const countries = matchCountries({ lifePath, destiny, limit: 1 });
  const topCountry = countries[0];

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">
        Light trivia only: top matches whose birth or independence / formation
        dates share your Pythagorean Life Path or Vedic Destiny number. Not
        predictions or endorsements.{" "}
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
        <h3 className="text-lg text-ink">Top matching country</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Date used is a commonly cited independence or formation day—not a
          political verdict.
        </p>
        {topCountry ? (
          <div className="mt-3 flex max-w-lg gap-3 rounded-xl border border-[var(--line)] bg-white/50 p-3">
            <div className="flex w-20 shrink-0 flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w80/${topCountry.iso2}.png`}
                alt={`${topCountry.name} flag`}
                width={80}
                height={53}
                className="h-auto w-full rounded border border-[var(--line)]"
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://staticmap.openstreetmap.de/staticmap.php?center=${topCountry.lat},${topCountry.lng}&zoom=3&size=120x80&maptype=mapnik`}
                alt={`Map of ${topCountry.name}`}
                width={120}
                height={80}
                className="h-auto w-full rounded border border-[var(--line)] bg-mist object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-ink">{topCountry.name}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                Founding / independence: {topCountry.dob}
              </p>
              <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                  <dt className="text-ink-soft">Life Path</dt>
                  <dd className="brand text-base text-ink">
                    {topCountry.lifePath}
                  </dd>
                </div>
                <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                  <dt className="text-ink-soft">Destiny</dt>
                  <dd className="brand text-base text-ink">
                    {topCountry.destiny}
                  </dd>
                </div>
                <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                  <dt className="text-ink-soft">Psychic</dt>
                  <dd className="brand text-base text-ink">
                    {topCountry.psychic}
                  </dd>
                </div>
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
