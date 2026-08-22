/**
 * Gold-set public figures: Wikidata DOB + dated events → Numora date engines.
 * Calibration only. Does not invent events.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { personalYearCycleAt } from "../src/lib/numerology/cycles";
import {
  lifePathFromDob,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "../src/lib/numerology/dateNumbers";
import { calculateLoShu } from "../src/lib/numerology/loShu";
import { pinnacleAtDate, pinnaclesForDob } from "../src/lib/numerology/pinnacles";
import { parseDob, reduceNumber } from "../src/lib/numerology/reduce";
import type {
  PublicFigureGold,
  PublicFigureRow,
  PublicFigureSeed,
  ResearchEvent,
  ResearchEventType,
} from "../src/lib/research/publicFigures";

const UA =
  "NumoraResearch/1.0 (local calibration study; public Wikidata only)";
const MAX_EVENTS = 8;

type TimeClaim = { time?: string; precision?: number };

function firstTime(
  claims: Record<string, unknown> | undefined,
  prop: string,
): { iso: string | null; precision: number | null } {
  const list = claims?.[prop] as Array<{ mainsnak?: { datavalue?: { value?: TimeClaim } } }> | undefined;
  return parseTimeSnak(list?.[0]?.mainsnak?.datavalue?.value);
}

function parseTimeSnak(snak: TimeClaim | undefined): {
  iso: string | null;
  precision: number | null;
} {
  if (!snak?.time) return { iso: null, precision: null };
  const m = /^\+(\d{4})-(\d{2})-(\d{2})/.exec(snak.time);
  if (!m) return { iso: null, precision: snak.precision ?? null };
  const year = m[1]!;
  const month = m[2]!;
  const day = m[3]!;
  const precision = snak.precision ?? 11;
  if (precision >= 11 && month !== "00" && day !== "00") {
    return { iso: `${year}-${month}-${day}`, precision };
  }
  if (precision >= 10 && month !== "00") {
    return { iso: `${year}-${month}-01`, precision };
  }
  return { iso: `${year}-01-01`, precision };
}

function qualifierTime(
  claim: { qualifiers?: Record<string, Array<{ datavalue?: { value?: TimeClaim } }>> },
  prop: string,
): { iso: string | null; precision: number | null } {
  return parseTimeSnak(claim.qualifiers?.[prop]?.[0]?.datavalue?.value);
}

function entityId(
  claim: { mainsnak?: { datavalue?: { value?: { id?: string } } } },
): string | null {
  return claim.mainsnak?.datavalue?.value?.id ?? null;
}

function isoToDob(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function yearMonth(iso: string | null, precision: number | null): {
  year: number;
  month: number | null;
} | null {
  if (!iso) return null;
  const [ys, ms] = iso.split("-");
  const year = Number(ys);
  if (!Number.isFinite(year)) return null;
  const month =
    precision != null && precision >= 10 && ms && ms !== "00" ? Number(ms) : null;
  return { year, month };
}

async function wikiToQids(titles: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (let i = 0; i < titles.length; i += 20) {
    const batch = titles.slice(i, i + 20);
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("prop", "pageprops");
    url.searchParams.set("ppprop", "wikibase_item");
    url.searchParams.set("titles", batch.join("|"));
    url.searchParams.set("redirects", "1");
    url.searchParams.set("format", "json");
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`wiki ${res.status}`);
    const json = await res.json();
    const normalized: Record<string, string> = {};
    for (const n of json.query?.normalized ?? []) normalized[n.from] = n.to;
    const redirects: Record<string, string> = {};
    for (const n of json.query?.redirects ?? []) redirects[n.from] = n.to;
    const pages = Object.values(json.query?.pages ?? {}) as Array<{
      title?: string;
      pageprops?: { wikibase_item?: string };
    }>;
    const titleToQ = new Map<string, string>();
    for (const p of pages) {
      const q = p.pageprops?.wikibase_item;
      if (p.title && q) titleToQ.set(p.title, q);
    }
    for (const original of batch) {
      let t = original.replace(/_/g, " ");
      t = normalized[t] ?? t;
      t = redirects[t] ?? t;
      const q = titleToQ.get(t);
      if (q) map.set(original, q);
    }
  }
  return map;
}

async function getEntities(ids: string[]): Promise<Record<string, any>> {
  const out: Record<string, any> = {};
  const unique = [...new Set(ids.filter(Boolean))];
  for (let i = 0; i < unique.length; i += 40) {
    const batch = unique.slice(i, i + 40);
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.searchParams.set("action", "wbgetentities");
    url.searchParams.set("ids", batch.join("|"));
    url.searchParams.set("props", "claims|labels");
    url.searchParams.set("languages", "en");
    url.searchParams.set("format", "json");
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`wikidata ${res.status}`);
    const json = await res.json();
    Object.assign(out, json.entities ?? {});
  }
  return out;
}

function labelOf(entities: Record<string, any>, id: string | null): string {
  if (!id) return "unknown";
  return entities[id]?.labels?.en?.value ?? id;
}

function collectRelatedIds(ent: any): string[] {
  const ids: string[] = [];
  for (const claim of ent?.claims?.P26 ?? []) {
    const id = entityId(claim);
    if (id) ids.push(id);
  }
  for (const claim of ent?.claims?.P166 ?? []) {
    const id = entityId(claim);
    if (id) ids.push(id);
  }
  for (const claim of ent?.claims?.P39 ?? []) {
    const id = entityId(claim);
    if (id) ids.push(id);
  }
  return ids;
}

function datedEvent(
  type: ResearchEventType,
  iso: string | null,
  precision: number | null,
  label: string,
  dob: string,
): ResearchEvent | null {
  const ym = yearMonth(iso, precision);
  if (!ym) return null;
  const asOf =
    ym.month != null
      ? new Date(ym.year, ym.month - 1, 15, 12, 0, 0)
      : new Date(ym.year, 6, 1, 12, 0, 0);
  const py = personalYearCycleAt(dob, asOf).number;
  const pin = pinnacleAtDate(dob, asOf);
  return {
    type,
    year: ym.year,
    month: ym.month,
    label,
    source: "Wikidata",
    personalYear: py,
    pinnacleId: pin.id,
    pinnacleNumber: pin.number,
  };
}

function extractEvents(
  ent: any,
  labels: Record<string, any>,
  dob: string,
): ResearchEvent[] {
  const out: ResearchEvent[] = [];
  for (const claim of ent?.claims?.P26 ?? []) {
    const who = labelOf(labels, entityId(claim));
    const start = qualifierTime(claim, "P580");
    const end = qualifierTime(claim, "P582");
    const m = datedEvent(
      "marriage",
      start.iso,
      start.precision,
      `Union with ${who}`,
      dob,
    );
    if (m) out.push(m);
    const e = datedEvent(
      "union_ended",
      end.iso,
      end.precision,
      `Union ended with ${who}`,
      dob,
    );
    if (e) out.push(e);
  }
  for (const claim of ent?.claims?.P166 ?? []) {
    const what = labelOf(labels, entityId(claim));
    const t = qualifierTime(claim, "P585");
    const t2 = t.iso ? t : qualifierTime(claim, "P580");
    const ev = datedEvent("award", t2.iso, t2.precision, what, dob);
    if (ev) out.push(ev);
  }
  for (const claim of ent?.claims?.P39 ?? []) {
    const what = labelOf(labels, entityId(claim));
    const t = qualifierTime(claim, "P580");
    const ev = datedEvent(
      "office_start",
      t.iso,
      t.precision,
      `Office: ${what}`,
      dob,
    );
    if (ev) out.push(ev);
  }
  out.sort((a, b) => a.year - b.year || (a.month ?? 13) - (b.month ?? 13));
  const seen = new Set<string>();
  const unique: ResearchEvent[] = [];
  for (const ev of out) {
    const key = `${ev.type}|${ev.year}|${ev.month ?? 0}|${ev.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(ev);
  }
  return unique.slice(0, MAX_EVENTS);
}

async function main() {
  const root = resolve(process.cwd());
  const seeds = JSON.parse(
    readFileSync(resolve(root, "src/data/research/public-figure-seeds.json"), "utf8"),
  ) as PublicFigureSeed[];

  const titleToQ = await wikiToQids(seeds.map((s) => s.wiki));
  const qids = seeds.map((s) => titleToQ.get(s.wiki)).filter(Boolean) as string[];
  const peopleEntities = await getEntities(qids);
  const related: string[] = [];
  for (const q of qids) {
    related.push(...collectRelatedIds(peopleEntities[q]));
  }
  const labelEntities = await getEntities(related);

  const figures: PublicFigureRow[] = [];
  const skipped: { name: string; reason: string }[] = [];

  for (const seed of seeds) {
    const q = titleToQ.get(seed.wiki);
    if (!q) {
      skipped.push({ name: seed.name, reason: "No Wikidata id from Wikipedia title" });
      continue;
    }
    const ent = peopleEntities[q];
    const wikiDob = firstTime(ent?.claims, "P569");
    const dayLevel =
      wikiDob.precision != null && wikiDob.precision >= 11 && !!wikiDob.iso;
    if (!dayLevel || !wikiDob.iso) {
      skipped.push({
        name: seed.name,
        reason: `P569 not day-level (precision ${wikiDob.precision ?? "none"})`,
      });
      continue;
    }
    const dob = isoToDob(wikiDob.iso);
    try {
      parseDob(dob);
    } catch {
      skipped.push({ name: seed.name, reason: `Unusable DOB ${wikiDob.iso}` });
      continue;
    }
    const loShu = calculateLoShu(dob);
    const pinSet = pinnaclesForDob(dob);
    const { day } = parseDob(dob);
    figures.push({
      name: seed.name,
      wiki: seed.wiki,
      qid: q,
      field: seed.field,
      country: seed.country,
      dob,
      dobIso: wikiDob.iso,
      dateSource: "Wikidata P569 (day-level)",
      lifePath: lifePathFromDob(dob),
      psychic: vedicPsychicFromDob(dob),
      destiny: vedicDestinyFromDob(dob),
      birthDay: reduceNumber(day),
      loShuMissing: loShu.missing_numbers ?? [],
      loShuRepeated: (loShu.repeated_numbers ?? []).filter((r) => r.count >= 2),
      pinnacles: pinSet.pinnacles.map((p) => ({
        id: p.id,
        number: p.number,
        ageStart: p.ageStart,
        ageEnd: p.ageEnd,
      })),
      events: extractEvents(ent, labelEntities, dob),
    });
  }

  const gold: PublicFigureGold = {
    generatedAt: new Date().toISOString(),
    source: "wikidata",
    disclaimer:
      "Public Wikidata dates only. Personal Year is birthday-to-birthday, not calendar year. Counts calibrate copy. They are not a prediction product and not customer data.",
    figures,
    skipped,
  };

  const outPath = resolve(root, "src/data/research/public-figures.gold.json");
  writeFileSync(outPath, `${JSON.stringify(gold, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${figures.length} figures, ${figures.reduce((s, f) => s + f.events.length, 0)} events, skipped ${skipped.length} → ${outPath}`,
  );
  for (const s of skipped) console.log(`  skip ${s.name}: ${s.reason}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
