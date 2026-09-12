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
        area.id === "communication"
          ? "You already have more than one number that supports explaining things out loud or in writing."
          : area.id === "learning"
            ? "Study and explanation show up more than once in this chart, so learning-by-teaching is available."
            : area.id === "creativity"
              ? "Idea-generation is well supplied. The work is choosing one idea."
              : area.id === "leadership"
                ? "Starting and stewardship digits are present. Lead a small defined piece, not a crowd."
                : area.id === "relationships"
                  ? "Partnership and care digits are in the mix. One real exchange beats a full social calendar."
                  : area.id === "patience"
                    ? "Waiting and sequencing are not your loudest seats. You can still practise them as a chosen constraint."
                    : area.id === "routine"
                      ? "Systems digits are quieter or mixed. A tiny repeating loop still protects the louder gifts."
                      : area.id === "focus"
                        ? "Depth seats exist beside faster ones. Protect a thinking slot so the expressive year has something true to say."
                        : "Change-digits are present. Use them for one planned shift, not five.",
        `blueprint.area.${area.id}.adv`,
      ),
      watch: assertSafeCopy(
        area.id === "communication"
          ? "Talking about the work can feel like finishing it. It is not, until something is sent."
          : area.id === "learning"
            ? "Collecting more material without using the last piece."
            : area.id === "creativity"
              ? "Opening a new idea whenever the current one gets hard."
              : area.id === "leadership"
                ? "Collecting roles instead of making one named decision."
                : area.id === "relationships"
                  ? "Filling the week with messages and events so the hard conversation never happens."
                  : area.id === "patience"
                    ? `${plainWatch(lead)} — especially saying yes before the last yes is done.`
                    : area.id === "routine"
                      ? "Dropping the small loop the week it feels boring."
                      : area.id === "focus"
                        ? "Protecting thinking time so well that nobody hears from you."
                        : "Changing the setup every time discomfort appears.",
        `blueprint.area.${area.id}.watch`,
      ),
      adjustment: assertSafeCopy(
        area.id === "communication"
          ? "One idea → one deliverable. Do not start the next explanation until the current one has a defined output."
          : area.id === "learning"
            ? "Before any new course, write ten lines on the last thing you learned and use it once."
            : area.id === "creativity"
              ? "Cap active creative threads at two. Park the rest for seven days."
              : area.id === "leadership"
                ? "Lead one decision this week with your name on it. Do not collect more titles."
                : area.id === "relationships"
                  ? "One uninterrupted conversation. No extra events as a substitute."
                  : area.id === "patience"
                    ? "Wait 24 hours before saying yes to a new request."
                    : area.id === "routine"
                      ? "Keep one repeating 20-minute block on the same weekday."
                      : area.id === "focus"
                        ? "Forty quiet minutes with notifications off, then answer the person who is waiting."
                        : "Change one small thing this week, not the whole setup.",
        `blueprint.area.${area.id}.adj`,
      ),
    };
  });
}
