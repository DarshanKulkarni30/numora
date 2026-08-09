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
  | "lo-shu-arrow";

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
];

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];

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

export const LO_SHU_ARROW_GUIDES: Record<
  string,
  { title: string; numbers: number[]; present: string; missing: string }
> = {
  planning: {
    title: "Arrow of Planning (Mental)",
    numbers: [4, 9, 2],
    present:
      "According to Lo Shu traditions, a present planning arrow may indicate comfort with foresight, organization of ideas, and mental mapping.",
    missing:
      "A missing planning arrow may suggest a growth opportunity in structuring thoughts and planning ahead—through habits, not fixed limits.",
  },
  will: {
    title: "Arrow of Will (Emotional)",
    numbers: [3, 5, 7],
    present:
      "A present will arrow may indicate emotional drive, expressive feeling, and resilience in the middle emotional plane.",
    missing:
      "A missing will arrow may invite conscious improvement in emotional steadiness and expressive confidence.",
  },
  action: {
    title: "Arrow of Action (Practical)",
    numbers: [8, 1, 6],
    present:
      "A present action arrow may indicate practical follow-through and comfort turning plans into tangible steps.",
    missing:
      "A missing action arrow may suggest building routines that convert ideas into completed actions.",
  },
  thought: {
    title: "Arrow of Thought",
    numbers: [4, 3, 8],
    present:
      "A present thought arrow may indicate analytical sequencing and a constructive thinking style.",
    missing:
      "A missing thought arrow may invite practice in orderly thinking and clearer mental frameworks.",
  },
  determination: {
    title: "Arrow of Determination",
    numbers: [9, 5, 1],
    present:
      "A present determination arrow may indicate persistence and centered resolve.",
    missing:
      "A missing determination arrow may suggest cultivating steady commitment on meaningful goals.",
  },
  practicality: {
    title: "Arrow of Practicality",
    numbers: [2, 7, 6],
    present:
      "A present practicality arrow may indicate grounded judgment and useful problem-solving.",
    missing:
      "A missing practicality arrow may invite more hands-on learning and real-world testing of ideas.",
  },
  intellect: {
    title: "Arrow of Intellect",
    numbers: [4, 5, 6],
    present:
      "A present intellect arrow may indicate quick learning across structured and adaptive modes.",
    missing:
      "A missing intellect arrow may suggest growth through study mixes—structure plus curiosity.",
  },
  emotion: {
    title: "Arrow of Emotion",
    numbers: [2, 5, 8],
    present:
      "A present emotion arrow may indicate rich emotional awareness linked with practical expression.",
    missing:
      "A missing emotion arrow may invite safer emotional naming and supportive connection habits.",
  },
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
  return NUMBER_KEYS.includes(value);
}

export function getGuidePage(topic: GuideTopic, value: string) {
  if (topic === "lo-shu-arrow") {
    const arrow = LO_SHU_ARROW_GUIDES[value];
    if (!arrow) return null;
    return {
      title: arrow.title,
      subtitle: `Numbers ${arrow.numbers.join(" · ")}`,
      paragraphs: [
        "According to Lo Shu grid traditions, arrows describe patterns across the birth-date square. They are reflective metaphors, not guarantees.",
        arrow.present,
        arrow.missing,
        "Use present arrows as strengths to steward, and missing arrows as conscious improvement areas—never as fixed destiny.",
      ],
      bullets: arrow.numbers.map((n) => `Grid number ${n} participates in this arrow pattern.`),
    };
  }

  const blurb = NUMBER_BLURBS[value];
  if (!blurb) return null;
  const label = topicLabel(topic);
  return {
    title: `${label} ${value}`,
    subtitle: blurb.theme,
    paragraphs: [
      `According to numerology traditions, ${label.toLowerCase()} number ${value} may indicate ${blurb.theme.toLowerCase()}.`,
      "These interpretations are belief-based possibilities for self-reflection. They are not scientific, medical, legal, financial, or psychological advice—and they do not predict fixed outcomes.",
      `A constructive practice with ${label.toLowerCase()} ${value}: ${blurb.practice}`,
    ],
    bullets: blurb.traits,
  };
}

export function allGuideParams(): { topic: string; value: string }[] {
  const params: { topic: string; value: string }[] = [];
  for (const { topic } of GUIDE_TOPICS) {
    if (topic === "lo-shu-arrow") {
      for (const value of Object.keys(LO_SHU_ARROW_GUIDES)) {
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
