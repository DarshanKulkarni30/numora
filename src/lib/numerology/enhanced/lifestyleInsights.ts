import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { traitLabel } from "./themeGraph";

export type LifestyleInsights = {
  learning: string;
  leadership: string;
  communication: string;
  stress: string;
  recovery: string;
};

export function buildLifestyleInsights(report: NumerologyReport): LifestyleInsights {
  const snap = report.numerology_snapshot;
  const young = isYoung(report.person.report_type);
  const lp = parseChartNumber(snap.life_path) ?? 9;
  const expr = parseChartNumber(snap.expression_number) ?? 9;
  const soul = parseChartNumber(snap.soul_urge_number) ?? 9;
  const pers = parseChartNumber(snap.personality_number) ?? 9;

  return {
    learning: assertSafeCopy(learningStyle(lp, expr, young), "enhanced.life.learn"),
    leadership: assertSafeCopy(
      young
        ? `May like to help by showing how something works (${traitLabel(expr)}), rather than by being in charge of people.`
        : leadershipStyle(lp, expr),
      "enhanced.life.lead",
    ),
    communication: assertSafeCopy(
      communicationStyle(pers, expr, young),
      "enhanced.life.comm",
    ),
    stress: assertSafeCopy(stressStyle(lp, soul, young), "enhanced.life.stress"),
    recovery: assertSafeCopy(recoveryStyle(lp, soul, young), "enhanced.life.recovery"),
  };
}

function isYoung(t: ReportType): boolean {
  return t === "child" || t === "adolescent";
}

function learningStyle(lp: number, expr: number, young: boolean): string {
  const bits: string[] = [];
  if (lp === 7 || lp === 11) bits.push("independent study and quiet reading");
  else if (lp === 5) bits.push("learning by trying more than one path");
  else if (lp === 4 || lp === 22) bits.push("step-by-step frameworks");
  else if (lp === 3 || lp === 9) bits.push("talking ideas into shape");
  else bits.push("a mix of example and practice");
  if (expr === 4 || expr === 22) bits.push("notes and systems that can be reused");
  if (expr === 3) bits.push("making or telling as a way to understand");
  const line = `May learn well through ${bits.join("; ")}.`;
  return young ? `${line} Adults can offer choice of pace rather than more pressure.` : line;
}

function leadershipStyle(lp: number, expr: number): string {
  if (lp === 7 || lp === 11 || expr === 7) {
    return "May lead through expertise and prepared thought more than through volume or title.";
  }
  if (lp === 8 || expr === 8) {
    return "May lead through stewardship of resources and clear standards, with a watch for over-control.";
  }
  if (lp === 2 || lp === 6) {
    return "May lead through care and coordination rather than solo command.";
  }
  if (lp === 1) {
    return "May lead by starting, then needing others who can finish the system.";
  }
  return `May lead by ${traitLabel(lp)}, using ${traitLabel(expr)} to get the work done.`;
}

function communicationStyle(pers: number, expr: number, young: boolean): string {
  const careful = pers === 7 || pers === 2 || pers === 4 || expr === 7;
  const warm = pers === 3 || pers === 6 || pers === 2;
  if (careful && warm) {
    return young
      ? "May choose words carefully and still care about the other person’s feelings. A pause before answering can help."
      : "Thoughtful and measured: careful with words, still relational. A pause before sending often improves the message.";
  }
  if (careful) {
    return young
      ? "May need time to think before speaking. Silence is not always refusal."
      : "Measured speech. May prefer writing or a second draft when the topic matters.";
  }
  if (warm) {
    return "May communicate with warmth and story; the growth edge is leaving room for the other person’s pace.";
  }
  return `First impressions may lean on Personality ${pers} (${traitLabel(pers)}), while longer craft leans on Expression ${expr}.`;
}

function stressStyle(lp: number, soul: number, young: boolean): string {
  if (lp === 7 || soul === 7 || lp === 11) {
    return young
      ? "When overwhelmed, may withdraw to think. A quiet corner and one trusted adult can help more than a crowd."
      : "Under strain, may withdraw, analyse, and reflect. Isolation helps in short doses; it becomes a trap if it is the only tool.";
  }
  if (lp === 8 || lp === 1) {
    return "Under strain, may push harder. The useful interrupt is a defined pause, not more force.";
  }
  if (lp === 2 || lp === 6 || soul === 2 || soul === 6) {
    return "Under strain, may over-care for others. The useful interrupt is one boundary that protects rest.";
  }
  return "Under strain, returning to one small controllable task often restores a sense of ground.";
}

function recoveryStyle(lp: number, soul: number, young: boolean): string {
  const bits: string[] = [];
  if (lp === 7 || lp === 11 || soul === 7) bits.push("silence", "reading", "nature");
  else if (lp === 5) bits.push("a change of scene", "light movement");
  else if (lp === 3) bits.push("making something small", "talking with a trusted person");
  else bits.push("a simple routine", "sleep and water treated as non-negotiable");
  if (young) bits.push("play that does not have to be productive");
  else bits.push("writing a short honest note to self");
  return `Recovery may look like ${bits.slice(0, 4).join(", ")}.`;
}
