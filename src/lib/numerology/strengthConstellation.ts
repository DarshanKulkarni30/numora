/**
 * Weighted strength constellation — gifts clustered around Life Path,
 * not a complete inventory.
 */

import { STRENGTH_BANK } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";

export type StrengthWeight = "core" | "supporting" | "stretch";

export type StrengthSource = {
  name: string;
  raw: string;
};

export type StrengthNode = {
  label: string;
  title: string;
  detail: string;
  sources: string[];
  weight: StrengthWeight;
  fromLifePath: boolean;
  meaning: string;
  tryLine: string;
  watchLine: string;
  sourceLine: string;
};

export type StrengthConstellationModel = {
  nodes: StrengthNode[];
  map: StrengthNode[];
  extra: StrengthNode[];
  defaultIndex: number;
};

export function splitStrengthLabel(label: string): { title: string; detail: string } {
  const clean = label.replace(/[.。].*$/, "").trim();
  const split =
    /^(.*?)\s+(when|in|with|to|across|under|before|through|for|of)\s+(.*)$/i.exec(
      clean,
    );
  if (split) {
    return { title: split[1]!.trim(), detail: `${split[2]} ${split[3]}`.trim() };
  }
  const words = clean.split(/\s+/);
  if (words.length <= 4) return { title: clean, detail: "" };
  return {
    title: words.slice(0, 3).join(" "),
    detail: words.slice(3).join(" "),
  };
}

function digitsFor(raw: string): number[] {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return [];
  const out = [n];
  const reduced = reduceToSingleDigit(n);
  if (reduced !== n) out.push(reduced);
  return out;
}

function banksInclude(label: string, raw: string): boolean {
  return digitsFor(raw).some((d) => (STRENGTH_BANK[d] ?? []).includes(label));
}

export function buildStrengthConstellation(opts: {
  strengths: string[];
  lifePath?: string | null;
  expression?: string | null;
  soulUrge?: string | null;
  vedicPsychic?: string | null;
}): StrengthConstellationModel {
  const banks: StrengthSource[] = [
    opts.lifePath ? { name: "Life Path", raw: opts.lifePath } : null,
    opts.expression ? { name: "Expression", raw: opts.expression } : null,
    opts.soulUrge ? { name: "Soul Urge", raw: opts.soulUrge } : null,
    opts.vedicPsychic ? { name: "Psychic", raw: opts.vedicPsychic } : null,
  ].filter((b): b is StrengthSource => b != null);

  const nodes: StrengthNode[] = opts.strengths.map((label) => {
    const { title, detail } = splitStrengthLabel(label);
    const matched = banks.filter((b) => banksInclude(label, b.raw));
    const fromLifePath = opts.lifePath
      ? banksInclude(label, opts.lifePath)
      : false;
    const sources = matched.map((b) => `${b.name} ${b.raw}`);
    const weight: StrengthWeight = fromLifePath
      ? "core"
      : matched.length >= 2
        ? "supporting"
        : "stretch";
    const sourceBits = matched.map((b) => {
      const n = Number(b.raw);
      return `${b.name} ${b.raw} (${plainTrait(n)})`;
    });
    const firstNum = Number(matched[0]?.raw ?? opts.lifePath ?? 0);
    const meaning =
      weight === "core"
        ? `This sits next to Life Path ${opts.lifePath ?? ""}. It may show up a lot.`
        : weight === "supporting"
          ? "This shows up in more than one seat. It is familiar, not the whole self."
          : "This is quieter on this chart. It is in the mix, not a hole.";
    const sourceLine = sourceBits.length
      ? `Tied to ${sourceBits.join("; ")}.`
      : "Tied to more than one seat on this chart.";
    return {
      label,
      title,
      detail,
      sources: sources.length ? sources : ["Chart mix"],
      weight,
      fromLifePath,
      meaning,
      tryLine: `Try: ${plainJob(firstNum)}.`,
      watchLine:
        weight === "stretch"
          ? `A useful practice is ${plainJob(firstNum)}.`
          : `Watch: ${plainWatch(firstNum)}.`,
      sourceLine,
    };
  });

  const rank = { core: 0, supporting: 1, stretch: 2 };
  const ordered = [...nodes].sort((a, b) => rank[a.weight] - rank[b.weight]);
  const map = ordered.slice(0, 5);
  const extra = ordered.slice(5);
  const defaultIndex = Math.max(
    0,
    map.findIndex((n) => n.weight === "core"),
  );

  return { nodes: ordered, map, extra, defaultIndex };
}

export function strengthWeightLabel(weight: StrengthWeight): string {
  if (weight === "core") return "Loud · next to Life Path";
  if (weight === "supporting") return "Familiar · more than one seat";
  return "Quiet · also in the mix";
}
