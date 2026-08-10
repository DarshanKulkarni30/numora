"use client";

import { matchCountries, matchPeople } from "@/lib/trivia/match";

type Props = {
  lifePath: string;
  destiny: string;
};

export function TriviaPanel({ lifePath, destiny }: Props) {
  const people = matchPeople({ lifePath, destiny, limit: 12 });
  const countries = matchCountries({ lifePath, destiny, limit: 8 });

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">
        Light trivia only: people and countries whose birth or independence /
        formation dates share your Pythagorean Life Path or Vedic Destiny
        number (after the usual reductions). Not predictions, endorsements, or
        destiny claims.
      </p>

      <div>
        <h3 className="text-lg text-ink">Famous personalities with similar numbers</h3>
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
          <p className="mt-2 text-sm text-ink-soft">No close matches in the current bank.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg text-ink">Countries with a similar founding pattern</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Date used is a commonly cited independence or formation day for
          reflective matching—not a political verdict.
        </p>
        {countries.length ? (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {countries.map((c) => (
              <li
                key={c.iso2}
                className="flex gap-3 rounded-xl border border-[var(--line)] bg-white/50 p-3"
              >
                <div className="flex w-20 shrink-0 flex-col items-center gap-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w80/${c.iso2}.png`}
                    alt={`${c.name} flag`}
                    width={80}
                    height={53}
                    className="h-auto w-full rounded border border-[var(--line)]"
                    loading="lazy"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://staticmap.openstreetmap.de/staticmap.php?center=${c.lat},${c.lng}&zoom=3&size=120x80&maptype=mapnik`}
                    alt={`Map of ${c.name}`}
                    width={120}
                    height={80}
                    className="h-auto w-full rounded border border-[var(--line)] bg-mist object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-ink">{c.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    Founding / independence: {c.dob}
                  </p>
                  <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                    <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                      <dt className="text-ink-soft">Life Path</dt>
                      <dd className="brand text-base text-ink">{c.lifePath}</dd>
                    </div>
                    <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                      <dt className="text-ink-soft">Destiny</dt>
                      <dd className="brand text-base text-ink">{c.destiny}</dd>
                    </div>
                    <div className="rounded-lg bg-mist/70 px-1 py-1.5">
                      <dt className="text-ink-soft">Psychic</dt>
                      <dd className="brand text-base text-ink">{c.psychic}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">No close country matches in the bank.</p>
        )}
      </div>
    </div>
  );
}
