/** First vowel in the first name — Pythagorean inner-tone themes (NumoraWisdom rewrite). */

export type FirstVowelMeaning = {
  vowel: string;
  linkedNumber: number;
  theme: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
  /** When this vowel is also the first letter of the name */
  leadingVowelNote: string;
};

export const FIRST_VOWEL_MEANINGS: Record<string, FirstVowelMeaning> = {
  A: {
    vowel: "A",
    linkedNumber: 1,
    theme: "Impulsive creativity with a need to be seen as capable",
    strengths: [
      "Action-oriented originality",
      "Drive to be independent and first",
      "Hardworking seeker energy",
    ],
    watchouts: [
      "Harsh inner criticism after missteps",
      "Wanting praise while fearing critique",
      "Impulsive starts without pacing",
    ],
    practice:
      "Ask for one piece of constructive feedback weekly—and celebrate effort, not only wins.",
    leadingVowelNote:
      "When A begins the name, decisions may need extra processing time before a clear yes/no.",
  },
  E: {
    vowel: "E",
    linkedNumber: 5,
    theme: "Excited freedom-seeking with intuitive, emotional curiosity",
    strengths: [
      "Instinctive adaptability",
      "Quick mind and magical curiosity",
      "Desire to experience widely",
    ],
    watchouts: [
      "Emotional drain from too much drama",
      "Scattering across disparate interests",
      "Freedom without recovery rituals",
    ],
    practice:
      "Protect solitude after social intensity so intuition stays clear.",
    leadingVowelNote:
      "When E begins the name, pause before snap decisions—instinct is strong, timing still matters.",
  },
  I: {
    vowel: "I",
    linkedNumber: 9,
    theme: "Intense wisdom-seeking with compassion and high standards",
    strengths: [
      "Charisma with depth",
      "Patience toward mastery",
      "Responsible, research-minded care",
    ],
    watchouts: [
      "Over-responsibility for family",
      "Feeling unloved beneath competence",
      "Romantic idealism without practical footing",
    ],
    practice:
      "Balance mastery loops with simple enjoyment that needs no achievement.",
    leadingVowelNote:
      "When I begins the name, give yourself decision time—intensity prefers reflection over rush.",
  },
  O: {
    vowel: "O",
    linkedNumber: 6,
    theme: "Magnetic care with contradictory independence and nurture",
    strengths: [
      "Protective loyalty",
      "Service orientation at home and with friends",
      "Natural authority when centered",
    ],
    watchouts: [
      "Annoyance when advice is ignored",
      "Overweening responsibility",
      "Reacting before creative problem-solving",
    ],
    practice:
      "Step back once before reacting—then lead with a creative option.",
    leadingVowelNote:
      "When O begins the name, slow the first answer; care decisions improve with a breath.",
  },
  U: {
    vowel: "U",
    linkedNumber: 3,
    theme: "Joyful communication with spiritual play and storytelling",
    strengths: [
      "Humor and lively presence",
      "Entertainment flair in ordinary roles",
      "Spontaneous creative energy",
    ],
    watchouts: [
      "Emotional explosions or shutdowns",
      "Exaggeration and scatter",
      "Superficiality when unfocused",
    ],
    practice:
      "Name the feeling before performing the story—then channel it into one finished piece.",
    leadingVowelNote:
      "When U begins the name, sleep on big choices; expressive energy needs a beat to settle.",
  },
  Y: {
    vowel: "Y",
    linkedNumber: 7,
    theme: "Analytical curiosity and spiritual probing",
    strengths: [
      "Truth-seeking detachment",
      "Specialist or research talent",
      "Comfort with deeper questions",
    ],
    watchouts: [
      "Isolation from ordinary connection",
      "Living on a different wavelength without translation",
      "Endless questioning without embodiment",
    ],
    practice:
      "Share one finding with a trusted person so insight becomes relationship.",
    leadingVowelNote:
      "When Y begins the name, allow processing time—analytical vowels dislike snap answers.",
  },
};

export function firstVowelMeaning(vowel: string): FirstVowelMeaning | null {
  const key = vowel.trim().toUpperCase();
  return FIRST_VOWEL_MEANINGS[key] ?? null;
}
