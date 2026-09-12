/**
 * Core Number Journey: Soul → Birth → Destiny → Name → Personality → Bridge.
 * Interaction story, not six equal blurbs.
 */

import { architectureKind, makeEdge, type HarmonyEdge } from "./harmony";
import { formatCompoundRoot } from "@/lib/numerology/chaldeanName";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { planetPairForDigit } from "@/lib/numerology/planets";
import { assertSafeCopy } from "@/lib/numerology/safety";

export type JourneyLayer = {
  id: string;
  role: string;
  question: string;
  digit: number;
  display: string;
  body: string;
};

export type BalanceRow = {
  balanced: string;
  overloaded: string;
};

export type NumberJourneyReading = {
  layers: JourneyLayer[];
  bridge: number;
  bridgeCalc: string;
  bridgeTitle: string;
  bridgeBody: string;
  pattern: string;
  challenge: string;
  tryThis: string;
  story: string;
  remember: string;
  rememberAction: string;
  dominantDigit: number;
  balanceTitle: string;
  balance: BalanceRow[];
  reset: string;
  edges: HarmonyEdge[];
  flowCounts: { supporting: number; tension: number; friction: number };
};

const WANT: Record<number, string> = {
  1: "independence and to decide for yourself",
  2: "partnership and to be in tune with someone",
  3: "to express ideas and be understood",
  4: "order and a plan you can keep",
  5: "freedom and a change of scene",
  6: "to care and to be needed",
  7: "to understand deeply before you move",
  8: "results you can measure",
  9: "to finish a chapter and help a wider group",
};

const ACT: Record<number, string> = {
  1: "start and go first",
  2: "wait, pair, and feel the room",
  3: "talk, explore, and share",
  4: "build systems and stick to them",
  5: "switch lanes and try the new thing",
  6: "take responsibility for people and place",
  7: "step back, study, and refine",
  8: "push for a numbered outcome",
  9: "close loops and hand things on",
};

const BALANCE: Record<number, BalanceRow[]> = {
  1: [
    { balanced: "Clear starts", overloaded: "Starts that never get a second day" },
    { balanced: "Owns a decision", overloaded: "Takes over a room that needed a team" },
  ],
  2: [
    { balanced: "Real partnership", overloaded: "Waits so long that nothing is said" },
    { balanced: "Reads the room", overloaded: "Disappears into other people’s plans" },
  ],
  3: [
    { balanced: "Expressive", overloaded: "Talks instead of executing" },
    { balanced: "Creative", overloaded: "Starts too many things" },
    { balanced: "Influential", overloaded: "Overexplains" },
  ],
  4: [
    { balanced: "Steady builder", overloaded: "Plans so long the week never starts" },
    { balanced: "Reliable", overloaded: "Rigid when a shortcut would help" },
  ],
  5: [
    { balanced: "Adaptable", overloaded: "Changes course every day" },
    { balanced: "Curious", overloaded: "Cannot sit with one skill long enough" },
  ],
  6: [
    { balanced: "Keeps promises", overloaded: "Says yes until there is no rest" },
    { balanced: "Cares well", overloaded: "Rescues instead of asking" },
  ],
  7: [
    { balanced: "Deep and precise", overloaded: "Preparation that never becomes a test" },
    { balanced: "Quiet clarity", overloaded: "People think you do not care" },
  ],
  8: [
    { balanced: "Gets results", overloaded: "Pushes with no pause" },
    { balanced: "Stewards money and plans", overloaded: "Lets the numbers own the week" },
  ],
  9: [
    { balanced: "Finishes chapters", overloaded: "Holds an ending that is already done" },
    { balanced: "Helps a wider group", overloaded: "Collects causes instead of closing one" },
  ],
};

function want(n: number): string {
  return WANT[reduceToSingleDigit(n)] ?? plainTrait(n);
}

function act(n: number): string {
  return ACT[reduceToSingleDigit(n)] ?? plainTrait(n);
}

function planetLine(n: number): string {
  const pair = planetPairForDigit(n);
  return pair.same
    ? pair.vedic.name
    : `${pair.vedic.name} / ${pair.western.name}`;
}

function dominantDigit(seats: number[]): number {
  const counts = new Map<number, number>();
  for (const n of seats) {
    const d = reduceToSingleDigit(n);
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  let best = seats[0] ?? 3;
  let max = 0;
  for (const [d, c] of counts) {
    if (c > max) {
      max = c;
      best = d;
    }
  }
  return best;
}

export function buildNumberJourney(opts: {
  bn: number;
  dn: number;
  soul: number;
  nameRoot: number;
  nameCompound?: number;
  personality: number;
  personalityCompound?: number;
}): NumberJourneyReading {
  const bn = reduceToSingleDigit(opts.bn);
  const dn = reduceToSingleDigit(opts.dn);
  const soul = reduceToSingleDigit(opts.soul);
  const nameRoot = reduceToSingleDigit(opts.nameRoot);
  const personality = reduceToSingleDigit(opts.personality);
  const nameDisplay = formatCompoundRoot(opts.nameCompound ?? nameRoot, nameRoot);
  const persDisplay = formatCompoundRoot(
    opts.personalityCompound ?? personality,
    personality,
  );
  const bridge = dn - bn;
  const lead = dominantDigit([soul, bn, dn, nameRoot]);

  const layers: JourneyLayer[] = [
    {
      id: "soul",
      role: "Inner drive",
      question: "What do I really want?",
      digit: soul,
      display: String(soul),
      body: assertSafeCopy(
        `Soul ${soul} (${planetLine(soul)}): you want ${want(soul)}, even when nobody is scoring you.`,
        "journey.soul",
      ),
    },
    {
      id: "bn",
      role: "Natural response",
      question: "How do I instinctively behave?",
      digit: bn,
      display: String(bn),
      body: assertSafeCopy(
        `Birth Number ${bn} (${planetLine(bn)}): you naturally ${act(bn)}.`,
        "journey.bn",
      ),
    },
    {
      id: "dn",
      role: "Life direction",
      question: "Where am I being pulled?",
      digit: dn,
      display: String(dn),
      body: assertSafeCopy(
        `Destiny Number ${dn} (${planetLine(dn)}): the longer path keeps asking you to ${act(dn)}.`,
        "journey.dn",
      ),
    },
    {
      id: "name",
      role: "Outer expression",
      question: "How does that energy show up?",
      digit: nameRoot,
      display: nameDisplay,
      body: assertSafeCopy(
        `Name ${nameDisplay} (${planetLine(nameRoot)}): people often meet ${plainTrait(nameRoot)} first.`,
        "journey.name",
      ),
    },
    {
      id: "personality",
      role: "What others see",
      question: "What is the first impression?",
      digit: personality,
      display: persDisplay,
      body: assertSafeCopy(
        `Personality ${persDisplay} (consonants): the surface others notice is ${plainTrait(personality)}.`,
        "journey.pers",
      ),
    },
  ];

  const sameDriver = bn === dn;
  const nameDiffers = nameRoot !== bn && nameRoot !== dn;
  const soulDiffers = soul !== bn;

  let pattern: string;
  if (sameDriver && nameDiffers) {
    pattern = assertSafeCopy(
      `You want ${want(soul)}. You naturally ${act(bn)}, and life direction repeats that ${bn} pattern. Name ${nameDisplay} adds ${plainTrait(nameRoot)} before the idea goes public.`,
      "journey.pattern.namediff",
    );
  } else if (sameDriver && !nameDiffers) {
    pattern = assertSafeCopy(
      `Inner drive, natural response, and outer name sit on similar tones. The pattern repeats: ${act(bn)}. The work is using it with discipline, not finding a new direction.`,
      "journey.pattern.same",
    );
  } else {
    pattern = assertSafeCopy(
      `You want ${want(soul)}. You naturally ${act(bn)}. Life direction pulls you to ${act(dn)}. Name ${nameDisplay} is how that mix shows.`,
      "journey.pattern.mix",
    );
  }

  const challenge =
    nameRoot === 7 && (bn === 3 || dn === 3 || soul === 3)
      ? assertSafeCopy(
          "Don’t confuse preparation with progress. The analytical side can keep refining an idea after it is already good enough to test.",
          "journey.ch.37",
        )
      : soulDiffers && soul === 1 && (bn === 3 || dn === 3)
        ? assertSafeCopy(
            "You may want independence while the day-to-day path is people-facing. The stretch is being visible without giving the whole self away.",
            "journey.ch.13",
          )
        : nameDiffers
          ? assertSafeCopy(
              `Don’t let the outer ${plainTrait(nameRoot)} stall the natural ${plainTrait(bn)}. They are meant to take turns, not cancel each other.`,
              "journey.ch.diff",
            )
          : assertSafeCopy(
              "The challenge is not becoming someone else. It is stopping the same strength from running the whole week.",
              "journey.ch.same",
            );

  const tryThis =
    nameRoot === 7
      ? assertSafeCopy(
          "Set a research deadline. After that point, move the idea into a real-world test — a page, a demo, or one conversation.",
          "journey.try.7",
        )
      : bn === 3 || dn === 3
        ? assertSafeCopy(
            "Keep one primary outcome visible. Capture new ideas on a Later list. Finish the current one before opening another.",
            "journey.try.3",
          )
        : assertSafeCopy(
            `Do one small act that uses ${plainTrait(bn)}, then one that uses ${plainTrait(nameRoot)}. Same day, two slots.`,
            "journey.try.mix",
          );

  const bridgeTitle =
    bridge === 0
      ? "Bridge 0 — no major numerical gap"
      : `Bridge ${bridge} (Destiny ${dn} − Birth ${bn})`;
  const bridgeBody =
    bridge === 0
      ? assertSafeCopy(
          "Your natural driver and life-direction number are aligned. The challenge is less about changing direction and more about using your strengths with discipline. A double match can repeat the same behavioural pattern more strongly.",
          "journey.bridge.0",
        )
      : assertSafeCopy(
          `The gap between Birth ${bn} and Destiny ${dn} is ${Math.abs(bridge)}. When you feel stuck, use ${plainTrait(reduceToSingleDigit(Math.abs(bridge)))} as the adjustment — a behaviour, not a new identity.`,
          "journey.bridge.n",
        );

  const story = assertSafeCopy(
    `You naturally move by ${act(bn)}. Destiny ${dn} ${
      sameDriver ? "reinforces that tendency" : `asks you also to ${act(dn)}`
    }. Name ${nameDisplay} adds ${plainTrait(nameRoot)}. Soul ${soul} is the private want: ${want(soul)}. ${
      nameDiffers
        ? "You may appear one way while taking longer inside than people realize. Growth is rarely becoming more of your loudest trait — it is learning when analysis or talk has done enough and action should begin."
        : "Growth is building a system so the repeating strength works, and its excess does not run the week."
    }`,
    "journey.story",
  );

  const edges: HarmonyEdge[] = [
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
      right: soul,
      kind: architectureKind(bn, soul),
    }),
    makeEdge({
      id: "dn-nn",
      leftLabel: "Destiny Number",
      left: dn,
      rightLabel: "Name Number",
      right: nameRoot,
      kind: architectureKind(dn, nameRoot),
    }),
    makeEdge({
      id: "sn-nn",
      leftLabel: "Soul Number",
      left: soul,
      rightLabel: "Name Number",
      right: nameRoot,
      kind: architectureKind(soul, nameRoot),
    }),
  ];
  const flowCounts = {
    supporting: edges.filter((e) => e.kind === "supportive").length,
    tension: edges.filter((e) => e.kind === "tension").length,
    friction: edges.filter((e) => e.kind === "friction").length,
  };

  return {
    layers,
    bridge,
    bridgeCalc: `Destiny ${dn} − Birth ${bn} = ${bridge}`,
    bridgeTitle,
    bridgeBody,
    pattern,
    challenge,
    tryThis,
    story,
    remember: assertSafeCopy(
      "Don’t try to become a different person. Build a system that lets your natural strengths work without their excesses controlling you.",
      "journey.remember",
    ),
    rememberAction: assertSafeCopy(
      "One priority. One deadline. One visible outcome.",
      "journey.remember.act",
    ),
    dominantDigit: lead,
    balanceTitle: `Your ${lead} energy`,
    balance: BALANCE[lead] ?? BALANCE[3]!,
    reset: assertSafeCopy(
      lead === 3
        ? "Pick one unfinished task and complete it before starting something new."
        : lead === 7
          ? "Share one finished-enough thought with a real person this week."
          : `Do the small version of ${plainTrait(lead)} once, then stop.`,
      "journey.reset",
    ),
    edges,
    flowCounts,
  };
}
