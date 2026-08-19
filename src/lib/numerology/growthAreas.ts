import { blurbForTopic } from "@/lib/guides/numberMeanings";
import { firstVowelMeaning } from "@/lib/guides/firstVowelMeanings";
import { buildLoShuArchitecture } from "@/lib/numerology/loShuArchitecture";
import { analyzeNameBookends } from "@/lib/numerology/nameBookends";
import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";

export type GrowthArea = {
  id: string;
  title: string;
  suggestion: string;
  sources: string[];
  /** Optional practice steps (Lo Shu catalysts / Growth Mode) */
  actions?: string[];
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
  const architecture = buildLoShuArchitecture(loShu);

  const push = (area: GrowthArea) => {
    if (out.length >= 7) return;
    if (out.some((a) => a.id === area.id)) return;
    out.push(area);
  };

  for (const c of architecture.catalysts.slice(0, 3)) {
    push({
      id: `lo-shu-catalyst-${c.number}`,
      title: c.title,
      suggestion: c.summary,
      sources: [`Lo Shu grid · catalyst ${c.number}`],
      actions: c.actions,
    });
  }

  for (const engine of architecture.engines.filter((e) => e.status === "quiet").slice(0, 2)) {
    push({
      id: `lo-shu-engine-${engine.id}`,
      title: `Develop ${engine.label}`,
      suggestion: engine.summary,
      sources: [`Lo Shu grid · ${engine.arrowName}`],
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
