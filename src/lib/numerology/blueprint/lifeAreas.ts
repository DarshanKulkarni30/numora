import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainJob, plainWatch } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { LoShuResult } from "@/lib/numerology/types";

export type LifeAreaId =
  | "communication"
  | "learning"
  | "creativity"
  | "leadership"
  | "relationships"
  | "patience"
  | "routine"
  | "focus"
  | "flexibility";

export type LifeAreaScore = {
  id: LifeAreaId;
  label: string;
  count: number;
  max: number;
  advantage: string;
  watch: string;
  adjustment: string;
};

const AREA_DIGITS: { id: LifeAreaId; label: string; digits: number[] }[] = [
  { id: "communication", label: "Communication", digits: [3, 5, 1] },
  { id: "learning", label: "Learning", digits: [3, 7, 4] },
  { id: "creativity", label: "Creativity", digits: [3, 5, 9] },
  { id: "leadership", label: "Leadership", digits: [1, 8, 4] },
  { id: "relationships", label: "Relationships", digits: [2, 6, 3] },
  { id: "patience", label: "Patience", digits: [2, 4, 7] },
  { id: "routine", label: "Routine", digits: [4, 8, 6] },
  { id: "focus", label: "Deep focus", digits: [7, 4, 8] },
  { id: "flexibility", label: "Flexibility", digits: [5, 3, 1] },
];

export function buildLifeAreaScores(opts: {
  bn: number;
  dn: number;
  soul: number;
  nameRoot: number;
  personalYear: number;
  loShu?: LoShuResult | null;
}): LifeAreaScore[] {
  const seats = [
    reduceToSingleDigit(opts.bn),
    reduceToSingleDigit(opts.dn),
    reduceToSingleDigit(opts.soul),
    reduceToSingleDigit(opts.nameRoot),
    reduceToSingleDigit(opts.personalYear),
    ...(opts.loShu?.present_numbers ?? []).map((n) => reduceToSingleDigit(n)),
  ];
  const maxPossible = 5 + (opts.loShu?.present_numbers?.length ? 1 : 0);

  return AREA_DIGITS.map((area) => {
    const count = seats.filter((n) => area.digits.includes(n)).length;
    const lead = area.digits[0] ?? 3;
    return {
      id: area.id,
      label: area.label,
      count,
      max: maxPossible,
      advantage: assertSafeCopy(
        `This area is fed by digits ${area.digits.join(", ")} in your seats. ${plainJob(lead)}.`,
        `blueprint.area.${area.id}.adv`,
      ),
      watch: assertSafeCopy(plainWatch(lead), `blueprint.area.${area.id}.watch`),
      adjustment: assertSafeCopy(
        `Use a one-in, one-out rule here: one ${area.label.toLowerCase()} action, then stop.`,
        `blueprint.area.${area.id}.adj`,
      ),
    };
  });
}
