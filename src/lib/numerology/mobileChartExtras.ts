/**
 * Extra mobile cards: last-four root vs whole-number root, year number, gated Kua.
 * Does not change evaluateMobileFit or the 100-point score.
 */

import { calculateKua, yearNumberFromDob } from "@/lib/numerology/hiddenYear";
import { rootFitTone, type RootFitTone } from "@/lib/numerology/mobileRootFit";

export type LastFourVsTotal = {
  lastFourRoot: number;
  totalRoot: number;
  tone: RootFitTone;
  line: string;
};

export function lastFourVsTotalRoot(
  lastFourRoot: number,
  totalRoot: number,
): LastFourVsTotal {
  const tone = rootFitTone(lastFourRoot, totalRoot);
  return {
    lastFourRoot,
    totalRoot,
    tone,
    line: `Last four root ${lastFourRoot} is the daily tail of the number. Total root ${totalRoot} is the whole number reduced to one digit. They sit ${tone.toLowerCase()} together. This is a structure note — it does not change the 100-point score.`,
  };
}

export type YearNumberSit = {
  year: number;
  lastTwo: number;
  compound: number;
  root: number;
  vsBirth: RootFitTone;
  vsDestiny: RootFitTone;
  vsMobile: RootFitTone;
  line: string;
};

export function yearNumberSit(
  dob: string,
  birth: number,
  destiny: number,
  mobileRoot: number,
): YearNumberSit {
  const y = yearNumberFromDob(dob);
  const vsBirth = rootFitTone(y.root, birth);
  const vsDestiny = rootFitTone(y.root, destiny);
  const vsMobile = rootFitTone(y.root, mobileRoot);
  const lastTwo = String(y.lastTwo).padStart(2, "0");
  return {
    year: y.year,
    lastTwo: y.lastTwo,
    compound: y.compound,
    root: y.root,
    vsBirth,
    vsDestiny,
    vsMobile,
    line: `Year number ${y.root} comes from the last two digits of ${y.year} (${lastTwo} → ${y.compound} → ${y.root}). Versus Birth ${birth}: ${vsBirth.toLowerCase()}. Versus Destiny ${destiny}: ${vsDestiny.toLowerCase()}. Versus this number’s total root ${mobileRoot}: ${vsMobile.toLowerCase()}.`,
  };
}

export function kuaForMobile(dob: string, gender: string | undefined | null) {
  return calculateKua(dob, gender);
}
