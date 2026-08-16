import { isSunSignId, SUN_SIGNS } from "@/lib/astrology/sunSign";
import { firstVowelMeaning } from "@/lib/guides/firstVowelMeanings";
import { letterMeaning } from "@/lib/guides/letterMeanings";
import { blurbForTopic } from "@/lib/guides/numberMeanings";
import {
  parsePlanetGuideValue,
  PLANET_GUIDES,
  planetImageUrl,
} from "@/lib/guides/planets";
import { LO_SHU_NUMBER_META } from "@/lib/numerology/loShuEffects";
import { GROUP_BLURBS } from "@/lib/numerology/nameBookends";
import { UNIT_NUMBER_META } from "@/lib/numerology/vedicUnitSystem";
import {
  NINE_NOTE,
  REDUCTION_TIP,
  squareDigitGuide,
} from "@/lib/numerology/vedicSquare";
import {
  PROJECTED_YEAR_METHOD_NOTE,
  PROJECTED_YEAR_META,
} from "@/lib/numerology/vedicYearNumber";
import {
  UNIT_AFFINITY_NOTE,
  numberCharacterGuide,
} from "@/lib/numerology/vedicNumberProfile";
import { planetForVedic } from "@/lib/numerology/planets";

export type GuideTopic =
  | "life-path"
  | "birth-day"
  | "expression"
  | "soul-urge"
  | "personality"
  | "maturity"
  | "chaldean-name"
  | "vedic-psychic"
  | "vedic-destiny"
  | "vedic-name"
  | "personal-year"
  | "personal-month"
  | "lo-shu-arrow"
  | "lo-shu-number"
  | "vedic-square"
  | "projected-year"
  | "planet"
  | "name-cornerstone"
  | "name-first-vowel"
  | "name-letter"
  | "sun-sign";

export const GUIDE_TOPICS: { topic: GuideTopic; title: string }[] = [
  { topic: "life-path", title: "Life Path" },
  { topic: "birth-day", title: "Birth Day" },
  { topic: "expression", title: "Expression" },
  { topic: "soul-urge", title: "Soul Urge" },
  { topic: "personality", title: "Personality" },
  { topic: "maturity", title: "Maturity" },
  { topic: "chaldean-name", title: "Chaldean Name" },
  { topic: "vedic-psychic", title: "Vedic Psychic" },
  { topic: "vedic-destiny", title: "Vedic Destiny" },
  { topic: "vedic-name", title: "Vedic Name" },
  { topic: "personal-year", title: "Personal Year" },
  { topic: "personal-month", title: "Personal Month" },
  { topic: "lo-shu-arrow", title: "Lo Shu Arrow" },
  { topic: "lo-shu-number", title: "Lo Shu Number" },
  { topic: "vedic-square", title: "Vedic Square" },
  { topic: "projected-year", title: "Projected Year" },
  { topic: "planet", title: "Planet" },
  { topic: "name-cornerstone", title: "Name Letter Group" },
  { topic: "name-first-vowel", title: "First Vowel" },
  { topic: "name-letter", title: "Alphabet Letter" },
  { topic: "sun-sign", title: "Sun Sign" },
];

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];
const LO_SHU_NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const VEDIC_SQUARE_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const PROJECTED_YEAR_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const NAME_CORNERSTONE_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const FIRST_VOWEL_KEYS = ["A", "E", "I", "O", "U", "Y"];
const LETTER_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type TopicLens = {
  system: string;
  aspect: string;
  /** How this aspect uses the number — unique per topic */
  focus: string;
};

const TOPIC_LENSES: Record<
  Exclude<
    GuideTopic,
    | "lo-shu-arrow"
    | "lo-shu-number"
    | "vedic-square"
    | "projected-year"
    | "planet"
    | "name-cornerstone"
    | "name-first-vowel"
    | "name-letter"
    | "sun-sign"
  >,
  TopicLens
> = {
  "life-path": {
    system: "Pythagorean",
    aspect: "Life Path",
    focus:
      "Life Path is drawn from the full birth date and is often treated as a lifelong learning theme—how you may tend to grow, choose challenges, and make meaning over decades.",
  },
  "birth-day": {
    system: "Pythagorean",
    aspect: "Birth Day",
    focus:
      "Birth Day comes from the day of the month alone. Traditions often read it as a talent or specialty flavor within the broader Life Path—how gifts may show up in daily skill and style.",
  },
  expression: {
    system: "Pythagorean",
    aspect: "Expression",
    focus:
      "Expression (Destiny of the name in some schools) is calculated from all letters of the full name. It is often framed as outward talents, skills you may develop, and how you present capability in the world.",
  },
  "soul-urge": {
    system: "Pythagorean",
    aspect: "Soul Urge",
    focus:
      "Soul Urge uses the vowels of the name. It is often described as inner motivation—what you may privately want, value, or feel drawn toward beneath public roles.",
  },
  personality: {
    system: "Pythagorean",
    aspect: "Personality",
    focus:
      "Personality uses the consonants of the name. Traditions often treat it as first impressions and the social “mask”—how others may initially experience your style.",
  },
  maturity: {
    system: "Pythagorean",
    aspect: "Maturity",
    focus:
      "Maturity blends Life Path and Expression. Many readers treat it as a later-life emphasis—themes that may become clearer with experience rather than a childhood label.",
  },
  "chaldean-name": {
    system: "Chaldean",
    aspect: "Name Number",
    focus:
      "Chaldean name numbers use a different letter-to-number map than Pythagorean. The compound and reduced values are often read as vibrational flavor of the written name—not interchangeable with Pythagorean Expression.",
  },
  "vedic-psychic": {
    system: "Vedic",
    aspect: "Psychic Number",
    focus:
      "Vedic Psychic reduces the birth day to 1–9. It is often associated with personality temperament and how you may instinctively respond—distinct from Pythagorean Birth Day framing and from Destiny.",
  },
  "vedic-destiny": {
    system: "Vedic",
    aspect: "Destiny Number",
    focus:
      "Vedic Destiny reduces the full birth date to 1–9. Traditions often read it as life direction and outer path themes—parallel in spirit to Life Path, but using Vedic single-digit reduction rules.",
  },
  "vedic-name": {
    system: "Vedic",
    aspect: "Name Number",
    focus:
      "Vedic name number maps letters with Indian-style associations used in NumoraWisdom. It is reflective name vibration within the Vedic panel—not a substitute for Psychic or Destiny.",
  },
  "personal-year": {
    system: "Pythagorean cycles",
    aspect: "Personal Year",
    focus:
      "Personal Year cycles the birth month and day with the current calendar year. It is often used as a temporary annual emphasis—timing flavor for the year, not a permanent personality rewrite.",
  },
  "personal-month": {
    system: "Pythagorean cycles",
    aspect: "Personal Month",
    focus:
      "Personal Month narrows the Personal Year into a monthly tone. Treat it as a short reflective window for pacing and focus—not a prediction of events.",
  },
};

export const LO_SHU_ARROW_GUIDES: Record<
  string,
  { title: string; numbers: number[]; present: string; missing: string; significance: string }
> = {
  planning: {
    title: "Arrow of Planning (Mental)",
    numbers: [4, 9, 2],
    present:
      "According to Lo Shu traditions, a present planning arrow may indicate comfort with foresight, organization of ideas, and mental mapping.",
    missing:
      "A missing planning arrow may suggest a growth opportunity in structuring thoughts and planning ahead—through habits, not fixed limits.",
    significance:
      "Mental foresight line (4–9–2): organizing ideas before action.",
  },
  will: {
    title: "Arrow of Will (Emotional)",
    numbers: [3, 5, 7],
    present:
      "A present will arrow may indicate emotional drive, expressive feeling, and resilience in the middle emotional plane.",
    missing:
      "A missing will arrow may invite conscious improvement in emotional steadiness and expressive confidence.",
    significance:
      "Emotional drive line (3–5–7): feeling energy that fuels persistence.",
  },
  action: {
    title: "Arrow of Action (Practical)",
    numbers: [8, 1, 6],
    present:
      "A present action arrow may indicate practical follow-through and comfort turning plans into tangible steps.",
    missing:
      "A missing action arrow may suggest building routines that convert ideas into completed actions.",
    significance:
      "Practical follow-through line (8–1–6): moving plans into results.",
  },
  thought: {
    title: "Arrow of Thought",
    numbers: [4, 3, 8],
    present:
      "A present thought arrow may indicate analytical sequencing and a constructive thinking style.",
    missing:
      "A missing thought arrow may invite practice in orderly thinking and clearer mental frameworks.",
    significance:
      "Thinking style line (4–3–8): sequencing ideas into usable frameworks.",
  },
  determination: {
    title: "Arrow of Determination",
    numbers: [9, 5, 1],
    present:
      "A present determination arrow may indicate persistence and centered resolve.",
    missing:
      "A missing determination arrow may suggest cultivating steady commitment on meaningful goals.",
    significance:
      "Centered resolve line (9–5–1): staying with a chosen aim.",
  },
  practicality: {
    title: "Arrow of Practicality",
    numbers: [2, 7, 6],
    present:
      "A present practicality arrow may indicate grounded judgment and useful problem-solving.",
    missing:
      "A missing practicality arrow may invite more hands-on learning and real-world testing of ideas.",
    significance:
      "Grounded judgment line (2–7–6): useful solutions in real conditions.",
  },
  intellect: {
    title: "Arrow of Intellect",
    numbers: [4, 5, 6],
    present:
      "A present intellect arrow may indicate quick learning across structured and adaptive modes.",
    missing:
      "A missing intellect arrow may suggest growth through study mixes—structure plus curiosity.",
    significance:
      "Learning agility line (4–5–6): structure meeting curiosity.",
  },
  emotion: {
    title: "Arrow of Emotion",
    numbers: [2, 5, 8],
    present:
      "A present emotion arrow may indicate rich emotional awareness linked with practical expression.",
    missing:
      "A missing emotion arrow may invite safer emotional naming and supportive connection habits.",
    significance:
      "Feeling-into-action line (2–5–8): awareness expressed usefully.",
  },
};

export type GuidePage = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  bullets: string[];
  strengths?: string[];
  watchouts?: string[];
  imageUrl?: string | null;
  facts?: { label: string; value: string }[];
};

export function arrowNameToSlug(name: string): string | null {
  const map: Record<string, string> = {
    "Arrow of Planning (Mental)": "planning",
    "Arrow of Will (Emotional)": "will",
    "Arrow of Action (Practical)": "action",
    "Arrow of Thought": "thought",
    "Arrow of Determination": "determination",
    "Arrow of Practicality": "practicality",
    "Arrow of Intellect": "intellect",
    "Arrow of Emotion": "emotion",
  };
  return map[name] ?? null;
}

export function topicLabel(topic: GuideTopic): string {
  return GUIDE_TOPICS.find((t) => t.topic === topic)?.title ?? topic;
}

export function isValidGuideValue(topic: GuideTopic, value: string): boolean {
  if (topic === "lo-shu-arrow") return value in LO_SHU_ARROW_GUIDES;
  if (topic === "lo-shu-number") return LO_SHU_NUMBER_KEYS.includes(value);
  if (topic === "vedic-square") return VEDIC_SQUARE_KEYS.includes(value);
  if (topic === "projected-year") return PROJECTED_YEAR_KEYS.includes(value);
  if (topic === "planet") return parsePlanetGuideValue(value) != null;
  if (topic === "name-cornerstone")
    return NAME_CORNERSTONE_KEYS.includes(value);
  if (topic === "name-first-vowel")
    return FIRST_VOWEL_KEYS.includes(value.toUpperCase());
  if (topic === "name-letter")
    return LETTER_KEYS.includes(value.toUpperCase());
  if (topic === "sun-sign") return isSunSignId(value.toLowerCase());
  return NUMBER_KEYS.includes(value);
}

export function getGuidePage(topic: GuideTopic, value: string): GuidePage | null {
  if (topic === "lo-shu-arrow") {
    const arrow = LO_SHU_ARROW_GUIDES[value];
    if (!arrow) return null;
    return {
      title: arrow.title,
      subtitle: `Numbers ${arrow.numbers.join(" · ")}`,
      paragraphs: [
        "According to Lo Shu grid traditions, arrows describe patterns across the birth-date square.",
        arrow.significance,
        arrow.present,
        arrow.missing,
        "Use present arrows as strengths to steward, and missing arrows as conscious improvement areas.",
      ],
      bullets: arrow.numbers.map((n) => `Grid number ${n} participates in this arrow pattern.`),
    };
  }

  if (topic === "lo-shu-number") {
    const n = Number(value);
    const meta = LO_SHU_NUMBER_META[n];
    if (!meta) return null;
    const plane =
      [4, 9, 2].includes(n)
        ? "Mental"
        : [3, 5, 7].includes(n)
          ? "Emotional"
          : "Practical";
    return {
      title: `Lo Shu number ${value}`,
      subtitle: `${meta.trait} · ${meta.vedic} · ${plane} plane`,
      paragraphs: [
        `In the Lo Shu birth grid, ${value} sits on the ${plane.toLowerCase()} plane and is associated with ${meta.theme}.`,
        `Vedic-style nicknames sometimes call this digit the “${meta.vedic}.” When the number is present (especially repeated), traditions may read an amplified ${meta.trait.toLowerCase()} theme; when missing, they often invite growth through ${meta.growth}.`,
        `A constructive Lo Shu practice with ${value}: notice where ${meta.trait.toLowerCase()} already shows up, then strengthen it gently through ${meta.growth}.`,
      ],
      bullets: [
        `Plane: ${plane}`,
        `Core trait: ${meta.trait}`,
        `Vedic nickname: ${meta.vedic}`,
        `Theme: ${meta.theme}`,
      ],
    };
  }

  if (topic === "vedic-square") {
    const n = Number(value);
    if (!VEDIC_SQUARE_KEYS.includes(value)) return null;
    const guide = squareDigitGuide(n);
    const oppLine = guide.opposite
      ? `In the play of opposites, ${guide.opposite.a} mirrors ${guide.opposite.b} (${guide.opposite.planets}): ${guide.opposite.theme}`
      : NINE_NOTE;
    return {
      title: `Vedic Square · ${value}`,
      subtitle: `${guide.theme} · appears ${guide.count} times`,
      paragraphs: [
        `In NumoraWisdom’s Vedic Square, digit ${value} is the digital root of products on a 9×9 multiplication grid. It appears ${guide.count} times when you highlight that tone.`,
        `${guide.theme}.`,
        oppLine,
        REDUCTION_TIP,
        `A practical focus with ${value}: ${guide.practice}`,
      ],
      strengths: guide.strengths,
      watchouts: guide.watchouts,
      bullets: [
        `Count in square: ${guide.count}`,
        guide.opposite
          ? `Opposite: ${guide.opposite.a} ↔ ${guide.opposite.b}`
          : "Opposite: none (9 stands alone)",
        guide.opposite ? `Planets: ${guide.opposite.planets}` : "Rim tone: persistent 9",
      ],
    };
  }

  if (topic === "projected-year") {
    const n = Number(value);
    const meta = PROJECTED_YEAR_META[n];
    if (!meta) return null;
    return {
      title: `Projected Year · ${value}`,
      subtitle: `${meta.planet} tone`,
      paragraphs: [
        meta.theme,
        PROJECTED_YEAR_METHOD_NOTE,
        `A practical focus: ${meta.practice}`,
      ],
      strengths: meta.strengths,
      watchouts: meta.watchouts,
      bullets: [
        `Planet tone: ${meta.planet}`,
        `Digit: ${value}`,
      ],
    };
  }

  if (topic === "planet") {
    const parsed = parsePlanetGuideValue(value);
    if (!parsed) return null;
    const guide = PLANET_GUIDES[parsed.id];
    const systemLabel =
      parsed.system === "pythagorean" ? "Pythagorean" : "Vedic";
    const traits =
      parsed.system === "pythagorean" ? guide.pythagorean : guide.vedic;
    const aka =
      parsed.system === "vedic" && guide.vedic.aka
        ? ` (${guide.vedic.aka})`
        : "";
    return {
      title: `${guide.name}${aka}`,
      subtitle: `${systemLabel} ruling-planet guide · ${guide.symbol}`,
      imageUrl: planetImageUrl(parsed.id),
      facts: [
        { label: "Distance / place", value: guide.distanceFromSun },
        { label: "Orbital period", value: guide.orbitalPeriod },
      ],
      paragraphs: [
        guide.astronomy,
        traits.note,
        `In NumoraWisdom, ${guide.name} is linked to numbers through ${systemLabel.toLowerCase()} tradition for reflective planet–number study.`,
      ],
      bullets: traits.traits,
    };
  }

  if (topic === "name-cornerstone") {
    const group = Number(value);
    const blurb = GROUP_BLURBS[group];
    if (!blurb) return null;
    const planet = planetForVedic(group);
    return {
      title: `Name letter group ${value}`,
      subtitle: `${blurb.theme} · ${planet.name}`,
      paragraphs: [
        "In Chaldean-style name traditions used in NumoraWisdom, the first letter of the first name (Cornerstone), last letter (Capstone), and first vowel are read as bookends—how beginnings, completions, and inner drive may feel in reflective practice.",
        `Letters in group ${value}: ${blurb.letters}.`,
        blurb.approach,
        blurb.growth,
      ],
      bullets: [
        `Chaldean group: ${value}`,
        `Associated planet theme: ${planet.name}`,
        `Letters: ${blurb.letters}`,
        `Theme: ${blurb.theme}`,
      ],
    };
  }

  if (topic === "name-first-vowel") {
    const fv = firstVowelMeaning(value);
    if (!fv) return null;
    return {
      title: `First vowel ${fv.vowel}`,
      subtitle: `Pythagorean tone · linked to ${fv.linkedNumber} · ${fv.theme}`,
      paragraphs: [
        "In Pythagorean-style name work, the first vowel of the first name is often read as an inner response style—how you meet the world from the inside.",
        fv.theme,
        fv.leadingVowelNote,
        `A constructive practice: ${fv.practice}`,
      ],
      strengths: fv.strengths,
      watchouts: fv.watchouts,
      bullets: [
        `Linked number energy: ${fv.linkedNumber}`,
        "System: Pythagorean name vowel emphasis",
      ],
    };
  }

  if (topic === "name-letter") {
    const lm = letterMeaning(value);
    if (!lm) return null;
    return {
      title: `Letter ${lm.letter}`,
      subtitle: `${lm.theme}`,
      paragraphs: [
        "Alphabet letters carry traditional number values. Pythagorean and Chaldean maps differ—NumoraWisdom shows both so you can compare systems without mixing their rules.",
        `A constructive practice with ${lm.letter}: ${lm.practice}`,
      ],
      strengths: lm.strengths,
      watchouts: lm.watchouts,
      facts: [
        { label: "Pythagorean value", value: String(lm.pythagorean) },
        {
          label: "Chaldean / NumoraWisdom Vedic map",
          value: lm.chaldean != null ? String(lm.chaldean) : "—",
        },
        {
          label: "Unit System",
          value: lm.unitSystem != null ? String(lm.unitSystem) : "—",
        },
      ],
      bullets: [`Theme: ${lm.theme}`],
    };
  }

  if (topic === "sun-sign") {
    const id = value.toLowerCase();
    if (!isSunSignId(id)) return null;
    const sign = SUN_SIGNS[id];
    return {
      title: `${sign.name} ${sign.symbol}`,
      subtitle: `Tropical sun sign · ${sign.element} · ${sign.modality} · ${sign.theme}`,
      paragraphs: [
        "Sun sign here uses the tropical calendar from month and day of birth (no birth time). It is a broad seasonal tone—complementary to numerology, not a full natal chart.",
        sign.theme,
        `A constructive practice: ${sign.practice}`,
      ],
      strengths: sign.strengths,
      watchouts: sign.watchouts,
      bullets: [
        `Element: ${sign.element}`,
        `Modality: ${sign.modality}`,
      ],
    };
  }

  const lens = TOPIC_LENSES[topic as keyof typeof TOPIC_LENSES];
  const blurb = blurbForTopic(topic, value);
  if (!lens || !blurb) return null;

  const n = Number(value);
  const unitSystem =
    (topic === "vedic-psychic" ||
      topic === "vedic-destiny" ||
      topic === "vedic-name") &&
    Number.isFinite(n) &&
    n >= 1 &&
    n <= 9
      ? UNIT_NUMBER_META[n]
      : null;

  const paragraphs = [
    lens.focus,
    `In the ${lens.system} reading of ${lens.aspect.toLowerCase()} ${value}, traditions associate this aspect with ${blurb.theme.toLowerCase()}.`,
  ];
  if (unitSystem) {
    paragraphs.push(
      `Planet link (Hindu/Vedic framing): ${unitSystem.planet}. Traits often listed: ${unitSystem.traits.join(", ")}.`,
    );
    if (topic === "vedic-psychic") {
      paragraphs.push(unitSystem.psychicNote);
      paragraphs.push(
        `Reflective temperament framing: ${unitSystem.dosha}; polarity ${unitSystem.polarity}.`,
      );
    }
    if (topic === "vedic-destiny") {
      paragraphs.push(unitSystem.destinyNote);
    }
    if (topic === "vedic-name") {
      paragraphs.push(
        "NumoraWisdom shows two name maps side by side: Chaldean-aligned Vedic letters, and Unit System letters (they disagree on some letters such as C and H).",
      );
    }
  }
  if (
    (topic === "vedic-psychic" ||
      topic === "vedic-destiny" ||
      topic === "vedic-name") &&
    Number.isFinite(n) &&
    n >= 1 &&
    n <= 9
  ) {
    const role =
      topic === "vedic-psychic"
        ? ("psychic" as const)
        : topic === "vedic-destiny"
          ? ("destiny" as const)
          : ("name" as const);
    const character = numberCharacterGuide(n, role);
    paragraphs.push(character.roleLens);
    paragraphs.push(...character.paragraphs);
    paragraphs.push(UNIT_AFFINITY_NOTE);
    paragraphs.push(
      `A constructive practice with ${lens.aspect.toLowerCase()} ${value}: ${blurb.practice}`,
    );

    return {
      title: `${lens.aspect} ${value}`,
      subtitle: `${lens.system} · Character of number ${value}`,
      paragraphs,
      strengths: [...(blurb.strengths ?? []), ...character.strengths].slice(
        0,
        6,
      ),
      watchouts: [...(blurb.watchouts ?? []), ...character.watchouts].slice(
        0,
        5,
      ),
      facts: character.facts,
      bullets: [
        `${lens.system} aspect: ${lens.aspect}`,
        ...character.bullets,
        ...(unitSystem
          ? [
              `Temperament theme: ${unitSystem.dosha}`,
              `Guna: ${unitSystem.guna}`,
            ]
          : []),
      ],
    };
  }
  paragraphs.push(
    `A constructive practice with ${lens.aspect.toLowerCase()} ${value}: ${blurb.practice}`,
  );

  return {
    title: `${lens.aspect} ${value}`,
    subtitle: `${lens.system} · ${blurb.theme}`,
    paragraphs,
    strengths: blurb.strengths,
    watchouts: blurb.watchouts,
    bullets: [
      `${lens.system} aspect: ${lens.aspect}`,
      ...(unitSystem
        ? [
            `Planet: ${unitSystem.planet}`,
            `Dosha theme: ${unitSystem.dosha}`,
            `Guna: ${unitSystem.guna}`,
          ]
        : []),
    ],
  };
}

export function allGuideParams(): { topic: string; value: string }[] {
  const params: { topic: string; value: string }[] = [];
  for (const { topic } of GUIDE_TOPICS) {
    if (topic === "lo-shu-arrow") {
      for (const value of Object.keys(LO_SHU_ARROW_GUIDES)) {
        params.push({ topic, value });
      }
    } else if (topic === "lo-shu-number") {
      for (const value of LO_SHU_NUMBER_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "vedic-square") {
      for (const value of VEDIC_SQUARE_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "projected-year") {
      for (const value of PROJECTED_YEAR_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "planet") {
      for (const system of ["pythagorean", "vedic"] as const) {
        for (const id of Object.keys(PLANET_GUIDES)) {
          params.push({ topic, value: `${system}-${id}` });
        }
      }
    } else if (topic === "name-cornerstone") {
      for (const value of NAME_CORNERSTONE_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "name-first-vowel") {
      for (const value of FIRST_VOWEL_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "name-letter") {
      for (const value of LETTER_KEYS) {
        params.push({ topic, value });
      }
    } else if (topic === "sun-sign") {
      for (const value of Object.keys(SUN_SIGNS)) {
        params.push({ topic, value });
      }
    } else {
      for (const value of NUMBER_KEYS) {
        params.push({ topic, value });
      }
    }
  }
  return params;
}

export function guideHref(topic: GuideTopic, value: string | number): string {
  return `/guide/${topic}/${value}`;
}
