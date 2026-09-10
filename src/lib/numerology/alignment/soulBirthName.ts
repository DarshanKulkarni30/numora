/**
 * Soul → Birth → Name alignment: relationships, not three disconnected blurbs.
 * Reflective guidance only.
 */

import {
  BAND_COMPAT_LABEL,
  pairPercent,
  softPairBand,
} from "@/lib/numerology/alignment/pairAffinity";
import type {
  TaggedChart,
  TaggedNumber,
} from "@/lib/numerology/alignment/tagged";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import type { TrioBand } from "@/lib/numerology/trioMatrix";

export type AlignmentPairId = "soul-birth" | "birth-name" | "soul-name";

export type AlignmentPair = {
  id: AlignmentPairId;
  from: TaggedNumber;
  to: TaggedNumber;
  question: string;
  band: TrioBand;
  percent: number;
  label: string;
  interpretation: string;
};

export type DomainId =
  | "career"
  | "business"
  | "leadership"
  | "learning"
  | "wealth"
  | "relationships";

export type DomainInsight = {
  id: DomainId;
  label: string;
  score: number;
  primaryInteraction: string;
  insight: string;
  why: string;
};

export type StrengthBlock = {
  pair: string;
  title: string;
  body: string;
  uses: string[];
};

export type TensionBlock = {
  pair: string;
  title: string;
  body: string;
  pattern: string;
};

export type BridgeBlock = {
  number: number;
  title: string;
  body: string;
};

export type SoulBirthNameAlignment = {
  soul: TaggedNumber;
  birth: TaggedNumber;
  name: TaggedNumber;
  destiny: TaggedNumber;
  personality: TaggedNumber;
  fortuna: TaggedNumber;
  flowLabel: string;
  headline: string;
  pairs: AlignmentPair[];
  overallLabel: string;
  strength: StrengthBlock;
  tension: TensionBlock;
  bridge: BridgeBlock;
  domains: DomainInsight[];
  strategy: string;
  strategyWhy: string;
  doMore: string[];
  watchFor: string[];
};

export type AlignmentOpts = {
  young?: boolean;
};

function trait(n: number): string {
  return CORE_TRAIT[n] ?? CORE_TRAIT[pairSafe(n)] ?? `Tone ${n}`;
}

function pairSafe(n: number): number {
  const x = Math.abs(n);
  if (x >= 1 && x <= 9) return x;
  return 9;
}

function flowLabel(soul: number, birth: number, name: number): string {
  return `${soul} → ${birth} → ${name}`;
}

function clampScore(n: number): number {
  return Math.max(40, Math.min(95, Math.round(n)));
}

function overallLabel(internal: number, external: number): string {
  const innerWord = internal >= 80 ? "Strong" : internal >= 65 ? "Moderate" : "Mixed";
  const outerWord = external >= 80 ? "strong" : external >= 65 ? "moderate" : "mixed";
  return `${innerWord} internal match (Soul vs Birth), ${outerWord} external match (with the name).`;
}

function pairInterpretation(
  id: AlignmentPairId,
  from: TaggedNumber,
  to: TaggedNumber,
  band: TrioBand,
): string {
  const a = from.number;
  const b = to.number;
  if (id === "soul-birth") {
    return `Inside you want ${plainTrait(a)} (Soul ${a}). The day’s natural move is ${plainTrait(b)} (Birth ${b}). ${BAND_COMPAT_LABEL[band]}: the day-tone can ${band === "friction" || band === "block" ? "pull against" : "carry"} that inner wish if you use it on purpose.`;
  }
  if (id === "birth-name") {
    return `The day’s energy is ${plainTrait(a)} (Birth ${a}). The name people meet is ${plainTrait(b)} (Name ${b}). ${BAND_COMPAT_LABEL[band]}: the outer spelling may ${band === "friction" || band === "block" ? "look quieter or more private than" : "support"} the day-tone.`;
  }
  return `Soul ${a} wants ${plainTrait(a)}. The name people meet is ${plainTrait(b)} (Name ${b}). ${BAND_COMPAT_LABEL[band]}: the outer spelling may ${band === "friction" || band === "block" ? "prefer depth and distance while the inner wish wants to be seen" : "help the inner wish show up in the room"}.`;
}

function usesFor(a: number, b: number): string[] {
  const map: Record<number, string[]> = {
    1: ["taking ownership", "starting a line of work"],
    2: ["pairing with one other person", "support roles"],
    3: ["teaching", "consulting", "writing"],
    4: ["systems work", "operations"],
    5: ["sales and movement", "product change"],
    6: ["care work", "client trust"],
    7: ["research", "specialist craft"],
    8: ["measured results", "resource plans"],
    9: ["closing loops", "wider-group help"],
  };
  const out: string[] = [];
  for (const n of [pairSafe(a), pairSafe(b)]) {
    for (const u of map[n] ?? []) {
      if (!out.includes(u)) out.push(u);
    }
  }
  return out.slice(0, 6);
}

function makePair(
  id: AlignmentPairId,
  from: TaggedNumber,
  to: TaggedNumber,
  question: string,
): AlignmentPair {
  const band = softPairBand(from.root, to.root);
  const interpretation = assertSafeCopy(
    pairInterpretation(id, from, to, band),
    `align.pair.${id}`,
  );
  return {
    id,
    from,
    to,
    question,
    band,
    percent: pairPercent(from.root, to.root),
    label: BAND_COMPAT_LABEL[band],
    interpretation,
  };
}

function domainInsight(
  id: DomainId,
  label: string,
  score: number,
  primaryInteraction: string,
  insight: string,
  why: string,
): DomainInsight {
  return {
    id,
    label,
    score: clampScore(score),
    primaryInteraction,
    insight: assertSafeCopy(insight, `align.domain.${id}`),
    why: assertSafeCopy(why, `align.domain.${id}.why`),
  };
}

export function buildSoulBirthNameAlignment(
  chart: TaggedChart,
  opts?: AlignmentOpts,
): SoulBirthNameAlignment {
  const { soul, birth, name, destiny, personality, fortuna } = chart;
  const young = Boolean(opts?.young);
  const flow = flowLabel(soul.number, birth.number, name.number);

  const soulBirth = makePair(
    "soul-birth",
    soul,
    birth,
    "Can your natural behaviour satisfy your inner motivation?",
  );
  const birthName = makePair(
    "birth-name",
    birth,
    name,
    "Does the way you present yourself support your natural energy?",
  );
  const soulName = makePair(
    "soul-name",
    soul,
    name,
    "Does your outer style support what you want inside?",
  );
  const pairs = [soulBirth, birthName, soulName];

  const internal = soulBirth.percent;
  const external = Math.round((birthName.percent + soulName.percent) / 2);

  const strength: StrengthBlock = {
    pair: `${soul.number} + ${birth.number}`,
    title: `${trait(soul.number)} + ${trait(birth.number).toLowerCase()}`,
    body: assertSafeCopy(
      `Soul ${soul.number} wants ${plainTrait(soul.number)}. Birth ${birth.number} supplies ${plainTrait(birth.number)}. Together they are the easiest inner engine on this chart.`,
      "align.strength",
    ),
    uses: assertSafeList(usesFor(soul.number, birth.number), "align.strength.uses"),
  };

  const low =
    soulName.percent <= birthName.percent ? soulName : birthName;
  const tension: TensionBlock = {
    pair: `${low.from.number} vs ${low.to.number}`,
    title: `${trait(low.from.number)} ↔ ${trait(low.to.number).toLowerCase()}`,
    body: assertSafeCopy(
      low.id === "soul-name"
        ? `Soul ${soul.number} wants to be seen for ${plainTrait(soul.number)}. Name ${name.number} tends toward ${plainTrait(name.number)}. That gap is information, not a verdict.`
        : `Birth ${birth.number} wants ${plainTrait(birth.number)}. Name ${name.number} shows ${plainTrait(name.number)}. Notice when the outer manner hides the day-tone.`,
      "align.tension",
    ),
    pattern: assertSafeCopy(
      `A workable pattern: want ${plainTrait(soul.number)}, then use ${plainTrait(birth.number)} before the ${plainTrait(name.number)} outer style takes over.`,
      "align.tension.pattern",
    ),
  };

  const bridge: BridgeBlock = {
    number: birth.number,
    title: `Birth ${birth.number} is the bridge`,
    body: assertSafeCopy(
      `Use ${plainTrait(birth.number)} (Birth ${birth.number}) as the working habit between the inner wish (Soul ${soul.number}) and the name people meet (Name ${name.number}).`,
      "align.bridge",
    ),
  };

  const career = clampScore(
    0.4 * soulBirth.percent + 0.35 * birthName.percent + 0.25 * soulName.percent,
  );
  const business = clampScore(
    0.35 * soulBirth.percent + 0.35 * birthName.percent + 0.3 * soulName.percent,
  );

  const domains: DomainInsight[] = [
    domainInsight(
      "career",
      "Career",
      career,
      flow,
      `Lead through ${trait(birth.number).toLowerCase()}, then let Name ${name.number} show the specialist edge.`,
      `Score from Soul ${soul.number} → Birth ${birth.number} (${soulBirth.percent}%) then Birth → Name ${name.number} (${birthName.percent}%).`,
    ),
    domainInsight(
      "business",
      "Business",
      business,
      `${soul.number}+${birth.number}+${name.number}`,
      `Build a craft that needs ${plainTrait(birth.number)} and ${plainTrait(name.number)} — not a loud title with no depth.`,
      `Blend of all three pairs in the Soul → Birth → Name flow.`,
    ),
    domainInsight(
      "leadership",
      "Leadership",
      soulBirth.percent,
      `${soul.number}+${birth.number}`,
      `Lead by ${plainTrait(soul.number)}, using ${plainTrait(birth.number)} so people can follow the work.`,
      `From Soul ${soul.number} → Birth ${birth.number} only (${soulBirth.percent}%).`,
    ),
    domainInsight(
      "learning",
      "Learning",
      birthName.percent,
      `${birth.number}+${name.number}`,
      `Study that uses ${plainTrait(birth.number)} and ${plainTrait(name.number)} is a usable strength on this chart.`,
      `From Birth ${birth.number} → Name ${name.number} (${birthName.percent}%).`,
    ),
    domainInsight(
      "wealth",
      "Wealth",
      soulName.percent,
      `${soul.number}+${name.number}`,
      `Avoid impulsive solo moves. Use a repeating decision step before you spend or commit.`,
      `From Soul ${soul.number} vs Name ${name.number} (${soulName.percent}%).`,
    ),
    domainInsight(
      "relationships",
      "Relationships",
      clampScore(soulName.percent - (softPairBand(soul.root, name.root) === "friction" ? 8 : 0)),
      `${soul.number} vs ${name.number}`,
      young
        ? `Balance time alone with one clear message to family. Independence is useful; silence is not the whole plan.`
        : `Balance independence with one honest sentence. The inner wish and the outer manner can both be true in the same week.`,
      `From Soul ${soul.number} vs Name ${name.number} (${soulName.percent}%).`,
    ),
  ];

  const strategy = assertSafeCopy(
    `Use ${trait(birth.number).toLowerCase()} as the bridge: ${plainTrait(soul.number)} inside, ${plainTrait(name.number)} outside.`,
    "align.strategy",
  );
  const strategyWhy = assertSafeCopy(
    `Soul ${soul.number} wants ${plainTrait(soul.number)}. Birth ${birth.number} gives ${plainTrait(birth.number)}. Name ${name.number} favours ${plainTrait(name.number)}. Therefore: practise the middle number until the outer style serves the inner wish.`,
    "align.strategyWhy",
  );

  const headline = assertSafeCopy(
    `${flow}: ${strategy}`,
    "align.headline",
  );

  const doMore = assertSafeList(
    [
      plainJob(soul.number),
      plainJob(birth.number),
      plainJob(name.number),
      `Name one piece of ${trait(birth.number).toLowerCase()} that connects what you want with how you show up.`,
    ],
    "align.doMore",
  );

  const watchFor = assertSafeList(
    [
      plainWatch(soul.number),
      plainWatch(birth.number),
      plainWatch(name.number),
      `Using Name ${name.number} (${plainTrait(name.number)}) to hide Soul ${soul.number}.`,
    ],
    "align.watchFor",
  );

  return {
    soul,
    birth,
    name,
    destiny,
    personality,
    fortuna,
    flowLabel: flow,
    headline,
    pairs,
    overallLabel: assertSafeCopy(overallLabel(internal, external), "align.overall"),
    strength,
    tension,
    bridge,
    domains,
    strategy,
    strategyWhy,
    doMore,
    watchFor,
  };
}

export function alignmentPdfLines(reading: SoulBirthNameAlignment): string[] {
  const fortunaNote =
    reading.fortuna.number === 0
      ? "Fortuna 0 — Destiny and Birth match on this date."
      : `Fortuna ${reading.fortuna.number} (Destiny ${reading.destiny.number} minus Birth ${reading.birth.number}).`;
  return [
    reading.headline,
    fortunaNote,
    reading.overallLabel,
    ...reading.pairs.map(
      (p) =>
        `${p.from.number} → ${p.to.number} ${p.percent}% (${p.label}). ${p.interpretation}`,
    ),
    `Strength ${reading.strength.pair}: ${reading.strength.body}`,
    `Tension ${reading.tension.pair}: ${reading.tension.body}`,
    reading.bridge.body,
    ...reading.domains.map(
      (d) => `${d.label} ${d.score}% (${d.primaryInteraction}). ${d.why} ${d.insight}`,
    ),
    `Strategy: ${reading.strategy}`,
    reading.strategyWhy,
    ...reading.doMore.map((x) => `Do more: ${x}`),
    ...reading.watchFor.map((x) => `Watch: ${x}`),
  ];
}
