/**
 * Natal vs Active name architecture. BN/DN stay date-only.
 * NN, SN, PN always share one declared spelling per layer.
 */

import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
import {
  calculateChaldeanNameSet,
  formatCompoundRoot,
} from "@/lib/numerology/chaldeanName";
import { architectureKind, HARMONY_LABEL } from "./harmony";
import { assertSafeCopy } from "@/lib/numerology/safety";
import { resolveNameInForce } from "@/lib/profile/nameHistory";
import { splitGivenAndSurname } from "@/lib/numerology/nameParts";
import type { NumerologyReport } from "@/lib/numerology/types";
import {
  nameCycleFromSpelling,
  type NameCycle,
} from "./nameCycle";

export type NameArchitecture = {
  spelling: string;
  givenName: string;
  nn: number;
  nnCompound: number;
  nnDisplay: string;
  sn: number;
  snCompound: number;
  pn: number;
  pnCompound: number;
};

export type IdentityReading = {
  sameSpelling: boolean;
  givenUnchanged: boolean;
  showNatalCycle: boolean;
  natal: NameArchitecture;
  active: NameArchitecture;
  question: string;
  supportLine: string;
  eraLabel: string | null;
};

function firstToken(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

function layerFromSpelling(spelling: string): NameArchitecture {
  const set = calculateChaldeanNameSet(spelling);
  const given = splitGivenAndSurname(spelling).given || firstToken(spelling);
  return {
    spelling,
    givenName: given,
    nn: set.expression.root,
    nnCompound: set.expression.compound,
    nnDisplay: formatCompoundRoot(set.expression.compound, set.expression.root),
    sn: set.soul.root,
    snCompound: set.soul.compound,
    pn: set.personality.root,
    pnCompound: set.personality.compound,
  };
}

function supportLine(opts: {
  bn: number;
  dn: number;
  natal: NameArchitecture;
  active: NameArchitecture;
  sameSpelling: boolean;
  givenUnchanged: boolean;
}): string {
  const nnFit = HARMONY_LABEL[architectureKind(opts.bn, opts.active.nn)];
  const dnFit = HARMONY_LABEL[architectureKind(opts.dn, opts.active.nn)];
  if (opts.sameSpelling) {
    return assertSafeCopy(
      `One name layer: ${opts.active.spelling}. Active NN ${opts.active.nnDisplay} vs BN ${opts.bn} is ${nnFit.toLowerCase()}; vs DN ${opts.dn} is ${dnFit.toLowerCase()}.`,
      "identity.support.one",
    );
  }
  if (opts.givenUnchanged) {
    return assertSafeCopy(
      `The given name stayed ${opts.active.givenName}. The later spelling changed overall Name Number (natal NN ${opts.natal.nnDisplay} → active NN ${opts.active.nnDisplay}). Everyday Name Cycle is still one walk.`,
      "identity.support.surname",
    );
  }
  return assertSafeCopy(
    `Natal spelling ${opts.natal.spelling} (NN ${opts.natal.nnDisplay}) and the name you use now ${opts.active.spelling} (NN ${opts.active.nnDisplay}) are different identities. Active NN vs BN ${opts.bn} is ${nnFit.toLowerCase()}. Natal Cycle stays behind Advanced.`,
    "identity.support.given",
  );
}

export function historyFromReport(
  report: NumerologyReport,
  extra?: unknown,
): unknown {
  return extra ?? report.person.name_history;
}

export function buildIdentityReading(
  report: NumerologyReport,
  opts?: { history?: unknown },
): IdentityReading {
  const natalName =
    report.numerology_snapshot.natal_name || report.person.full_name;
  const force = resolveNameInForce({
    natalName,
    dateOfBirth: report.person.date_of_birth,
    history: historyFromReport(report, opts?.history),
    preferredName: report.person.preferred_name,
  });
  const natal = layerFromSpelling(force.natalSpelling);
  const active = layerFromSpelling(force.operatingSpelling);
  const sameSpelling = !force.differs;
  const givenUnchanged = force.givenUnchanged;
  const bn = parseChartNumber(report.numerology_snapshot.vedic_psychic) ?? 9;
  const dn = parseChartNumber(report.numerology_snapshot.vedic_destiny) ?? 9;

  return {
    sameSpelling,
    givenUnchanged,
    showNatalCycle: !sameSpelling && !givenUnchanged,
    natal,
    active,
    question: assertSafeCopy(
      "How well does the identity you were born with, and the identity you use now, support BN → DN?",
      "identity.q",
    ),
    supportLine: supportLine({
      bn,
      dn,
      natal,
      active,
      sameSpelling,
      givenUnchanged,
    }),
    eraLabel: force.differs ? force.label : null,
  };
}

export function natalNameCycle(opts: {
  identity: IdentityReading;
  dob: string;
  calendarYearUsed: number;
  personalYear?: number;
}): NameCycle | null {
  if (!opts.identity.showNatalCycle) return null;
  return nameCycleFromSpelling({
    fullSpelling: opts.identity.natal.spelling,
    dob: opts.dob,
    calendarYearUsed: opts.calendarYearUsed,
    personalYear: opts.personalYear,
    firstName: firstToken(opts.identity.natal.givenName),
  });
}
