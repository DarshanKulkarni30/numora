/**
 * Learning curriculum — methods and concepts taught in NumoraWisdom.
 * Free: intro + birth/destiny teaser. Paid/admin: full tree.
 *
 * `detail` copy is original NumoraWisdom teaching text (4–5 lines),
 * synthesized for reflection—not third-party verbatim content.
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
  | "vedic-explore"
  | "vedic-square";

export type LearningConcept = {
  slug: string;
  title: string;
  blurb: string;
  /** Longer teaching copy shown on the concept page (≈4–5 sentences). */
  detail: string;
  interactive: LearningInteractive;
  /** Matching guide topic when a deep-link exists. */
  guideTopic?: string;
};

export type LearningMethod = {
  id: LearningMethodId;
  title: string;
  subtitle: string;
  blurb: string;
  /** Short origin / history note for intro and method hubs. */
  origin: string;
  /** Longer overview for hubs and “What is numerology?” (≈4–5 sentences). */
  detail: string;
  concepts: LearningConcept[];
};

export const LEARNING_METHODS: LearningMethod[] = [
  {
    id: "pythagorean",
    title: "Pythagorean",
    subtitle: "Western core map",
    blurb:
      "From full name and birth date: Life Path, Birth Day, Expression, Soul Urge, Personality, and Maturity.",
    origin:
      "Roots are often traced to the Greek philosopher Pythagoras (6th century BCE) and later Western revival. He did not invent all number mysticism, but his school popularized linking number, harmony, and character—today’s “modern” or Western chart usually follows this 1–9 letter map.",
    detail:
      "Pythagorean (Western) numerology maps letters A–Z to 1–9 and reduces birth-date parts into core themes. Life Path comes from the full date; Birth Day from the day alone. Expression uses the whole name, Soul Urge the vowels, and Personality the consonants. Maturity blends Life Path with Expression for later-life emphasis. Numbers usually reduce to 1–9, while 11, 22, and 33 may be kept as master tones. In NumoraWisdom this is a reflective chart beside other systems—not a forecast.",
    concepts: [
      {
        slug: "life-path",
        title: "Life Path",
        blurb: "Reduce the full birth date into a lifelong pacing theme.",
        detail:
          "Life Path is the Pythagorean spine of the birth chart: reduce day, month, and year (often keeping 11/22/33), then reduce their sum. Readers treat it as a lifelong pacing theme—how growth chapters may feel—not a script of events. Compare it with Vedic Destiny when the digits differ; contrast is useful. Use the calculator below with any date to see each reduction step. Guides for 1–9 (and masters) deepen the keyword, not a prediction.",
        interactive: "dob-life-path",
        guideTopic: "life-path",
      },
      {
        slug: "birth-day",
        title: "Birth Day",
        blurb: "The day of the month, reduced—how you may show up instinctively.",
        detail:
          "Birth Day isolates the calendar day you were born and reduces it (masters may stay). It is often read as an instinctive style—how you may enter rooms or start tasks—alongside the broader Life Path. In Indian-style work a similar day reduction appears as Psychic / Moolank, but the framing differs. Try a date below to see the day digit and its reduction. Treat overlaps across systems as conversation, not conflict.",
        interactive: "dob-life-path",
        guideTopic: "birth-day",
      },
      {
        slug: "expression",
        title: "Expression",
        blurb: "Full-name letter total on the Pythagorean 1–9 map.",
        detail:
          "Expression (sometimes called Destiny in Western naming) totals every letter of the full name on the Pythagorean 1–9 chart, then reduces. It is often read as talents and outer craft—the “how you build” tone of a spelling. Compound totals before reduction can add nuance. Type a name below to see letter values and the reduced Expression. Spelling changes change the vibration; that is the point of careful name experiments.",
        interactive: "name-pythagorean",
        guideTopic: "expression",
      },
      {
        slug: "soul-urge",
        title: "Soul Urge",
        blurb: "Vowels only—often read as inner drive.",
        detail:
          "Soul Urge (Heart’s Desire) uses vowels only on the Pythagorean map. Practitioners often read it as inner motivation—what you may want beneath the social face. It can differ sharply from Expression or Personality. Enter a name below; the demo highlights vowel math beside the full Expression. Use it for reflection on motive, not as a claim about secret destiny.",
        interactive: "name-pythagorean",
        guideTopic: "soul-urge",
      },
      {
        slug: "personality",
        title: "Personality",
        blurb: "Consonants only—outer presentation tone.",
        detail:
          "Personality numbers come from consonants only. They are often framed as first impression or social armor—how others may read you before they know your deeper drivers. Pair with Soul Urge when the two diverge. The name demo below shows consonant totals alongside the full name. Again: reflective language, not a verdict on character.",
        interactive: "name-pythagorean",
        guideTopic: "personality",
      },
      {
        slug: "maturity",
        title: "Maturity",
        blurb: "Life Path + Expression, reduced—later-life emphasis.",
        detail:
          "Maturity combines Life Path and Expression, then reduces. Many Western readers treat it as an emphasis that grows clearer with age—skills and path themes converging. It needs both a valid date and a name in a full report; the date demo below still shows Life Path building blocks. Compare Maturity with midlife Personal Years when you explore timing later.",
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
    origin:
      "Named for the Chaldeans of ancient Mesopotamia (Babylonia), this stream is often treated as one of the oldest surviving name-vibration maps. It reached later readers through Near Eastern and Mediterranean occult traditions and remains popular wherever compound name totals are prized.",
    detail:
      "Chaldean numerology is an older name-focused map. Letters take values from 1–8; nine is not assigned to letters in the classic chart. Readers often keep the compound total as well as the reduced digit for texture. In NumoraWisdom, Vedic name numbers use the same Chaldean-aligned letter map for consistency across panels. Use Chaldean to sense how a spelling may feel—then compare with Pythagorean Expression on the same name.",
    concepts: [
      {
        slug: "name-number",
        title: "Chaldean name number",
        blurb:
          "Map each letter, sum the name, then reduce (masters 11/22 kept when they appear).",
        detail:
          "Map each letter with the Chaldean 1–8 table, sum the name, and reduce while noting masters when they appear. Compound and reduced values are both useful: compound for texture, reduced for a simple keyword. Type a name below to see every letter value and the totals. This is the same map NumoraWisdom uses for Vedic name panels.",
        interactive: "name-chaldean",
        guideTopic: "chaldean-name",
      },
      {
        slug: "compound",
        title: "Compound number",
        blurb: "The total before final reduction—often read for extra nuance.",
        detail:
          "The compound is the raw name total before you fold it to a single digit. Many Chaldean-leaning readers keep it in view because two names can share a reduced digit yet feel different at 23 vs 32, for example. Practice naming both numbers when you experiment. The interactive below shows compound and reduced side by side.",
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
    origin:
      "Indian-style practice grew beside Vedic astrology and folk number lore on the subcontinent—Moolank (birth day) and Bhagyank (full date) with planetary rulers. Modern “Vedic numerology” courses blend those date themes with name charts; NumoraWisdom uses an Indian-style teaching map for reflection, not a full kundli.",
    detail:
      "Indian-style (Vedic) teaching in NumoraWisdom centers on Psychic from the birth day (Moolank) and Destiny from the full date (Bhagyank), each reduced to 1–9 with planet and keyword themes such as Leader or Harmony. Name numbers use a Chaldean-aligned letter map; Unit System Map B is shown when letters disagree. Year outlook adds a birthday-cycle tone (calendar toggle on the Years page). Digits are mirrors for temperament and path themes—never medical or event predictions.",
    concepts: [
      {
        slug: "psychic",
        title: "Psychic number",
        blurb:
          "Reduce the birth day to 1–9—temperament themes (Moolank). Explore Leader→Humanity keywords.",
        detail:
          "Psychic (Moolank) comes from the birth day only, reduced to 1–9. Days like the 1st, 10th, 19th, and 28th share Psychic 1, and so on through 9. It is often read as day-to-day temperament—the solar-through-Mars keyword map (Leader, Harmony, Creativity…). Enter a date below to walk the reduction. Then open digit guides for fuller character notes. Reflective only—not a diagnosis.",
        interactive: "dob-psychic-destiny",
        guideTopic: "vedic-psychic",
      },
      {
        slug: "destiny",
        title: "Destiny number",
        blurb:
          "Reduce the full birth date—outer-path themes (Bhagyank / DN), same 1–9 keyword map.",
        detail:
          "Destiny (Bhagyank / DN) adds day + month + year, then reduces to 1–9. Readers often treat it as outer-path flavor beside Psychic temperament. The same keyword set (Leader→Humanity) applies with a path-facing emphasis. Use the calculator below to see the sum and reduction. Where Psychic and Destiny differ, notice the tension as a prompt—not a flaw.",
        interactive: "dob-psychic-destiny",
        guideTopic: "vedic-destiny",
      },
      {
        slug: "name",
        title: "Vedic name number",
        blurb: "Same Indian-style letter map as Chaldean in NumoraWisdom.",
        detail:
          "Vedic name number in this product uses the Chaldean-aligned letter chart so spelling experiments stay consistent across Vedic and Chaldean panels. Compound and reduced values both appear in reports. Try a name below and compare with Pythagorean Expression on the same spelling. Letter-map differences are teaching tools, not fights between “correct” systems.",
        interactive: "name-chaldean",
        guideTopic: "vedic-name",
      },
      {
        slug: "unit-map",
        title: "Unit System (Map B)",
        blurb: "A second letter map that disagrees on some letters (e.g. C, H).",
        detail:
          "Unit System Map B is a second Indian-style letter assignment that can disagree with the primary Vedic/Chaldean map on letters such as C or H. NumoraWisdom shows both so you can see how map choice shifts a name number. Use the name demo to explore totals; when maps diverge, treat the gap as nuance for reflection.",
        interactive: "name-chaldean",
      },
      {
        slug: "projected-year",
        title: "Year outlook",
        blurb: "Birthday-cycle tone using birthday weekday digits.",
        detail:
          "Year outlook (projected year tone) uses birthday-related digits with that year’s last two digits to sketch a reflective yearly atmosphere. The number activates on your birthday; toggle Calendar year on the Years page for 1 Jan–31 Dec. It sits beside Personal Year rather than replacing it. Pick a date and year below to see how the tone number is built. Weather language only—no event calendar.",
        interactive: "personal-year",
        guideTopic: "projected-year",
      },
      {
        slug: "vedic-square",
        title: "Vedic Square",
        blurb:
          "9×9 digital-root multiplication lattice—footprints and opposite pairs, not a full kundli.",
        detail:
          "The Vedic Square is a fixed 9×9 table of digital roots from multiplication. Highlight Psychic, Destiny, or Name to see that digit’s footprint constellation, its opposite shadow (1↔8, 2↔7, 3↔6, 4↔5; 9 alone), and a short reflective practice. It is not Ank Kundli and not a house chart—pattern-spotting for reflection only. Try the lattice below, then open a report for your live numbers.",
        interactive: "vedic-square",
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
    origin:
      "The Lo Shu square is a Chinese magic square of three—legend ties it to the Yellow River and early Chinese cosmology. Later East Asian and Western occult writers reused the 3×3 layout; modern “birth grid” numerology places date digits into those cells for reflective reading.",
    detail:
      "The Lo Shu square places non-zero digits from the birth date onto a fixed 3×3 layout. Filled lines (“arrows”) and empty cells (“missing numbers”) are read as emphasis or awareness themes. NumoraWisdom also overlays BN (Psychic) and DN (Destiny) so Vedic day/date themes sit beside the grid. Explore interactively—planes for reflection, not defects or fate.",
    concepts: [
      {
        slug: "grid",
        title: "Lo Shu grid",
        blurb:
          "How digits from the birth date fill the square—plus BN (Psychic) and DN (Destiny).",
        detail:
          "Each non-zero digit of the birth date lands in its Lo Shu cell; repeats stack as emphasis. NumoraWisdom also places BN (Psychic) and DN (Destiny) so Indian-style day and full-date themes sit with the grid. Enter a date below to fill the square live. Read density as attention, not destiny.",
        interactive: "lo-shu-grid",
        guideTopic: "lo-shu-number",
      },
      {
        slug: "arrows",
        title: "Arrows",
        blurb: "Lines of filled cells often read as emphasis themes.",
        detail:
          "When a row, column, or diagonal fills, many Lo Shu readers call it an arrow—an emphasis plane (mind, will, action, and so on, depending on tradition). Multiple arrows can coexist. Use the grid demo to spot lines as you change dates. Emphasis is not a guarantee of talent or trouble.",
        interactive: "lo-shu-grid",
        guideTopic: "lo-shu-arrow",
      },
      {
        slug: "missing",
        title: "Missing numbers",
        blurb: "Empty cells invite awareness—not defects.",
        detail:
          "Empty cells are often framed as missing numbers—areas inviting awareness, practice, or partnership rather than permanent defects. A missing plane can be soft, not broken. Watch how the interactive grid changes when digits appear or vanish. Pair with arrows for a balanced reading habit.",
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
    origin:
      "Personal Year / Month pacing grew mainly inside modern Western (Pythagorean-style) practice in the 19th–20th centuries as a way to read calendar “seasons” without claiming fixed events. Related year-tone ideas also appear in Indian-style teaching; NumoraWisdom keeps both as weather metaphors only.",
    detail:
      "Timing cycles describe temporary pacing: Personal Year from birth month + day + calendar year; Personal Month from that year number plus the calendar month. They are weather metaphors for focus and tempo—starts, maintenance, completion—not predictions of specific events. Use them beside Life Path or Destiny for “what season am I in?” reflection only.",
    concepts: [
      {
        slug: "personal-year",
        title: "Personal Year",
        blurb: "Birth month + day + calendar year, reduced.",
        detail:
          "Personal Year adds birth month and day to the calendar year, then reduces (masters may apply by house style). It sketches a yearly weather theme—initiative, cooperation, completion, and so on. Change the year below to see how the number shifts. Never treat it as a calendar of incidents.",
        interactive: "personal-year",
        guideTopic: "personal-year",
      },
      {
        slug: "personal-month",
        title: "Personal Month",
        blurb: "Personal Year + calendar month, reduced.",
        detail:
          "Personal Month layers the calendar month onto Personal Year and reduces again. It zooms the yearly weather into a shorter pacing cue. The same demo lets you set year (month themes follow in guides and reports). Keep language soft: tempo and focus, not appointments with fate.",
        interactive: "personal-year",
        guideTopic: "personal-month",
      },
    ],
  },
];

export type LearningNavItem = {
  href: string;
  title: string;
  subtitle?: string;
};

/** Flat curriculum order for Previous / Next (method pages include all lessons + interactives). */
export function learningNavSequence(): LearningNavItem[] {
  const items: LearningNavItem[] = [
    { href: "/learning", title: "Learning home", subtitle: "Start here" },
    {
      href: "/learning/what-is-numerology",
      title: "What is numerology?",
      subtitle: "Introduction",
    },
  ];
  for (const method of LEARNING_METHODS) {
    items.push({
      href: learningHref(method.id),
      title: method.title,
      subtitle: method.subtitle,
    });
  }
  return items;
}

export function learningNeighbors(pathname: string): {
  prev: LearningNavItem | null;
  next: LearningNavItem | null;
  index: number;
  total: number;
} {
  const seq = learningNavSequence();
  const clean = pathname.replace(/\/$/, "") || "/learning";
  // Concept URLs redirect to method#slug; treat bare method path for pager.
  const methodOnly = clean.replace(
    /^(\/learning\/(?:pythagorean|chaldean|vedic|lo-shu|timing))\/[^/]+$/,
    "$1",
  );
  const index = seq.findIndex((i) => i.href === methodOnly || i.href === clean);
  if (index < 0) {
    return { prev: null, next: null, index: -1, total: seq.length };
  }
  return {
    prev: index > 0 ? seq[index - 1] : null,
    next: index < seq.length - 1 ? seq[index + 1] : null,
    index,
    total: seq.length,
  };
}

/** Method hub, or method hub + #concept for deep-links from reports. */
export function learningHref(
  method: LearningMethodId,
  concept?: string,
): string {
  if (!concept) return `/learning/${method}`;
  return `/learning/${method}#${concept}`;
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
