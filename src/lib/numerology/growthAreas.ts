/**
 * Growth Mode seats — one weekly practice from Lo Shu quiet digits and
 * other chart tensions. Reflective only.
 */

import { blurbForTopic } from "@/lib/guides/numberMeanings";
import { firstVowelMeaning } from "@/lib/guides/firstVowelMeanings";
import { buildLoShuArchitecture } from "@/lib/numerology/loShuArchitecture";
import { analyzeNameBookends } from "@/lib/numerology/nameBookends";
import type { GrowthOrigin, LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";
import { DIGIT_SEASON, seasonUserCue, yearMonthMixLine } from "@/lib/numerology/yearRhythm";

export type { GrowthOrigin };

export type GrowthArea = {
  id: string;
  title: string;
  suggestion: string;
  sources: string[];
  actions?: string[];
  focusNumber?: number;
  origin?: GrowthOrigin;
  whyLine?: string;
  examples?: string[];
  reflectPrompt?: string;
};

type Input = {
  snap: NumerologySnapshot;
  loShu: LoShuResult;
  fullName: string;
  growthBank: string[];
};

const LO_SHU_EXAMPLES: Record<number, string[]> = {
  1: [
    "Start one small task before conditions feel perfect.",
    "Own one initiative for the week.",
    "Make one decision without waiting to be asked.",
  ],
  2: [
    "Listen fully before you answer once.",
    "Share one decision with a partner.",
    "Wait one extra beat before you push.",
  ],
  3: [
    "Speak or write one idea today.",
    "Finish one small creative thing.",
    "Share one unfinished thought with a person you trust.",
  ],
  4: [
    "Write the week as a short plan.",
    "Document one recurring process.",
    "Keep one simple system for seven days.",
  ],
  5: [
    "Add one safe new thing to the week.",
    "Try one small change on purpose.",
    "Leave one slot open for movement.",
  ],
  6: [
    "Keep one promise with a clear stop.",
    "Offer care once without taking the whole load.",
    "Finish one responsibility loop.",
  ],
  7: [
    "Protect ten quiet minutes before you answer.",
    "Study one theme without rushing to act.",
    "Write one insight down so it can be used.",
  ],
  8: [
    "Complete one pending task.",
    "Make one important decision.",
    "Deliver one milestone.",
    "Spend 30 minutes each day on one priority.",
    "Define and track one business or household metric.",
  ],
  9: [
    "Close one loop before opening another.",
    "Finish a small cycle generously.",
    "Let one ended thing stay ended.",
  ],
};

const LO_SHU_REFLECT: Record<number, string> = {
  1: "Did starting one small thing change how the rest of the week felt?",
  2: "Did waiting and working with someone change the quality of the decision?",
  3: "Did finishing one idea change how I used my voice?",
  4: "Did a written plan change whether the week actually started?",
  5: "Did one chosen change feel different from changing course every day?",
  6: "Did keeping one promise with a stop leave more rest, not less?",
  7: "Did protected quiet time make the next action clearer?",
  8: "Did having a measurable target change how I used my time?",
  9: "Did closing one loop make room for the next thing?",
};

function loShuWhy(n: number, keyword: string): string {
  return `Your Lo Shu pattern shows ${n} as a quiet digit. This framework treats ${keyword.toLowerCase()} as a skill you can practise — not something wrong with you.`;
}

function loShuSuggestion(n: number, keyword: string): string {
  return `${keyword} is an area you may benefit from practising on purpose. A quiet ${n} is a growth doorway, not a verdict. Strengthen it through one small habit, not pressure.`;
}

export function growthFocusKicker(): string {
  return "This week's focus";
}

export function growthDevelopmentLine(area: GrowthArea): string | null {
  if (area.focusNumber == null) return null;
  if (area.origin === "lo-shu-missing") {
    return `Development number ${area.focusNumber}`;
  }
  if (area.origin === "life-path") return `Life Path ${area.focusNumber}`;
  if (area.origin === "expression") return `Expression ${area.focusNumber}`;
  if (area.origin === "chaldean") return `Compound ${area.focusNumber}`;
  return `Number ${area.focusNumber}`;
}

export function howToUseFocusThisWeek(
  area: GrowthArea,
  yearN: number | null,
  monthN: number | null,
): string {
  if (yearN == null || monthN == null) {
    return "Keep the practice small enough to finish in seven days.";
  }
  const y = DIGIT_SEASON[yearN];
  const m = DIGIT_SEASON[monthN];
  if (!y || !m) {
    return "Keep the practice small enough to finish in seven days.";
  }
  const skill = area.title.toLowerCase();
  if (yearN === 7 && monthN === 6) {
    return `Use this STUDY year to see ${skill} clearly, then move it with this TEND month — care, not force.`;
  }
  if (yearN === monthN) {
    return `Year and month share ${y.verb} ${yearN}. Use that matching pace for one ${skill} practice — not a new identity.`;
  }
  return `Use this ${y.verb} year (${seasonUserCue(yearN).toLowerCase()}) to map ${skill}, then take it at this ${m.verb} month's pace (${seasonUserCue(monthN).toLowerCase()}).`;
}

export function contextMixLine(yearN: number, monthN: number): string {
  return yearMonthMixLine(yearN, monthN);
}

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
    const keyword = c.keyword;
    push({
      id: `lo-shu-catalyst-${c.number}`,
      title: keyword,
      suggestion: loShuSuggestion(c.number, keyword),
      sources: [`Lo Shu grid · quiet ${c.number}`],
      actions: c.actions,
      focusNumber: c.number,
      origin: "lo-shu-missing",
      whyLine: loShuWhy(c.number, keyword),
      examples: LO_SHU_EXAMPLES[c.number],
      reflectPrompt:
        LO_SHU_REFLECT[c.number] ??
        "Did one small practice change how I used the week?",
    });
  }

  for (const engine of architecture.engines.filter((e) => e.status === "quiet").slice(0, 2)) {
    const skill = engine.label.replace(/\s+engine$/i, "");
    push({
      id: `lo-shu-engine-${engine.id}`,
      title: skill,
      suggestion: engine.summary,
      sources: [`Lo Shu grid · ${engine.arrowName}`],
      origin: "lo-shu-engine",
      whyLine: `This Lo Shu pattern leaves ${skill.toLowerCase()} quiet. You can still practise it as a skill this week — not as a missing part of you.`,
      actions: ["Run one small version of this skill for seven days."],
      examples: [
        "Name one situation where this skill would help.",
        "Do one small version of it today.",
        "Stop after that one version.",
      ],
      reflectPrompt: `Did practising ${skill.toLowerCase()} once change the week?`,
    });
  }

  const lp = blurbForTopic("life-path", snap.life_path);
  if (lp?.watchouts[0]) {
    const n = Number(snap.life_path);
    push({
      id: `lp-watch-${snap.life_path}`,
      title: "Life Path",
      suggestion: `${lp.watchouts[0]}. ${lp.practice}`,
      sources: [`Life Path ${snap.life_path}`],
      focusNumber: n,
      origin: "life-path",
      whyLine: `Life Path ${snap.life_path} is already a long theme in this chart. This seat is a balance practice for that path — not a second personality.`,
      actions: [lp.practice],
      examples: [lp.practice, "Keep the path theme to one small move this week."],
      reflectPrompt:
        "Did one path-sized action feel different from trying to live the whole number?",
    });
  }

  const expr = blurbForTopic("expression", snap.expression_number);
  if (expr?.watchouts[0]) {
    const n = Number(snap.expression_number);
    push({
      id: `expr-watch-${snap.expression_number}`,
      title: "Expression",
      suggestion: `${expr.watchouts[0]}. ${expr.practice}`,
      sources: [`Expression ${snap.expression_number}`],
      focusNumber: n,
      origin: "expression",
      whyLine: `Expression ${snap.expression_number} is how you tend to show up. This seat is a craft practice for that style — not a demand to become someone else.`,
      actions: [expr.practice],
      examples: [expr.practice, "Use how people meet you once, then rest."],
      reflectPrompt: "Did one crafted showing-up change the week more than trying harder?",
    });
  }

  if (snap.vedic_psychic !== snap.vedic_destiny) {
    push({
      id: "vedic-tension",
      title: "Alignment",
      suggestion: `Psychic ${snap.vedic_psychic} (day temperament) and Destiny ${snap.vedic_destiny} (longer path) differ. Notice when a day's reaction pulls against the longer aim, then choose one bridging habit.`,
      sources: [
        `Vedic Psychic ${snap.vedic_psychic}`,
        `Vedic Destiny ${snap.vedic_destiny}`,
      ],
      origin: "vedic",
      whyLine:
        "Day temperament and the longer path use different numbers here. Alignment is a weekly noticing practice, not a problem to solve.",
      actions: [
        "When the day's first reaction pulls against the longer aim, take one small path step.",
      ],
      examples: [
        "Name the day's first reaction once.",
        "Take one step that belongs to the longer path.",
        "Do not try to make the two numbers match.",
      ],
      reflectPrompt:
        "Did noticing the day's pull make the longer step easier to take?",
    });
  }

  const compound = Number(snap.compound_number);
  if ([13, 14, 16, 19].includes(compound)) {
    push({
      id: `chaldean-kd-${compound}`,
      title: "Name pressure",
      suggestion: `Compound ${compound} is traditionally read as a growth pressure in the name vibration. Meet it with patience, ethics, and steady skill rather than drama.`,
      sources: [`Chaldean compound ${compound}`],
      focusNumber: compound,
      origin: "chaldean",
      whyLine: `The name compound ${compound} is a pressure some schools treat as growth work. Practise patience and one ethical skill — not a story of being flawed.`,
      actions: ["Meet one tense moment this week with a slower, steadier skill."],
      examples: [
        "Pause once before you answer under pressure.",
        "Finish one piece of work cleanly.",
        "Choose the ethical option in one small choice.",
      ],
      reflectPrompt: "Did one slower response change the pressure of the week?",
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
        origin: "name",
        whyLine: `The first vowel ${fv.vowel} colours how the name opens. This is a small name-habit practice, not a verdict on character.`,
        actions: [fv.practice],
        examples: [fv.practice],
        reflectPrompt: "Did one name-habit practice show up in an ordinary conversation?",
      });
    }
  }

  for (const g of growthBank.slice(0, 3)) {
    push({
      id: `bank-${g.slice(0, 24)}`,
      title: "Practice focus",
      suggestion: g,
      sources: ["Growth bank"],
      origin: "bank",
      whyLine:
        "This is a practice that showed up across more than one part of the reading. Keep it to one small weekly move.",
      actions: [g],
      examples: [g],
      reflectPrompt: "Did keeping this to one small move change the week?",
    });
  }

  return out.slice(0, 7);
}
