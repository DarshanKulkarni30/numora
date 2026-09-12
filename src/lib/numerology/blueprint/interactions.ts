import { pairTone, type CompatTone } from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";
import { vedicPairTone } from "@/lib/numerology/vedicCompatibility";
import { flowVerbs } from "./yearInterpreter";

export type InteractionEase =
  | "Very Easy"
  | "Easy"
  | "Moderate"
  | "Productive tension";

export type NumberInteraction = {
  id: string;
  pair: string;
  ease: InteractionEase;
  meaning: string;
};

export type InteractionMap = {
  items: NumberInteraction[];
  energyFlow: string;
  naturalFlow: string;
};

function easeFrom(tone: CompatTone, same: boolean): InteractionEase {
  if (same) return "Very Easy";
  if (tone === "Amazing") return "Very Easy";
  if (tone === "Favourable") return "Easy";
  if (tone === "Neutral") return "Moderate";
  return "Productive tension";
}

function meaning(a: number, b: number, ease: InteractionEase): string {
  if (ease === "Very Easy" || ease === "Easy") {
    return `Natural direction: ${plainTrait(a)} sits with ${plainTrait(b)}.`;
  }
  if (ease === "Moderate") {
    return `Expression and depth take turns: ${plainTrait(a)} with ${plainTrait(b)}.`;
  }
  return `Useful stretch: ${plainTrait(a)} asks for patience beside ${plainTrait(b)}.`;
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

  const pairs: { id: string; pair: string; a: number; b: number; tone: CompatTone }[] =
    [
      {
        id: "bn-dn",
        pair: "BN ↔ DN",
        a: bn,
        b: dn,
        tone: vedicPairTone(bn, dn),
      },
      {
        id: "bn-name",
        pair: "BN ↔ Name",
        a: bn,
        b: name,
        tone: vedicPairTone(bn, name),
      },
      {
        id: "dn-name",
        pair: "DN ↔ Name",
        a: dn,
        b: name,
        tone: vedicPairTone(dn, name),
      },
      {
        id: "soul-bn",
        pair: "Soul ↔ BN",
        a: soul,
        b: bn,
        tone: pairTone(soul, bn),
      },
    ];

  const items: NumberInteraction[] = pairs.map((row) => {
    const ease = easeFrom(row.tone, row.a === row.b);
    return {
      id: row.id,
      pair: row.pair,
      ease,
      meaning: assertSafeCopy(meaning(row.a, row.b, ease), `blueprint.ix.${row.id}`),
    };
  });

  const bnDn = items[0]!;
  return {
    items,
    energyFlow: flowVerbs(bn, dn, name),
    naturalFlow: assertSafeCopy(
      `BN ${bn} → DN ${dn}: ${bnDn.ease.toLowerCase()}. Name ${name} adds the outer face.`,
      "blueprint.ix.flow",
    ),
  };
}
