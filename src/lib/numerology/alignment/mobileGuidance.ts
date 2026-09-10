/**
 * Mobile decision layer on top of existing MobileFit facts.
 * Does not change the 100-point score.
 */

import type { SoulBirthNameAlignment } from "@/lib/numerology/alignment/soulBirthName";
import type { TaggedChart } from "@/lib/numerology/alignment/tagged";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import type {
  MobileFit,
  MobileVerdict,
} from "@/lib/numerology/mobileFit";
import { alignmentPoints } from "@/lib/numerology/mobileRootFit";
import type { MobilePurpose } from "@/lib/numerology/mobileLastFour";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";

export type DimensionScore = {
  id: string;
  label: string;
  score: number;
};

export type MobileBlueprint = {
  digits: string;
  score: number;
  verdict: MobileVerdict;
  overallLabel: string;
  dimensions: DimensionScore[];
  primaryFinding: string;
};

export type NumberPersonality = {
  root: number;
  primaryEnergy: string;
  supporting: number[];
  challenging: string[];
};

export type PersonMobileLink = {
  id: string;
  label: string;
  personRole: string;
  personNumber: number;
  mobileRoot: number;
  percent: number;
  interpretation: string;
};

export type MobileDnaLayer = {
  id: string;
  label: string;
  note: string;
  score: number;
};

export type ReceiverCaller = {
  receiver: string;
  caller: string;
  receiverNote: string;
  callerNote: string;
  balance: number;
  balanceNote: string;
};

export type ZeroProfile = {
  count: number;
  positions: number[];
  adjacent: string[];
  notes: string[];
};

export type RepetitionProfile = {
  counts: { digit: number; count: number }[];
  reinforced: number[];
  excessive: number[];
  missing: number[];
  missingNote: string;
};

export type PurposeWhy = {
  id: MobilePurpose;
  label: string;
  score: number;
  supports: string;
  friction: string;
  bestUse: string;
  lessIdeal: string;
};

export type BestUseChip = {
  purpose: string;
  tone: "strong" | "ok" | "caution";
};

export type MobileVerdictCard = {
  score: number;
  verdict: MobileVerdict;
  primaryStrength: string;
  primaryConcern: string;
  bestSuited: string[];
  useCaution: string[];
  recommendation: string;
  methodology: string[];
};

export type ChangeRow = {
  dimension: string;
  current: number;
  candidate: number;
  better: "current" | "candidate" | "tie";
};

export type NumberChange = {
  rows: ChangeRow[];
  strengthened: number[];
  reduced: number[];
  recommendation: string;
};

export type MobileGuidance = {
  blueprint: MobileBlueprint;
  personality: NumberPersonality;
  personMobile: { links: PersonMobileLink[]; overall: number };
  dna: MobileDnaLayer[];
  receiverCaller: ReceiverCaller | null;
  zeros: ZeroProfile;
  repetition: RepetitionProfile;
  purposeWhy: PurposeWhy[];
  bestUse: BestUseChip[];
  verdict: MobileVerdictCard;
};

const PURPOSE_LABEL: Record<MobilePurpose, string> = {
  personal: "Personal",
  career: "Career",
  business: "Business",
  wealth: "Wealth",
  relationships: "Relationships",
  networking: "Networking",
};

function trait(n: number): string {
  return CORE_TRAIT[n] ?? `Tone ${n}`;
}

function pctFromPoints(points: number, cap: number): number {
  if (cap <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((points / cap) * 100)));
}

function overallWord(score: number, verdict: MobileVerdict): string {
  if (verdict === "Exceptional" || verdict === "Excellent") {
    return `${score} / 100 — ${verdict.toUpperCase()}`;
  }
  if (verdict === "Good") return `${score} / 100 — GOOD WITH CONDITIONS`;
  if (verdict === "Acceptable") return `${score} / 100 — ACCEPTABLE / CONDITIONAL`;
  if (verdict === "Weak") return `${score} / 100 — WEAK FOR ALL-PURPOSE USE`;
  return `${score} / 100 — ${verdict.toUpperCase()}`;
}

function shownTagged(n: {
  number: number;
  compound: number;
  root: number;
}): string {
  if (n.compound !== n.number && n.compound !== n.root) {
    return `${n.compound}/${n.root}`;
  }
  return String(n.number);
}

function personVsMobile(
  id: string,
  label: string,
  personRole: string,
  personNumber: number,
  mobileRoot: number,
): PersonMobileLink {
  const percent = pctFromPoints(alignmentPoints(personNumber, mobileRoot), 25);
  const interpretation = assertSafeCopy(
    `Person ${personRole} ${personNumber} (${plainTrait(personNumber)}) ↔ mobile root ${mobileRoot} (${plainTrait(mobileRoot)}). Derived fit ${percent}%.`,
    `mobile.link.${id}`,
  );
  return {
    id,
    label,
    personRole,
    personNumber,
    mobileRoot,
    percent,
    interpretation,
  };
}

function digitEnergyNote(n: number): string {
  return trait(n);
}

export function buildMobileGuidance(
  fit: MobileFit,
  chart: TaggedChart,
  personAlignment?: SoulBirthNameAlignment,
): MobileGuidance {
  const root = fit.core;
  const digits = fit.parsed.digits;
  const personalAlign = pctFromPoints(fit.pillars.destiny + fit.pillars.birth, 45);
  const vibration = pctFromPoints(
    alignmentPoints(chart.birth.root, root) +
      alignmentPoints(chart.destiny.root, root),
    50,
  );
  const structural = pctFromPoints(fit.pillars.sequence, 35);
  const purposeAvg = fit.purpose
    ? Math.round(
        Object.values(fit.purpose).reduce((s, n) => s + n, 0) /
          Object.values(fit.purpose).length,
      )
    : 60;

  const dimensions: DimensionScore[] = [
    { id: "personal", label: "Personal fit", score: personalAlign },
    { id: "vibration", label: "Root vs date", score: vibration },
    { id: "structure", label: "Structure", score: structural },
    { id: "purpose", label: "Purpose fit", score: purposeAvg },
  ];

  const flow = personAlignment?.flowLabel ?? `${chart.soul.number} → ${chart.birth.number} → ${chart.name.number}`;
  const primaryFinding = assertSafeCopy(
    `The number has ${fit.verdict.toLowerCase()} alignment with your ${chart.birth.number}/${chart.destiny.number} date profile${
      fit.hasSevereConflict
        ? ", and the inner sequence contains a traditionally high-conflict pair"
        : ""
    }. It is more useful for selected purposes than as a universal pick. Personal flow in view: ${flow}.`,
    "mobile.finding",
  );

  const counts = fit.digitCounts
    .map((count, digit) => ({ digit, count }))
    .filter((row) => row.count > 0 && row.digit >= 1);
  const supporting = [...counts]
    .sort((a, b) => b.count - a.count)
    .filter((r) => r.digit !== root)
    .slice(0, 3)
    .map((r) => r.digit);
  const challenging: string[] = [];
  if (fit.flags.some((f) => f.kind === "overCount")) {
    const d = fit.flags.find((f) => f.kind === "overCount");
    if (d) challenging.push(`Repeated ${d.digit}`);
  }
  if (fit.hasSevereConflict) {
    const severe = fit.pairs.find((p) => p.kind === "severeConflict");
    if (severe) challenging.push(`Pair ${severe.pair}`);
  }

  const personality: NumberPersonality = {
    root,
    primaryEnergy: assertSafeCopy(
      `${digitEnergyNote(root)} · movement of this root through the digit string`,
      "mobile.personality",
    ),
    supporting,
    challenging,
  };

  const links = [
    personVsMobile(
      "soul",
      `Soul ${shownTagged(chart.soul)}`,
      "Soul",
      chart.soul.root,
      root,
    ),
    personVsMobile("birth", `Birth ${chart.birth.number}`, "Birth", chart.birth.root, root),
    personVsMobile(
      "destiny",
      `Destiny ${chart.destiny.number}`,
      "Destiny",
      chart.destiny.root,
      root,
    ),
    personVsMobile(
      "name",
      `Name ${shownTagged(chart.name)}`,
      "Name",
      chart.name.root,
      root,
    ),
  ];
  const overallFit = Math.round(
    links.reduce((s, l) => s + l.percent, 0) / links.length,
  );

  const dna: MobileDnaLayer[] = [
    {
      id: "root",
      label: "Root",
      note: `Digit total ${fit.compound} → root ${root}. First layer only.`,
      score: vibration,
    },
    {
      id: "digits",
      label: "Digits",
      note: "Which digits appear, and how often.",
      score: pctFromPoints(fit.pillars.pairing.frequency, 7),
    },
    {
      id: "position",
      label: "Position",
      note: "Last-four receiver/caller tail.",
      score: pctFromPoints(fit.pillars.ending, 5),
    },
    {
      id: "sequence",
      label: "Sequence",
      note: "Adjacent pairs and runs.",
      score: structural,
    },
    {
      id: "personal",
      label: "Personal fit",
      note: "Birth and Destiny vs this root.",
      score: personalAlign,
    },
  ];

  let receiverCaller: ReceiverCaller | null = null;
  if (fit.lastFour && fit.lastFour.slots.length === 4) {
    const [a, b, c, d] = fit.lastFour.slots;
    const recSum = a.digit + b.digit;
    const callSum = c.digit + d.digit;
    const gap = Math.abs(recSum - callSum);
    const balance = Math.max(50, Math.min(95, 92 - gap * 6));
    const recNote = `${a.digit} then ${b.digit}: ${a.note}`;
    const callNote = `${c.digit} then ${d.digit}: ${c.note}`;
    receiverCaller = {
      receiver: `${a.digit} → ${b.digit}`,
      caller: `${c.digit} → ${d.digit}`,
      receiverNote: assertSafeCopy(recNote, "mobile.receiver"),
      callerNote: assertSafeCopy(callNote, "mobile.caller"),
      balance,
      balanceNote: assertSafeCopy(
        recSum === callSum
          ? "Receiving and outgoing sides sit in a similar range."
          : recSum > callSum
            ? "The receiving side is a little stronger than the outgoing side."
            : "The outgoing side is a little stronger than the receiving side.",
        "mobile.balance",
      ),
    };
  }

  const zeroPositions: number[] = [];
  digits.split("").forEach((ch, i) => {
    if (ch === "0") zeroPositions.push(i + 1);
  });
  const adjacent: string[] = [];
  digits.split("").forEach((ch, i) => {
    if (ch !== "0") return;
    const before = digits[i - 1] ?? "—";
    const after = digits[i + 1] ?? "—";
    adjacent.push(`${before} — 0 — ${after}`);
  });
  const zeros: ZeroProfile = {
    count: fit.digitCounts[0] ?? 0,
    positions: zeroPositions,
    adjacent,
    notes: assertSafeList(
      zeroPositions.length
        ? [
            `${zeroPositions.length} zero${zeroPositions.length === 1 ? "" : "s"} in this national number.`,
            "Zero is read by position and neighbours here, not as an automatic defect.",
          ]
        : ["No zeros in this national number."],
      "mobile.zero",
    ),
  };

  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (d) => (fit.digitCounts[d] ?? 0) === 0,
  );
  const reinforced = counts.filter((r) => r.count >= 2 && r.count <= 2).map((r) => r.digit);
  const excessive = counts.filter((r) => r.count >= 3).map((r) => r.digit);
  const repetition: RepetitionProfile = {
    counts: counts.filter((r) => r.count > 0),
    reinforced,
    excessive,
    missing,
    missingNote: assertSafeCopy(
      "Missing digits are areas of comparatively lower numerical representation, not automatically defects.",
      "mobile.missing",
    ),
  };

  const purposeWhy: PurposeWhy[] = fit.purpose
    ? (Object.keys(fit.purpose) as MobilePurpose[]).map((id) => {
        const score = fit.purpose![id];
        const supports = `Root ${root} with Birth ${fit.birthNumber} / Destiny ${fit.destinyNumber}`;
        const friction = fit.hasSevereConflict
          ? "A high-conflict pair in the sequence"
          : excessive.length
            ? `Repeated ${excessive.join(", ")}`
            : "No severe pair flagged";
        return {
          id,
          label: PURPOSE_LABEL[id],
          score,
          supports: assertSafeCopy(supports, `mobile.purpose.${id}.s`),
          friction: assertSafeCopy(friction, `mobile.purpose.${id}.f`),
          bestUse: assertSafeCopy(
            score >= 70
              ? `Workable for ${PURPOSE_LABEL[id].toLowerCase()} contact in this reading.`
              : `Use for ${PURPOSE_LABEL[id].toLowerCase()} only with a clear limit.`,
            `mobile.purpose.${id}.best`,
          ),
          lessIdeal: assertSafeCopy(
            score < 60
              ? `Less ideal as the main number for ${PURPOSE_LABEL[id].toLowerCase()}.`
              : "Fine as a supporting use if another purpose is the priority.",
            `mobile.purpose.${id}.less`,
          ),
        };
      })
    : [];

  const bestUse: BestUseChip[] = purposeWhy.map((p) => ({
    purpose: p.label,
    tone: p.score >= 75 ? "strong" : p.score >= 55 ? "ok" : "caution",
  }));

  const bestSuited = bestUse.filter((c) => c.tone === "strong").map((c) => c.purpose);
  const useCaution = bestUse.filter((c) => c.tone === "caution").map((c) => c.purpose);

  const verdict: MobileVerdictCard = {
    score: fit.score,
    verdict: fit.verdict,
    primaryStrength: assertSafeCopy(
      `Date alignment sits ${fit.bnTone.toLowerCase()} with Birth ${fit.birthNumber} and ${fit.dnTone.toLowerCase()} with Destiny ${fit.destinyNumber}.`,
      "mobile.verdict.strength",
    ),
    primaryConcern: assertSafeCopy(
      fit.hasSevereConflict
        ? "A traditionally high-conflict pair reduces structural harmony."
        : structural < 55
          ? "Sequence quality is the weaker pillar on this number."
          : "No single severe pair; still read purpose by purpose, not as luck.",
      "mobile.verdict.concern",
    ),
    bestSuited: bestSuited.length ? bestSuited : bestUse.filter((c) => c.tone === "ok").map((c) => c.purpose),
    useCaution: useCaution.length ? useCaution : [],
    recommendation: assertSafeCopy(
      fit.score >= 80
        ? "Usable as a strong everyday number in this traditional reading."
        : fit.score >= 70
          ? "Usable, with a clearer best-purpose than as an all-purpose pick."
          : fit.score >= 60
            ? "Usable, but not an optimal all-purpose number."
            : "Treat as a limited-use number in this traditional reading.",
      "mobile.verdict.rec",
    ),
    methodology: assertSafeList(
      [
        "System: Chaldean-aligned pair matrix plus selected traditional mobile rules.",
        `Personal profile: Soul ${shownTagged(chart.soul)} (Chaldean vowels), Birth ${chart.birth.number} (day), Destiny ${chart.destiny.number} (date sum), Name ${shownTagged(chart.name)} (Chaldean).`,
        "Structural analysis: digit position, repetition, sequence, pairs, Lo Shu.",
        "The 100-point headline is unchanged. Purpose bars are a separate weighted view.",
        "Interpretations are reflective guidance, not scientific prediction.",
      ],
      "mobile.method",
    ),
  };

  return {
    blueprint: {
      digits,
      score: fit.score,
      verdict: fit.verdict,
      overallLabel: overallWord(fit.score, fit.verdict),
      dimensions,
      primaryFinding,
    },
    personality,
    personMobile: { links, overall: overallFit },
    dna,
    receiverCaller,
    zeros,
    repetition,
    purposeWhy,
    bestUse,
    verdict,
  };
}

function digitDelta(
  current: number[],
  candidate: number[],
): { strengthened: number[]; reduced: number[] } {
  const strengthened: number[] = [];
  const reduced: number[] = [];
  for (let d = 1; d <= 9; d++) {
    const a = current[d] ?? 0;
    const b = candidate[d] ?? 0;
    if (b > a) strengthened.push(d);
    if (b < a) reduced.push(d);
  }
  return { strengthened, reduced };
}

export function buildNumberChange(
  current: MobileFit,
  candidate: MobileFit,
): NumberChange {
  const purposeAvg = (fit: MobileFit) =>
    fit.purpose
      ? Math.round(
          Object.values(fit.purpose).reduce((s, n) => s + n, 0) /
            Object.values(fit.purpose).length,
        )
      : 0;
  const rows: ChangeRow[] = [
    {
      dimension: "Headline score",
      current: current.score,
      candidate: candidate.score,
      better:
        candidate.score > current.score
          ? "candidate"
          : candidate.score < current.score
            ? "current"
            : "tie",
    },
    {
      dimension: "Personal alignment",
      current: pctFromPoints(current.pillars.destiny + current.pillars.birth, 45),
      candidate: pctFromPoints(candidate.pillars.destiny + candidate.pillars.birth, 45),
      better: "tie",
    },
    {
      dimension: "Sequence",
      current: pctFromPoints(current.pillars.sequence, 35),
      candidate: pctFromPoints(candidate.pillars.sequence, 35),
      better: "tie",
    },
    {
      dimension: "Purpose average",
      current: purposeAvg(current),
      candidate: purposeAvg(candidate),
      better: "tie",
    },
  ];
  for (const row of rows) {
    if (row.candidate > row.current) row.better = "candidate";
    else if (row.candidate < row.current) row.better = "current";
    else row.better = "tie";
  }
  const { strengthened, reduced } = digitDelta(
    current.digitCounts,
    candidate.digitCounts,
  );
  const rec =
    candidate.score > current.score
      ? "The candidate is stronger on the headline 100-point reading. Still check the purpose you care about."
      : current.score > candidate.score
        ? "The current number is stronger on the headline 100-point reading. Keep it if that purpose still matches."
        : "Headline scores match. Choose by purpose bars, not by luck language.";
  return {
    rows,
    strengthened,
    reduced,
    recommendation: assertSafeCopy(rec, "mobile.change"),
  };
}
