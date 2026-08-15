/**
 * Birth × Destiny × Name trio lookups.
 * Vedic and Chaldean: one 9×9 table per Birth number.
 * Pythagorean: odd/even pattern + birth-to-name alignment (condensed).
 * Outcomes are mapped to reflective bands — not predictions.
 */

import { reduceToSingleDigit } from "./dateNumbers";

export type TrioBand =
  | "amazing"
  | "favourable"
  | "neutral"
  | "friction"
  | "block";

export type TrioSystem = "vedic" | "chaldean" | "pythagorean";

export type TrioHit = {
  system: TrioSystem;
  birth: number;
  destiny: number;
  name: number;
  band: TrioBand;
  label: string;
  summary: string;
  sourceLabel: string;
};

const BAND_FROM_CODE: Record<string, TrioBand> = {
  S: "amazing",
  M: "amazing",
  G: "favourable",
  O: "favourable",
  F: "favourable",
  R: "favourable",
  A: "neutral",
  W: "neutral",
  P: "neutral",
  L: "neutral",
  N: "neutral",
  C: "friction",
  V: "friction",
  B: "friction",
  D: "block",
  E: "block",
  U: "block",
  K: "block",
};

const LABEL_FROM_CODE: Record<string, string> = {
  S: "Superb",
  M: "Master",
  G: "Great",
  O: "Good",
  F: "Favourable",
  R: "Growth",
  A: "Average",
  W: "Steady",
  P: "Quiet",
  L: "Slow",
  N: "Neutral",
  C: "Clash",
  V: "Volatile",
  B: "Obstacle",
  D: "Defeat",
  E: "Severe",
  U: "Struggle",
  K: "Heavy",
};

/** 9 birth tables × 9 destiny rows × 9 name columns. */
const VEDIC_GRIDS: string[][] = [
  [
    "SOGCSDAEV",
    "OOGCSDAES",
    "GGSCSDAES",
    "CDACSDAEC",
    "SSSASOADS",
    "DDDESOEED",
    "AAGASDAEO",
    "EEDESDEEE",
    "SSSCSDOES",
  ],
  [
    "SOGDSDAES",
    "OOGESDOEA",
    "GGSESDAEG",
    "DEEDSDAEE",
    "SSSASOADS",
    "DDDESOEED",
    "AOAASUSEA",
    "EEEESSEEE",
    "SAGESDAES",
  ],
  [
    "SGSDSDAES",
    "GOGESDAEG",
    "SGSESDAES",
    "DEEDSSEEE",
    "SSSASOADS",
    "DDDEOSSED",
    "AAGESUSEA",
    "EEEESSEEE",
    "SGSESDAES",
  ],
  [
    "ODDCSOSWV",
    "DDESSDAEE",
    "DESESSEEE",
    "CEESSOSWE",
    "SSSSSSOSO",
    "SOESSOSWD",
    "OAESOSOWE",
    "WEESWWWSE",
    "VEEESDEEV",
  ],
  [
    "SSSOSOSAS",
    "SOSDSSOEO",
    "SSSESSOES",
    "ODSOSSOAD",
    "SSSSSSSOS",
    "SSOSSSSSO",
    "OOOOSSSAA",
    "AEEASSAOE",
    "SOSDSSAES",
  ],
  [
    "CDDESSEED",
    "DDDESSEED",
    "DDSESSEED",
    "EEEOSOSWE",
    "SSSSSSSSS",
    "SSESSSSSO",
    "EEEOSSSWE",
    "EEEWSSWSE",
    "DDDESOEES",
  ],
  [
    "SOGOSUSES",
    "OOAASUOEE",
    "GASESEGEA",
    "OAEOSOSWE",
    "SSSSSSSAS",
    "EEESSSSSE",
    "SOGOSSSEE",
    "EEEWASSEE",
    "AEAESEEEE",
  ],
  [
    "EEEESSEEE",
    "EEEESSEEE",
    "EEEESSEEE",
    "EEEWSSWSE",
    "SSSSSSSSS",
    "EEESSSSSE",
    "EEEWSSSEE",
    "EEESSSOSE",
    "EEEESSEEE",
  ],
  [
    "SSSVSDAES",
    "SOGESDEES",
    "SGSESDAES",
    "VEEESDEEV",
    "SSSSSOSES",
    "DDDESOEEO",
    "AEAESEEEE",
    "EEEESSEEE",
    "SSSVSOEES",
  ],
];

const CHALDEAN_GRIDS: string[][] = [
  [
    "SFRBMUPKV",
    "FSRUMUFKF",
    "RRSEMUPKS",
    "BUESMFPLE",
    "MMMMSSMPM",
    "UUUFSSUFU",
    "PFPPMUSEP",
    "KKKLMFKSK",
    "VFSEMUPKS",
  ],
  [
    "FSRUMUFKF",
    "SSREMUSKP",
    "RRSEMUPKR",
    "UEESMFFKE",
    "MMMMSSMUM",
    "UUUFSSUFU",
    "FSPFMUSKP",
    "KKKKMFKEK",
    "FPREMUPKS",
  ],
  [
    "RRSEMUPKS",
    "RSREMUPKR",
    "SRSEMEPKS",
    "EEEPMUEKE",
    "MMMMSFMUM",
    "UUEUFSUFU",
    "PPPEMUSEP",
    "KKKKMFKEK",
    "SRSEMUPKS",
  ],
  [
    "BUESMSFLE",
    "UEESMFFKE",
    "EEEPMUEKE",
    "SSPSMSSLE",
    "MMMMSSMFM",
    "SFUSMSSLU",
    "FFESMSSLE",
    "LKKLMLLSK",
    "EEEEMUEKV",
  ],
  [
    "MMMMSSMPM",
    "MSMMSSMUM",
    "MMSMSFMUM",
    "MMMSSSSFM",
    "SSSSSSSSS",
    "SSFSSSSSS",
    "MMMMSSSPM",
    "PUUFSSPSU",
    "MMMMSSMUS",
  ],
  [
    "UUUFSSUFU",
    "UUUFSSUFU",
    "UUEUFSUFU",
    "FFUSMSSLU",
    "SSFSSSSSS",
    "SSUSSSSSF",
    "UUUSMSSLU",
    "FFFLSSLSN",
    "UUUUSFUNS",
  ],
  [
    "PFPPMUSEP",
    "FSPFMUSKP",
    "PPPEMUSEP",
    "PFESMSSLE",
    "MMMMSSSPM",
    "UUUSMSSLU",
    "SSSSSSEKE",
    "KKKLPLKEK",
    "PPPEMUEKE",
  ],
  [
    "KKKLMFKSK",
    "KKKKMFKEK",
    "KKKKMFKEK",
    "LKKLMLLSK",
    "PUUFSSPSU",
    "FFFLSSLSN",
    "KKKLPLKEK",
    "SEESSSKSE",
    "KKKKMNKEE",
  ],
  [
    "VFSEMUPKS",
    "FPREMUPKS",
    "SRSEMUPKS",
    "EEEEMUEKV",
    "MMMMSSMUM",
    "UUUUSFUNS",
    "PPPEMUEKE",
    "KKKKMNKEE",
    "SSSVMSEES",
  ],
];

function assertGrid(name: string, grids: string[][]): void {
  if (grids.length !== 9) throw new Error(`${name}: expected 9 birth tables`);
  grids.forEach((table, bi) => {
    if (table.length !== 9) {
      throw new Error(`${name} birth ${bi + 1}: expected 9 destiny rows`);
    }
    table.forEach((row, di) => {
      if (row.length !== 9) {
        throw new Error(
          `${name} birth ${bi + 1} destiny ${di + 1}: row length ${row.length}`,
        );
      }
      for (const ch of row) {
        if (!BAND_FROM_CODE[ch]) {
          throw new Error(
            `${name} birth ${bi + 1} destiny ${di + 1}: bad code ${ch}`,
          );
        }
      }
    });
  });
}

assertGrid("vedic", VEDIC_GRIDS);
assertGrid("chaldean", CHALDEAN_GRIDS);

function digit(n: number | string): number {
  return reduceToSingleDigit(Number(n));
}

function cellFromGrid(
  grids: string[][],
  birth: number,
  destiny: number,
  name: number,
): string {
  const b = digit(birth);
  const d = digit(destiny);
  const n = digit(name);
  return grids[b - 1][d - 1][n - 1];
}

const BAND_SUMMARY: Record<TrioBand, string> = {
  amazing:
    "In this tradition the three digits are often read as mutually supportive—ease may show up more readily, still with ordinary care and effort.",
  favourable:
    "A clean, workable mix in tradition. Everyday effort is usually enough to keep things moving.",
  neutral:
    "Results are more tied to steady work than to an easy lift. Progress can be real, just less dramatic.",
  friction:
    "High heat or mixed signals. Movement is possible, but peace of mind may take more attention and clearer boundaries.",
  block:
    "Tradition describes frequent bottlenecks here. Treat that as a cue to simplify, rest, and adjust—not as a verdict on your worth.",
};

export const TRIO_BAND_HINT: Record<TrioBand, string> = {
  amazing: "Often described as a natural three-way fit.",
  favourable: "Supportive mix; ordinary effort still matters.",
  neutral: "Work-led progress; limited “luck” lift.",
  friction: "Heat, ego, or sudden swings—pace yourself.",
  block: "Repeated friction or delay—simplify and reset.",
};

export function vedicTrio(
  birth: number | string,
  destiny: number | string,
  name: number | string,
): TrioHit {
  const code = cellFromGrid(VEDIC_GRIDS, Number(birth), Number(destiny), Number(name));
  return hit("vedic", birth, destiny, name, code, LABEL_FROM_CODE[code] ?? code);
}

export function chaldeanTrio(
  birth: number | string,
  destiny: number | string,
  name: number | string,
): TrioHit {
  const code = cellFromGrid(
    CHALDEAN_GRIDS,
    Number(birth),
    Number(destiny),
    Number(name),
  );
  return hit(
    "chaldean",
    birth,
    destiny,
    name,
    code,
    LABEL_FROM_CODE[code] ?? code,
  );
}

const PYTH_PATTERN = {
  oddOdd: {
    fav: [1, 3, 5, 7, 9],
    unfav: [2, 4, 8],
    label: "Odd + odd",
    effect:
      "A quicker, idea-led mix. Odd name totals often feel more natural; even totals may ask for more grounding.",
  },
  evenEven: {
    fav: [2, 4, 6, 8],
    unfav: [1, 5, 7],
    label: "Even + even",
    effect:
      "A steadier, structure-led mix. Even name totals often feel more natural; some odd totals may feel less settled.",
  },
  mixed: {
    fav: [5, 6, 9],
    unfav: [4, 7, 8],
    label: "Mixed odd / even",
    effect:
      "A social, shifting mix. 5, 6, and 9 name totals often act as bridges; 4, 7, and 8 may ask for more patience.",
  },
} as const;

const PYTH_ALIGN: Record<number, { fav: number[]; unfav: number[]; note: string }> =
  {
    1: {
      fav: [3, 5, 7, 9],
      unfav: [4, 8],
      note: "Birth 1 often pairs more easily with 3, 5, 7, or 9 name totals; 4 or 8 may feel heavier.",
    },
    2: {
      fav: [4, 6, 8],
      unfav: [1, 9],
      note: "Birth 2 often pairs more easily with 4, 6, or 8; intense 1 or 9 name totals may overshadow a quieter style.",
    },
    3: {
      fav: [1, 5, 6, 9],
      unfav: [4, 7],
      note: "Birth 3 often expresses more easily through 1, 5, 6, or 9; 4 or 7 may feel more self-critical.",
    },
    4: {
      fav: [2, 6, 8],
      unfav: [1, 5],
      note: "Birth 4 often builds more steadily with 2, 6, or 8; 1 or 5 name totals may feel more disruptive.",
    },
    5: {
      fav: [1, 3, 7, 9],
      unfav: [4],
      note: "Birth 5 often adapts more easily with 1, 3, 7, or 9; a 4 name total may feel restrictive.",
    },
    6: {
      fav: [2, 3, 4, 8, 9],
      unfav: [1, 7],
      note: "Birth 6 often sits more easily with 2, 3, 4, 8, or 9; 1 or 7 may feel more distant.",
    },
    7: {
      fav: [1, 4, 5],
      unfav: [3, 8],
      note: "Birth 7 often focuses more easily with 1, 4, or 5; 3 or 8 may feel scattered or heavy.",
    },
    8: {
      fav: [2, 4, 6],
      unfav: [1, 9],
      note: "Birth 8 often organizes more easily with 2, 4, or 6; 1 or 9 name totals may feel like stop-start effort.",
    },
    9: {
      fav: [1, 3, 5, 6],
      unfav: [4, 8],
      note: "Birth 9 often reaches more easily with 1, 3, 5, or 6; 4 or 8 may raise heat in conversation.",
    },
  };

export function pythagoreanTrio(
  birth: number | string,
  destiny: number | string,
  name: number | string,
): TrioHit & {
  patternLabel: string;
  patternEffect: string;
  alignNote: string;
  favNames: number[];
  unfavNames: number[];
} {
  const b = digit(birth);
  const d = digit(destiny);
  const n = digit(name);
  const oddB = b % 2 === 1;
  const oddD = d % 2 === 1;
  const pattern =
    oddB && oddD
      ? PYTH_PATTERN.oddOdd
      : !oddB && !oddD
        ? PYTH_PATTERN.evenEven
        : PYTH_PATTERN.mixed;
  const align = PYTH_ALIGN[b];
  const inList = (list: readonly number[], value: number) =>
    list.some((x) => x === value);
  const pSide = inList(pattern.fav, n)
    ? "fav"
    : inList(pattern.unfav, n)
      ? "unfav"
      : "mid";
  const aSide = inList(align.fav, n)
    ? "fav"
    : inList(align.unfav, n)
      ? "unfav"
      : "mid";

  let band: TrioBand = "neutral";
  if (pSide === "fav" && aSide !== "unfav") band = aSide === "fav" ? "amazing" : "favourable";
  else if (pSide === "unfav" && aSide === "unfav") band = "block";
  else if (pSide === "unfav" || aSide === "unfav") band = "friction";
  else if (aSide === "fav") band = "favourable";

  const label =
    band === "amazing"
      ? "Aligned"
      : band === "favourable"
        ? "Supportive"
        : band === "friction"
          ? "Mixed"
          : band === "block"
            ? "Heavy"
            : "Neutral";

  return {
    system: "pythagorean",
    birth: b,
    destiny: d,
    name: n,
    band,
    label,
    summary: `${pattern.effect} ${align.note}`,
    sourceLabel: pattern.label,
    patternLabel: pattern.label,
    patternEffect: pattern.effect,
    alignNote: align.note,
    favNames: [...new Set([...pattern.fav, ...align.fav])].sort((x, y) => x - y),
    unfavNames: [...new Set([...pattern.unfav, ...align.unfav])].sort(
      (x, y) => x - y,
    ),
  };
}

function hit(
  system: TrioSystem,
  birth: number | string,
  destiny: number | string,
  name: number | string,
  code: string,
  label: string,
): TrioHit {
  const band = BAND_FROM_CODE[code] ?? "neutral";
  return {
    system,
    birth: digit(birth),
    destiny: digit(destiny),
    name: digit(name),
    band,
    label,
    summary: BAND_SUMMARY[band],
    sourceLabel: label,
  };
}

export function vedicTableForBirth(birth: number | string): string[][] {
  return VEDIC_GRIDS[digit(birth) - 1].map((row) => row.split(""));
}

export function chaldeanTableForBirth(birth: number | string): string[][] {
  return CHALDEAN_GRIDS[digit(birth) - 1].map((row) => row.split(""));
}

export function trioCodeBand(code: string): TrioBand {
  return BAND_FROM_CODE[code] ?? "neutral";
}

export function trioCodeLabel(code: string): string {
  return LABEL_FROM_CODE[code] ?? code;
}

export const TRIO_NOTE =
  "This is a traditional Birth × Destiny × Name lookup for reflection only. It describes how three digits are often read together—not a prediction of money, health, relationships, or fate. Partner compatibility stays in the radar section.";
