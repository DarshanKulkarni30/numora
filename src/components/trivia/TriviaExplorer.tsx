"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  lifePathFromDob,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { calculatePythagorean } from "@/lib/numerology/pythagorean";
import { calculateVedic } from "@/lib/numerology/vedic";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { CountryNumberStat } from "@/components/trivia/CountryNumberStat";
import { CountryWikiMap } from "@/components/trivia/CountryWikiMap";
import {
  matchCities,
  matchCountries,
  matchPeople,
  matchPeopleByDayMonth,
} from "@/lib/trivia/match";
import { TRIVIA_CITIES } from "@/lib/trivia/cities";
import { TRIVIA_COUNTRIES } from "@/lib/trivia/countries";
import { TRIVIA_PEOPLE } from "@/lib/trivia/people";

type Props = {
  people: PersonRecord[];
};

type Tab = "browse" | "match";
type BrowseKind = "people" | "countries" | "cities";

const NUMBER_FILTERS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];
const CITY_NUMBER_FILTERS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

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
  const [filterCityNumber, setFilterCityNumber] = useState("");
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
  const matchPsychic = selected
    ? vedicPsychicFromDob(selected.date_of_birth)
    : null;
  const nameLayers = selected
    ? (() => {
        const full = selected.full_name || selected.preferred_name || "";
        const pyth = calculatePythagorean(full, selected.date_of_birth);
        const vedic = calculateVedic(full, selected.date_of_birth);
        return { expression: pyth.expression, vedicName: vedic.nameNumber };
      })()
    : null;

  const matchedPeople =
    matchLp != null && matchDestiny != null && matchPsychic != null
      ? matchPeople({
          lifePath: matchLp,
          destiny: matchDestiny,
          psychic: matchPsychic,
          limit: 10,
        })
      : [];
  const birthdayTwins = selected
    ? matchPeopleByDayMonth(selected.date_of_birth, 10)
    : [];
  const matchedCountries =
    matchLp != null && matchDestiny != null && matchPsychic != null
      ? matchCountries({
          lifePath: matchLp,
          destiny: matchDestiny,
          psychic: matchPsychic,
          limit: 10,
        })
      : [];
  const matchedCities =
    matchLp != null &&
    matchDestiny != null &&
    matchPsychic != null &&
    nameLayers != null
      ? matchCities({
          lifePath: matchLp,
          destiny: matchDestiny,
          psychic: matchPsychic,
          expression: nameLayers.expression,
          vedicName: nameLayers.vedicName,
          limit: 10,
        })
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

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRIVIA_CITIES.filter((c) => {
      if (filterCityNumber && String(c.nameNumber) !== filterCityNumber)
        return false;
      if (q && !`${c.name} ${c.country}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [filterCityNumber, query]);

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
                    <span className="brand text-ink">{matchLp}</span>, Destiny{" "}
                    <span className="brand text-ink">{matchDestiny}</span>, and
                    Psychic <span className="brand text-ink">{matchPsychic}</span>
                    {nameLayers ? (
                      <>
                        ; cities also use Expression{" "}
                        <span className="brand text-ink">
                          {nameLayers.expression}
                        </span>{" "}
                        and Vedic name{" "}
                        <span className="brand text-ink">
                          {nameLayers.vedicName}
                        </span>
                      </>
                    ) : null}{" "}
                    (from {selected.date_of_birth}
                    {selected.full_name ? ` · ${selected.full_name}` : ""}).
                    Rank prefers exact digit overlaps, then closest numbers.
                  </p>
                ) : null}
              </div>

              <section>
                <h2 className="text-xl text-ink">Top 10 personalities</h2>
                <PeopleTable rows={matchedPeople} />
              </section>

              <section>
                <h2 className="text-xl text-ink">
                  Born on the same day &amp; month
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Same calendar day and month as{" "}
                  {selected ? personLabel(selected) : "the selected person"}{" "}
                  (year ignored). Up to 10 from the bank.
                </p>
                <div className="mt-3">
                  <PeopleTable rows={birthdayTwins} />
                </div>
              </section>

              <section>
                <h2 className="text-xl text-ink">Top 10 countries</h2>
                <CountryCards rows={matchedCountries} />
              </section>

              <section>
                <h2 className="text-xl text-ink">Top 10 cities</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  City name numbers matched to your core digits—reflective
                  trivia, not relocation advice.
                </p>
                <CityTable rows={matchedCities} />
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
              className={`rounded-full px-4 py-2 text-sm transition-all duration-150 ${
                browseKind === "people"
                  ? "bg-ink text-paper shadow-sm"
                  : "border border-[var(--line)] bg-white/60 text-ink-soft hover:-translate-y-px hover:bg-white hover:shadow-sm active:translate-y-0 active:shadow-none"
              }`}
            >
              Personalities ({TRIVIA_PEOPLE.length})
            </button>
            <button
              type="button"
              onClick={() => setBrowseKind("countries")}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-150 ${
                browseKind === "countries"
                  ? "bg-ink text-paper shadow-sm"
                  : "border border-[var(--line)] bg-white/60 text-ink-soft hover:-translate-y-px hover:bg-white hover:shadow-sm active:translate-y-0 active:shadow-none"
              }`}
            >
              Countries ({TRIVIA_COUNTRIES.length})
            </button>
            <button
              type="button"
              onClick={() => setBrowseKind("cities")}
              className={`rounded-full px-4 py-2 text-sm transition-all duration-150 ${
                browseKind === "cities"
                  ? "bg-ink text-paper shadow-sm"
                  : "border border-[var(--line)] bg-white/60 text-ink-soft hover:-translate-y-px hover:bg-white hover:shadow-sm active:translate-y-0 active:shadow-none"
              }`}
            >
              Cities ({TRIVIA_CITIES.length})
            </button>
          </div>

          {browseKind === "cities" ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterSelect
                label="Name number"
                value={filterCityNumber}
                onChange={setFilterCityNumber}
                options={CITY_NUMBER_FILTERS}
              />
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="mb-1 block text-xs uppercase tracking-wider text-ink-soft">
                  Search
                </label>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="City or country…"
                  className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-sm outline-none ring-gold focus:ring-2"
                />
              </div>
            </div>
          ) : (
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
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              Showing{" "}
              {browseKind === "people"
                ? filteredPeople.length
                : browseKind === "countries"
                  ? filteredCountries.length
                  : filteredCities.length}{" "}
              of{" "}
              {browseKind === "people"
                ? TRIVIA_PEOPLE.length
                : browseKind === "countries"
                  ? TRIVIA_COUNTRIES.length
                  : TRIVIA_CITIES.length}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterLp("");
                setFilterDestiny("");
                setFilterPsychic("");
                setFilterCityNumber("");
                setQuery("");
              }}
              disabled={
                !filterLp &&
                !filterDestiny &&
                !filterPsychic &&
                !filterCityNumber &&
                !query.trim()
              }
              className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink transition-all duration-150 hover:-translate-y-px hover:bg-mist/80 hover:shadow-sm active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              Clear filters
            </button>
          </div>

          {browseKind === "people" ? (
            <PeopleTable rows={filteredPeople} />
          ) : browseKind === "countries" ? (
            <CountryCards rows={filteredCountries} />
          ) : (
            <CityTable rows={filteredCities} />
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
  options = NUMBER_FILTERS,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
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
        {options.filter(Boolean).map((n) => (
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
          <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w80/${c.iso2}.png`}
              alt={`${c.name} flag`}
              width={80}
              height={53}
              className="h-auto w-full rounded border border-[var(--line)]"
              loading="lazy"
            />
            <CountryWikiMap name={c.name} iso2={c.iso2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ink">{c.name}</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              Founding / independence: {c.dob}
            </p>
            <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
              <CountryNumberStat
                kind="lifePath"
                value={c.lifePath}
                countryName={c.name}
              />
              <CountryNumberStat
                kind="destiny"
                value={c.destiny}
                countryName={c.name}
              />
              <CountryNumberStat
                kind="psychic"
                value={c.psychic}
                countryName={c.name}
              />
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CityTable({
  rows,
}: {
  rows: { name: string; country: string; nameNumber: number }[];
}) {
  if (!rows.length) {
    return (
      <p className="mt-2 text-sm text-ink-soft">No cities match these filters.</p>
    );
  }
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)]">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="bg-mist/60 text-ink-soft">
          <tr>
            <th className="px-3 py-2 font-medium">City</th>
            <th className="px-3 py-2 font-medium">Country</th>
            <th className="px-3 py-2 font-medium">Name number</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr
              key={`${c.name}|${c.country}`}
              className="border-t border-[var(--line)]"
            >
              <td className="px-3 py-2 text-ink">{c.name}</td>
              <td className="px-3 py-2 text-ink-soft">{c.country}</td>
              <td className="brand px-3 py-2 text-ink">{c.nameNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
