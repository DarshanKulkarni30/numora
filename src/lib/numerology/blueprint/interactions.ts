import { pairTone, type CompatTone } from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainMeet, plainStart, plainTrait } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";
import { vedicPairTone } from "@/lib/numerology/vedicCompatibility";
import { flowVerbFor, flowVerbs } from "./yearInterpreter";

export type InteractionEase =
  | "Very Easy"
  | "Easy"
  | "Moderate"
  | "Productive tension";

export type PatternNode = {
  id: "soul" | "bn" | "dn" | "name";
  seat: string;
  digit: number;
  verb: string;
  role: string;
  hint: string;
};

export type NumberInteraction = {
  id: string;
  pair: string;
  leftLabel: string;
  left: number;
  rightLabel: string;
  right: number;
  ease: InteractionEase;
  easeLabel: string;
  headline: string;
  meaning: string;
};

export type InteractionMap = {
  items: NumberInteraction[];
  nodes: PatternNode[];
  energyFlow: string;
  naturalFlow: string;
  caption: string;
};

export const EASE_LABEL: Record<InteractionEase, string> = {
  "Very Easy": "Smooth",
  Easy: "Works together",
  Moderate: "Takes turns",
  "Productive tension": "Useful stretch",
};

function easeFrom(tone: CompatTone, same: boolean): InteractionEase {
  if (same) return "Very Easy";
  if (tone === "Amazing") return "Very Easy";
  if (tone === "Favourable") return "Easy";
  if (tone === "Neutral") return "Moderate";
  return "Productive tension";
}

function practice(ease: InteractionEase, lead: string, other: string): string {
  if (ease === "Very Easy" || ease === "Easy") {
    return `Lead with ${lead}, then let ${other} set the weekly aim.`;
  }
  if (ease === "Moderate") {
    return `Do not blend them into one mood. Give ${lead} one block, and ${other} a later block.`;
  }
  return `Say the clash out loud, then pick one for this week: ${lead}, or ${other}.`;
}

function pairCopy(opts: {
  id: string;
  left: number;
  right: number;
  ease: InteractionEase;
}): { headline: string; meaning: string } {
  const { id, left, right, ease } = opts;
  const label = EASE_LABEL[ease];

  if (id === "bn-dn") {
    return {
      headline: "How you start vs where life keeps pointing",
      meaning: assertSafeCopy(
        `Birth Number ${left} is how you instinctively start: ${plainTrait(left)}. Destiny ${right} is the longer pull: ${plainTrait(right)}. “${label}” means those two ${
          ease === "Moderate"
            ? "share an ordinary week — it is not a personality type."
            : ease === "Productive tension"
              ? "want different things, and that can still be useful."
              : "usually pull the same way."
        } ${practice(ease, plainStart(left), plainTrait(right))}`,
        "blueprint.ix.bn-dn",
      ),
    };
  }

  if (id === "bn-name") {
    return {
      headline: "How you start vs how people meet you",
      meaning: assertSafeCopy(
        `Birth Number ${left} is the private operating style (${plainTrait(left)}). Name ${right} is the public spelling — people meet ${plainMeet(right)}. “${label}” is about whether that public face supports how you actually start, not a grade. ${practice(ease, plainStart(left), `being met as ${plainMeet(right)}`)}`,
        "blueprint.ix.bn-name",
      ),
    };
  }

  if (id === "dn-name") {
    return {
      headline: "Life direction vs how people meet you",
      meaning: assertSafeCopy(
        `Destiny ${left} is the long walk (${plainTrait(left)}). Name ${right} is the door people use (${plainTrait(right)}). “${label}” means ${
          ease === "Productive tension"
            ? "the face people meet can pull against the longer walk — do not let the name replace Destiny."
            : ease === "Moderate"
              ? "the public face and the long walk take turns. Use the name to open the door; keep Destiny as the weekly aim."
              : "the face people meet can serve the longer walk."
        } ${practice(ease, plainTrait(left), `showing up as ${plainMeet(right)}`)}`,
        "blueprint.ix.dn-name",
      ),
    };
  }

  return {
    headline: "What you want inside vs how you actually start",
    meaning: assertSafeCopy(
      `Soul ${left} is the inner want (${plainTrait(left)}). People cannot see that number. Birth Number ${right} is the start-of-day habit they do see (${plainTrait(right)}). “${label}” means ${
        ease === "Moderate"
          ? "inner want and start-of-day habit take turns — not a type called Expression."
          : ease === "Productive tension"
            ? "the inner want and the daily start pull differently. Give each a named slot."
            : "the inner want and the daily start usually agree."
      } ${practice(ease, plainTrait(left), plainStart(right))}`,
      "blueprint.ix.soul-bn",
    ),
  };
}

export function buildInteractionMap(opts: {
  bn: number;
  dn: number;
  nameRoot: number;
  soul: number;
}): InteractionMap {
  const bn = reduceToSingleDigit(opts.bn);
  const dn = reduceToSingleDigit(opts.dn);
  const name = reduceToSingleDigit(opts.nameRoot);
  const soul = reduceToSingleDigit(opts.soul);

  const pairs: {
    id: string;
    pair: string;
    leftLabel: string;
    rightLabel: string;
    a: number;
    b: number;
    tone: CompatTone;
  }[] = [
    {
      id: "bn-dn",
      pair: "BN ↔ DN",
      leftLabel: "Birth",
      rightLabel: "Destiny",
      a: bn,
      b: dn,
      tone: vedicPairTone(bn, dn),
    },
    {
      id: "bn-name",
      pair: "BN ↔ Name",
      leftLabel: "Birth",
      rightLabel: "Name",
      a: bn,
      b: name,
      tone: vedicPairTone(bn, name),
    },
    {
      id: "dn-name",
      pair: "DN ↔ Name",
      leftLabel: "Destiny",
      rightLabel: "Name",
      a: dn,
      b: name,
      tone: vedicPairTone(dn, name),
    },
    {
      id: "soul-bn",
      pair: "Soul ↔ BN",
      leftLabel: "Soul",
      rightLabel: "Birth",
      a: soul,
      b: bn,
      tone: pairTone(soul, bn),
    },
  ];

  const items: NumberInteraction[] = pairs.map((row) => {
    const ease = easeFrom(row.tone, row.a === row.b);
    const copy = pairCopy({ id: row.id, left: row.a, right: row.b, ease });
    return {
      id: row.id,
      pair: row.pair,
      leftLabel: row.leftLabel,
      left: row.a,
      rightLabel: row.rightLabel,
      right: row.b,
      ease,
      easeLabel: EASE_LABEL[ease],
      headline: copy.headline,
      meaning: copy.meaning,
    };
  });

  const bnDn = items[0]!;
  const dnName = items[2]!;
  const nodes: PatternNode[] = [
    {
      id: "soul",
      seat: "Soul",
      digit: soul,
      verb: flowVerbFor(soul),
      role: "What you want inside",
      hint: plainTrait(soul),
    },
    {
      id: "bn",
      seat: "Birth Number",
      digit: bn,
      verb: flowVerbFor(bn),
      role: "How you start",
      hint: plainTrait(bn),
    },
    {
      id: "dn",
      seat: "Destiny Number",
      digit: dn,
      verb: flowVerbFor(dn),
      role: "Where life keeps pointing",
      hint: plainTrait(dn),
    },
    {
      id: "name",
      seat: "Name Number",
      digit: name,
      verb: flowVerbFor(name),
      role: "How people meet you",
      hint: plainTrait(name),
    },
  ];

  return {
    items,
    nodes,
    energyFlow: flowVerbs(bn, dn, name),
    naturalFlow: assertSafeCopy(
      `Birth ${bn} (${flowVerbFor(bn)}) → Destiny ${dn} (${flowVerbFor(dn)}): ${bnDn.easeLabel.toLowerCase()}. Name ${name} (${flowVerbFor(name)}) is how people first meet you — ${plainTrait(name)} — not a rewrite of Birth or Destiny.`,
      "blueprint.ix.flow",
    ),
    caption: assertSafeCopy(
      `The path is ${flowVerbs(bn, dn, name)}. Destiny → Name is ${dnName.easeLabel.toLowerCase()}.`,
      "blueprint.ix.caption",
    ),
  };
}
