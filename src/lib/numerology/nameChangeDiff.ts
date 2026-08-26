/**
 * One consolidated answer to "what changed when I changed my name?".
 *
 * The comparison already existed in about eight scattered places. This gathers
 * it into a single table: which numbers moved, which are date-based and
 * therefore fixed, and which karmic debts appeared or fell away.
 */

import {
  groupKarmicDebts,
  karmicDebtsFromName,
  type GroupedKarmicDebt,
} from "./karmicDebt";
import type { NumerologyReport } from "./types";

export type NameDiffRow = {
  id: string;
  label: string;
  /** What the number is for, in plain words. */
  what: string;
  natal: string;
  operating: string;
  changed: boolean;
};

export type NameChangeDiff = {
  natalName: string;
  operatingName: string;
  eraLabel?: string;
  intro: string;
  /** Numbers built from the name, so a respelling can move them. */
  nameRows: NameDiffRow[];
  /** Numbers built from the birth date, so nothing here can move. */
  dateRows: NameDiffRow[];
  debts: {
    note: string;
    appeared: GroupedKarmicDebt[];
    fellAway: GroupedKarmicDebt[];
    carriedOver: GroupedKarmicDebt[];
  };
  summary: string;
};

const NAME_ROW_SPECS: {
  id: string;
  label: string;
  what: string;
  operating: keyof NumerologyReport["numerology_snapshot"];
  natal: keyof NumerologyReport["numerology_snapshot"];
}[] = [
  {
    id: "expression",
    label: "Expression",
    what: "How you get things done and what you produce.",
    operating: "expression_number",
    natal: "natal_expression_number",
  },
  {
    id: "soul-urge",
    label: "Soul Urge",
    what: "What you privately want, from the vowels.",
    operating: "soul_urge_number",
    natal: "natal_soul_urge_number",
  },
  {
    id: "personality",
    label: "Personality",
    what: "The first impression you give, from the consonants.",
    operating: "personality_number",
    natal: "natal_personality_number",
  },
  {
    id: "maturity",
    label: "Maturity",
    what: "The theme that grows louder in later life. Built from Life Path plus Expression, so it moves only because Expression moved.",
    operating: "maturity_number",
    natal: "natal_maturity_number",
  },
  {
    id: "chaldean",
    label: "Chaldean name number",
    what: "The same name read with the Chaldean letter map instead of the Pythagorean one.",
    operating: "chaldean_name_number",
    natal: "natal_chaldean_name_number",
  },
  {
    id: "vedic-name",
    label: "Vedic name number",
    what: "The name read in the Indian tradition.",
    operating: "vedic_name",
    natal: "natal_vedic_name",
  },
  {
    id: "unit-name",
    label: "Unit System name number",
    what: "A second Indian name map, kept alongside the first because practitioners disagree on which to use.",
    operating: "unit_name",
    natal: "natal_unit_name",
  },
];

const DATE_ROW_SPECS: {
  id: string;
  label: string;
  what: string;
  key: keyof NumerologyReport["numerology_snapshot"];
}[] = [
  {
    id: "life-path",
    label: "Life Path",
    what: "Your main direction, from the whole birth date.",
    key: "life_path",
  },
  {
    id: "birth-day",
    label: "Birth Day",
    what: "Your first instinct, from the day of the month.",
    key: "birth_day",
  },
  {
    id: "vedic-psychic",
    label: "Vedic Psychic",
    what: "How you see yourself, from the birth day.",
    key: "vedic_psychic",
  },
  {
    id: "vedic-destiny",
    label: "Vedic Destiny",
    what: "The path others see, from the whole date.",
    key: "vedic_destiny",
  },
  {
    id: "personal-year",
    label: "Personal Year",
    what: "This year's climate, from your date and the calendar.",
    key: "personal_year",
  },
];

export function buildNameChangeDiff(
  report: NumerologyReport,
): NameChangeDiff | null {
  const snap = report.numerology_snapshot;
  const natalName = snap.natal_name || report.person.full_name || "";
  const operatingName =
    snap.operating_name || report.person.operating_name || natalName;

  if (!natalName || !operatingName || natalName === operatingName) return null;

  const nameRows: NameDiffRow[] = NAME_ROW_SPECS.map((spec) => {
    const operating = String(snap[spec.operating] ?? "—");
    // Natal duplicates are only stored when they differ from the operating value.
    const natal = String(snap[spec.natal] ?? operating);
    return {
      id: spec.id,
      label: spec.label,
      what: spec.what,
      natal,
      operating,
      changed: natal !== operating && natal !== "—" && operating !== "—",
    };
  });

  const dateRows: NameDiffRow[] = DATE_ROW_SPECS.map((spec) => {
    const value = String(snap[spec.key] ?? "—");
    return {
      id: spec.id,
      label: spec.label,
      what: spec.what,
      natal: value,
      operating: value,
      changed: false,
    };
  });

  const natalDebts = groupKarmicDebts(karmicDebtsFromName(natalName, "natal"));
  const nowDebts = groupKarmicDebts(
    karmicDebtsFromName(operatingName, "operating"),
  );
  const natalCodes = new Set(natalDebts.map((d) => d.code));
  const nowCodes = new Set(nowDebts.map((d) => d.code));

  const changedCount = nameRows.filter((r) => r.changed).length;

  return {
    natalName,
    operatingName,
    eraLabel: snap.name_era_label || report.person.name_era_label,
    intro:
      "You have two spellings on file, so some numbers have two readings. Numbers built from your name follow the spelling you use now. Numbers built from your birth date never move, whatever you are called.",
    nameRows,
    dateRows,
    debts: {
      note: "Karmic debts sitting in a name total can appear or disappear with a respelling. Debts sitting in your birth date are unaffected and are listed in the karmic debt section instead.",
      appeared: nowDebts.filter((d) => !natalCodes.has(d.code)),
      fellAway: natalDebts.filter((d) => !nowCodes.has(d.code)),
      carriedOver: nowDebts.filter((d) => natalCodes.has(d.code)),
    },
    summary:
      changedCount === 0
        ? "Your new spelling produces the same numbers as your birth-certificate name, so nothing in the reading changes. That happens more often than people expect."
        : `Changing your name moved ${changedCount} of your ${nameRows.length} name-based numbers. The birth-date numbers below are unchanged, which is why your Life Path and Personal Year readings still apply exactly as written.`,
  };
}
