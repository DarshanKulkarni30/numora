/**
 * Smoke checks for trivia discovery kinds, day-month strip, and reflective copy.
 */
import {
  dayMonthNarrative,
  describePersonMatch,
  filterDiscovery,
  personInitials,
  triadNarrative,
} from "../src/lib/trivia/discovery";
import { matchPeople, matchPeopleByDayMonth } from "../src/lib/trivia/match";
import { TRIVIA_PEOPLE } from "../src/lib/trivia/people";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function has(text: string, needle: string, label: string) {
  if (!text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: missing "${needle}" in:\n${text}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function lacks(text: string, needle: string, label: string) {
  if (text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: unexpected "${needle}"`);
    process.exit(1);
  }
  console.log("ok", label);
}

const thatcher = TRIVIA_PEOPLE.find((p) => p.name === "Margaret Thatcher");
if (!thatcher) {
  console.error("FAIL fixture Margaret Thatcher missing from trivia bank");
  process.exit(1);
}

const triad = describePersonMatch(
  { lifePath: 4, destiny: 4, psychic: 4, dob: "13/10/1990" },
  thatcher,
);
eq(triad.kind, "triad", "4/4/4 vs Thatcher is a strong triad");
eq(triad.sameDay, true, "13/10 viewer shares Thatcher's day-month");
eq(triad.layers.lifePath.matched, true, "life path ring matched");
eq(triad.glyph, "✦", "triad glyph");
has(triad.reason, "4–4–4", "triad reason names the triad");
has(triad.insight, "Shared triad", "triad insight");

const dual = describePersonMatch(
  { lifePath: 4, destiny: 4, psychic: 2, dob: "13/10/1990" },
  thatcher,
);
eq(dual.kind, "dual", "4/4/2 vs Thatcher is dual (path + destiny)");
eq(dual.layers.psychic.matched, false, "psychic 2 vs 4 is not a match");
eq(dual.glyph, "↑", "dual glyph");

const single = describePersonMatch(
  { lifePath: 1, destiny: 8, psychic: 4, dob: "01/01/1990" },
  thatcher,
);
eq(single.kind, "single", "only psychic 4 matches");
eq(single.sameDay, false, "01/01 is not 13/10");
eq(single.glyph, "•", "single glyph");

const contrast = describePersonMatch(
  { lifePath: 1, destiny: 2, psychic: 5, dob: "01/01/1990" },
  thatcher,
);
eq(contrast.kind, "contrast", "no overlapping digits is contrast");
eq(contrast.glyph, "◇", "contrast glyph is quiet, not a warning mark");

const ranked = matchPeople({
  lifePath: 4,
  destiny: 4,
  psychic: 4,
  limit: 5,
});
eq(ranked[0]?.psychic, 4, "exact triad still ranks ahead of near misses");
eq(
  ranked[0] ? describePersonMatch({ lifePath: 4, destiny: 4, psychic: 4 }, ranked[0]).kind : null,
  "triad",
  "top rank for 4/4/4 is a triad",
);

const twins = matchPeopleByDayMonth("13/10/1990", 10);
eq(
  twins.some((p) => p.name.includes("Thatcher")),
  true,
  "13/10 bank includes Thatcher",
);
eq(
  twins.every((p) => p.dob.startsWith("13/10/")),
  true,
  "twins keep 13/10 prefix",
);

const dayRows = twins.map((p) =>
  describePersonMatch({ lifePath: 4, destiny: 4, psychic: 2, dob: "13/10/1990" }, p),
);
eq(
  filterDiscovery([], "day", dayRows).length,
  dayRows.length,
  "day filter uses the timeline set",
);

has(triadNarrative(6, 6, 4), "6–6–4", "triad narrative names 6–6–4");
has(triadNarrative(6, 6, 4), "relational care", "6 tone is relational care");
has(triadNarrative(6, 6, 4), "structured effort", "4 tone is structured effort");
lacks(triadNarrative(6, 6, 4), "will become", "no predictive will-become");
lacks(triadNarrative(6, 6, 4), "guaranteed", "no guaranteed language");

has(dayMonthNarrative("13/10/1990"), "13/10", "day-month narrative keeps 13/10");
has(dayMonthNarrative("13/10/1990"), "structured effort", "13 reduces to 4");
has(dayMonthNarrative("13/10/1990"), "not a lineage", "day-month copy denies lineage");
eq(personInitials("Margaret Thatcher (Tory)"), "MT", "initials skip parentheticals");
eq(personInitials("Yves Montand"), "YM", "two-word initials");

console.log("trivia discovery smoke passed");
