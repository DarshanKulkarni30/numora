/**
 * Comprehensive reading: Chaldean Soul → Birth → Destiny → Name.
 * Alignment percents are Numora analysis, not Chaldean digits.
 */

import {
  BAND_COMPAT_LABEL,
  pairPercent,
  softPairBand,
} from "@/lib/numerology/alignment/pairAffinity";
import type { TrioBand } from "@/lib/numerology/trioMatrix";
import {
  calculateChaldeanProfile,
  type ChaldeanProfile,
  type CompoundRoot,
} from "@/lib/numerology/chaldeanProfile";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import type { NumerologyReport } from "@/lib/numerology/types";
import type { KuaResult } from "@/lib/numerology/hiddenYear";

export type CompPairId =
  | "soul-birth"
  | "birth-destiny"
  | "destiny-name"
  | "soul-name"
  | "birth-name"
  | "first-name";

export type CompPair = {
  id: CompPairId;
  fromLabel: string;
  toLabel: string;
  from: string;
  to: string;
  question: string;
  band: TrioBand;
  percent: number;
  sitLabel: string;
  interpretation: string;
};

export type CompDomain = {
  id: string;
  label: string;
  score: number;
  from: string;
  insight: string;
  why: string;
};

export type ComprehensiveReading = {
  displayName: string;
  methodNote: string;
  profile: ChaldeanProfile;
  flowLabel: string;
  headline: string;
  overallLabel: string;
  pairs: CompPair[];
  strength: { title: string; body: string; uses: string[] };
  tension: { title: string; body: string };
  bridge: { number: number; body: string };
  domains: CompDomain[];
  doMore: string[];
  watchFor: string[];
  yearNote: string;
  kuaNote: string;
  disclaimer: string;
};

function trait(n: number): string {
  return CORE_TRAIT[n] ?? `themes of ${n}`;
}

function sitWord(band: TrioBand): "support" | "mixed" | "friction" {
  if (band === "amazing" || band === "favourable") return "support";
  if (band === "friction" || band === "block") return "friction";
  return "mixed";
}

function pairOf(
  id: CompPairId,
  fromLabel: string,
  toLabel: string,
  fromRoot: number,
  toRoot: number,
  fromShown: string,
  toShown: string,
  question: string,
  interpretation: string,
): CompPair {
  const band = softPairBand(fromRoot, toRoot);
  return {
    id,
    fromLabel,
    toLabel,
    from: fromShown,
    to: toShown,
    question,
    band,
    percent: pairPercent(fromRoot, toRoot),
    sitLabel: BAND_COMPAT_LABEL[band],
    interpretation: assertSafeCopy(interpretation, `comp.pair.${id}`),
  };
}

export function buildComprehensiveReading(
  report: NumerologyReport,
): ComprehensiveReading {
  const person = report.person;
  const displayName =
    person.preferred_name?.trim() || person.full_name;
  const name = person.operating_name || person.full_name;
  const young =
    person.report_type === "child" || person.report_type === "adolescent";
  const profile = calculateChaldeanProfile(
    name,
    person.date_of_birth,
    person.gender,
  );

  const soul = profile.soul;
  const birth = profile.birth;
  const destiny = profile.destiny;
  const nm = profile.name;
  const first = profile.firstLetter;

  const flowLabel = `${soul.root} → ${birth.root} → ${destiny.root} → ${nm.label}`;

  const soulBirth = pairOf(
    "soul-birth",
    "Soul number",
    "Birth number",
    soul.root,
    birth.root,
    soul.label,
    birth.label,
    "Does how you act day to day match what you want inside?",
    `Soul ${soul.label} (vowels in the name, Chaldean letters) points to ${plainTrait(soul.root)}. Birth ${birth.label} (the day you were born) is ${plainTrait(birth.root)}. ${BAND_COMPAT_LABEL[softPairBand(soul.root, birth.root)]}.`,
  );
  const birthDestiny = pairOf(
    "birth-destiny",
    "Birth number",
    "Destiny number",
    birth.root,
    destiny.root,
    birth.label,
    destiny.label,
    "Does the day-to-day style match the longer path from the full date?",
    `Birth ${birth.label} is ${plainTrait(birth.root)}. Destiny ${destiny.label} (all digits of the birth date) is ${plainTrait(destiny.root)}. ${BAND_COMPAT_LABEL[softPairBand(birth.root, destiny.root)]}.`,
  );
  const destinyName = pairOf(
    "destiny-name",
    "Destiny number",
    "Name number",
    destiny.root,
    nm.root,
    destiny.label,
    nm.label,
    "Does the name support the longer path from the date?",
    `Destiny ${destiny.label} is ${plainTrait(destiny.root)}. Name ${nm.label} (whole name, Chaldean letters: long total / one digit) is ${plainTrait(nm.root)}. ${BAND_COMPAT_LABEL[softPairBand(destiny.root, nm.root)]}.`,
  );
  const soulName = pairOf(
    "soul-name",
    "Soul number",
    "Name number",
    soul.root,
    nm.root,
    soul.label,
    nm.label,
    "Does the full name support what you want inside?",
    `Soul ${soul.label} wants ${plainTrait(soul.root)}. Name ${nm.label} tends toward ${plainTrait(nm.root)}. ${BAND_COMPAT_LABEL[softPairBand(soul.root, nm.root)]}.`,
  );
  const birthName = pairOf(
    "birth-name",
    "Birth number",
    "Name number",
    birth.root,
    nm.root,
    birth.label,
    nm.label,
    "Does the name match how you act day to day?",
    `Birth ${birth.label} is ${plainTrait(birth.root)}. Name ${nm.label} is ${plainTrait(nm.root)}. ${BAND_COMPAT_LABEL[softPairBand(birth.root, nm.root)]}.`,
  );

  const pairs: CompPair[] = [
    soulBirth,
    birthDestiny,
    destinyName,
    soulName,
    birthName,
  ];

  if (first) {
    pairs.push(
      pairOf(
        "first-name",
        "First letter",
        "Name number",
        first.value,
        nm.root,
        `${first.letter} / ${first.value}`,
        nm.label,
        "Does the first letter of the first name sit with the full name?",
        `First letter ${first.letter} is Chaldean ${first.value}. Full name is ${nm.label} (${plainTrait(nm.root)}). ${BAND_COMPAT_LABEL[softPairBand(first.value, nm.root)]}. This is a supporting note, not equal to Soul or Name.`,
      ),
    );
  }

  const overall = Math.round(
    0.25 * soulBirth.percent +
      0.2 * birthDestiny.percent +
      0.2 * destinyName.percent +
      0.2 * soulName.percent +
      0.15 * birthName.percent,
  );
  const overallLabel = assertSafeCopy(
    `These numbers sit together at about ${overall} out of 100 in this reading — a Numora check of how the pairs fit, not a Chaldean digit and not a promise.`,
    "comp.overall",
  );

  const strategy = assertSafeCopy(
    `Use ${plainTrait(birth.root)} (Birth ${birth.label}) as the habit that joins what you want inside (Soul ${soul.label}) with how the name shows (Name ${nm.label}).`,
    "comp.strategy",
  );

  const yearSit = sitWord(
    softPairBand(profile.yearNumber.root, birth.root),
  );
  const yearNote = assertSafeCopy(
    `Year number ${profile.yearNumber.root} comes from the last two digits of ${profile.yearNumber.year} (${String(profile.yearNumber.lastTwo).padStart(2, "0")} → ${profile.yearNumber.compound} → ${profile.yearNumber.root}). Versus Birth ${birth.root}: ${yearSit}. Versus Destiny ${destiny.root}: ${sitWord(softPairBand(profile.yearNumber.root, destiny.root))}.`,
    "comp.year",
  );

  const kuaNote = kuaCopy(profile.kua);

  const domains: CompDomain[] = [
    {
      id: "career",
      label: "Work",
      score: Math.round(0.4 * soulBirth.percent + 0.35 * birthDestiny.percent + 0.25 * destinyName.percent),
      from: `${soul.root}→${birth.root}→${destiny.root}`,
      insight: assertSafeCopy(
        `Lead with ${plainTrait(soul.root)}, using ${plainTrait(birth.root)} so the work is easy to follow.`,
        "comp.d.career",
      ),
      why: `From Soul–Birth (${soulBirth.percent}%) and Birth–Destiny (${birthDestiny.percent}%).`,
    },
    {
      id: "business",
      label: "Business",
      score: Math.round(
        0.35 * soulBirth.percent + 0.35 * destinyName.percent + 0.3 * birthName.percent,
      ),
      from: `${soul.root}+${birth.root}+${nm.root}`,
      insight: assertSafeCopy(
        `Build a craft that needs ${plainTrait(birth.root)} and ${plainTrait(nm.root)}.`,
        "comp.d.biz",
      ),
      why: `From Soul–Birth, Destiny–Name, and Birth–Name.`,
    },
    {
      id: "learning",
      label: "Learning",
      score: birthName.percent,
      from: `${birth.root}+${nm.root}`,
      insight: assertSafeCopy(
        `Study that uses ${plainTrait(birth.root)} and ${plainTrait(nm.root)} is a usable strength here.`,
        "comp.d.learn",
      ),
      why: `From Birth–Name (${birthName.percent}%).`,
    },
    {
      id: "wealth",
      label: "Money decisions",
      score: soulName.percent,
      from: `${soul.root} vs ${nm.root}`,
      insight: assertSafeCopy(
        `Use a repeating check before you spend or commit. Do not treat a number as a guarantee.`,
        "comp.d.wealth",
      ),
      why: `From Soul–Name (${soulName.percent}%).`,
    },
    {
      id: "relationships",
      label: "Close people",
      score: Math.max(
        40,
        soulName.percent - (softPairBand(soul.root, nm.root) === "friction" ? 8 : 0),
      ),
      from: `${soul.root} vs ${nm.root}`,
      insight: assertSafeCopy(
        young
          ? `Keep time alone, and still send one clear message to family.`
          : `Independence and one honest sentence can both be true in the same week.`,
        "comp.d.rel",
      ),
      why: `From Soul–Name (${soulName.percent}%).`,
    },
  ];

  return {
    displayName,
    methodNote:
      "This page uses Chaldean letter values for Soul, Personality, and Name. Birth and Destiny come from the date. Scores below are Numora’s check of how two numbers sit together — not extra Chaldean digits.",
    profile,
    flowLabel,
    headline: assertSafeCopy(`${flowLabel}. ${strategy}`, "comp.headline"),
    overallLabel,
    pairs,
    strength: {
      title: `${soul.label} + ${birth.label}`,
      body: assertSafeCopy(
        `Soul ${soul.label} wants ${plainTrait(soul.root)}. Birth ${birth.label} gives ${plainTrait(birth.root)}. That pair is the easiest inner match on this page.`,
        "comp.strength",
      ),
      uses: assertSafeList(
        [
          plainJob(soul.root),
          plainJob(birth.root),
          trait(birth.root).toLowerCase(),
        ],
        "comp.uses",
      ),
    },
    tension: {
      title: `${soul.label} and ${nm.label}`,
      body: assertSafeCopy(
        `What you want inside (${plainTrait(soul.root)}) and how the name shows (${plainTrait(nm.root)}) can differ. Use Birth ${birth.label} (${plainTrait(birth.root)}) as the working habit between them.`,
        "comp.tension",
      ),
    },
    bridge: {
      number: birth.root,
      body: assertSafeCopy(
        `Birth number ${birth.label} is the bridge: practise ${plainTrait(birth.root)} so Soul ${soul.label} and Name ${nm.label} can work in the same week.`,
        "comp.bridge",
      ),
    },
    domains,
    doMore: assertSafeList(
      [plainJob(soul.root), plainJob(birth.root), plainJob(nm.root)],
      "comp.do",
    ),
    watchFor: assertSafeList(
      [plainWatch(soul.root), plainWatch(birth.root), plainWatch(nm.root)],
      "comp.watch",
    ),
    yearNote,
    kuaNote,
    disclaimer:
      "This is a traditional reading for reflection. It is not a prediction of money, health, or events.",
  };
}

function kuaCopy(kua: KuaResult): string {
  if (!kua.ok) {
    return assertSafeCopy(kua.note, "comp.kua.skip");
  }
  return assertSafeCopy(
    `Kua number ${kua.number} is an extra Lo Shu compass number from the birth year and gender (Male: 10 minus the year number; Female: 5 plus the year number). It is a side note. It does not replace Birth, Destiny, or Name.`,
    "comp.kua",
  );
}

export function compoundShown(n: CompoundRoot): string {
  return n.label;
}
