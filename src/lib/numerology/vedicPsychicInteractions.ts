/**
 * Psychic×Psychic interaction phrases — NumoraWisdom-rewritten reflective one-liners.
 * Complements AstroSage-style tiers; does not replace them.
 */

import { reduceNumber } from "./reduce";

type Tone = "supportive" | "mixed" | "stretch";

const GRID: Record<number, Record<number, { tone: Tone; phrase: string }>> = {
  1: {
    1: { tone: "mixed", phrase: "Two strong wills—friendship needs clear roles." },
    2: { tone: "mixed", phrase: "Helpful yet uneven; they may challenge habits while staying warm." },
    3: { tone: "supportive", phrase: "Friendly support with practical help." },
    4: { tone: "stretch", phrase: "Often friction—pace and plans may collide." },
    5: { tone: "mixed", phrase: "Cordial independence; space keeps goodwill." },
    6: { tone: "mixed", phrase: "Warm company that can feel costly in time or energy." },
    7: { tone: "supportive", phrase: "Lucky-feeling ally with thoughtful timing." },
    8: { tone: "stretch", phrase: "Oppositional edge—structure vs. spotlight." },
    9: { tone: "supportive", phrase: "Steady friendliness and backup energy." },
  },
  2: {
    1: { tone: "mixed", phrase: "Critical tone with useful help if trust holds." },
    2: { tone: "supportive", phrase: "Cooperative well-wishing between similar rhythms." },
    3: { tone: "mixed", phrase: "Neutral advisor energy—good counsel, light heat." },
    4: { tone: "mixed", phrase: "Helpful but sometimes delaying or irritating." },
    5: { tone: "stretch", phrase: "Easily tangled expectations—keep agreements short." },
    6: { tone: "supportive", phrase: "Mutually useful warmth and care." },
    7: { tone: "stretch", phrase: "Mirror tension—critique beside genuine guidance." },
    8: { tone: "supportive", phrase: "Caring companion energy with steady service." },
    9: { tone: "supportive", phrase: "Protective helper tone when aligned." },
  },
  3: {
    1: { tone: "supportive", phrase: "Helpful, supportive friendship with lift." },
    2: { tone: "mixed", phrase: "Not harsh, yet may drain focus if unchecked." },
    3: { tone: "supportive", phrase: "Calming mutual satisfaction and shared growth." },
    4: { tone: "stretch", phrase: "Strong opposition—little shared benefit." },
    5: { tone: "stretch", phrase: "Busy friction that can teach trade skills if bounded." },
    6: { tone: "supportive", phrase: "Attractive, mutually beneficial warmth." },
    7: { tone: "mixed", phrase: "Independent and sometimes neglectful neutrality." },
    8: { tone: "mixed", phrase: "Limited help unless roles are clear (mentor/kin)." },
    9: { tone: "supportive", phrase: "Full-support partnership energy." },
  },
  4: {
    1: { tone: "mixed", phrase: "Critical spark that can still attract and benefit." },
    2: { tone: "mixed", phrase: "Uneven personally; sometimes useful in work lanes." },
    3: { tone: "mixed", phrase: "Sympathetic advisor tone without deep closeness." },
    4: { tone: "supportive", phrase: "Ready support between similar edge-builders." },
    5: { tone: "supportive", phrase: "Close, playful helper bond." },
    6: { tone: "mixed", phrase: "Harmonious distance—little gain or loss socially." },
    7: { tone: "stretch", phrase: "Personal chill; work lanes may still function." },
    8: { tone: "supportive", phrase: "Attractive support—watch shared labels and spaces." },
    9: { tone: "stretch", phrase: "Argumentative stretch that teaches practicality." },
  },
  5: {
    1: { tone: "supportive", phrase: "Socially fluid friendship with political ease." },
    2: { tone: "mixed", phrase: "Short-span spark—fun, lucky, not always lasting." },
    3: { tone: "mixed", phrase: "Critical enjoyment that can open growth doors." },
    4: { tone: "mixed", phrase: "Ordinary, sometimes neglectful friendship." },
    5: { tone: "supportive", phrase: "Closest peer rhythm—shared quickness." },
    6: { tone: "supportive", phrase: "Quieting friend who softens rough edges." },
    7: { tone: "mixed", phrase: "Neutral coexistence—low drama, low glue." },
    8: { tone: "mixed", phrase: "Beneficial yet cool—help without warmth." },
    9: { tone: "mixed", phrase: "Friendly critique that can spur growth." },
  },
  6: {
    1: { tone: "mixed", phrase: "Good influence that may ask for more resources." },
    2: { tone: "mixed", phrase: "Friendly without deep mutual benefit." },
    3: { tone: "supportive", phrase: "Security-giving helper friendship." },
    4: { tone: "stretch", phrase: "Low harmony—different care languages." },
    5: { tone: "supportive", phrase: "Well-wishing supportive bond." },
    6: { tone: "supportive", phrase: "Quiet cooperative friendship." },
    7: { tone: "mixed", phrase: "Inspiring benefit without instant closeness." },
    8: { tone: "mixed", phrase: "Ordinary acquaintance tone—polite distance." },
    9: { tone: "supportive", phrase: "Hard-working care with occasional odd edges." },
  },
  7: {
    1: { tone: "supportive", phrase: "Strong ally in culture, ideas, and careful business." },
    2: { tone: "stretch", phrase: "Opposing heat that still forces growth." },
    3: { tone: "supportive", phrase: "Strong supporter for learning arcs." },
    4: { tone: "stretch", phrase: "Obstacles from strong-headed clash." },
    5: { tone: "mixed", phrase: "Strange ordinary friendship—keep it light." },
    6: { tone: "supportive", phrase: "Lucky-feeling friendly benefit." },
    7: { tone: "stretch", phrase: "Argumentative twin-flame friction." },
    8: { tone: "mixed", phrase: "Financially useful; friendship stays cool." },
    9: { tone: "mixed", phrase: "Inspiring yet sometimes dissatisfied bond." },
  },
  8: {
    1: { tone: "stretch", phrase: "Obstacles mixed with odd luck—pace carefully." },
    2: { tone: "mixed", phrase: "Friendly without strong practical help." },
    3: { tone: "mixed", phrase: "Advisor/teacher tone more than peer warmth." },
    4: { tone: "supportive", phrase: "Quieting, sympathetic fulfillment." },
    5: { tone: "mixed", phrase: "Public-lane friendliness more than private glue." },
    6: { tone: "supportive", phrase: "Caring, inspiring, attractive friendship." },
    7: { tone: "supportive", phrase: "Comfortable teacher–friend benefit." },
    8: { tone: "mixed", phrase: "Strength-sharing cooperation with critique." },
    9: { tone: "mixed", phrase: "Growth advice—watch grudges if opposed." },
  },
  9: {
    1: { tone: "supportive", phrase: "Long-lasting help that buffers criticism." },
    2: { tone: "supportive", phrase: "Mutual benefit when both cooperate." },
    3: { tone: "supportive", phrase: "Centering friend who lends inner strength." },
    4: { tone: "stretch", phrase: "Strong opponent except in shared social causes." },
    5: { tone: "mixed", phrase: "Helpful yet cooler than expected." },
    6: { tone: "supportive", phrase: "Excellent ally with protective loyalty." },
    7: { tone: "mixed", phrase: "Helpful luck that can blur your own center." },
    8: { tone: "stretch", phrase: "Oppositional stretch—better as learning roles." },
    9: { tone: "mixed", phrase: "Friendly yet argumentative twin drive." },
  },
};

function digit(n: number | string): number {
  return reduceNumber(Number(n), []);
}

export function psychicInteraction(
  self: number | string,
  other: number | string,
): { tone: Tone; phrase: string } {
  const a = digit(self);
  const b = digit(other);
  return (
    GRID[a]?.[b] ?? {
      tone: "mixed" as const,
      phrase: "Situational tone—watch consent, pace, and clear agreements.",
    }
  );
}

export function interactionPhrase(
  self: number | string,
  other: number | string,
): string {
  return psychicInteraction(self, other).phrase;
}

export const PSYCHIC_INTERACTION_NOTE =
  "Psychic interaction lines are reflective Unit System–style notes for day-to-day temperament pairing. They sit beside the Amazing / Favourable / Neutral / Challenging tiers—not instead of them.";
