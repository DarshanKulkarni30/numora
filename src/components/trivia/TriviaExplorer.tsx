"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  lifePathFromDob,
  vedicDestinyFromDob,
} from "@/lib/numerology/dateNumbers";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { matchCountries, matchPeople } from "@/lib/trivia/match";
import { TRIVIA_COUNTRIES } from "@/lib/trivia/countries";
import { TRIVIA_PEOPLE } from "@/lib/trivia/people";

type Props = {
  people: PersonRecord[];
};

type Tab = "browse" | "match";
type BrowseKind = "people" | "countries";

const NUMBER_FILTERS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

export function TriviaExplorer({ people }: Props) {
  const [tab, setTab] = useState<Tab>("match");
  const [browseKind, setBrowseKind] = useState<BrowseKind>("people");
  const [filterLp, setFilterLp] = useState("");
  const [filterDestiny, setFilterDestiny] = useState("");
  const [filterPsychic, setFilterPsychic] = useState("");
  const [query, setQuery] = useState("");

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

  const matchLp = selected ? lifePathFromDob(selected.date_of_birth) : null;
  const matchDestiny = selected
    ? vedicDestinyFromDob(selected.date_of_birth)
    : null;

  const matchedPeople =
    matchLp != null && matchDestiny != null
      ? matchPeople({ lifePath: matchLp, destiny: matchDestiny, limit: 10 })
      : [];
  const matchedCountries =
    matchLp != null && matchDestiny != null
      ? matchCountries({ lifePath: matchLp, destiny: matchDestiny, limit: 10 })
      : [];

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRIVIA_PEOPLE.filter((p) => {
      if (filterLp && String(p.lifePath) !== filterLp) return false;
      if (filterDestiny && String(p.destiny) !== filterDestiny) return false;
      if (filterPsychic && String(p.psychic) !== filterPsychic) return false;
      if (q && !`${p.name} ${p.note}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filterLp, filterDestiny, filterPsychic, query]);

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRIVIA_COUNTRIES.filter((c) => {
      if (filterLp && String(c.lifePath) !== filterLp) return false;
      if (filterDestiny && String(c.destiny) !== filterDestiny) return false;
      if (filterPsychic && String(c.psychic) !== filterPsychic) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filterLp, filterDestiny, filterPsychic, query]);

  return (
    <div className="space-y-6">
      <div className="flex rounded-full border border-[var(--line)] bg-white/50 p-1">
        <button
          type="button"
          onClick={() => setTab("match")}
          className={`flex-1 rounded-full px-3 py-2 text-sm ${
            tab === "match" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          Match from profile
        </button>
        <button
          type="button"
          onClick={() => setTab("browse")}
          className={`flex-1 rounded-full px-3 py-2 text-sm ${
            tab === "browse" ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          Browse full lists
        </button>
      </div>

      {tab === "match" ? (
        <div className="space-y-6">
          {selectable.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
              Save at least one complete profile person (name + DOB) to match
              trivia.{" "}
              <Link href="/profile" className="text-gold-deep underline">
                Open profile
              </Link>
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="trivia-person"
                  className="mb-1 block text-sm text-ink-soft"
                >
                  Person from your profile
                </label>
                <select
                  id="trivia-person"
                  value={selectedKey}
                  onChange={(e) => setSelectedKey(e.target.value)}
                  className="w-full max-w-md rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
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
                {selected ? (
                  <p className="mt-2 text-sm text-ink-soft">
                    Matching on Life Path{" "}
                    <span className="brand text-ink">{matchLp}</span> and Destiny{" "}
                    <span className="brand text-ink">{matchDestiny}</span>{" "}
                    (from {selected.date_of_birth}). Showing top 10 each.
                  </p>
                ) : null}
              </div>

              <section>
                <h2 className="text-xl text-ink">Top 10 personalities</h2>
                <PeopleTable rows={matchedPeople} />
              </section>

              <section>
                <h2 className="text-xl text-ink">Top 10 countries</h2>
                <CountryCards rows={matchedCountries} />
              </section>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setBrowseKind("people")}
              className={`rounded-full px-4 py-2 text-sm ${
                browseKind === "people"
                  ? "bg-ink text-paper"
                  : "border border-[var(--line)] bg-white/60 text-ink-soft"
              }`}
            >
              Personalities ({TRIVIA_PEOPLE.length})
            </button>
            <button
              type="button"
              onClick={() => setBrowseKind("countries")}
              className={`rounded-full px-4 py-2 text-sm ${
                browseKind === "countries"
                  ? "bg-ink text-paper"
                  : "border border-[var(--line)] bg-white/60 text-ink-soft"
              }`}
            >
              Countries ({TRIVIA_COUNTRIES.length})
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Life Path"
              value={filterLp}
              onChange={setFilterLp}
            />
            <FilterSelect
              label="Destiny"
              value={filterDestiny}
              onChange={setFilterDestiny}
            />
            <FilterSelect
              label="Psychic"
              value={filterPsychic}
              onChange={setFilterPsychic}
            />
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-ink-soft">
                Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name…"
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-sm outline-none ring-gold focus:ring-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              Showing{" "}
              {browseKind === "people"
                ? filteredPeople.length
                : filteredCountries.length}{" "}
              of{" "}
              {browseKind === "people"
                ? TRIVIA_PEOPLE.length
                : TRIVIA_COUNTRIES.length}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterLp("");
                setFilterDestiny("");
                setFilterPsychic("");
                setQuery("");
              }}
              disabled={
                !filterLp && !filterDestiny && !filterPsychic && !query.trim()
              }
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink hover:bg-mist/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear filters
            </button>
          </div>

          {browseKind === "people" ? (
            <PeopleTable rows={filteredPeople} />
          ) : (
            <CountryCards rows={filteredCountries} />
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wider text-ink-soft">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-sm outline-none ring-gold focus:ring-2"
      >
        <option value="">Any</option>
        {NUMBER_FILTERS.filter(Boolean).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}

function PeopleTable({
  rows,
}: {
  rows: {
    name: string;
    note: string;
    dob: string;
    lifePath: number;
    destiny: number;
    psychic: number;
  }[];
}) {
  if (!rows.length) {
    return (
      <p className="mt-2 text-sm text-ink-soft">No rows match these filters.</p>
    );
  }
  return (
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
          {rows.map((p) => (
            <tr key={`${p.name}-${p.dob}`} className="border-t border-[var(--line)]">
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
  );
}

function CountryCards({
  rows,
}: {
  rows: {
    name: string;
    iso2: string;
    dob: string;
    lat: number;
    lng: number;
    lifePath: number;
    destiny: number;
    psychic: number;
  }[];
}) {
  if (!rows.length) {
    return (
      <p className="mt-2 text-sm text-ink-soft">No countries match these filters.</p>
    );
  }
  return (
    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
      {rows.map((c) => (
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
  );
}
