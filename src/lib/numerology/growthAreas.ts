import { blurbForTopic } from "@/lib/guides/numberMeanings";
import { firstVowelMeaning } from "@/lib/guides/firstVowelMeanings";
import { analyzeNameBookends } from "@/lib/numerology/nameBookends";
import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";

export type GrowthArea = {
  id: string;
  title: string;
  suggestion: string;
  sources: string[];
};

type Input = {
  snap: NumerologySnapshot;
  loShu: LoShuResult;
  fullName: string;
  growthBank: string[];
};

export function synthesizeGrowthAreas(input: Input): GrowthArea[] {
  const { snap, loShu, fullName, growthBank } = input;
  const out: GrowthArea[] = [];

  const push = (area: GrowthArea) => {
    if (out.length >= 7) return;
    if (out.some((a) => a.id === area.id)) return;
    out.push(area);
  };

  for (const n of loShu.missing_numbers.slice(0, 3)) {
    push({
      id: `lo-shu-missing-${n}`,
      title: `Strengthen Lo Shu ${n}`,
      suggestion: `Number ${n} is light or missing in the birth grid—practice its theme gently through daily habits rather than forcing a personality rewrite.`,
      sources: [`Lo Shu · missing ${n}`],
    });
  }

  for (const arrow of loShu.missing_arrows.slice(0, 2)) {
    const short = arrow.replace(/^Arrow of\s+/i, "");
    push({
      id: `lo-shu-arrow-${short}`,
      title: `Develop ${short}`,
      suggestion: `A missing ${arrow} invites conscious practice along that plane—small weekly drills beat self-judgment.`,
      sources: [`Lo Shu · ${arrow}`],
    });
  }

  const lp = blurbForTopic("life-path", snap.life_path);
  if (lp?.watchouts[0]) {
    push({
      id: `lp-watch-${snap.life_path}`,
      title: `Life Path ${snap.life_path} balance`,
      suggestion: `${lp.watchouts[0]}. ${lp.practice}`,
      sources: [`Life Path ${snap.life_path}`],
    });
  }

  const expr = blurbForTopic("expression", snap.expression_number);
  if (expr?.watchouts[0]) {
    push({
      id: `expr-watch-${snap.expression_number}`,
      title: `Expression ${snap.expression_number} craft`,
      suggestion: `${expr.watchouts[0]}. ${expr.practice}`,
      sources: [`Expression ${snap.expression_number}`],
    });
  }

  if (snap.vedic_psychic !== snap.vedic_destiny) {
    push({
      id: "vedic-tension",
      title: "Align Psychic and Destiny tones",
      suggestion: `Psychic ${snap.vedic_psychic} (day temperament) and Destiny ${snap.vedic_destiny} (longer path) differ—notice when daily reactions pull against longer goals, then choose one bridging habit.`,
      sources: [
        `Vedic Psychic ${snap.vedic_psychic}`,
        `Vedic Destiny ${snap.vedic_destiny}`,
      ],
    });
  }

  const compound = Number(snap.compound_number);
  if ([13, 14, 16, 19].includes(compound)) {
    push({
      id: `chaldean-kd-${compound}`,
      title: `Chaldean compound ${compound} awareness`,
      suggestion: `Compound ${compound} is traditionally read as a growth pressure in the name vibration—meet it with patience, ethics, and steady skill rather than drama.`,
      sources: [`Chaldean compound ${compound}`],
    });
  }

  const bookends = analyzeNameBookends(fullName);
  if (bookends.firstVowel) {
    const fv = firstVowelMeaning(bookends.firstVowel.letter);
    if (fv?.watchouts[0]) {
      push({
        id: `vowel-${fv.vowel}`,
        title: `First vowel ${fv.vowel}`,
        suggestion: `${fv.watchouts[0]}. ${fv.practice}`,
        sources: [`First vowel ${fv.vowel}`],
      });
    }
  }

  for (const g of growthBank.slice(0, 3)) {
    push({
      id: `bank-${g.slice(0, 24)}`,
      title: "Practice focus",
      suggestion: g,
      sources: ["Growth bank"],
    });
  }

  return out.slice(0, 7);
}
