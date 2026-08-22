/** Public-figure gold set — date numbers + Wikidata events. Calibration only. */

export type FigureField = "wealth" | "film" | "sport" | "politics";

export type ResearchEventType =
  | "marriage"
  | "union_ended"
  | "award"
  | "office_start";

export type PublicFigureSeed = {
  name: string;
  wiki: string;
  field: FigureField;
  country: string;
};

export type ResearchEvent = {
  type: ResearchEventType;
  year: number;
  month: number | null;
  label: string;
  source: string;
  personalYear: number;
  pinnacleId: number;
  pinnacleNumber: number;
};

export type PublicFigureRow = {
  name: string;
  wiki: string;
  qid: string;
  field: FigureField;
  country: string;
  dob: string;
  dobIso: string;
  deathIso?: string | null;
  dateSource: string;
  lifePath: number;
  psychic: number;
  destiny: number;
  birthDay: number;
  loShuMissing: number[];
  loShuRepeated: { number: number; count: number }[];
  pinnacles: { id: number; number: number; ageStart: number; ageEnd: number | null }[];
  events: ResearchEvent[];
};

export type PublicFigureGold = {
  generatedAt: string;
  source: "wikidata";
  disclaimer: string;
  figures: PublicFigureRow[];
  skipped: { name: string; reason: string }[];
};

export type DigitCount = { digit: number; count: number };

export type PublicFigureSummary = {
  figureCount: number;
  eventCount: number;
  skippedCount: number;
  byField: { field: FigureField; count: number }[];
  byEventType: { type: ResearchEventType; count: number }[];
  personalYearHits: DigitCount[];
  pinnacleHits: { id: number; count: number }[];
  pyByEventType: Record<ResearchEventType, DigitCount[]>;
};

export function summarizePublicFigures(gold: PublicFigureGold): PublicFigureSummary {
  const figures = gold.figures;
  const events = figures.flatMap((f) => f.events);
  const fieldMap = new Map<FigureField, number>();
  for (const f of figures) {
    fieldMap.set(f.field, (fieldMap.get(f.field) ?? 0) + 1);
  }
  const typeMap = new Map<ResearchEventType, number>();
  const pyMap = new Map<number, number>();
  const pinMap = new Map<number, number>();
  const pyByType = new Map<ResearchEventType, Map<number, number>>();
  for (const e of events) {
    typeMap.set(e.type, (typeMap.get(e.type) ?? 0) + 1);
    pyMap.set(e.personalYear, (pyMap.get(e.personalYear) ?? 0) + 1);
    pinMap.set(e.pinnacleId, (pinMap.get(e.pinnacleId) ?? 0) + 1);
    if (!pyByType.has(e.type)) pyByType.set(e.type, new Map());
    const m = pyByType.get(e.type)!;
    m.set(e.personalYear, (m.get(e.personalYear) ?? 0) + 1);
  }
  const toDigits = (m: Map<number, number>): DigitCount[] =>
    [...m.entries()]
      .map(([digit, count]) => ({ digit, count }))
      .sort((a, b) => b.count - a.count || a.digit - b.digit);

  return {
    figureCount: figures.length,
    eventCount: events.length,
    skippedCount: gold.skipped.length,
    byField: (["wealth", "film", "sport", "politics"] as FigureField[]).map(
      (field) => ({ field, count: fieldMap.get(field) ?? 0 }),
    ),
    byEventType: [...typeMap.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    personalYearHits: toDigits(pyMap),
    pinnacleHits: [...pinMap.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => a.id - b.id),
    pyByEventType: {
      marriage: toDigits(pyByType.get("marriage") ?? new Map()),
      union_ended: toDigits(pyByType.get("union_ended") ?? new Map()),
      award: toDigits(pyByType.get("award") ?? new Map()),
      office_start: toDigits(pyByType.get("office_start") ?? new Map()),
    },
  };
}
