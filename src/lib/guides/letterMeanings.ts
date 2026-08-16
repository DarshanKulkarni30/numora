/** A–Z letter meanings (Pythagorean value + Chaldean note). Original NumoraWisdom copy. */

import { UNIT_SYSTEM_NAME_MAP } from "@/lib/numerology/vedicUnitSystem";
import { CHALDEAN, PYTHAGOREAN } from "@/lib/numerology/mappings";

export type LetterMeaning = {
  letter: string;
  pythagorean: number;
  chaldean: number | null;
  unitSystem: number | null;
  theme: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
};

const DATA: Omit<
  LetterMeaning,
  "letter" | "pythagorean" | "chaldean" | "unitSystem"
>[] = [
  {
    theme: "Independent drive and purposeful starts",
    strengths: ["Self-starting will", "Honest directness", "Courage to own a path"],
    watchouts: ["Stubbornness", "Difficulty yielding mid-course"],
    practice: "Invite one collaborator into plans you usually own alone.",
  },
  {
    theme: "Sensitive harmony and quiet loyalty",
    strengths: ["Emotional awareness", "Faithfulness", "Peacemaking instincts"],
    watchouts: ["Rigidity of opinion under stress", "Withdrawing when conflict rises"],
    practice: "State one preference clearly before smoothing the room.",
  },
  {
    theme: "Expressive optimism and social spark",
    strengths: ["Warm communication", "Humor", "Enthusiasm that lifts others"],
    watchouts: ["Scattered focus", "Changing direction too often"],
    practice: "Finish one expressive project before opening another.",
  },
  {
    theme: "Logical method and steady craft",
    strengths: ["Practical problem-solving", "Determination", "Realistic planning"],
    watchouts: ["Inflexibility", "Authoritarian tone under pressure"],
    practice: "Allow one planned experiment outside the usual system.",
  },
  {
    theme: "Freedom, curiosity, and adaptable wit",
    strengths: ["Multiple perspectives", "Social ease", "Quick learning"],
    watchouts: ["Discipline gaps", "Restlessness in routines"],
    practice: "Keep one anchor habit while exploring new inputs.",
  },
  {
    theme: "Empathic optimism and helpful presence",
    strengths: ["Sympathy", "Approachability", "Cheerful support"],
    watchouts: ["Over-involvement in others’ lives", "Self-sacrifice loops"],
    practice: "Help with consent—ask what is wanted before stepping in.",
  },
  {
    theme: "Determined mind and orderly creativity",
    strengths: ["Focus when committed", "Practical imagination", "Self-made opportunities"],
    watchouts: ["Overthinking", "Spiritual bypass of ordinary duties"],
    practice: "Turn one insight into a scheduled, finishable task.",
  },
  {
    theme: "Self-reliant creativity and resource flow",
    strengths: ["Original thinking", "Capacity to earn and rebuild", "Independence"],
    watchouts: ["Money volatility", "Loneliness or self-doubt spikes"],
    practice: "Pair creative risk with a simple weekly money check-in.",
  },
  {
    theme: "Artistic sensitivity and careful empathy",
    strengths: ["Aesthetic sense", "Care not to harm", "Talented expression"],
    watchouts: ["Nervous extremes", "Instability when unbalanced"],
    practice: "Use art or journaling to discharge intensity safely.",
  },
  {
    theme: "Honest compassion and talented helpfulness",
    strengths: ["Sincerity", "Empathy in action", "Creative cleverness"],
    watchouts: ["People-pleasing", "Needing constant external motivation"],
    practice: "Help from overflow; keep one personal goal on the list.",
  },
  {
    theme: "Intuitive will and multifaceted drive",
    strengths: ["Strong intuition", "Determination", "Many usable talents"],
    watchouts: ["Fear under pressure", "Scattered self-doubt"],
    practice: "Pick one lane for 90 days so willpower compounds.",
  },
  {
    theme: "Analytical truth-seeking and careful pacing",
    strengths: ["Intellectual honesty", "Sincerity", "Thoughtful travel of mind"],
    watchouts: ["Slow decisions", "Stress accidents when emotionally overloaded"],
    practice: "Set a decision deadline after analysis—not endless research.",
  },
  {
    theme: "Hardworking resilience and family grounding",
    strengths: ["Endurance", "Duty to kin", "Physical follow-through"],
    watchouts: ["Workaholic pace", "Impatience with slower people"],
    practice: "Schedule recovery as non-negotiable as work blocks.",
  },
  {
    theme: "Original intuition and unconventional choice",
    strengths: ["Fresh ideas", "Instinctive creativity", "Distinctive viewpoint"],
    watchouts: ["Stubborn opinions", "Romantic restlessness"],
    practice: "Test unconventional ideas with one practical pilot.",
  },
  {
    theme: "Courage, discipline, and moral backbone",
    strengths: ["Bravery", "Protective loyalty", "Principled effort"],
    watchouts: ["Self-righteousness", "Over-control in care roles"],
    practice: "Lead by example; leave room for others’ methods.",
  },
  {
    theme: "Ambitious structure and material focus",
    strengths: ["Drive for achievement", "Organizational sense", "Practical ambition"],
    watchouts: ["Status anxiety", "Harshness when goals stall"],
    practice: "Define success metrics that include kindness and rest.",
  },
  {
    theme: "Inquisitive mind and communicative spark",
    strengths: ["Questions that open doors", "Mental agility", "Teaching potential"],
    watchouts: ["Nervous chatter", "Leaving projects half-asked"],
    practice: "Write answers down—curiosity becomes knowledge when captured.",
  },
  {
    theme: "Diplomatic intelligence and refined taste",
    strengths: ["Tact", "Aesthetic judgment", "Strategic patience"],
    watchouts: ["Over-refinement delaying action", "People-pleasing polish"],
    practice: "Ship the good version; iterate after feedback.",
  },
  {
    theme: "Magnetic warmth and responsible charm",
    strengths: ["Sociability", "Loyalty", "Attractive presence"],
    watchouts: ["Overpromising care", "Mood swings in closeness"],
    practice: "Keep promises small and reliable.",
  },
  {
    theme: "Tenacious builder energy",
    strengths: ["Persistence", "Practical grit", "Long-game focus"],
    watchouts: ["Stubborn tunnels", "Ignoring soft skills"],
    practice: "Ask for a second opinion before doubling down.",
  },
  {
    theme: "Inspired intuition and unusual insight",
    strengths: ["Psychic-leaning hunches", "Creative flashes", "Humanitarian bent"],
    watchouts: ["Nervous intensity", "Idealism without body care"],
    practice: "Ground inspiration with sleep, food, and one verified step.",
  },
  {
    theme: "Friendly adaptability and lively exchange",
    strengths: ["Sociable warmth", "Flexibility", "Helpful networking"],
    watchouts: ["Superficial connections", "Avoiding depth"],
    practice: "Deepen one friendship with consistent check-ins.",
  },
  {
    theme: "Determined will with emotional undercurrents",
    strengths: ["Courage", "Protective instinct", "Capacity to push through"],
    watchouts: ["Temper flashes", "All-or-nothing moods"],
    practice: "Pause before hard replies—channel heat into movement.",
  },
  {
    theme: "Generous intellect and broad interests",
    strengths: ["Curiosity across fields", "Teaching bent", "Open-handed ideas"],
    watchouts: ["Scattered expertise", "Overcommitting wisdom"],
    practice: "Specialize enough to finish a teaching artifact.",
  },
  {
    theme: "Discriminating insight and quiet discernment",
    strengths: ["Keen judgment", "Spiritual curiosity", "Selective focus"],
    watchouts: ["Critical distance", "Isolation"],
    practice: "Share one discernment kindly with someone trusted.",
  },
  {
    theme: "Idealistic completion and compassionate vision",
    strengths: ["Big-picture care", "Artistic finish", "Service impulse"],
    watchouts: ["Martyr patterns", "Difficulty with mundane details"],
    practice: "Complete small loops so idealism stays embodied.",
  },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const LETTER_MEANINGS: Record<string, LetterMeaning> = Object.fromEntries(
  LETTERS.map((letter, i) => {
    const row = DATA[i];
    return [
      letter,
      {
        letter,
        pythagorean: PYTHAGOREAN[letter] ?? ((i % 9) + 1),
        chaldean: CHALDEAN[letter] ?? null,
        unitSystem: UNIT_SYSTEM_NAME_MAP[letter] ?? null,
        ...row,
      },
    ];
  }),
);

export function letterMeaning(letter: string): LetterMeaning | null {
  const key = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(key)) return null;
  return LETTER_MEANINGS[key] ?? null;
}
