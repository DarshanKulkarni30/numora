/**
 * Learning curriculum — methods and concepts taught in NumoraWisdom.
 * Free: intro + birth/destiny teaser. Paid: full tree.
 */

export type LearningMethodId =
  | "pythagorean"
  | "chaldean"
  | "vedic"
  | "lo-shu"
  | "timing";

export type LearningInteractive =
  | "none"
  | "dob-psychic-destiny"
  | "dob-life-path"
  | "name-pythagorean"
  | "name-chaldean"
  | "personal-year"
  | "lo-shu-grid"
  | "vedic-explore";

export type LearningConcept = {
  slug: string;
  title: string;
  blurb: string;
  interactive: LearningInteractive;
  /** Matching guide topic when a deep-link exists. */
  guideTopic?: string;
};

export type LearningMethod = {
  id: LearningMethodId;
  title: string;
  subtitle: string;
  blurb: string;
  concepts: LearningConcept[];
};

export const LEARNING_METHODS: LearningMethod[] = [
  {
    id: "pythagorean",
    title: "Pythagorean",
    subtitle: "Western core map",
    blurb:
      "From full name and birth date: Life Path, Birth Day, Expression, Soul Urge, Personality, and Maturity.",
    concepts: [
      {
        slug: "life-path",
        title: "Life Path",
        blurb: "Reduce the full birth date into a lifelong pacing theme.",
        interactive: "dob-life-path",
        guideTopic: "life-path",
      },
      {
        slug: "birth-day",
        title: "Birth Day",
        blurb: "The day of the month, reduced—how you may show up instinctively.",
        interactive: "dob-life-path",
        guideTopic: "birth-day",
      },
      {
        slug: "expression",
        title: "Expression",
        blurb: "Full-name letter total on the Pythagorean 1–9 map.",
        interactive: "name-pythagorean",
        guideTopic: "expression",
      },
      {
        slug: "soul-urge",
        title: "Soul Urge",
        blurb: "Vowels only—often read as inner drive.",
        interactive: "name-pythagorean",
        guideTopic: "soul-urge",
      },
      {
        slug: "personality",
        title: "Personality",
        blurb: "Consonants only—outer presentation tone.",
        interactive: "name-pythagorean",
        guideTopic: "personality",
      },
      {
        slug: "maturity",
        title: "Maturity",
        blurb: "Life Path + Expression, reduced—later-life emphasis.",
        interactive: "dob-life-path",
        guideTopic: "maturity",
      },
    ],
  },
  {
    id: "chaldean",
    title: "Chaldean",
    subtitle: "Name vibration map",
    blurb:
      "Letter values 1–8 (no 9 for letters). Compound and reduced name numbers color how a spelling may feel.",
    concepts: [
      {
        slug: "name-number",
        title: "Chaldean name number",
        blurb: "Map each letter, sum the name, then reduce (masters 11/22 kept when they appear).",
        interactive: "name-chaldean",
        guideTopic: "chaldean-name",
      },
      {
        slug: "compound",
        title: "Compound number",
        blurb: "The total before final reduction—often read for extra nuance.",
        interactive: "name-chaldean",
        guideTopic: "chaldean-name",
      },
    ],
  },
  {
    id: "vedic",
    title: "Vedic",
    subtitle: "Indian-style map",
    blurb:
      "Psychic (birth day), Destiny (full date), name on a Chaldean-aligned map, plus Unit System Map B and year outlook.",
    concepts: [
      {
        slug: "psychic",
        title: "Psychic number",
        blurb:
          "Reduce the birth day to 1–9—temperament themes (Moolank). Explore Leader→Humanity keywords.",
        interactive: "vedic-explore",
        guideTopic: "vedic-psychic",
      },
      {
        slug: "destiny",
        title: "Destiny number",
        blurb:
          "Reduce the full birth date—outer-path themes (Bhagyank / DN), same 1–9 keyword map.",
        interactive: "vedic-explore",
        guideTopic: "vedic-destiny",
      },
      {
        slug: "name",
        title: "Vedic name number",
        blurb: "Same Indian-style letter map as Chaldean in NumoraWisdom.",
        interactive: "name-chaldean",
        guideTopic: "vedic-name",
      },
      {
        slug: "unit-map",
        title: "Unit System (Map B)",
        blurb: "A second letter map that disagrees on some letters (e.g. C, H).",
        interactive: "name-chaldean",
      },
      {
        slug: "projected-year",
        title: "Year outlook",
        blurb: "Calendar-year tone using birthday weekday digits.",
        interactive: "personal-year",
        guideTopic: "projected-year",
      },
      {
        slug: "vedic-square",
        title: "Vedic number chart",
        blurb: "A reflective grid of birth and name digits—not a full kundli.",
        interactive: "none",
        guideTopic: "vedic-square",
      },
    ],
  },
  {
    id: "lo-shu",
    title: "Lo Shu",
    subtitle: "Birth grid",
    blurb:
      "Place birth-date digits on a 3×3 grid. Arrows and missing numbers are read as reflective planes.",
    concepts: [
      {
        slug: "grid",
        title: "Lo Shu grid",
        blurb:
          "How digits from the birth date fill the square—plus BN (Psychic) and DN (Destiny).",
        interactive: "lo-shu-grid",
        guideTopic: "lo-shu-number",
      },
      {
        slug: "arrows",
        title: "Arrows",
        blurb: "Lines of filled cells often read as emphasis themes.",
        interactive: "lo-shu-grid",
        guideTopic: "lo-shu-arrow",
      },
      {
        slug: "missing",
        title: "Missing numbers",
        blurb: "Empty cells invite awareness—not defects.",
        interactive: "lo-shu-grid",
        guideTopic: "lo-shu-number",
      },
    ],
  },
  {
    id: "timing",
    title: "Timing cycles",
    subtitle: "Year and month pacing",
    blurb:
      "Personal Year and Personal Month are temporary weather themes—not event forecasts.",
    concepts: [
      {
        slug: "personal-year",
        title: "Personal Year",
        blurb: "Birth month + day + calendar year, reduced.",
        interactive: "personal-year",
        guideTopic: "personal-year",
      },
      {
        slug: "personal-month",
        title: "Personal Month",
        blurb: "Personal Year + calendar month, reduced.",
        interactive: "personal-year",
        guideTopic: "personal-month",
      },
    ],
  },
];

export function learningHref(
  method: LearningMethodId,
  concept?: string,
): string {
  if (!concept) return `/learning/${method}`;
  return `/learning/${method}/${concept}`;
}

export function getMethod(id: string): LearningMethod | undefined {
  return LEARNING_METHODS.find((m) => m.id === id);
}

export function getConcept(
  methodId: string,
  conceptSlug: string,
): { method: LearningMethod; concept: LearningConcept } | undefined {
  const method = getMethod(methodId);
  if (!method) return undefined;
  const concept = method.concepts.find((c) => c.slug === conceptSlug);
  if (!concept) return undefined;
  return { method, concept };
}

/** Map report / snapshot labels to Learning concept pages. */
export const REPORT_LEARNING_LINKS: Record<
  string,
  { method: LearningMethodId; concept: string; label: string }
> = {
  "life-path": {
    method: "pythagorean",
    concept: "life-path",
    label: "Learn how Life Path is calculated",
  },
  "birth-day": {
    method: "pythagorean",
    concept: "birth-day",
    label: "Learn how Birth Day is calculated",
  },
  expression: {
    method: "pythagorean",
    concept: "expression",
    label: "Learn how Expression is calculated",
  },
  "soul-urge": {
    method: "pythagorean",
    concept: "soul-urge",
    label: "Learn how Soul Urge is calculated",
  },
  personality: {
    method: "pythagorean",
    concept: "personality",
    label: "Learn how Personality is calculated",
  },
  maturity: {
    method: "pythagorean",
    concept: "maturity",
    label: "Learn how Maturity is calculated",
  },
  "chaldean-name": {
    method: "chaldean",
    concept: "name-number",
    label: "Learn how Chaldean name numbers work",
  },
  "vedic-psychic": {
    method: "vedic",
    concept: "psychic",
    label: "Learn how Psychic number is calculated",
  },
  "vedic-destiny": {
    method: "vedic",
    concept: "destiny",
    label: "Learn how Destiny number is calculated",
  },
  "vedic-name": {
    method: "vedic",
    concept: "name",
    label: "Learn how Vedic name number is calculated",
  },
  "personal-year": {
    method: "timing",
    concept: "personal-year",
    label: "Learn how Personal Year is calculated",
  },
  "personal-month": {
    method: "timing",
    concept: "personal-month",
    label: "Learn how Personal Month is calculated",
  },
  "projected-year": {
    method: "vedic",
    concept: "projected-year",
    label: "Learn how year outlook is calculated",
  },
  "lo-shu": {
    method: "lo-shu",
    concept: "grid",
    label: "Learn how the Lo Shu grid works",
  },
};
