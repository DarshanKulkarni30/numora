/**
 * Identity Snapshot — structured executive-summary model.
 * Reflective only; builds from snapshot + Lo Shu + personality.
 */

import { CORE_TRAIT, coreTraitFor } from "./meanings";
import type { LoShuResult, NumerologySnapshot } from "./types";

export type SnapshotCapsule = {
  id: string;
  label: string;
  value: string;
  trait: string;
  glyph: string;
  tint: string;
};

export type CommonThread = {
  digit: number;
  trait: string;
  glyph: string;
  tint: string;
  appearsIn: string[];
};

export type DivergenceCard = {
  id: string;
  title: string;
  values: string[];
  insight: string;
  glyph: string;
};

export type NarrativeBeat = {
  id: string;
  label: string;
  line: string;
  glyph: string;
};

export type ToneBalanceSlice = {
  id: string;
  label: string;
  weight: number;
  tint: string;
};

export type HarmonyScore = {
  label: "High Harmony" | "Steady Mix" | "Soft Stretch";
  score: number;
  summary: string;
};

export type IdentitySnapshot = {
  capsules: SnapshotCapsule[];
  threads: CommonThread[];
  divergences: DivergenceCard[];
  narrative: NarrativeBeat[];
  corePoem: string;
  flowerPetals: SnapshotCapsule[];
  toneBalance: ToneBalanceSlice[];
  harmony: HarmonyScore;
  loShuMini: { number: number; count: number }[];
  blueprintLines: string[];
};

const DIGIT_GLYPH: Record<number, string> = {
  1: "◆",
  2: "○○",
  3: "✎",
  4: "▢",
  5: "∿",
  6: "♡",
  7: "◉",
  8: "▤",
  9: "✦",
};

const DIGIT_TINT: Record<number, string> = {
  1: "from-amber-50 to-amber-100/80 border-amber-200",
  2: "from-sky-50 to-sky-100/80 border-sky-200",
  3: "from-orange-50 to-orange-100/70 border-orange-200",
  4: "from-stone-50 to-stone-100/80 border-stone-200",
  5: "from-teal-50 to-teal-100/70 border-teal-200",
  6: "from-emerald-50 to-emerald-100/70 border-emerald-200",
  7: "from-indigo-50 to-indigo-100/70 border-indigo-200",
  8: "from-slate-50 to-slate-100/80 border-slate-300",
  9: "from-rose-50 to-rose-100/70 border-rose-200",
};

function digitCore(n: string | number): number {
  const raw = Number(n);
  if (!Number.isFinite(raw)) return 0;
  let x = Math.abs(Math.trunc(raw));
  while (x > 9 && x !== 11 && x !== 22 && x !== 33) {
    x = String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  if (x === 11 || x === 22 || x === 33) {
    return x === 11 ? 2 : x === 22 ? 4 : 6;
  }
  return x;
}

function trait(n: number): string {
  return CORE_TRAIT[n] ?? coreTraitFor(n);
}

type Tagged = { label: string; digit: number };

function collectTags(snap: NumerologySnapshot): Tagged[] {
  const tags: Tagged[] = [
    { label: "Life Path", digit: digitCore(snap.life_path) },
    { label: "Birth Day", digit: digitCore(snap.birth_day) },
    { label: "Expression", digit: digitCore(snap.expression_number) },
    { label: "Soul Urge", digit: digitCore(snap.soul_urge_number) },
    { label: "Personality", digit: digitCore(snap.personality_number) },
    { label: "Maturity", digit: digitCore(snap.maturity_number) },
    { label: "Chaldean Name", digit: digitCore(snap.chaldean_name_number) },
    { label: "Psychic", digit: digitCore(snap.vedic_psychic) },
    { label: "Destiny", digit: digitCore(snap.vedic_destiny) },
    { label: "Vedic Name", digit: digitCore(snap.vedic_name) },
  ];
  if (snap.natal_vedic_name) {
    tags.push({
      label: "Natal Vedic Name",
      digit: digitCore(snap.natal_vedic_name),
    });
  }
  if (snap.unit_name) {
    tags.push({ label: "Unit Name", digit: digitCore(snap.unit_name) });
  }
  if (snap.personal_year) {
    tags.push({ label: "Personal Year", digit: digitCore(snap.personal_year) });
  }
  return tags.filter((t) => t.digit >= 1 && t.digit <= 9);
}

function buildToneBalance(tags: Tagged[]): ToneBalanceSlice[] {
  const buckets: {
    id: string;
    label: string;
    digits: number[];
    tint: string;
  }[] = [
    {
      id: "structure",
      label: "Structure",
      digits: [4, 8],
      tint: "bg-stone-400",
    },
    { id: "care", label: "Care", digits: [2, 6], tint: "bg-emerald-500" },
    { id: "freedom", label: "Freedom", digits: [5], tint: "bg-teal-500" },
    {
      id: "creativity",
      label: "Creativity",
      digits: [3, 9],
      tint: "bg-orange-400",
    },
    { id: "insight", label: "Insight", digits: [1, 7], tint: "bg-indigo-400" },
  ];
  const weights = buckets.map((b) => ({
    ...b,
    weight: tags.filter((t) => b.digits.includes(t.digit)).length,
  }));
  const total = weights.reduce((s, w) => s + w.weight, 0) || 1;
  return weights.map((w) => ({
    id: w.id,
    label: w.label,
    weight: Math.round((w.weight / total) * 100),
    tint: w.tint,
  }));
}

function buildHarmony(
  threadCount: number,
  divergenceCount: number,
): HarmonyScore {
  const score = Math.max(
    0,
    Math.min(100, 55 + threadCount * 12 - divergenceCount * 14),
  );
  if (score >= 72) {
    return {
      label: "High Harmony",
      score,
      summary:
        "Several of your numbers repeat across different methods, which means the schools mostly agree about you rather than describing three different people.",
    };
  }
  if (score >= 45) {
    return {
      label: "Steady Mix",
      score,
      summary:
        "Shared threads and clear divergences—compare layers rather than forcing one number.",
    };
  }
  return {
    label: "Soft Stretch",
    score,
    summary:
      "Methods spotlight different tones—use contrast as a growth map, not a conflict.",
  };
}

export function buildIdentitySnapshot(input: {
  snap: NumerologySnapshot;
  loShu: LoShuResult;
  preferredName?: string;
}): IdentitySnapshot {
  const { snap, loShu } = input;
  const name = input.preferredName?.trim() || "You";
  const tags = collectTags(snap);

  const lp = digitCore(snap.life_path);
  const expr = digitCore(snap.expression_number);
  const destiny = digitCore(snap.vedic_destiny);
  const year = digitCore(snap.personal_year);
  const soul = digitCore(snap.soul_urge_number);
  const pers = digitCore(snap.personality_number);
  const maturity = digitCore(snap.maturity_number);
  const psychic = digitCore(snap.vedic_psychic);
  const chal = digitCore(snap.chaldean_name_number);
  const vName = digitCore(snap.vedic_name);
  const unit = snap.unit_name ? digitCore(snap.unit_name) : null;

  const capsules: SnapshotCapsule[] = [
    {
      id: "life-path",
      label: "Life Path",
      value: String(snap.life_path),
      trait: trait(lp),
      glyph: DIGIT_GLYPH[lp] ?? "◆",
      tint: DIGIT_TINT[lp] ?? DIGIT_TINT[1],
    },
    {
      id: "expression",
      label: "Expression",
      value: String(snap.expression_number),
      trait: trait(expr),
      glyph: DIGIT_GLYPH[expr] ?? "✎",
      tint: DIGIT_TINT[expr] ?? DIGIT_TINT[3],
    },
    {
      id: "destiny",
      label: "Vedic Destiny",
      value: String(snap.vedic_destiny),
      trait: trait(destiny),
      glyph: DIGIT_GLYPH[destiny] ?? "♡",
      tint: DIGIT_TINT[destiny] ?? DIGIT_TINT[6],
    },
    {
      id: "year",
      label: "Personal Year",
      value: String(snap.personal_year),
      trait: trait(year),
      glyph: DIGIT_GLYPH[year] ?? "∿",
      tint: DIGIT_TINT[year] ?? DIGIT_TINT[5],
    },
  ];
  if (snap.sun_sign_label) {
    capsules.push({
      id: "sun",
      label: "Sun Sign",
      value: snap.sun_sign_label,
      trait: "Solar temperament",
      glyph: "☉",
      tint: "from-gold/20 to-sand/30 border-sand/50",
    });
  }

  const byDigit = new Map<number, Tagged[]>();
  for (const t of tags) {
    const list = byDigit.get(t.digit) ?? [];
    list.push(t);
    byDigit.set(t.digit, list);
  }
  const repeats = [...byDigit.entries()]
    .filter(([, list]) => list.length >= 2)
    .sort((a, b) => b[1].length - a[1].length);

  const threads: CommonThread[] = repeats.slice(0, 3).map(([digit, list]) => ({
    digit,
    trait: trait(digit),
    glyph: DIGIT_GLYPH[digit] ?? "·",
    tint: DIGIT_TINT[digit] ?? DIGIT_TINT[1],
    appearsIn: list.map((x) => x.label),
  }));

  const divergences: DivergenceCard[] = [];
  if (expr !== chal || expr !== vName || chal !== vName || (unit != null && unit !== expr)) {
    const values = [
      `Expression ${expr}`,
      `Chaldean ${chal}`,
      `Vedic ${vName}`,
    ];
    if (unit != null) values.push(`Unit ${unit}`);
    divergences.push({
      id: "name-layers",
      title: "Name Layers Differ",
      values,
      insight: "Same spelling, different letter maps → different roles.",
      glyph: "✎",
    });
  }
  if (psychic !== destiny) {
    divergences.push({
      id: "day-date",
      title: "Day vs Full Date",
      values: [`Psychic ${psychic}`, `Destiny ${destiny}`],
      insight: "Temperament vs long-path themes.",
      glyph: "▣",
    });
  }
  if (soul !== pers) {
    divergences.push({
      id: "inner-outer",
      title: "What you want vs what people see",
      values: [`Soul Urge ${soul}`, `Personality ${pers}`],
      insight: "What you want vs what people see first.",
      glyph: "☽",
    });
  }

  const narrative: NarrativeBeat[] = [
    {
      id: "movement",
      label: "Your Core Movement",
      line: `Life Path ${lp} + Expression ${expr} → you move with ${(trait(lp) || "").toLowerCase()} shaped by ${(trait(expr) || "").toLowerCase()}.`,
      glyph: "→",
    },
    {
      id: "inner",
      label: "Inner Layer",
      line: `Soul Urge ${soul} → ${(trait(soul) || "").toLowerCase()}.`,
      glyph: "◉",
    },
    {
      id: "outer",
      label: "Outer Layer",
      line: `Personality ${pers} → ${(trait(pers) || "").toLowerCase()}.`,
      glyph: "◇",
    },
    {
      id: "long",
      label: "Long-Term Tone",
      line: `Maturity ${maturity} → ${(trait(maturity) || "").toLowerCase()} emerging with experience.`,
      glyph: "✦",
    },
  ];

  const corePoem = `${name}: Life Path ${lp} is ${trait(lp) || "your longer direction"}. Expression ${expr} is how you show up (${trait(expr) || "your style"}). Inside, Soul Urge ${soul} wants ${trait(soul) || "what you want"}. People first see Personality ${pers} (${trait(pers) || "the outer face"}). Later, Maturity ${maturity} is ${trait(maturity) || "the later blend"}. Keep one practice from Life Path this week.`;

  const flowerPetals = capsules.slice(0, 5);
  const toneBalance = buildToneBalance(tags);
  const harmony = buildHarmony(threads.length, divergences.length);

  const loShuMini = [4, 9, 2, 3, 5, 7, 8, 1, 6].map((n) => ({
    number: n,
    count: loShu.grid?.[n] ?? 0,
  }));

  const blueprintLines = [
    `Identity Snapshot · ${harmony.label} (${harmony.score})`,
    capsules.map((c) => `${c.label} ${c.value}`).join(" · "),
    threads.length
      ? `Common threads: ${threads.map((t) => `${t.digit} in ${t.appearsIn.slice(0, 3).join(", ")}`).join("; ")}`
      : "Common threads: methods emphasize different digits.",
    divergences.length
      ? `Divergences: ${divergences.map((d) => d.title).join("; ")}`
      : "Divergences: main digits largely agree.",
    corePoem,
    `Tone balance: ${toneBalance.map((t) => `${t.label} ${t.weight}%`).join(" · ")}`,
  ];

  return {
    capsules,
    threads,
    divergences,
    narrative,
    corePoem,
    flowerPetals,
    toneBalance,
    harmony,
    loShuMini,
    blueprintLines,
  };
}
