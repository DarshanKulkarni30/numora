import { LO_SHU_NUMBER_META } from "@/lib/numerology/loShuEffects";
import {
  parsePlanetGuideValue,
  PLANET_GUIDES,
  planetImageUrl,
} from "@/lib/guides/planets";

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
  | "planet";

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
  { topic: "planet", title: "Planet" },
];

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];
const LO_SHU_NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const NUMBER_BLURBS: Record<string, { theme: string; traits: string[]; practice: string }> = {
  "1": {
    theme: "Initiative and independent direction",
    traits: ["Self-starting energy", "Leadership instincts", "Original approaches"],
    practice: "Balance decisive action with listening and collaboration.",
  },
  "2": {
    theme: "Cooperation and sensitive partnership",
    traits: ["Diplomatic awareness", "Patience", "Supportive presence"],
    practice: "State needs clearly while keeping warmth in relationships.",
  },
  "3": {
    theme: "Expression, creativity, and social warmth",
    traits: ["Communicative flair", "Optimism", "Imaginative thinking"],
    practice: "Finish creative starts and listen as actively as you speak.",
  },
  "4": {
    theme: "Structure, reliability, and steady building",
    traits: ["Practical follow-through", "Systems thinking", "Endurance"],
    practice: "Allow flexibility inside routines so structure stays alive.",
  },
  "5": {
    theme: "Freedom, curiosity, and adaptable movement",
    traits: ["Versatility", "Learning by experience", "Quick pivots"],
    practice: "Commit long enough to deepen skill while keeping exploration.",
  },
  "6": {
    theme: "Care, responsibility, and harmony",
    traits: ["Nurturing instincts", "Aesthetic sense", "Loyalty"],
    practice: "Care without over-responsibility; receive support as well.",
  },
  "7": {
    theme: "Insight, analysis, and inward clarity",
    traits: ["Reflective depth", "Discernment", "Study orientation"],
    practice: "Share insights with trusted people and move from thought to action.",
  },
  "8": {
    theme: "Stewardship, ambition, and material mastery",
    traits: ["Strategic focus", "Resource awareness", "Leadership of systems"],
    practice: "Define success beyond status and pace ambition ethically.",
  },
  "9": {
    theme: "Compassion, completion, and broad vision",
    traits: ["Empathy", "Mentoring impulse", "Release of old chapters"],
    practice: "Serve without erasing personal needs; complete before collecting.",
  },
  "11": {
    theme: "Inspired intuition and illuminating ideas",
    traits: ["Heightened sensitivity", "Motivational insight", "Visionary flashes"],
    practice: "Ground intuition with rest, verification, and simple habits.",
  },
  "22": {
    theme: "Large-scale building with practical vision",
    traits: ["Long-range stamina", "Coordination skill", "Manifesting capacity"],
    practice: "Break big visions into weekly steps and celebrate milestones.",
  },
  "33": {
    theme: "Compassionate teaching and elevated care",
    traits: ["Uplifting influence", "Creative nurture", "Service through example"],
    practice: "Teach without self-sacrifice; model boundaries as care.",
  },
};

type TopicLens = {
  system: string;
  aspect: string;
  /** How this aspect uses the number — unique per topic */
  focus: string;
};

const TOPIC_LENSES: Record<
  Exclude<GuideTopic, "lo-shu-arrow" | "lo-shu-number" | "planet">,
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
      "Vedic name number maps letters with Indian-style associations used in Numora. It is reflective name vibration within the Vedic panel—not a substitute for Psychic or Destiny.",
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
  if (topic === "planet") return parsePlanetGuideValue(value) != null;
  return NUMBER_KEYS.includes(value);
}

function disclaimer(): string {
  return "These interpretations are belief-based possibilities for self-reflection. They are not scientific, medical, legal, financial, or psychological advice—and they do not predict fixed outcomes.";
}

export function getGuidePage(topic: GuideTopic, value: string): GuidePage | null {
  if (topic === "lo-shu-arrow") {
    const arrow = LO_SHU_ARROW_GUIDES[value];
    if (!arrow) return null;
    return {
      title: arrow.title,
      subtitle: `Numbers ${arrow.numbers.join(" · ")}`,
      paragraphs: [
        "According to Lo Shu grid traditions, arrows describe patterns across the birth-date square. They are reflective metaphors, not guarantees.",
        arrow.significance,
        arrow.present,
        arrow.missing,
        "Use present arrows as strengths to steward, and missing arrows as conscious improvement areas—never as fixed destiny.",
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
        disclaimer(),
        `A constructive Lo Shu practice with ${value}: notice where ${meta.trait.toLowerCase()} already shows up, then strengthen it gently through ${meta.growth}—without treating the grid as fate.`,
      ],
      bullets: [
        `Plane: ${plane}`,
        `Core trait: ${meta.trait}`,
        `Vedic nickname: ${meta.vedic}`,
        `Theme: ${meta.theme}`,
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
        disclaimer(),
        "Planet links in Numora are traditional number associations for reflection—not astronomy forecasts, kundli predictions, or medical advice.",
      ],
      bullets: traits.traits,
    };
  }

  const lens = TOPIC_LENSES[topic as keyof typeof TOPIC_LENSES];
  const blurb = NUMBER_BLURBS[value];
  if (!lens || !blurb) return null;

  return {
    title: `${lens.aspect} ${value}`,
    subtitle: `${lens.system} · ${blurb.theme}`,
    paragraphs: [
      lens.focus,
      `In the ${lens.system} reading of ${lens.aspect.toLowerCase()} ${value}, traditions may associate this number with ${blurb.theme.toLowerCase()}.`,
      disclaimer(),
      `A constructive practice with ${lens.aspect.toLowerCase()} ${value}: ${blurb.practice}`,
    ],
    bullets: [
      `${lens.system} aspect: ${lens.aspect}`,
      ...blurb.traits.map((t) => `${t} (as ${lens.aspect.toLowerCase()} emphasis)`),
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
    } else if (topic === "planet") {
      for (const system of ["pythagorean", "vedic"] as const) {
        for (const id of Object.keys(PLANET_GUIDES)) {
          params.push({ topic, value: `${system}-${id}` });
        }
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
