/** Role-aware watch-outs (−) for guide numbers — NumoraWisdom-original wording. */

type Map = Record<string, string[]>;

const CORE: Map = {
  "1": [
    "Impatience when others move slower",
    "Sensitivity to criticism under a bold exterior",
    "Going it alone when collaboration would help",
  ],
  "2": [
    "Over-accommodating until resentment builds",
    "Indecision when harmony feels threatened",
    "Absorbing others’ moods without a reset",
  ],
  "3": [
    "Scattering energy across too many starts",
    "Performing brightness instead of finishing craft",
    "Avoiding hard feedback with humor",
  ],
  "4": [
    "Rigidity when plans need revision",
    "Overwork mistaken for worth",
    "Resistance to spontaneous opportunities",
  ],
  "5": [
    "Restlessness that abandons depth too soon",
    "Overcommitting to novelty",
    "Freedom used as escape from responsibility",
  ],
  "6": [
    "Over-responsibility for others’ outcomes",
    "Difficulty receiving care",
    "Perfectionism in home or duty roles",
  ],
  "7": [
    "Isolation that starves connection",
    "Analysis paralysis",
    "Dismissing ordinary joys as shallow",
  ],
  "8": [
    "Status pressure crowding integrity",
    "Work identity eclipsing rest",
    "Controlling outcomes instead of stewarding people",
  ],
  "9": [
    "Over-giving until personal needs disappear",
    "Difficulty closing chapters cleanly",
    "Idealism without practical next steps",
  ],
  "11": [
    "Nervous overstimulation",
    "Idealism without grounding habits",
    "Feeling misunderstood and withdrawing",
  ],
  "22": [
    "Overwhelm from oversized visions",
    "Skipping foundations to chase scale",
    "Burnout from carrying every brick alone",
  ],
  "33": [
    "Compassion fatigue",
    "Teaching everyone except yourself rest",
    "Boundaries dissolving under caretaking",
  ],
};

const LIFE_PATH: Map = {
  "1": [
    "Life lessons around ego vs true leadership",
    "Repeating solo battles that need allies",
    "Fear of failure blocking starts",
  ],
  "5": [
    "Lifelong tug-of-war between freedom and commitment",
    "Changing lanes before mastery ripens",
    "Using variety to avoid emotional depth",
  ],
  "8": [
    "Power lessons that test ethics under pressure",
    "Equating self-worth with accumulation",
    "Delayed rest until the body forces it",
  ],
};

const EXPRESSION: Map = {
  "5": [
    "Public versatility without a clear specialty",
    "Persuasion used faster than follow-through",
    "Reputation for changeability over reliability",
  ],
  "3": [
    "Talent visible before craft is finished",
    "Saying yes to every creative invite",
    "Charm covering missed deadlines",
  ],
};

const SOUL_URGE: Map = {
  "5": [
    "Inner restlessness when life feels static",
    "Craving options even inside good commitments",
    "Emotional drain from too much stimulation",
  ],
  "2": [
    "Private need for reassurance going unspoken",
    "Peacekeeping that silences true desire",
  ],
};

const PERSONALITY: Map = {
  "5": [
    "First impressions of flightiness",
    "Others expecting constant spontaneity",
    "Mask of freedom hiding need for anchors",
  ],
  "7": [
    "Coming across as aloof or hard to know",
    "Privacy misread as disinterest",
  ],
};

const VEDIC_PSYCHIC: Map = {
  "1": [
    "Impatience when results arrive slowly",
    "Over-controlling rooms that need collaboration",
  ],
  "2": [
    "Taking criticism too personally",
    "Quiet withdrawal instead of clear needs",
  ],
  "3": [
    "Scattered ideas without finishing",
    "Advice offered before consent",
  ],
  "4": [
    "Rigidity when a flexible lane would work",
    "Restlessness without a constructive project",
  ],
  "5": [
    "Mercurial mind jumping topics mid-conversation",
    "Curiosity without completing messages or deals",
  ],
  "6": [
    "Caretaking past healthy boundaries",
    "Avoiding hard talks to keep the peace",
  ],
  "7": [
    "Isolation mistaken for wisdom",
    "Skepticism that pushes allies away",
  ],
  "8": [
    "Saturn heaviness in daily mood",
    "Harsh self-judgment for slow progress",
  ],
  "9": [
    "Impulse before reflection",
    "Scattered focus across too many missions",
  ],
};

const VEDIC_DESTINY: Map = {
  "1": [
    "Clashing with other strong wills for the same lead role",
    "Visibility pursuits that skip fairness",
  ],
  "2": [
    "Over-depending on partners for direction",
    "Delaying decisions to keep harmony",
  ],
  "3": [
    "Optimism without follow-through on path goals",
    "Teaching others while skipping own practice",
  ],
  "4": [
    "Unconventional destiny creating instability if unfocused",
    "Fighting structure instead of inventing better structure",
  ],
  "5": [
    "Path restlessness when livelihood needs roots",
    "Networking without deepening one trade",
  ],
  "6": [
    "Service path that erases personal needs",
    "Comfort-seeking that avoids necessary change",
  ],
  "7": [
    "Mastery path that becomes chronic withdrawal",
    "Dismissing practical support as “shallow”",
  ],
  "8": [
    "Grinding past recovery in pursuit of status",
    "Measuring worth only by material milestones",
  ],
  "9": [
    "Holding the past too tightly on a completion path",
    "Starting new causes before finishing the last",
  ],
};

const CHALDEAN: Map = {
  "4": [
    "Name vibration of upheaval without rebuild plans",
    "Unusual energy read as inconsistency",
  ],
  "5": [
    "Mercurial name tone without message clarity",
    "Wit outrunning substance in introductions",
  ],
};

const CYCLE: Map = {
  "5": [
    "Over-scheduling change in a freedom cycle",
    "Leaving stability projects unfinished",
  ],
  "9": [
    "Forcing new starts before endings complete",
    "Emotional clutter from unclosed loops",
  ],
};

const BY_TOPIC: Record<string, Map> = {
  "life-path": LIFE_PATH,
  expression: EXPRESSION,
  "soul-urge": SOUL_URGE,
  personality: PERSONALITY,
  "birth-day": {},
  maturity: {},
  "vedic-psychic": VEDIC_PSYCHIC,
  "vedic-destiny": VEDIC_DESTINY,
  "vedic-name": VEDIC_PSYCHIC,
  "chaldean-name": CHALDEAN,
  "personal-year": CYCLE,
  "personal-month": CYCLE,
};

export function watchoutsFor(topic: string, value: string): string[] {
  const specific = BY_TOPIC[topic]?.[value];
  const core = CORE[value] ?? [
    "Imbalance when the theme is overplayed",
    "Ignoring the constructive practice for this number",
  ];
  if (!specific?.length) return core.slice(0, 3);
  // Prefer role-specific, pad with core
  const merged = [...specific];
  for (const c of core) {
    if (merged.length >= 3) break;
    if (!merged.includes(c)) merged.push(c);
  }
  return merged.slice(0, 3);
}
