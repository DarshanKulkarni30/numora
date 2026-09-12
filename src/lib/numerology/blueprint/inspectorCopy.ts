import { calculateChaldeanNameSet } from "@/lib/numerology/chaldeanName";
import { personalYearCycleAt } from "@/lib/numerology/cycles";
import { vedicDestinyFromDob, vedicPsychicFromDob } from "@/lib/numerology/dateNumbers";
import { pinnaclesForDob, type Pinnacle } from "@/lib/numerology/pinnacles";
import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NameCycle } from "./nameCycle";

export type InspectorKind =
  | "birth"
  | "destiny"
  | "name"
  | "soul"
  | "personality"
  | "personalYear"
  | "pinnacle"
  | "cycle"
  | "generic";

export type InspectorCardCopy = {
  kind: InspectorKind;
  meaning: string;
  alsoKnownAs?: string;
  calc: string[];
  compound?: number;
  letter?: string;
};

function kindFromLabel(label: string): InspectorKind {
  const l = label.toLowerCase();
  if (l.includes("name cycle") || l === "cycle") return "cycle";
  if (l.includes("birth")) return "birth";
  if (l.includes("destiny")) return "destiny";
  if (l.includes("name")) return "name";
  if (l.includes("personality") || l.includes("others see")) return "personality";
  if (l.includes("soul") || l.includes("inner drive")) return "soul";
  if (l.includes("personal year") || l === "py") return "personalYear";
  if (l.includes("pinnacle")) return "pinnacle";
  return "generic";
}

function letterSumLine(
  letters: { letter: string; value: number }[],
  compound: number,
  root: number,
): string {
  const parts = letters.map((row) => `${row.letter}=${row.value}`).join(" + ");
  if (compound === root) return `${parts} = ${root}.`;
  return `${parts} = ${compound} → ${root}.`;
}

function ageRange(pin: Pinnacle): string {
  if (pin.ageEnd == null) return `from age ${pin.ageStart}`;
  return `ages ${pin.ageStart}–${pin.ageEnd}`;
}

export function buildInspectorCardCopy(opts: {
  label: string;
  digit: number;
  dob: string;
  operatingName: string;
  soulCompound?: number;
  cycle?: NameCycle | null;
  pinnacle?: Pinnacle | null;
}): InspectorCardCopy {
  const kind = kindFromLabel(opts.label);
  const name = opts.operatingName.trim() || "the name in force";
  const traces = calculateChaldeanNameSet(name);

  if (kind === "birth") {
    const { day } = parseDob(opts.dob);
    const root = vedicPsychicFromDob(opts.dob);
    return {
      kind,
      meaning: assertSafeCopy(
        "Birth Number is the calendar day you were born, reduced to one digit (1–9). It is the starting style of the date — how you tend to begin — not a forecast of what will happen.",
        "inspector.birth.meaning",
      ),
      alsoKnownAs: "Also called Psychic Number or Moolank in Indian-style (Vedic) charts.",
      calc: assertSafeList(
        [
          `Birth date used: ${opts.dob}.`,
          `Take the day only: ${day} → ${root}.`,
          "Month and year are not added for Birth Number. They belong to Destiny Number.",
        ],
        "inspector.birth.calc",
      ),
    };
  }

  if (kind === "destiny") {
    const { day, month, year } = parseDob(opts.dob);
    const total = day + month + year;
    const root = vedicDestinyFromDob(opts.dob);
    return {
      kind,
      meaning: assertSafeCopy(
        "Destiny Number is the full birth date added together, then reduced to one digit. It is the longer path tone of the date, not a prediction of events.",
        "inspector.destiny.meaning",
      ),
      alsoKnownAs: "Also called Bhagyank in Indian-style (Vedic) charts.",
      calc: assertSafeList(
        [
          `Birth date used: ${opts.dob}.`,
          `Add day + month + year: ${day} + ${month} + ${year} = ${total} → ${root}.`,
          "This is the Vedic single-digit reduction (1–9). It sits beside Western Life Path, which may keep 11, 22, or 33.",
        ],
        "inspector.destiny.calc",
      ),
    };
  }

  if (kind === "name") {
    const expression = traces.expression;
    return {
      kind,
      meaning: assertSafeCopy(
        "Name Number (NN) is the Chaldean letter total of the spelling this reading is using. NN, Soul Number (SN), and Personality Number (PN) always share that same spelling. This is not the Western Expression chart, which uses a different letter table.",
        "inspector.name.meaning",
      ),
      alsoKnownAs: "NN — Chaldean name number of the declared spelling.",
      compound: expression.compound,
      calc: assertSafeList(
        [
          `Spelling used: ${expression.sourceInput}.`,
          "Chaldean letter values (1–8; no 9 on a letter).",
          letterSumLine(expression.letters, expression.compound, expression.root),
        ],
        "inspector.name.calc",
      ),
    };
  }

  if (kind === "soul") {
    const soul = traces.soul;
    return {
      kind,
      meaning: assertSafeCopy(
        "Soul Number (SN) uses only the vowels in that same spelling as Name Number. It is inner motive — what you reach for when nobody is scoring you — not a secret destiny.",
        "inspector.soul.meaning",
      ),
      alsoKnownAs: "Also called Soul Urge. Consonants are not counted here.",
      compound: soul.compound !== soul.root ? soul.compound : opts.soulCompound,
      calc: assertSafeList(
        [
          `Vowels in ${soul.sourceInput}:`,
          letterSumLine(soul.letters, soul.compound, soul.root),
          "Personality Number (not on this card) uses consonants of the same spelling.",
        ],
        "inspector.soul.calc",
      ),
    };
  }

  if (kind === "personality") {
    const pers = traces.personality;
    return {
      kind,
      meaning: assertSafeCopy(
        "Personality Number (PN) uses the consonants in that same spelling. It is the outer manner people notice first — not Soul (vowels) and not the full Name Number.",
        "inspector.pers.meaning",
      ),
      alsoKnownAs: "PN — consonants of the same spelling as NN and SN.",
      compound: pers.compound !== pers.root ? pers.compound : undefined,
      calc: assertSafeList(
        [
          `Consonants in ${pers.sourceInput}:`,
          letterSumLine(pers.letters, pers.compound, pers.root),
          "Soul Number (vowels) is the inner layer of the same spelling.",
        ],
        "inspector.pers.calc",
      ),
    };
  }

  if (kind === "personalYear") {
    const cycle = personalYearCycleAt(opts.dob);
    return {
      kind,
      meaning: assertSafeCopy(
        "Personal Year is this year’s theme from birth month + birth day + the year in force. Name Number and Soul Number do not change that digit. What changes is Year Resonance — how your seats meet the year.",
        "inspector.py.meaning",
      ),
      alsoKnownAs: "Western Personal Year, birthday-to-birthday in this Blueprint.",
      calc: assertSafeList(
        [
          `Cycle in force: birthday ${cycle.rangeStart.toLocaleDateString("en-GB")} to ${cycle.rangeEnd.toLocaleDateString("en-GB")}.`,
          `Month ${cycle.month} + day ${cycle.day} + ${cycle.calendarYearUsed} = ${cycle.compound} → ${cycle.number}.`,
          "Master numbers 11, 22, 33 are kept if they appear before the last reduction.",
        ],
        "inspector.py.calc",
      ),
    };
  }

  if (kind === "pinnacle") {
    const set = pinnaclesForDob(opts.dob);
    const { day, month, year } = parseDob(opts.dob);
    const m = reduceNumber(month, []);
    const d = reduceNumber(day, []);
    const y = reduceNumber(year, []);
    const current = opts.pinnacle ?? set.pinnacles[0]!;
    return {
      kind,
      meaning: assertSafeCopy(
        "A Pinnacle Number is a longer life chapter built from month, day, and year of birth. There are four chapters in sequence. The number on this card is the chapter you are in now — a theme for that span of years, not a yearly forecast.",
        "inspector.pin.meaning",
      ),
      alsoKnownAs: "Pythagorean pinnacle cycle (four chapters).",
      calc: assertSafeList(
        [
          `Reduce the date parts: month ${month} → ${m}; day ${day} → ${d}; year ${year} → ${y}.`,
          `Pinnacle 1 = month + day → ${set.pinnacles[0]!.number} (${ageRange(set.pinnacles[0]!)}).`,
          `Pinnacle 2 = day + year → ${set.pinnacles[1]!.number} (${ageRange(set.pinnacles[1]!)}).`,
          `Pinnacle 3 = Pinnacle 1 + Pinnacle 2 → ${set.pinnacles[2]!.number} (${ageRange(set.pinnacles[2]!)}).`,
          `Pinnacle 4 = month + year → ${set.pinnacles[3]!.number} (${ageRange(set.pinnacles[3]!)}).`,
          `You are in Pinnacle ${current.id} (${ageRange(current)}): ${current.number}.`,
        ],
        "inspector.pin.calc",
      ),
    };
  }

  if (kind === "cycle") {
    const cycle = opts.cycle;
    return {
      kind,
      meaning: assertSafeCopy(
        "Name Cycle is which letter of the given / first name is active in this Personal Year. Birth year is letter 1, then the name loops. It is everyday identity timing — not a fifth core number, and not Pythagorean Essence. If the given name later changed, natal cycle sits under Advanced.",
        "inspector.cycle.meaning",
      ),
      alsoKnownAs: "Chaldean first-name letter walk, one letter per Personal Year.",
      letter: cycle?.active.letter,
      calc: assertSafeList(
        cycle?.calcLines ?? [
          "Add a Latin first name to see the letter-by-letter walk from birth year.",
        ],
        "inspector.cycle.calc",
      ),
    };
  }

  return {
    kind,
    meaning: assertSafeCopy(
      `This card is the digit ${opts.digit} as it appears in your profile. Open Birth, Destiny, Name, Soul, Personal Year, or Pinnacle for the full term and working.`,
      "inspector.generic.meaning",
    ),
    calc: assertSafeList(
      ["See “In your profile” below for every seat that currently holds this digit."],
      "inspector.generic.calc",
    ),
  };
}
