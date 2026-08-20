/**
 * Natal vs operating name numbers for a person (or report input).
 */

import { calculateChaldean } from "./chaldean";
import { calculatePythagorean } from "./pythagorean";
import { calculateVedic } from "./vedic";
import {
  resolveNameInForce,
  type NameInForce,
} from "@/lib/profile/nameHistory";

export type NameNumberBundle = {
  lifePath: number;
  birthDay: number;
  expression: number;
  soulUrge: number;
  personality: number;
  maturity: number;
  vedicName: number;
  vedicCompound: number;
  unitName: number;
  chaldean: number;
  chaldeanCompound: number;
  givenVedic: number;
};

export type DualNameChart = {
  force: NameInForce;
  natal: NameNumberBundle;
  operating: NameNumberBundle;
  differs: boolean;
};

function bundle(spelling: string, dob: string, givenSpelling: string): NameNumberBundle {
  const pyth = calculatePythagorean(spelling, dob);
  const vedic = calculateVedic(spelling, dob);
  const chald = calculateChaldean(spelling);
  const given = calculateVedic(givenSpelling || spelling, dob);
  return {
    lifePath: pyth.lifePath,
    birthDay: pyth.birthDay,
    expression: pyth.expression,
    soulUrge: pyth.soulUrge,
    personality: pyth.personality,
    maturity: pyth.maturity,
    vedicName: vedic.nameNumber,
    vedicCompound: vedic.nameCompound,
    unitName: vedic.unitSystemNameNumber,
    chaldean: chald.nameNumber,
    chaldeanCompound: chald.compound,
    givenVedic: given.nameNumber,
  };
}

export function dualNameChart(opts: {
  natalName: string;
  dateOfBirth: string;
  history?: unknown;
  preferredName?: string;
  asOf?: Date | string;
}): DualNameChart {
  const force = resolveNameInForce(opts);
  const natal = bundle(
    force.natalSpelling,
    opts.dateOfBirth,
    force.natalGivenSpelling,
  );
  const operating = bundle(
    force.operatingSpelling,
    opts.dateOfBirth,
    force.givenSpelling,
  );
  return {
    force,
    natal,
    operating,
    differs: force.differs,
  };
}
