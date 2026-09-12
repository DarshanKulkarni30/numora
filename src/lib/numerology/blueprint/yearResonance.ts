/**
 * Year Resonance: how Birth architecture, Name architecture, and Name Cycle
 * meet an unchanged Personal Year. Same date → same PY. Same PY ≠ same experience.
 */

import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";
import {
  architectureKind,
  makeEdge,
  yearSeatKind,
  type HarmonyEdge,
  type HarmonyKind,
} from "./harmony";
import { yearModeFor } from "./yearInterpreter";

export type YearClass = "flow" | "growth" | "adjustment" | "friction-year";

export type YearResonance = {
  personalYear: number;
  pyTitle: string;
  pyKeywords: string;
  yearClass: YearClass;
  yearClassLabel: string;
  bandLabel: string;
  naturalFit: HarmonyKind;
  directionFit: HarmonyKind;
  nameFit: HarmonyKind;
  cycleFit: HarmonyKind | null;
  supporting: HarmonyEdge[];
  challenging: HarmonyEdge[];
  allYearEdges: HarmonyEdge[];
  architectureEdges: HarmonyEdge[];
  summary: string;
  yearStory: string;
  strategy: string;
  whyDifferent: string;
  counts: { supporting: number; tension: number; friction: number };
};

const PY_KEYS: Record<number, string> = {
  1: "Start • Decide • Begin",
  2: "Connect • Wait • Pair",
  3: "Express • Create • Connect",
  4: "Build • Systems • Repeat",
  5: "Change • Movement • Experiment",
  6: "Care • Home • Promises",
  7: "Research • Depth • Quiet",
  8: "Achieve • Results • Steward",
  9: "Complete • Finish • Release",
};

const CLASS_LABEL: Record<YearClass, string> = {
  flow: "Flow year",
  growth: "Growth year",
  adjustment: "Adjustment year",
  "friction-year": "High-friction year",
};

const BAND: Record<YearClass, string> = {
  flow: "High alignment",
  growth: "Productive tension",
  adjustment: "Mixed alignment",
  "friction-year": "High friction — prepare, don’t force",
};

function classify(
  natural: HarmonyKind,
  direction: HarmonyKind,
  name: HarmonyKind,
  counts: { supporting: number; tension: number; friction: number },
): YearClass {
  if (counts.friction >= 2) return "friction-year";
  if (natural === "friction" || direction === "friction") return "adjustment";
  if (counts.friction === 1 || name === "tension" || counts.tension >= 2) {
    return "growth";
  }
  if (natural === "supportive" && direction === "supportive") return "flow";
  return "growth";
}

export function buildYearResonance(opts: {
  personalYear: number;
  bn: number;
  dn: number;
  soul: number;
  nameRoot: number;
  cycleNumber?: number | null;
  cycleLetter?: string | null;
}): YearResonance {
  const py = reduceToSingleDigit(opts.personalYear);
  const bn = reduceToSingleDigit(opts.bn);
  const dn = reduceToSingleDigit(opts.dn);
  const sn = reduceToSingleDigit(opts.soul);
  const nn = reduceToSingleDigit(opts.nameRoot);
  const cycleN =
    opts.cycleNumber != null ? reduceToSingleDigit(opts.cycleNumber) : null;
  const pyMode = yearModeFor(py);

  const naturalFit = yearSeatKind(py, bn, "bn");
  const directionFit = yearSeatKind(py, dn, "dn");
  const snFit = yearSeatKind(py, sn, "sn");
  const nnFit = yearSeatKind(py, nn, "nn");
  const nameFit: HarmonyKind =
    snFit === "friction" || nnFit === "friction"
      ? "friction"
      : snFit === "tension" || nnFit === "tension"
        ? "tension"
        : snFit === "neutral" || nnFit === "neutral"
          ? "neutral"
          : "supportive";
  const cycleFit =
    cycleN != null ? yearSeatKind(py, cycleN, "cycle") : null;

  const yearEdges: HarmonyEdge[] = [
    makeEdge({
      id: "py-bn",
      leftLabel: "Personal Year",
      left: py,
      rightLabel: "Birth Number",
      right: bn,
      kind: naturalFit,
    }),
    makeEdge({
      id: "py-dn",
      leftLabel: "Personal Year",
      left: py,
      rightLabel: "Destiny Number",
      right: dn,
      kind: directionFit,
    }),
    makeEdge({
      id: "py-sn",
      leftLabel: "Personal Year",
      left: py,
      rightLabel: "Soul Number",
      right: sn,
      kind: snFit,
    }),
    makeEdge({
      id: "py-nn",
      leftLabel: "Personal Year",
      left: py,
      rightLabel: "Name Number",
      right: nn,
      kind: nnFit,
    }),
  ];
  if (cycleN != null && cycleFit) {
    yearEdges.push(
      makeEdge({
        id: "py-cycle",
        leftLabel: "Personal Year",
        left: py,
        rightLabel: opts.cycleLetter
          ? `Name Cycle ${opts.cycleLetter}`
          : "Name Cycle",
        right: cycleN,
        kind: cycleFit,
      }),
    );
  }

  const architectureEdges: HarmonyEdge[] = [
    makeEdge({
      id: "bn-dn",
      leftLabel: "Birth Number",
      left: bn,
      rightLabel: "Destiny Number",
      right: dn,
      kind: architectureKind(bn, dn),
    }),
    makeEdge({
      id: "bn-sn",
      leftLabel: "Birth Number",
      left: bn,
      rightLabel: "Soul Number",
      right: sn,
      kind: architectureKind(bn, sn),
    }),
    makeEdge({
      id: "bn-nn",
      leftLabel: "Birth Number",
      left: bn,
      rightLabel: "Name Number",
      right: nn,
      kind: architectureKind(bn, nn),
    }),
    makeEdge({
      id: "dn-sn",
      leftLabel: "Destiny Number",
      left: dn,
      rightLabel: "Soul Number",
      right: sn,
      kind: architectureKind(dn, sn),
    }),
    makeEdge({
      id: "dn-nn",
      leftLabel: "Destiny Number",
      left: dn,
      rightLabel: "Name Number",
      right: nn,
      kind: architectureKind(dn, nn),
    }),
    makeEdge({
      id: "sn-nn",
      leftLabel: "Soul Number",
      left: sn,
      rightLabel: "Name Number",
      right: nn,
      kind: architectureKind(sn, nn),
    }),
  ];

  const supporting = yearEdges.filter((e) => e.kind === "supportive");
  const challenging = yearEdges.filter(
    (e) => e.kind === "tension" || e.kind === "friction",
  );
  const counts = {
    supporting: supporting.length,
    tension: yearEdges.filter((e) => e.kind === "tension").length,
    friction: yearEdges.filter((e) => e.kind === "friction").length,
  };
  const yearClass = classify(naturalFit, directionFit, nameFit, counts);

  const summary = assertSafeCopy(
    yearClass === "flow"
      ? `Personal Year ${py} (${pyMode.title}) matches how you already operate. The date did not change. Your seats simply speak this year’s language.`
      : yearClass === "growth"
        ? `Personal Year ${py} (${pyMode.title}) is still the year’s theme. Parts of you already speak it; Name or Soul may ask for depth, control, or quiet before you move.`
        : yearClass === "adjustment"
          ? `Personal Year ${py} (${pyMode.title}) pulls against a main seat (Birth or Destiny). Keep the year number. Change the strategy, not the calendar.`
          : `Personal Year ${py} (${pyMode.title}) meets several opposing seats. This is a year to simplify and prepare — not a “bad year.”`,
    "res.summary",
  );

  const yearStory = assertSafeCopy(
    challenging.length
      ? `The year asks you to ${plainTrait(py)}. Birth ${bn} / Destiny ${dn} ${
          naturalFit === "supportive" && directionFit === "supportive"
            ? "already support that"
            : "meet that with more stretch"
        }. Soul ${sn} and Name ${nn} ${
          nameFit === "supportive"
            ? "join in"
            : "may want more certainty or privacy first"
        }. ${
          cycleN != null && opts.cycleLetter
            ? `Name Cycle ${opts.cycleLetter}/${cycleN} is the identity colour on top.`
            : ""
        }`
      : `This year may feel like a natural chapter: Personal Year ${py} and your Birth/Destiny seats are telling a similar story.`,
    "res.story",
  );

  const strategy = assertSafeCopy(
    (py === 3 || py === 5) && (sn === 7 || nn === 7)
      ? "Research with a deadline. Put one idea into the world before it is perfect. Improve through the reply."
      : yearClass === "flow"
        ? "Use the momentum. Act on one thing that already fits. Do not invent a new life to match the year."
        : yearClass === "adjustment" || yearClass === "friction-year"
          ? "Adapt the method. Smaller bets, clearer dates, less forcing of a full expansion."
          : "Do not resist the stretch. Use it to practise the quieter seat, then take one public step.",
    "res.strategy",
  );

  const whyDifferent = assertSafeCopy(
    "Two people with the same date of birth share this Personal Year. They do not share Year Resonance. Name Number and Soul Number never rewrite the year digit — they change how the year may feel and what strategy fits.",
    "res.why",
  );

  return {
    personalYear: py,
    pyTitle: pyMode.title,
    pyKeywords: PY_KEYS[py] ?? pyMode.title,
    yearClass,
    yearClassLabel: CLASS_LABEL[yearClass],
    bandLabel: BAND[yearClass],
    naturalFit,
    directionFit,
    nameFit,
    cycleFit,
    supporting,
    challenging,
    allYearEdges: yearEdges,
    architectureEdges,
    summary,
    yearStory,
    strategy,
    whyDifferent,
    counts,
  };
}
