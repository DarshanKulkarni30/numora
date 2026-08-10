import type { PlanetId } from "@/lib/numerology/planets";
import { PLANETS } from "@/lib/numerology/planets";

export type PlanetGuide = {
  id: PlanetId;
  name: string;
  symbol: string;
  /** Wikimedia Commons filename for Special:Redirect/file */
  imageFile: string | null;
  distanceFromSun: string;
  orbitalPeriod: string;
  astronomy: string;
  pythagorean: { traits: string[]; note: string };
  vedic: { traits: string[]; note: string; aka?: string };
};

export const PLANET_GUIDES: Record<PlanetId, PlanetGuide> = {
  sun: {
    id: "sun",
    name: "Sun",
    symbol: "☉",
    imageFile: "Sun_in_February_(black_background).jpg",
    distanceFromSun: "Center of the solar system (reference body)",
    orbitalPeriod: "Earth orbits the Sun in ~365.25 days",
    astronomy:
      "The Sun is the star at the center of our solar system. Its light and gravity shape the orbital dance of the planets.",
    pythagorean: {
      traits: ["Leadership", "Vitality", "Self-direction", "Visibility"],
      note: "In Pythagorean-style number links, the Sun often pairs with 1 — initiative and pioneering presence.",
    },
    vedic: {
      traits: ["Authority", "Soul vitality", "Father/mentor themes", "Clarity of will"],
      note: "In Vedic number tradition, Surya (Sun) often pairs with 1 — confidence and rightful self-expression.",
      aka: "Surya",
    },
  },
  moon: {
    id: "moon",
    name: "Moon",
    symbol: "☽",
    imageFile: "FullMoon2010.jpg",
    distanceFromSun: "~1 AU with Earth (Earth–Moon system)",
    orbitalPeriod: "~27.3 days to orbit Earth",
    astronomy:
      "Earth’s natural satellite; tides and night illumination are shaped by its phases and proximity.",
    pythagorean: {
      traits: ["Sensitivity", "Intuition", "Nurture", "Emotional rhythm"],
      note: "Often linked with 2 (and master 11) — partnership awareness and receptive insight.",
    },
    vedic: {
      traits: ["Mind (manas)", "Mood cycles", "Care", "Adaptability"],
      note: "Chandra (Moon) often pairs with 2 — feeling life and responding with empathy.",
      aka: "Chandra",
    },
  },
  mars: {
    id: "mars",
    name: "Mars",
    symbol: "♂",
    imageFile: "OSIRIS_Mars_true_color.jpg",
    distanceFromSun: "~1.5 AU average",
    orbitalPeriod: "~687 Earth days",
    astronomy:
      "A rocky planet outward of Earth, known for its reddish iron-rich surface and thin atmosphere.",
    pythagorean: {
      traits: ["Drive", "Courage", "Action", "Assertiveness"],
      note: "Often linked with 9 — completion energy expressed through decisive movement.",
    },
    vedic: {
      traits: ["Energy (tej)", "Courage", "Sibling themes", "Focused effort"],
      note: "Mangala (Mars) often pairs with 9 — bold effort tempered by ethics.",
      aka: "Mangala",
    },
  },
  mercury: {
    id: "mercury",
    name: "Mercury",
    symbol: "☿",
    imageFile: "Mercury_in_color_-_Prockter07_centered.jpg",
    distanceFromSun: "~0.39 AU",
    orbitalPeriod: "~88 Earth days",
    astronomy:
      "The innermost planet; small, fast-orbiting, with extreme day–night temperature swings.",
    pythagorean: {
      traits: ["Communication", "Curiosity", "Agility", "Learning"],
      note: "Often linked with 5 — adaptable minds and lively exchange.",
    },
    vedic: {
      traits: ["Buddhi (intellect)", "Speech", "Trade", "Wit"],
      note: "Budha (Mercury) often pairs with 5 — clever movement between ideas and people.",
      aka: "Budha",
    },
  },
  jupiter: {
    id: "jupiter",
    name: "Jupiter",
    symbol: "♃",
    imageFile: "Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
    distanceFromSun: "~5.2 AU",
    orbitalPeriod: "~12 Earth years",
    astronomy:
      "The largest planet—a gas giant with a strong magnetic field and many moons.",
    pythagorean: {
      traits: ["Growth", "Optimism", "Teaching", "Expansion"],
      note: "Often linked with 3 — expressive learning and generous outlook.",
    },
    vedic: {
      traits: ["Guru wisdom", "Dharma guidance", "Fortune themes", "Mentorship"],
      note: "Guru / Brihaspati (Jupiter) often pairs with 3 — guidance through knowledge.",
      aka: "Guru / Brihaspati",
    },
  },
  venus: {
    id: "venus",
    name: "Venus",
    symbol: "♀",
    imageFile: "Venus_globe.jpg",
    distanceFromSun: "~0.72 AU",
    orbitalPeriod: "~225 Earth days",
    astronomy:
      "Earth’s nearest planetary neighbor; dense atmosphere and bright appearance in our sky.",
    pythagorean: {
      traits: ["Harmony", "Aesthetics", "Affection", "Values"],
      note: "Often linked with 6 (and 33) — care, beauty, and relational warmth.",
    },
    vedic: {
      traits: ["Shukra — pleasure with wisdom", "Arts", "Partnership", "Comfort"],
      note: "Shukra (Venus) often pairs with 6 — refining desire into lasting care.",
      aka: "Shukra",
    },
  },
  saturn: {
    id: "saturn",
    name: "Saturn",
    symbol: "♄",
    imageFile: "Saturn_during_Equinox.jpg",
    distanceFromSun: "~9.5 AU",
    orbitalPeriod: "~29.5 Earth years",
    astronomy:
      "A gas giant famous for its ring system; slow orbit and many moons.",
    pythagorean: {
      traits: ["Discipline", "Structure", "Stewardship", "Time mastery"],
      note: "Often linked with 8 — ambition grounded in responsibility.",
    },
    vedic: {
      traits: ["Shani — karma & patience", "Duty", "Endurance", "Boundaries"],
      note: "Shani (Saturn) often pairs with 8 — ripening through steady effort.",
      aka: "Shani",
    },
  },
  rahu: {
    id: "rahu",
    name: "Rahu",
    symbol: "☊",
    imageFile: null,
    distanceFromSun: "Lunar node (not a physical planet)",
    orbitalPeriod: "Nodal cycle ~18.6 years (traditional)",
    astronomy:
      "In astronomy, Rahu corresponds to the ascending lunar node—where Moon’s path crosses the ecliptic northward. It is a mathematical point, not a solid body.",
    pythagorean: {
      traits: ["Less emphasized in classic Pythagorean planet lists"],
      note: "Western Pythagorean tables in Numora map 4 to Uranus instead of Rahu.",
    },
    vedic: {
      traits: ["Desire amplification", "Unconventional paths", "Innovation hunger", "Shadow work"],
      note: "Rahu often pairs with 4 — sudden turns, foreign influence, and intense appetite for experience.",
      aka: "North Node / Caput Draconis (traditional)",
    },
  },
  ketu: {
    id: "ketu",
    name: "Ketu",
    symbol: "☋",
    imageFile: null,
    distanceFromSun: "Lunar node (not a physical planet)",
    orbitalPeriod: "Nodal cycle ~18.6 years (traditional)",
    astronomy:
      "Ketu corresponds to the descending lunar node—the south node of the Moon’s path. Like Rahu, it is a point in space, not a planet with a surface.",
    pythagorean: {
      traits: ["Less emphasized in classic Pythagorean planet lists"],
      note: "Western Pythagorean tables in Numora map 7 to Neptune instead of Ketu.",
    },
    vedic: {
      traits: ["Detachment", "Insight flashes", "Past-pattern release", "Spiritual curiosity"],
      note: "Ketu often pairs with 7 — inward seeing and letting go of excess.",
      aka: "South Node / Cauda Draconis (traditional)",
    },
  },
  uranus: {
    id: "uranus",
    name: "Uranus",
    symbol: "♅",
    imageFile: "Uranus2.jpg",
    distanceFromSun: "~19.2 AU",
    orbitalPeriod: "~84 Earth years",
    astronomy:
      "An ice giant that rotates on its side; discovered in 1781, far beyond Saturn.",
    pythagorean: {
      traits: ["Innovation", "Freedom from habit", "Sudden insight", "Reform"],
      note: "Often linked with 4 (and 22) in Numora’s Pythagorean table — original structure-breaking.",
    },
    vedic: {
      traits: ["Not a classical Navagraha planet"],
      note: "Modern Vedic practice sometimes discusses Uranus, but Numora’s Vedic number map uses Rahu for 4 instead.",
    },
  },
  neptune: {
    id: "neptune",
    name: "Neptune",
    symbol: "♆",
    imageFile: "Neptune_Full.jpg",
    distanceFromSun: "~30.1 AU",
    orbitalPeriod: "~165 Earth years",
    astronomy:
      "The outermost major planet in common lists—an ice giant with strong winds and a deep blue appearance.",
    pythagorean: {
      traits: ["Imagination", "Compassion", "Idealism", "Subtle perception"],
      note: "Often linked with 7 in Numora’s Pythagorean table — inward vision and dreamlike sensing.",
    },
    vedic: {
      traits: ["Not a classical Navagraha planet"],
      note: "Numora’s Vedic number map uses Ketu for 7 instead of Neptune.",
    },
  },
};

export function planetImageUrl(id: PlanetId, width = 480): string | null {
  const file = PLANET_GUIDES[id]?.imageFile;
  if (!file) return null;
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
}

export function parsePlanetGuideValue(
  value: string,
): { system: "pythagorean" | "vedic"; id: PlanetId } | null {
  const m = /^(pythagorean|vedic)-([a-z]+)$/.exec(value);
  if (!m) return null;
  const id = m[2] as PlanetId;
  if (!(id in PLANETS)) return null;
  return { system: m[1] as "pythagorean" | "vedic", id };
}

export function planetGuideHref(
  system: "pythagorean" | "vedic",
  id: PlanetId,
): string {
  return `/guide/planet/${system}-${id}`;
}
