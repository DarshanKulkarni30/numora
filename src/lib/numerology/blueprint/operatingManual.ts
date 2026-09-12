import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";

export type ManualCard = {
  title: string;
  body: string;
};

export type OperatingManual = {
  strengths: ManualCard[];
  friction: ManualCard[];
  playbook: string[];
};

const STRENGTH_TITLE: Record<number, string> = {
  1: "STARTER",
  2: "PARTNER",
  3: "EXPLAINER",
  4: "BUILDER",
  5: "MOVER",
  6: "KEEPER",
  7: "DEEP DIVER",
  8: "STEWARD",
  9: "CLOSER",
};

export function buildOperatingManual(opts: {
  bn: number;
  dn: number;
  soul: number;
  nameRoot: number;
}): OperatingManual {
  const digits = [
    reduceToSingleDigit(opts.bn),
    reduceToSingleDigit(opts.dn),
    reduceToSingleDigit(opts.nameRoot),
    reduceToSingleDigit(opts.soul),
  ];
  const unique: number[] = [];
  for (const n of digits) {
    if (!unique.includes(n)) unique.push(n);
  }

  const strengths = unique.slice(0, 4).map((n) => ({
    title: STRENGTH_TITLE[n] ?? `TONE ${n}`,
    body: assertSafeCopy(
      `${plainTrait(n).replace(/^./, (c) => c.toUpperCase())}.`,
      `blueprint.manual.str.${n}`,
    ),
  }));

  const frictionDigits = unique.filter((n) => [3, 5, 7, 1].includes(n)).slice(0, 3);
  const frictionSource = frictionDigits.length ? frictionDigits : unique.slice(0, 2);
  const friction = frictionSource.map((n) => ({
    title: n === 3 || n === 5 ? "SCATTERING" : n === 7 ? "OVER-ANALYSIS" : "ROUTINE RESISTANCE",
    body: assertSafeCopy(plainWatch(n), `blueprint.manual.fr.${n}`),
  }));

  const playbook = assertSafeList(
    [
      "Limit active priorities to 2.",
      "Review them once a week on a fixed day.",
      "Any new idea goes on a Later list for 7 days before it can become an active project.",
      `This week: ${plainJob(unique[0] ?? 3)}.`,
    ],
    "blueprint.manual.play",
  );

  return { strengths, friction, playbook };
}
