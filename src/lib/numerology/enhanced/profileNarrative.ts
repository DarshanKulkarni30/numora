import { assertSafeCopy } from "@/lib/numerology/safety";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import type { ThemeHit } from "./themeGraph";
import { themeTierLabel } from "./themeGraph";
import type { SeasonBrief } from "./seasonBrief";
import { parseChartNumber, wordCount } from "./digits";

export type ProfileNarrative = {
  teaser: string;
  full: string;
  wordCount: number;
};

function cap(s: string): string {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s;
}

function action(n: number): string {
  return `${cap(plainJob(n))}.`;
}

function showsAs(n: number): string {
  const map: Record<number, string> = {
    1: "being the one who starts, then carrying too many first days at once",
    2: "waiting for the other person before you speak",
    3: "several conversations or pieces opened, and few of them closed",
    4: "rewriting the plan instead of starting the week",
    5: "changing course when a task becomes repetitive",
    6: "saying yes to people who have not asked you to carry it",
    7: "needing more quiet than the room expects before you answer",
    8: "measuring the day by output and skipping the rest",
    9: "taking on a wider cause before yesterday's loop is done",
    11: "noticing more than you can act on in one sitting",
    22: "holding a large plan that has no first calendar date",
    33: "helping several people lightly and yourself not at all",
  };
  return map[n] ?? plainWatch(n);
}

function numberBeat(label: string, n: number, pointsTo: string): string {
  return `${label} ${n} points to ${plainTrait(n)} — ${pointsTo} You notice this as ${showsAs(n)}. ${action(n)}`;
}

function pairBeat(
  aLabel: string,
  aN: number,
  aPoints: string,
  bLabel: string,
  bN: number,
  bPoints: string,
): string {
  if (aN === bN) {
    return `${aLabel} ${aN} and ${bLabel} ${bN} both point to ${plainTrait(aN)} — ${aPoints} ${bPoints} You notice this as ${showsAs(aN)}. ${action(aN)}`;
  }
  return `${numberBeat(aLabel, aN, aPoints)} ${numberBeat(bLabel, bN, bPoints)}`;
}

export function buildProfileNarrative(opts: {
  report: NumerologyReport;
  displayName: string;
  archetypeTitle: string;
  themes: ThemeHit[];
  season: SeasonBrief;
}): ProfileNarrative {
  const { report, displayName, archetypeTitle, themes, season } = opts;
  const snap = report.numerology_snapshot;
  const young =
    report.person.report_type === "child" ||
    report.person.report_type === "adolescent";
  const lp = parseChartNumber(snap.life_path) ?? 9;
  const bd = parseChartNumber(snap.birth_day) ?? lp;
  const expr = parseChartNumber(snap.expression_number) ?? 9;
  const soul = parseChartNumber(snap.soul_urge_number) ?? 9;
  const pers = parseChartNumber(snap.personality_number) ?? 9;
  const mat = parseChartNumber(snap.maturity_number) ?? 9;
  const psychic = parseChartNumber(snap.vedic_psychic) ?? bd;
  const destiny = parseChartNumber(snap.vedic_destiny) ?? lp;
  const chal = parseChartNumber(snap.chaldean_name_number) ?? expr;
  const top = themes.slice(0, 3);

  const themeSentence = top.length
    ? top
        .map(
          (t) =>
            `${t.label} is a ${themeTierLabel(t.tier)} (in ${t.appearsIn.slice(0, 4).join(", ")})`,
        )
        .join(". ")
    : "No single family dominates this chart";

  const paras: string[] = [];

  paras.push(
    `${displayName}, in this report, is called ${archetypeTitle}. ${action(lp)}`,
  );

  paras.push(
    pairBeat(
      "Life Path",
      lp,
      "the longer walk this life keeps returning to.",
      "Birth Day",
      bd,
      "the first instinct of the calendar day you were born.",
    ),
  );

  paras.push(
    pairBeat(
      "Expression",
      expr,
      "how the spelling you use now shapes how you show up and contribute.",
      "Maturity",
      mat,
      "what deepens after practice, not a switch on a birthday.",
    ),
  );

  paras.push(
    pairBeat(
      "Soul Urge",
      soul,
      "what feels true when no one is watching.",
      "Personality",
      pers,
      "the first impression a room gets.",
    ) +
      (soul === pers
        ? " These two agree, so the inner wish and the outer manner can use the same move."
        : " They differ, so name the inner wish out loud instead of hoping the outer manner will translate it."),
  );

  paras.push(
    pairBeat(
      "Vedic Psychic",
      psychic,
      "day temperament — how you start an ordinary day.",
      "Destiny",
      destiny,
      "the longer path number from the full date.",
    ) +
      (psychic === destiny
        ? " Here the two agree, so today's first reaction and the longer aim can share one practice."
        : " Here they differ, so use the day's first reaction for the next hour and the longer aim for the next month."),
  );

  paras.push(
    `Vedic Name ${snap.vedic_name} and Chaldean ${chal} describe the spelling in force. ${action(chal)}`,
  );

  if (
    snap.natal_name &&
    snap.operating_name &&
    snap.natal_name !== snap.operating_name
  ) {
    paras.push(
      `Two spellings are on file. Birth-certificate (${snap.natal_name}) stays natal. The name in force (${snap.operating_name}${snap.name_era_label ? `, ${snap.name_era_label}` : ""}) is the one driving Expression, Soul Urge, Personality, and name-school digits. Date numbers do not move. Read both layers; use the operating spelling for what to do this week.`,
    );
  }

  paras.push(
    `Repeating themes: ${themeSentence}. A strong theme is the one to budget time for. A secondary theme is a tool for the days you need it. ${action(lp)}`,
  );

  const loMissing = (report.lo_shu?.missing_numbers ?? []).slice(0, 3);
  const loRepeat = (report.lo_shu?.repeated_numbers ?? []).filter(
    (r) => r.count >= 2,
  );
  if (loMissing.length || loRepeat.length) {
    const tryMissing = loMissing[0] != null ? action(loMissing[0]) : "";
    paras.push(
      [
        loRepeat.length
          ? `Repeated date-grid digits (${loRepeat.map((r) => `${r.number}×${r.count}`).join(", ")}) show habits that already run on their own.`
          : "",
        loMissing.length
          ? `Quiet digits (${loMissing.join(", ")}) are skills to practise on purpose.`
          : "",
        tryMissing,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  paras.push(
    `This season is Personal Year ${season.yearNumber}${
      season.monthNumber != null ? ` · Personal Month ${season.monthNumber}` : ""
    }. ${season.yearJob} ${season.doThis[0] ? cap(season.doThis[0].replace(/\.$/, "")) + "." : action(season.yearNumber)}`,
  );

  paras.push(
    purposeParagraph(
      displayName,
      report.person.purpose,
      report.person.report_type,
      lp,
      expr,
      soul,
    ),
  );

  paras.push(
    young
      ? `Use this as a pace note for ${displayName}, then offer a choice rather than a label. ${action(lp)}`
      : `Treat this as a working note: pick one practice from this page and run it for seven days. ${action(expr)}`,
  );

  paras.push(
    "Read the numbers as a pattern to check against real days, not as a forecast of events.",
  );

  const full = paras.map((p) => p.trim()).join("\n\n");
  const teaser = `${archetypeTitle}. Loudest pattern: ${
    top[0]
      ? `${top[0].label.toLowerCase()} (${themeTierLabel(top[0].tier)})`
      : "a mixed set of tones"
  }. ${action(lp)} This season: Personal Year ${season.yearNumber}${
    season.monthNumber != null ? ` · Personal Month ${season.monthNumber}` : ""
  }.`;

  return {
    teaser: assertSafeCopy(teaser, "enhanced.narrative.teaser"),
    full: assertSafeCopy(full, "enhanced.narrative.full"),
    wordCount: wordCount(full),
  };
}

function purposeParagraph(
  name: string,
  purpose: string,
  reportType: ReportType,
  lp: number,
  expr: number,
  soul: number,
): string {
  const p = (purpose || "").toLowerCase();
  const young = reportType === "child" || reportType === "adolescent";
  if (young || p.includes("family")) {
    return `This reading was asked for ${purpose || "family and self-understanding"}. Use Life Path ${lp} as a pace at home: ${plainJob(lp)}.`;
  }
  if (p.includes("career")) {
    return `This reading was asked for career reflection. Treat Expression ${expr} as craft to practise this month: ${plainJob(expr)}.`;
  }
  if (p.includes("relationship")) {
    return `This reading was asked for relationships. Soul Urge ${soul} is the inner wish to state plainly: ${plainJob(soul)}.`;
  }
  return `This reading was asked for ${purpose || "self-reflection"}. Where does ${name} already live this pattern? ${action(lp)}`;
}
