/**
 * Adjacent two-digit conjunctions. Ratings are research-weighted traditional
 * lean, not objective harm. Motifs are original Numora lines.
 */

export type PairKind =
  | "highlyFavourable"
  | "favourable"
  | "neutral"
  | "mildConflict"
  | "strongConflict"
  | "severeConflict";

export type CompoundPair = {
  pair: string;
  kind: PairKind;
  raw: number;
  motif: string;
  index: number;
};

export const PAIR_RAW: Record<PairKind, number> = {
  highlyFavourable: 5,
  favourable: 4,
  neutral: 2,
  mildConflict: 0,
  strongConflict: -3,
  severeConflict: -5,
};

export const PAIR_LABEL: Record<PairKind, string> = {
  highlyFavourable: "Strong lift",
  favourable: "Lift",
  neutral: "Contextual",
  mildConflict: "Uneasy",
  strongConflict: "High conflict",
  severeConflict: "Severe conflict",
};

/** Hard-stop set: clearest overlapping traditional warnings. */
const SEVERE = new Set([
  "00", "14", "16", "18", "22", "26", "28", "34", "43", "44", "45", "46",
  "48", "49", "61", "62", "64", "68", "77", "81", "82", "84", "86", "88",
  "89", "94", "98", "99",
]);

const STRONG = new Set([
  "04", "08", "21", "27", "54", "58", "63", "72", "76", "78", "80", "85",
  "87",
]);

const HIGHLY = new Set([
  "10", "12", "13", "15", "17", "19", "23", "24", "25", "29", "31", "35",
  "37", "47", "51", "52", "53", "56", "57", "65", "71", "73", "74", "75",
  "83", "91", "95",
]);

const FAVOURABLE = new Set([
  "11", "33", "39", "50", "55", "59", "66", "69", "79", "92", "93", "97",
]);

const MILD = new Set([
  "32", "38", "41", "96",
]);

/** Short original themes — not source prose. */
const THEME: Record<string, string> = {
  "00": "Empty pause; weaker if it ends the number",
  "01": "A start that arrives slowly",
  "02": "Soft mood, a little diluted",
  "03": "Voice with a quieter landing",
  "04": "Plans that keep shifting",
  "05": "Talk that comes in bursts",
  "06": "Ease with a faint outline",
  "07": "Inward turn, less contact",
  "08": "Slow work with a hollow stretch",
  "09": "Drive that starts and stops",
  "10": "A clean start and a lead tone",
  "11": "Double lead — bright, can get loud",
  "12": "Warm support around a start",
  "13": "Teaching and a useful reset",
  "14": "Motion with shaky money themes",
  "15": "Talk, help, and follow-through",
  "16": "Sudden turns in close ties",
  "17": "Public role and recognition",
  "18": "Duty and friction around elders",
  "19": "Independence with a strong finish",
  "20": "Feeling first, form later",
  "21": "Charm that spends freely",
  "22": "Mood swings when 2 stacks",
  "23": "Clear talk and useful ideas",
  "24": "Home, help, and ease",
  "25": "Quiet knowing and study",
  "26": "Partnership strain in tradition",
  "27": "Insight with an uneven pulse",
  "28": "A traditionally unstable join",
  "29": "Earning through ordinary work",
  "30": "Ideas without much ground",
  "31": "Craft, study, and a public face",
  "32": "Social reach; schools disagree",
  "33": "Teaching heat — excess scatters",
  "34": "Structure that fights the voice",
  "35": "Sharp talk and money sense",
  "36": "Schools split on this join",
  "37": "Protection and a bright mix",
  "38": "Property heat with extra friction",
  "39": "Wisdom with a sharp edge",
  "40": "Cool systems, little warmth",
  "41": "Ambition with official snags",
  "42": "Home and work in a trade-off",
  "43": "A jolt that breaks the plan",
  "44": "Heavy delay when 4 doubles",
  "45": "Work and health friction in tradition",
  "46": "Money and habit strain",
  "47": "Clean research and backbone",
  "48": "A traditionally severe money join",
  "49": "Heat plus unstable structure",
  "50": "Movement with a soft start",
  "51": "Money, voice, and authority",
  "52": "Healing talk and study",
  "53": "A public, followed voice",
  "54": "Fast travel, easy to tire",
  "55": "Quick mind — stacks get restless",
  "56": "Charm in work and talk",
  "57": "Writing and quiet counsel",
  "58": "Gains that arrive the hard way",
  "59": "Recovery energy with extra risk",
  "60": "Comfort with a faint outline",
  "61": "Close-tie strain in some schools",
  "62": "Family and study friction",
  "63": "Often read as relationship strain",
  "64": "Money and habit obstacles",
  "65": "Social ease and trade",
  "66": "Comfort and company — once",
  "67": "Attraction with a private pull",
  "68": "Material pressure in tradition",
  "69": "Planning and comfort, mixed reads",
  "70": "Inward, a little foggy",
  "71": "Lead role and official rooms",
  "72": "Warmth with joint-work wobble",
  "73": "Art and knowledge landing well",
  "74": "Research with a straight spine",
  "75": "A messenger pace",
  "76": "Charm with private snags",
  "77": "Deep inward — isolation if stacked",
  "78": "Long work, some missed doors",
  "79": "Independence away from the old base",
  "80": "Delay plus an empty beat",
  "81": "Duty and health friction in tradition",
  "82": "A traditionally unstable join",
  "83": "Property and counsel that can help",
  "84": "A traditionally severe money join",
  "85": "Hard gains with extra risk",
  "86": "Material and tie complications",
  "87": "Healing tone, some isolation",
  "88": "Double delay and extra weight",
  "89": "Power with conflict themes",
  "90": "Drive with a hollow start",
  "91": "Authority with a clean name",
  "92": "Earning; the home tone matters",
  "93": "Knowledge with family spark",
  "94": "Heat plus unstable structure",
  "95": "Talk that recovers ground",
  "96": "Comfort with mixed close-tie reads",
  "97": "Study and a private path",
  "98": "Gains that arrive through delay",
  "99": "High heat when 9 doubles",
};

export function pairKind(pair: string): PairKind {
  if (SEVERE.has(pair)) return "severeConflict";
  if (HIGHLY.has(pair)) return "highlyFavourable";
  if (FAVOURABLE.has(pair)) return "favourable";
  if (STRONG.has(pair)) return "strongConflict";
  if (MILD.has(pair)) return "mildConflict";
  return "neutral";
}

export function pairRawScore(pair: string): number {
  return PAIR_RAW[pairKind(pair)];
}

export function normalizePairRaw(raw: number): number {
  return (raw + 5) / 10;
}

export function isSeverePair(pair: string): boolean {
  return SEVERE.has(pair);
}

export function pairMotif(pair: string): string {
  return THEME[pair] ?? "A mixed join of the two digits.";
}

export function pairDirectionNote(pair: string): string {
  const a = pair[0];
  const b = pair[1];
  if (a === b) return `${a} then ${b} again — a same-digit join.`;
  const rev = `${b}${a}`;
  const same = pairKind(pair) === pairKind(rev);
  if (same) {
    return `${a}→${b} (reverse ${rev} sits in a similar band).`;
  }
  return `${a}→${b} is not the same as ${rev} — direction is kept.`;
}

export function slidingPairs(digits: string): CompoundPair[] {
  const out: CompoundPair[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    const pair = digits.slice(i, i + 2);
    if (!/^\d{2}$/.test(pair)) continue;
    const kind = pairKind(pair);
    out.push({
      pair,
      kind,
      raw: PAIR_RAW[kind],
      motif: pairMotif(pair),
      index: i,
    });
  }
  return out;
}

export function pairFrequencies(pairs: CompoundPair[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of pairs) {
    map.set(p.pair, (map.get(p.pair) ?? 0) + 1);
  }
  return map;
}

/** Nonlinear weights: 1st=1, 2nd=1.5, 3rd=2.25, 4th+=3.5 */
export const OCCURRENCE_WEIGHT = [1, 1.5, 2.25, 3.5];

export function occurrenceWeight(occurrenceIndex: number): number {
  return OCCURRENCE_WEIGHT[Math.min(Math.max(occurrenceIndex, 0), 3)];
}

export function meanNormalizedPairs(pairs: CompoundPair[]): number {
  if (pairs.length === 0) return 0.5;
  const sum = pairs.reduce((s, p) => s + normalizePairRaw(p.raw), 0);
  return sum / pairs.length;
}

export function compoundPairKey(compound: number): string {
  let n = Math.abs(Math.trunc(compound));
  if (n <= 9) return `0${n}`;
  while (n > 99) {
    n = String(n)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return String(n).padStart(2, "0");
}

export function isAdverseKind(kind: PairKind): boolean {
  return (
    kind === "mildConflict" ||
    kind === "strongConflict" ||
    kind === "severeConflict"
  );
}
