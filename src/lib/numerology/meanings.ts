type MeaningMap = Record<number, string>;

const CORE: MeaningMap = {
  1: "According to numerology traditions, 1 may indicate leadership, initiative, and a pioneering spirit. This could suggest comfort with independent decisions and starting new paths.",
  2: "According to numerology traditions, 2 may indicate cooperation, sensitivity, and diplomatic awareness. This could suggest strength in partnership and careful listening.",
  3: "According to numerology traditions, 3 may indicate creative expression, optimism, and social warmth. This could suggest a natural pull toward communication and imaginative work.",
  4: "According to numerology traditions, 4 may indicate structure, reliability, and steady craftsmanship. This could suggest value in systems, patience, and practical follow-through.",
  5: "According to numerology traditions, 5 may indicate curiosity, adaptability, and freedom-seeking energy. This could suggest growth through variety, travel, and learning by experience.",
  6: "According to numerology traditions, 6 may indicate care, responsibility, and harmony-seeking. This could suggest fulfillment through support roles, aesthetics, and family-minded choices.",
  7: "According to numerology traditions, 7 may indicate analysis, introspection, and a search for deeper meaning. This could suggest strength in research, solitude, and thoughtful study.",
  8: "According to numerology traditions, 8 may indicate ambition, stewardship, and material mastery. This could suggest growth through leadership of resources and long-range planning.",
  9: "According to numerology traditions, 9 may indicate compassion, breadth of vision, and completion themes. This could suggest fulfillment through service, mentoring, and releasing what no longer fits.",
  11: "According to numerology traditions, master number 11 may indicate heightened intuition and inspirational influence. This could suggest a calling to illuminate ideas while staying grounded in daily habits.",
  22: "According to numerology traditions, master number 22 may indicate large-scale building and practical vision. This could suggest capacity to turn ambitious ideas into durable structures over time.",
  33: "According to numerology traditions, master number 33 may indicate teaching through compassion and elevated care. This could suggest influence through guidance, creativity, and responsible nurture.",
};

const YEAR_MONTH: MeaningMap = {
  1: "A Personal cycle of 1 may emphasize fresh starts, clearer self-direction, and planting intentions. This period may invite initiative rather than waiting for perfect conditions.",
  2: "A Personal cycle of 2 may emphasize patience, collaboration, and emotional attunement. This period may invite quieter progress through partnership and timing.",
  3: "A Personal cycle of 3 may emphasize expression, learning, and social exchange. This period may invite creative projects and more open communication.",
  4: "A Personal cycle of 4 may emphasize foundations, routines, and practical building. This period may invite disciplined effort and simplifying commitments.",
  5: "A Personal cycle of 5 may emphasize change, movement, and experimentation. This period may invite flexible plans and conscious freedom with responsibility.",
  6: "A Personal cycle of 6 may emphasize home, care, and relationship harmony. This period may invite service balanced with healthy boundaries.",
  7: "A Personal cycle of 7 may emphasize reflection, skill refinement, and inner clarity. This period may invite study, rest, and honest self-assessment.",
  8: "A Personal cycle of 8 may emphasize recognition, stewardship, and measurable progress. This period may invite organized ambition and ethical resource choices.",
  9: "A Personal cycle of 9 may emphasize completion, generosity, and release. This period may invite closing chapters with gratitude before the next cycle.",
  11: "A Personal cycle of 11 may emphasize inspiration and intuitive insight. This period may invite sharing ideas while protecting rest and nervous-system balance.",
  22: "A Personal cycle of 22 may emphasize ambitious yet practical building. This period may invite long-horizon projects grounded in steady daily steps.",
  33: "A Personal cycle of 33 may emphasize compassionate leadership and teaching energy. This period may invite uplifting others without self-erasure.",
};

const CHALDEAN_COMPOUND: Record<number, string> = {
  10: "Compound 10 may suggest a renewed sense of independence after lessons in cooperation.",
  11: "Compound 11 may suggest intuitive flashes that benefit from calm verification.",
  12: "Compound 12 may suggest creative service when ego softens into collaboration.",
  13: "Compound 13 may suggest transformation through disciplined change rather than abrupt upheaval.",
  14: "Compound 14 may suggest movement and opportunity tempered by consistency.",
  15: "Compound 15 may suggest magnetic charm guided by integrity and responsibility.",
  16: "Compound 16 may suggest rebuilding after awakening; humility can become strength.",
  17: "Compound 17 may suggest lasting achievement through wisdom and measured ambition.",
  18: "Compound 18 may suggest material themes balanced by ethical awareness.",
  19: "Compound 19 may suggest independence strengthened by past experience.",
  20: "Compound 20 may suggest decisions ripened through patience and partnership.",
  21: "Compound 21 may suggest creative success when optimism meets follow-through.",
  22: "Compound 22 may suggest masterful building when vision stays practical.",
  23: "Compound 23 may suggest supportive networks and helpful timing for learning.",
  24: "Compound 24 may suggest love of beauty and care expressed through reliable action.",
  25: "Compound 25 may suggest wisdom earned through varied experience.",
  26: "Compound 26 may suggest influence paired with duty; stewardship over pressure.",
  27: "Compound 27 may suggest teaching and completion through broad understanding.",
  28: "Compound 28 may suggest leadership tested and refined by responsibility.",
  29: "Compound 29 may suggest intuitive partnerships needing clear boundaries.",
  30: "Compound 30 may suggest communication gifts used for constructive influence.",
  31: "Compound 31 may suggest original ideas grounded by method.",
  32: "Compound 32 may suggest cooperative achievement through tact.",
  33: "Compound 33 may suggest elevated care and teaching responsibility.",
  34: "Compound 34 may suggest practical creativity that benefits others.",
  35: "Compound 35 may suggest adaptable intelligence applied with focus.",
  36: "Compound 36 may suggest responsible creativity within family or community roles.",
  37: "Compound 37 may suggest thoughtful originality and reflective leadership.",
  38: "Compound 38 may suggest organized ambition guided by fairness.",
  39: "Compound 39 may suggest expressive completion and mentoring themes.",
  40: "Compound 40 may suggest structure that supports long-term security.",
  41: "Compound 41 may suggest innovative independence with practical checks.",
  42: "Compound 42 may suggest collaborative systems that endure.",
  43: "Compound 43 may suggest inventive problem-solving under pressure.",
  44: "The total 44 means 4 + 4. In this school that is a “builder” name: slow work, systems, and finishing heavy jobs. Useful — and tiring if everyone expects you to carry the load.",
  45: "Compound 45 may suggest versatile mastery when curiosity is channeled.",
  46: "Compound 46 may suggest caring leadership with clear standards.",
  47: "Compound 47 may suggest deep study applied to real-world craft.",
  48: "Compound 48 may suggest material organization for collective benefit.",
  49: "Compound 49 may suggest broad vision refined into usable plans.",
  50: "Compound 50 may suggest freedom used wisely after experience.",
  51: "Compound 51 may suggest communicative leadership and initiative.",
  52: "Compound 52 may suggest intuitive strategy and careful timing.",
};

/** One short core trait label for tiles and recommendations. */
export const CORE_TRAIT: Record<number, string> = {
  1: "Leadership & initiative",
  2: "Cooperation & diplomacy",
  3: "Creative expression",
  4: "Structure & reliability",
  5: "Freedom & adaptability",
  6: "Care & responsibility",
  7: "Insight & analysis",
  8: "Ambition & stewardship",
  9: "Compassion & completion",
  11: "Inspired intuition",
  22: "Master builder",
  33: "Compassionate teaching",
};

export function coreTraitFor(n: number | string): string {
  const num = Number(n);
  return CORE_TRAIT[num] ?? `Themes of ${n}`;
}

export function meaningFor(n: number, map: MeaningMap = CORE): string {
  return (
    map[n] ??
    CORE[n] ??
    `According to numerology traditions, the number ${n} may invite reflective attention to balance, intention, and steady personal growth.`
  );
}

export function yearMonthMeaning(n: number): string {
  return meaningFor(n, YEAR_MONTH);
}

export function chaldeanCompoundMeaning(compound: number): string {
  if (CHALDEAN_COMPOUND[compound]) return CHALDEAN_COMPOUND[compound];
  return `Compound ${compound} may suggest layered themes inviting thoughtful pacing and conscious choice rather than fixed outcomes.`;
}

export const DISCLAIMER =
  "Numerology is a belief-based reflective practice and should not be treated as scientific, medical, legal, financial, educational, parenting, or psychological advice. It does not diagnose, treat, or predict outcomes.";

export const RECOMMENDATIONS_DISCLAIMER =
  "IMPORTANT — Recommendations disclaimer: The focus ideas below are optional reflective suggestions only. They are not instructions, prescriptions, or guarantees. They must not replace professional advice from qualified educators, clinicians, counselors, legal advisors, or other licensed professionals. NumoraWisdom and its operators accept no liability for decisions made solely from this belief-based content.";

export const CHILD_REPORT_DISCLAIMER =
  "CHILD / MINOR SAFETY NOTICE: This reading is for supportive reflection by a parent or guardian only. It is not a developmental assessment, school evaluation, behavioral diagnosis, or parenting directive. Children develop at different rates; do not use these themes to label, limit, compare, pressure, or discriminate against a child. If you have concerns about a child’s wellbeing, learning, or safety, consult qualified professionals. Nothing here predicts future success, setbacks, health, relationships, or character.";

export const TEEN_REPORT_DISCLAIMER =
  "TEEN / ADOLESCENT SAFETY NOTICE: This reading offers optional reflective themes for teens and parents. It is not counseling, mental-health advice, academic placement guidance, or a prediction of identity, ability, or future outcomes. Do not use it to stereotype, shame, or restrict a young person’s choices. Seek qualified professional support for wellbeing, safety, or educational decisions.";

export const STRENGTH_BANK: Record<number, string[]> = {
  1: [
    "Comfort initiating when others hesitate",
    "Clear sense of personal direction",
    "Courage to try original approaches",
  ],
  2: [
    "Natural diplomatic awareness",
    "Ability to notice subtle emotional cues",
    "Patience with collaborative processes",
  ],
  3: [
    "Expressive and imaginative communication",
    "Uplifting presence in social settings",
    "Playful problem-solving",
  ],
  4: [
    "Dependable follow-through",
    "Skill with systems and order",
    "Steady progress under pressure",
  ],
  5: [
    "Adaptability across changing contexts",
    "Curious learning style",
    "Resourcefulness when plans shift",
  ],
  6: [
    "Warm sense of responsibility",
    "Eye for harmony and care",
    "Loyalty in close relationships",
  ],
  7: [
    "Thoughtful analytical depth",
    "Comfort with focused solitude",
    "Discernment before acting",
  ],
  8: [
    "Strategic awareness of resources",
    "Drive to complete meaningful goals",
    "Capacity for organized leadership",
  ],
  9: [
    "Broad empathy and perspective",
    "Willingness to support others' growth",
    "Ability to close chapters with grace",
  ],
  11: [
    "Inspirational insight",
    "Sensitivity to meaningful patterns",
    "Capacity to motivate through ideas",
  ],
  22: [
    "Vision paired with practical building",
    "Long-range project stamina",
    "Ability to coordinate complex efforts",
  ],
  33: [
    "Compassionate teaching energy",
    "Creative care for communities",
    "Uplifting influence through example",
  ],
};

export const GROWTH_BANK: Record<number, string[]> = {
  1: [
    "Growth opportunity: inviting collaboration without losing authenticity",
    "Development area: pacing ambition with rest",
    "Conscious improvement area: listening before directing",
  ],
  2: [
    "Growth opportunity: stating needs with clearer boundaries",
    "Development area: trusting decisions without over-seeking approval",
    "Conscious improvement area: protecting energy in conflict",
  ],
  3: [
    "Growth opportunity: finishing creative starts",
    "Development area: focusing attention amid many interests",
    "Conscious improvement area: deeper listening in conversation",
  ],
  4: [
    "Growth opportunity: allowing flexibility inside structure",
    "Development area: softening perfectionist standards",
    "Conscious improvement area: scheduling joy alongside duty",
  ],
  5: [
    "Growth opportunity: committing long enough to deepen skill",
    "Development area: grounding freedom with routines",
    "Conscious improvement area: mindful follow-through on promises",
  ],
  6: [
    "Growth opportunity: caring without over-responsibility",
    "Development area: receiving support as well as giving it",
    "Conscious improvement area: separating others' emotions from your own",
  ],
  7: [
    "Growth opportunity: sharing insights with trusted people",
    "Development area: balancing analysis with warm connection",
    "Conscious improvement area: moving from reflection into timely action",
  ],
  8: [
    "Growth opportunity: defining success beyond status alone",
    "Development area: delegating with trust",
    "Conscious improvement area: ethical pacing of ambition",
  ],
  9: [
    "Growth opportunity: releasing outcomes you cannot control",
    "Development area: prioritizing personal needs within service",
    "Conscious improvement area: completing before collecting new causes",
  ],
  11: [
    "Growth opportunity: grounding intuition in practical checks",
    "Development area: nervous-system care during intense periods",
    "Conscious improvement area: translating insight into simple habits",
  ],
  22: [
    "Growth opportunity: breaking large visions into weekly steps",
    "Development area: asking for help on complex builds",
    "Conscious improvement area: celebrating incremental milestones",
  ],
  33: [
    "Growth opportunity: teaching without self-sacrifice",
    "Development area: protecting personal creative time",
    "Conscious improvement area: modeling boundaries as care",
  ],
};

export function pickUnique(items: string[], count: number): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (!out.includes(item)) out.push(item);
    if (out.length >= count) break;
  }
  return out;
}
