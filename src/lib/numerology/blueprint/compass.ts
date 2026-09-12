import { professionsForDigit } from "@/lib/numerology/careers";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { YearInterpretation } from "./yearInterpreter";

export type ProfessionFit = {
  title: string;
  why: string[];
};

export type CareerCompass = {
  modeLine: string;
  professions: ProfessionFit[];
};

export type LifeThemeFit = {
  title: string;
  band: "primary" | "secondary" | "maintain";
  why: string;
};

export type LifeCompass = {
  themes: LifeThemeFit[];
  actions: string[];
  prompt: string;
};

export function buildCareerCompass(opts: {
  bn: number;
  dn: number;
  nameRoot: number;
  year: YearInterpretation;
}): CareerCompass {
  const weights = [
    reduceToSingleDigit(opts.bn),
    reduceToSingleDigit(opts.dn),
    reduceToSingleDigit(opts.nameRoot),
    opts.year.personalYear,
    opts.year.cycleNumber ?? opts.year.personalYear,
  ];
  const score = new Map<string, { hits: number; why: Set<string> }>();
  for (const digit of weights) {
    for (const title of professionsForDigit(digit)) {
      const row = score.get(title) ?? { hits: 0, why: new Set<string>() };
      row.hits += 1;
      row.why.add(`${digit}: ${plainTrait(digit)}`);
      score.set(title, row);
    }
  }
  const professions = [...score.entries()]
    .sort((a, b) => b[1].hits - a[1].hits)
    .slice(0, 10)
    .map(([title, row]) => ({
      title,
      why: [...row.why].slice(0, 4),
    }));

  const modeLine = assertSafeCopy(
    `Your career mode this year: ${opts.year.pyMode.verb} + ${opts.year.cycleMode.verb}. This combination tends to favor ${opts.year.career.strong[0]}.`,
    "blueprint.career.mode",
  );

  return { modeLine, professions };
}

const LIFE_CATS = [
  "Relationships",
  "Personal growth",
  "Learning",
  "Family",
  "Finance",
  "Home",
  "Purpose",
] as const;

export function buildLifeCompass(opts: {
  purpose: string;
  growthTitles: string[];
  year: YearInterpretation;
}): LifeCompass {
  const purpose = opts.purpose || "Self-reflection";
  const ranked = LIFE_CATS.map((title, i) => {
    let score = LIFE_CATS.length - i;
    if (purpose.toLowerCase().includes(title.split(" ")[0]!.toLowerCase())) {
      score += 8;
    }
    if (title === "Relationships" && /relation/i.test(purpose)) score += 8;
    if (title === "Purpose" && /self|curios/i.test(purpose)) score += 4;
    if (title === "Personal growth") score += 3;
    if (opts.year.personalYear === 3 && title === "Learning") score += 3;
    if (opts.year.personalYear === 2 && title === "Relationships") score += 4;
    if (opts.year.personalYear === 8 && title === "Finance") score += 4;
    if (opts.year.personalYear === 6 && (title === "Family" || title === "Home")) {
      score += 4;
    }
    return { title, score };
  }).sort((a, b) => b.score - a.score);

  const themes: LifeThemeFit[] = ranked.map((row, i) => ({
    title: row.title,
    band: i < 2 ? "primary" : i < 4 ? "secondary" : "maintain",
    why: assertSafeCopy(
      i < 2
        ? `This year may ask for attention here because of Personal Year ${opts.year.personalYear} and your stated aim (${purpose}).`
        : `Keep this area from collapsing, without making it the whole year.`,
      `blueprint.life.${row.title}`,
    ),
  }));

  const actions = [
    opts.year.asking[0] ?? "Choose one relationship or growth move this week.",
    opts.year.asking[1] ?? "Make one piece of thinking visible.",
    opts.year.asking[2] ?? "Finish one open loop.",
  ];

  return {
    themes,
    actions,
    prompt: opts.year.oneSentence,
  };
}
