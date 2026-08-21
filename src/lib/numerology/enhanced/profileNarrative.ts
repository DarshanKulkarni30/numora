import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import type { ThemeHit } from "./themeGraph";
import type { Tension } from "./tensions";
import type { SeasonBrief } from "./seasonBrief";
import { parseChartNumber, wordCount } from "./digits";
import { traitLabel } from "./themeGraph";

export type ProfileNarrative = {
  teaser: string;
  full: string;
  wordCount: number;
};

export function buildProfileNarrative(opts: {
  report: NumerologyReport;
  displayName: string;
  archetypeTitle: string;
  throughline: string;
  themes: ThemeHit[];
  tensions: Tension[];
  season: SeasonBrief;
}): ProfileNarrative {
  const { report, displayName, archetypeTitle, throughline, themes, tensions, season } =
    opts;
  const snap = report.numerology_snapshot;
  const young = report.person.report_type === "child" || report.person.report_type === "adolescent";
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
        .map((t) => `${t.label.toLowerCase()} (${t.count} chart seats)`)
        .join(", ")
    : "a mixed set of tones";

  const paras: string[] = [];

  paras.push(
    `${displayName} reads, in Numora’s language, as ${archetypeTitle}. ${throughline} This is not a verdict and not a forecast. It is a way of noticing how several independent numbers rhyme—and where they stretch.`,
  );

  paras.push(
    `Life Path ${lp} (${traitLabel(lp)}) describes the longer walk: why the journey exists. Birth Day ${bd} (${traitLabel(bd)}) is closer to the native heat of the calendar day. Expression ${expr} (${traitLabel(expr)}) is how the spelling in force may shape craft and contribution. Together they often sketch a sequence: early emphasis through ${bd}, a working style through ${expr}, and a longer curriculum through ${lp}. Maturity ${mat} (${traitLabel(mat)}) may describe what deepens after practice, not a switch that waits for a birthday.`,
  );

  paras.push(
    `Inside the profile, Soul Urge ${soul} (${traitLabel(soul)}) may name what feels true when no one is watching. Personality ${pers} (${traitLabel(pers)}) may color the first impression. ${
      soul === pers
        ? "When these two agree, inner wish and outer manner may feel like the same room."
        : "When they differ, the work is translation: letting the inner wish be visible without asking the outer manner to vanish."
    } None of this predicts how relationships will go. It only suggests a style of closeness to notice with care.`,
  );

  paras.push(
    `A second school sits beside the first. Vedic Psychic ${psychic} (${traitLabel(psychic)}) is often read as day temperament—the default wiring of the birth day. Destiny ${destiny} (${traitLabel(destiny)}) is the longer path number from the full date. ${
      psychic === destiny
        ? "Here the two agree, which some readers treat as a simpler through-line from daily habit to longer aim."
        : "Here they differ, which can feel like a productive stretch: the day’s reaction and the longer aim are not always the same instrument."
    } Name numbers in this school (Vedic Name ${snap.vedic_name}, Chaldean ${chal}) describe spelling in force, not fate.`,
  );

  if (snap.natal_name && snap.operating_name && snap.natal_name !== snap.operating_name) {
    paras.push(
      `This reading keeps both name layers. Birth-certificate spelling (${snap.natal_name}) stays natal. The name in force (${snap.operating_name}${snap.name_era_label ? `, ${snap.name_era_label}` : ""}) may shift Expression, Soul Urge, Personality, and name-school digits, while date-based numbers stay put. Professionals often want both visible; casual readers can treat the operating spelling as “how the name works now,” without discarding the natal layer.`,
    );
  }

  paras.push(
    `Across Pythagorean, Chaldean, Vedic, and this year’s timing, recurring themes include ${themeSentence}. Counts are not scores and not percentages. They simply mark how many independent chart seats cite a family of digits. A theme that appears often may feel like home weather. A quieter theme may still matter on the days it is needed.`,
  );

  if (tensions[0]) {
    paras.push(
      `The profile also holds productive stretch. ${tensions
        .slice(0, 3)
        .map((t) => t.insight)
        .join(" ")} Stretch is not failure. In Numora’s reading it is often the place where skill is earned.`,
    );
  }

  const loMissing = (report.lo_shu.missing_numbers ?? []).slice(0, 3);
  const loRepeat = (report.lo_shu.repeated_numbers ?? []).filter((r) => r.count >= 2);
  if (loMissing.length || loRepeat.length) {
    paras.push(
      `The Lo Shu grid, built from date digits, adds a lived map rather than another personality label. ${
        loRepeat.length
          ? `Repeated digits (${loRepeat.map((r) => `${r.number}×${r.count}`).join(", ")}) may feel like emphasis—useful when they become craft, tiring when they become the only gear.`
          : ""
      } ${
        loMissing.length
          ? `Digits that do not appear (${loMissing.join(", ")}) are treated as practice edges: habits to grow, not holes in character.`
          : ""
      }`.replace(/\s+/g, " ").trim(),
    );
  }

  paras.push(
    `Timing is calendar-bound. ${season.combined} Personal Year and Personal Month are pacing themes for how a cycle may feel to work with. They do not announce events, luck, or guaranteed outcomes. The as-of date is printed so a later reader can see which season this paragraph described.`,
  );

  paras.push(
    purposeParagraph(displayName, report.person.purpose, report.person.report_type, lp, expr),
  );

  paras.push(
    young
      ? `For a young person, this story is a mirror for curiosity—not a sorting hat. Adults around ${displayName} may use it to notice strengths and preferred pace, then offer choices rather than labels. The detailed report remains the catalog of every method; this enhanced reading is the through-line.`
      : `Achievement may motivate early chapters, while meaning often motivates the longer ones. Structure, when it appears, is frequently the bridge between ambition and wisdom. Growth tends to land when insight is converted into one small action and, when it is kind to do so, shared. ${displayName} can treat this story as a working poem: return to the numbers, test them against lived days, and keep what is useful.`,
  );

  paras.push(
    `If a section below feels like a dictionary entry, look back here. The value of the enhanced report is not more charts. It is this question: given these rhymes and these stretches, what is one honest next practice in the current season?`,
  );

  let full = paras.map((p) => p.trim()).join("\n\n");
  let count = wordCount(full);

  if (count < 600) {
    full += `\n\n${padParagraph(report, displayName, themes)}`;
    count = wordCount(full);
  }
  if (count < 600) {
    full += `\n\n${secondPad(report, season)}`;
    count = wordCount(full);
  }

  if (count > 950) {
    const clipped = clipToWords(full, 920);
    full = clipped;
    count = wordCount(full);
  }

  const teaser = `${throughline} Recurring themes include ${themeSentence}. Current season: Personal Year ${season.yearNumber}${season.monthNumber != null ? ` · Personal Month ${season.monthNumber}` : ""}.`;

  return {
    teaser: assertSafeCopy(teaser, "enhanced.narrative.teaser"),
    full: assertSafeCopy(full, "enhanced.narrative.full"),
    wordCount: count,
  };
}

function purposeParagraph(
  name: string,
  purpose: string,
  reportType: ReportType,
  lp: number,
  expr: number,
): string {
  const p = (purpose || "").toLowerCase();
  const young = reportType === "child" || reportType === "adolescent";
  if (young || p.includes("family")) {
    return `The stated lens for this reading is ${purpose || "family and self-understanding"}. In that light, Life Path ${lp} and Expression ${expr} are most useful as a description of pace and contribution at home: how ${name} may like to help, learn, and repair—not as a ranking of family members.`;
  }
  if (p.includes("career")) {
    return `The stated lens is career reflection. Expression ${expr} may describe craft; Life Path ${lp} may describe the longer why. Treat profession lists as invitations to experiment, never as assigned jobs or promises of status.`;
  }
  if (p.includes("relationship")) {
    return `The stated lens is relationships. Soul Urge and Personality are the more useful pair here: what feels true inside, and what others may meet first. Compatibility language elsewhere is a tone map, not a prediction of who will stay.`;
  }
  return `The stated lens is ${purpose || "self-reflection"}. Use the numbers as questions: Where does ${name} already live this pattern? Where does it ask for a gentler pace?`;
}

function padParagraph(
  report: NumerologyReport,
  name: string,
  themes: ThemeHit[],
): string {
  const strengths = (report.strengths ?? []).slice(0, 4).join("; ");
  const growth = (report.growth_opportunities ?? []).slice(0, 3).join("; ");
  const extraTheme = themes
    .slice(0, 4)
    .map((t) => `${t.label} appears in ${t.appearsIn.slice(0, 4).join(", ")}`)
    .join(". ");
  return `Strength language already stored in this reading includes: ${strengths || "steady attention to craft and care"}. Growth language includes: ${growth || "patience with unfinished systems"}. ${extraTheme}. These lines are the same banks used in the detailed report—they are not new claims. They are repeated here so ${name} can hear them inside one story rather than as isolated tiles.`;
}

function secondPad(report: NumerologyReport, season: SeasonBrief): string {
  const rec = (report.recommendations ?? []).slice(0, 3).join(" ");
  return `Recommended focus already computed for this profile: ${rec || season.doThis.join("; ")}. The enhanced action plan later in this page simply groups those invitations into thirty days, ninety days, and the year—so practice has a clock, not so the future is written in advance.`;
}

function clipToWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text;
  return `${words.slice(0, max).join(" ")}…`;
}
