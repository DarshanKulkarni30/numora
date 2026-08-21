import { sunSignFromDob } from "@/lib/astrology/sunSign";
import { calculateChaldean } from "./chaldean";
import { personalMonth } from "./cycles";
import { buildPythagoreanChart } from "./pythagoreanChart";
import {
  currentWesternOutlook,
  LAND_LABEL,
  pyNatureMeta,
} from "./personalYearOutlook";
import { calculateLoShu } from "./loShu";
import {
  CHILD_REPORT_DISCLAIMER,
  DISCLAIMER,
  GROWTH_BANK,
  RECOMMENDATIONS_DISCLAIMER,
  STRENGTH_BANK,
  TEEN_REPORT_DISCLAIMER,
  chaldeanCompoundMeaning,
  coreTraitFor,
  meaningFor,
  pickUnique,
  yearMonthMeaning,
} from "./meanings";
import { LO_SHU_NUMBER_META } from "./loShuEffects";
import { CAREER_DISCLAIMER, modernProfessionsFor } from "./careers";
import {
  COMPAT_DISCLAIMER,
  buildCompatibilityMatrix,
} from "./compatibility";
import { synthesizeGrowthAreas } from "./growthAreas";
import { planetForPythagorean, planetLabel } from "./planets";
import { calculatePythagorean } from "./pythagorean";
import { calculateAge } from "./reduce";
import { reduceToSingleDigit } from "./dateNumbers";
import { bookendsAnalysisLines } from "./nameBookends";
import {
  buildVedicCompatibilityMatrix,
  VEDIC_COMPAT_NOTE,
} from "./vedicCompatibility";
import { unitSystemCompatNote } from "./vedicUnitSystem";
import {
  NINE_NOTE,
  oppositesForReport,
  REDUCTION_TIP,
} from "./vedicSquare";
import {
  PROJECTED_YEAR_METHOD_NOTE,
  projectedYearCycleAt,
  projectedYearMeta,
} from "./vedicYearNumber";
import { UNIT_AFFINITY_NOTE, vedicNumberProfile } from "./vedicNumberProfile";
import {
  vedicDigitTheme,
  vedicRoleMeaning,
} from "./vedicNumberThemes";
import { assertSafeCopy, assertSafeList } from "./safety";
import type {
  NumerologyReport,
  PersonInput,
  ReportSection,
  ReportType,
} from "./types";
import { dualNameChart } from "./nameLayers";
import { calculateVedic } from "./vedic";

function reportTypeForAge(age: number): ReportType {
  if (age < 14) return "child";
  if (age <= 19) return "adolescent";
  return "adult";
}

function displayName(input: PersonInput): string {
  return (input.preferredName?.trim() || input.fullName.trim()).split(/\s+/)[0];
}

function strengthsFor(...nums: number[]): string[] {
  const pool = nums.flatMap((n) => STRENGTH_BANK[n] ?? []);
  return pickUnique(pool, 8);
}

function growthFor(...nums: number[]): string[] {
  const pool = nums.flatMap((n) => GROWTH_BANK[n] ?? []);
  return pickUnique(pool, 7);
}

function safetyNoticesFor(reportType: ReportType): string[] {
  if (reportType === "child") return [CHILD_REPORT_DISCLAIMER, RECOMMENDATIONS_DISCLAIMER];
  if (reportType === "adolescent")
    return [TEEN_REPORT_DISCLAIMER, RECOMMENDATIONS_DISCLAIMER];
  return [RECOMMENDATIONS_DISCLAIMER];
}

function ageGuidance(age: number, name: string, lifePath: number): {
  category: string;
  guidance: string;
} {
  if (age < 14) {
    return {
      category: "Parent Guidance",
      guidance: [
        `For ${name}, according to numerology traditions, Life Path ${lifePath} may offer supportive clues about learning preferences and emotional needs.`,
        "Learning style: this pattern may suggest responding well to encouragement, clear routines, and creative exploration matched to attention span.",
        "Confidence building: celebrate small completions and effort, not only outcomes. Short wins can strengthen a sense of capability.",
        "Emotional needs: warmth, predictable care, and space to name feelings may help this period of development.",
        "Parenting approach: firm kindness—boundaries with explanation—may support growing self-trust. Adapt to the individual child.",
        "Communication advice: ask open questions, reflect feelings, and avoid comparing progress to peers.",
        "Children continue developing emotionally, socially and intellectually—use themes as supportive reflection, not fixed labels.",
      ].join("\n\n"),
    };
  }
  if (age <= 19) {
    return {
      category: "Guidance For Teens And Parents",
      guidance: [
        `For ${name} (age ${age}), numerology traditions may describe reflective themes around identity and motivation linked with Life Path ${lifePath}.`,
        "Identity formation: this period may emphasize trying roles, values, and friendships. Curiosity can be a strength when paired with reflection.",
        "Self-confidence: progress may come from skills practiced consistently more than from sudden breakthroughs.",
        "Friendships: social belonging may matter deeply; supportive peers and clear personal boundaries can coexist.",
        "Academic motivation: purpose-linked goals and varied study methods may help more than pressure alone.",
        "Emotional regulation: naming stress and using short resets (walks, journaling, music) may support steadier choices.",
        "Healthy communication: respectful honesty between teens and parents may reduce misunderstandings during growth spurts of independence.",
      ].join("\n\n"),
    };
  }
  return {
    category: "Adult Life Guidance",
    guidance: [
      `For ${name}, adult guidance in numerology traditions may center on conscious self-development rather than prediction.`,
      "Self-development: Life Path themes can be used as a mirror for habits, values, and the kind of challenges that feel meaningful.",
      "Career growth: aligning work with Expression and Life Path tendencies may support engagement, while skills and ethics remain the practical drivers of progress.",
      "Relationships: awareness of communication and care styles may improve partnership quality without guaranteeing outcomes.",
      "Personal responsibility: cycles such as Personal Year and Month may suggest pacing—when to initiate, refine, or release—not certainty about events.",
      "Long-term goals: maturity number themes may become more visible with time; steady stewardship of health, craft, and relationships can support that unfolding.",
    ].join("\n\n"),
  };
}

function monthlyGuidance(py: number, pm: number, reportType: ReportType) {
  if (reportType === "child") {
    return {
      career:
        "Learning & play pacing (reflective only): this month may emphasize curiosity through short, enjoyable activities—not performance pressure or career forecasting.",
      relationships:
        "Family & friendships: gentle presence, clear routines, and kind communication may support connection. Outcomes are not predicted.",
      finances:
        "Money themes are not applicable as career finance advice for children. For family budgeting, rely on adult judgment—not this report.",
      learning:
        "Study & exploration may feel easier in short playful sessions with rest breaks. This is optional reflection, not an academic plan.",
      wellbeing:
        "Emotional focus may include rest, outdoor play, and reducing overstimulation. Seek a qualified professional for any wellbeing concerns.",
      focus_areas: [
        "One enjoyable learning activity",
        "Warm family check-ins",
        "A calm daily rhythm",
        "Short practice blocks with praise for effort",
        "Plenty of rest and free play",
      ],
      avoid: [
        "Treating numbers as labels of ability",
        "Comparing the child to others",
        "Using the report to pressure performance",
        "Reading themes as medical or behavioral diagnoses",
      ],
    };
  }

  if (reportType === "adolescent") {
    return {
      career: `Interests & future pacing (reflective only): Personal Month ${pm} within Personal Year ${py} may emphasize exploring interests without locking a lifelong path. This is not career counseling.`,
      relationships:
        "Friendships & family: presence and respectful communication may help. This does not predict relationship outcomes.",
      finances:
        "Money awareness, if relevant, may benefit from simple tracking with a trusted adult. Not financial advice.",
      learning:
        "Study may flow in short focused sessions with realistic goals. Not an academic assessment.",
      wellbeing:
        "Emotional focus may include rest and reducing overload. For distress or safety concerns, contact qualified help—do not rely on this report.",
      focus_areas: [
        "One clear weekly priority",
        "Kind communication at home",
        "A sustainable study rhythm",
        "Skill practice in short blocks",
        "Rest without guilt",
      ],
      avoid: [
        "Treating cycle numbers as guarantees",
        "Using charts to shame or compare",
        "Overcommitting from peer pressure",
        "Ignoring professional support when needed",
      ],
    };
  }

  return {
    career: `According to numerology traditions, Personal Month ${pm} within a Personal Year ${py} may emphasize thoughtful career pacing—progress through clear priorities rather than urgency. This could suggest reviewing commitments and choosing one high-value focus. Not a guarantee of results.`,
    relationships: `This period may emphasize presence and honest communication. Small consistent gestures may matter more than grand statements. Outcomes remain open; the invitation is reflective connection.`,
    finances: `Money awareness this month may benefit from tracking, simplifying, and avoiding impulsive upgrades. Numerology may highlight stewardship themes—not windfalls or losses as certainties. Not financial advice.`,
    learning: `Study and skill-building may flow when broken into short sessions. Curiosity paired with a simple weekly review could support retention.`,
    wellbeing: `Emotional focus may include rest and reducing overstimulation. Supportive routines may help more than dramatic overhauls. Not medical or psychological advice.`,
    focus_areas: [
      "One priority project",
      "Clearer communication in key relationships",
      "A sustainable daily rhythm",
      "Skill practice in short blocks",
      "Gentle money tracking",
    ],
    avoid: [
      "Treating cycle numbers as guarantees",
      "Overcommitting from FOMO",
      "Neglecting rest during ambitious pushes",
      "Harsh self-judgment when plans adjust",
    ],
  };
}

function recommendationsFor(
  reportType: ReportType,
  pyth: { lifePath: number; personality: number; expression: number },
  py: number,
  pm: number,
  missing: number[],
): string[] {
  const lp = coreTraitFor(pyth.lifePath);
  const pers = coreTraitFor(pyth.personality);
  const expr = coreTraitFor(pyth.expression);
  const pyTheme = pyNatureMeta(py).short;
  const pmTheme = yearMonthMeaning(pm);
  const missingTips = missing
    .slice(0, 3)
    .map((n) => {
      const m = LO_SHU_NUMBER_META[n];
      return m ? `${n} (${m.trait}) via ${m.growth}` : String(n);
    })
    .join("; ");

  if (reportType === "child") {
    return [
      `For parents/guardians only: Life Path ${pyth.lifePath} (${lp}) may show up as preferences in play or learning—not as fixed ability. Notice one preference this week and support it without pressure.`,
      "Offer one encouraging learning activity this week and praise effort over outcomes.",
      "Keep communication warm and specific; avoid comparing the child to siblings or peers using this report.",
      `Personal Year ${py} / Month ${pm}: ${pyTheme} Use this only as gentle pacing—not a schedule of destiny.`,
      missing.length
        ? `Optional Lo Shu play themes for missing numbers: ${missingTips}. Treat as variety, not deficits.`
        : "Keep a balanced mix of quiet, creative, and active play across the week.",
      "Do not use this report for school placement, diagnosis, or disciplinary decisions.",
      "If concerns arise about development, learning, mood, or safety, consult qualified professionals.",
    ];
  }

  if (reportType === "adolescent") {
    return [
      `Life Path ${pyth.lifePath} (${lp}): once this week, notice one choice where this theme showed up—without treating the number as your whole identity.`,
      `Personality ${pyth.personality} (${pers}): practice one concrete communication habit (for example: one clear ask, or one full listen before advising).`,
      `Expression ${pyth.expression} (${expr}): try a hobby or school project for a few weeks that uses this energy—exploration, not a locked career path.`,
      `Personal Year ${py}: ${pyTheme} Keep goals small enough to finish without harsh self-criticism.`,
      `Personal Month ${pm}: ${pmTheme}`,
      missing.length
        ? `Missing Lo Shu growth experiments (optional): ${missingTips}.`
        : "Balance study, rest, and social time across the week.",
      "Do not use this report as counseling, academic placement, or medical guidance. Seek trusted adults or qualified professionals for wellbeing or major decisions.",
    ];
  }

  return [
    `Life Path ${pyth.lifePath} (${lp}): journal once this week on a real choice where you led, started, or held back—and what you’d repeat.`,
    `Personality ${pyth.personality} (${pers}): pick one visible communication habit for 7 days (e.g. open with the point, then the story; or ask one clarifying question before answering).`,
    `Expression ${pyth.expression} (${expr}): choose one skill or project for the next 90 days that uses this energy in a concrete weekly block (not a vague “align with the number”).`,
    `Personal Year ${py}: ${pyTheme} Favor that pacing without treating it as certainty.`,
    `Personal Month ${pm}: ${pmTheme} Keep goals small enough to finish this month.`,
    missing.length
      ? `Missing Lo Shu numbers invite gentle habits—not pressure: ${missingTips}.`
      : "Vary the week across mental planning, emotional connection, and practical finishing so all three Lo Shu planes get airtime.",
    "Revisit this report after major life changes; update name spelling if you legally change your name.",
  ];
}

function digitCore(n: string | number): number {
  const v = Number(n);
  return Number.isFinite(v) ? reduceToSingleDigit(v) : 1;
}

/** Common echoes and contrasts across Pythagorean, Chaldean, Vedic, Lo Shu. */
function executiveCrossMethodNotes(
  report: Omit<NumerologyReport, "sections">,
): { common: string; contrast: string } {
  const snap = report.numerology_snapshot;
  const lo = report.lo_shu;

  type Tagged = { label: string; system: string; digit: number };
  const tags: Tagged[] = [
    { label: "Life Path", system: "Pythagorean", digit: digitCore(snap.life_path) },
    {
      label: "Birth Day",
      system: "Pythagorean",
      digit: digitCore(snap.birth_day),
    },
    {
      label: "Expression",
      system: "Pythagorean",
      digit: digitCore(snap.expression_number),
    },
    {
      label: "Soul Urge",
      system: "Pythagorean",
      digit: digitCore(snap.soul_urge_number),
    },
    {
      label: "Personality",
      system: "Pythagorean",
      digit: digitCore(snap.personality_number),
    },
    {
      label: "Maturity",
      system: "Pythagorean",
      digit: digitCore(snap.maturity_number),
    },
    {
      label: "Chaldean Name",
      system: "Chaldean",
      digit: digitCore(snap.chaldean_name_number),
    },
    {
      label: "Psychic",
      system: "Vedic",
      digit: digitCore(snap.vedic_psychic),
    },
    {
      label: "Destiny",
      system: "Vedic",
      digit: digitCore(snap.vedic_destiny),
    },
    {
      label: "Vedic Name",
      system: "Vedic",
      digit: digitCore(snap.vedic_name),
    },
  ];
  if (snap.unit_name) {
    tags.push({
      label: "Unit name",
      system: "Vedic",
      digit: digitCore(snap.unit_name),
    });
  }
  if (snap.personal_year) {
    tags.push({
      label: "Personal Year",
      system: "Timing",
      digit: digitCore(snap.personal_year),
    });
  }

  const byDigit = new Map<number, Tagged[]>();
  for (const t of tags) {
    const list = byDigit.get(t.digit) ?? [];
    list.push(t);
    byDigit.set(t.digit, list);
  }

  const repeats = [...byDigit.entries()]
    .filter(([, list]) => list.length >= 2)
    .sort((a, b) => b[1].length - a[1].length);

  const commonParts: string[] = [];
  for (const [digit, list] of repeats.slice(0, 3)) {
    const systems = [...new Set(list.map((x) => x.system))];
    const labels = list.map((x) => x.label).slice(0, 5);
    const more = list.length > 5 ? ` (+${list.length - 5} more)` : "";
    commonParts.push(
      `${digit} (${coreTraitFor(digit).toLowerCase()}) shows up in ${labels.join(", ")}${more}${
        systems.length > 1 ? ` across ${systems.join(" · ")}` : ""
      }`,
    );
  }

  if (lo.present_numbers?.length) {
    const topPresent = lo.present_numbers.slice(0, 4).join(", ");
    commonParts.push(
      `Lo Shu grid emphasizes present ${topPresent}${
        lo.missing_numbers?.length
          ? `; quieter/missing ${lo.missing_numbers.slice(0, 4).join(", ")}`
          : ""
      }`,
    );
  }

  const contrasts: string[] = [];
  const lp = digitCore(snap.life_path);
  const destiny = digitCore(snap.vedic_destiny);
  if (lp !== destiny) {
    contrasts.push(
      `Life Path ${lp} and Vedic Destiny ${destiny} differ—outer path tone vs full-date destiny lens`,
    );
  } else if (!repeats.some(([d]) => d === lp && (byDigit.get(lp)?.length ?? 0) >= 2)) {
    commonParts.push(
      `Life Path and Vedic Destiny both reduce to ${lp}—date-based themes align`,
    );
  }

  const expr = digitCore(snap.expression_number);
  const chal = digitCore(snap.chaldean_name_number);
  const vName = digitCore(snap.vedic_name);
  if (expr !== chal || expr !== vName || chal !== vName) {
    contrasts.push(
      `Name layers differ: Expression ${expr} · Chaldean name ${chal} · Vedic name ${vName}${
        snap.unit_name ? ` · Unit name ${digitCore(snap.unit_name)}` : ""
      }—same spelling, different letter maps/roles`,
    );
  }

  const psychic = digitCore(snap.vedic_psychic);
  if (psychic !== destiny) {
    contrasts.push(
      `Psychic ${psychic} (birth day) vs Destiny ${destiny} (full date)—day temperament vs longer path`,
    );
  }

  const soul = digitCore(snap.soul_urge_number);
  const pers = digitCore(snap.personality_number);
  if (soul !== pers) {
    contrasts.push(
      `Soul Urge ${soul} vs Personality ${pers}—inner want vs first impression may not match`,
    );
  }

  if (lo.missing_numbers?.length && repeats[0]) {
    const dominant = repeats[0][0];
    if (lo.missing_numbers.includes(dominant)) {
      contrasts.push(
        `Digit ${dominant} is strong in core numbers but missing on the Lo Shu grid—practice that tone consciously`,
      );
    }
  }

  const common =
    commonParts.length > 0
      ? `Common themes across methods: ${commonParts.join(". ")}.`
      : "Common themes across methods: each system highlights different digits—compare the snapshot groups rather than forcing one story.";

  const contrast =
    contrasts.length > 0
      ? `Where methods diverge: ${contrasts.slice(0, 4).join("; ")}.`
      : "Where methods diverge: the main digits largely agree—use the detailed sections for nuance rather than conflict.";

  return { common, contrast };
}

function buildSections(report: Omit<NumerologyReport, "sections">): ReportSection[] {
  const n = displayName({
    fullName: report.person.full_name,
    preferredName: report.person.preferred_name,
    dateOfBirth: report.person.date_of_birth,
  });
  const snap = report.numerology_snapshot;
  const py = report.pythagorean;
  const isMinor =
    report.person.report_type === "child" ||
    report.person.report_type === "adolescent";
  const interestsTitle =
    report.person.report_type === "adult"
      ? "10. Career Tendencies"
      : "10. Interests & Learning Tendencies";
  const relationshipTitle =
    report.person.report_type === "child"
      ? "11. Family & Friendship Style"
      : "11. Relationship Style";

  const cross = executiveCrossMethodNotes(report);

  const sections: ReportSection[] = [
    {
      id: "executive-summary",
      title: "1. Executive Summary",
      body: [
        isMinor
          ? `${n}'s NumoraWisdom reading weaves Pythagorean, Chaldean, Vedic, and Lo Shu perspectives from name and birth date for supportive reflection by a parent/guardian or teen—with care.`
          : `${n}, this NumoraWisdom report weaves Pythagorean, Chaldean, Vedic, and Lo Shu perspectives from your name and birth date.`,
        `Snapshot highlights Life Path ${snap.life_path}, Expression ${snap.expression_number}, Vedic Destiny ${snap.vedic_destiny}, Personal Year ${snap.personal_year}${
          snap.sun_sign_label ? `, and Sun sign ${snap.sun_sign_label}` : ""
        }.`,
        cross.common,
        cross.contrast,
        report.personality.core_personality,
      ].join("\n\n"),
    },
    {
      id: "snapshot",
      title: "2. Numerology Snapshot",
      body: [
        `- Life Path: ${snap.life_path}`,
        `- Birth Day: ${snap.birth_day}`,
        `- Expression: ${snap.expression_number}`,
        `- Soul Urge: ${snap.soul_urge_number}`,
        `- Personality: ${snap.personality_number}`,
        `- Maturity: ${snap.maturity_number}`,
        `- Chaldean Name / Compound: ${snap.chaldean_name_number} / ${snap.compound_number}`,
        `- Vedic Psychic / Destiny / Name: ${snap.vedic_psychic} / ${snap.vedic_destiny} / ${snap.vedic_name}`,
        snap.natal_vedic_name
          ? `- Natal (birth-certificate) Expression / Vedic name: ${snap.natal_expression_number} / ${snap.natal_vedic_name} · ${snap.name_era_label ?? "later name in force now"}`
          : null,
        `- Personal Year / Month: ${snap.personal_year} / ${snap.personal_month}`,
        snap.personal_day ? `- Personal Day: ${snap.personal_day}` : null,
        snap.balance_number ? `- Balance: ${snap.balance_number}` : null,
        snap.hidden_passion ? `- Hidden Passion: ${snap.hidden_passion}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "pythagorean",
      title: "3. Pythagorean Analysis",
      body: [
        `Life Path ${py.life_path.number} · Birth Day ${py.birth_day.number} · Expression ${py.expression.number} · Soul Urge ${py.soul_urge.number} · Personality ${py.personality.number} · Maturity ${py.maturity.number}`,
        `• Life Path: ${py.life_path.meaning}`,
        `• Expression: ${py.expression.meaning}`,
        `• Soul Urge: ${py.soul_urge.meaning}`,
        `• Personality: ${py.personality.meaning}`,
        snap.balance_number
          ? `• Balance ${snap.balance_number} · Hidden Passion ${snap.hidden_passion ?? "—"} · see Pythagorean chart for Challenges, Period Cycles, name-letter Lessons, and Planes of Expression.`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "chaldean",
      title: "4. Chaldean Analysis",
      body: [
        `Name ${report.chaldean.name_number} · before reduce ${report.chaldean.compound_number}`,
        `• ${report.chaldean.analysis.split(/(?<=\.)\s+/).slice(0, 3).join(" ")}`,
      ].join("\n"),
    },
    {
      id: "vedic",
      title: "5. Vedic Numerology Analysis",
      body: [
        `Psychic ${snap.vedic_psychic} (birth day) · Destiny ${snap.vedic_destiny} (full date) · Name ${snap.vedic_name}`,
        snap.natal_vedic_name
          ? `Current legal spelling NN ${snap.vedic_name}; birth-certificate NN ${snap.natal_vedic_name}. Psychic and Destiny are date-only.`
          : null,
        `• Psychic: ${report.vedic.psychic_number.meaning}`,
        `• Destiny: ${report.vedic.destiny_number.meaning}`,
        report.vedic.unitSystem
          ? `• Fit of the three: ${report.vedic.unitSystem.harmony_label} — ${report.vedic.unitSystem.harmony_detail}`
          : null,
        "• See the Vedic panel above for balancing pairs and easy/careful number notes.",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "lo-shu",
      title: "6. Lo Shu Analysis",
      body: [
        `Present: ${report.lo_shu.present_numbers.join(", ") || "—"} · Missing: ${report.lo_shu.missing_numbers.join(", ") || "—"}`,
        ...report.lo_shu.analysis
          .split(/(?<=\.)\s+/)
          .slice(0, 4)
          .map((s) => `• ${s.trim()}`),
      ].join("\n"),
    },
    {
      id: "core-personality",
      title: "7. Core Personality",
      body: report.personality.core_personality
        .replace(
          /\s*These are reflective possibilities—not judgments of worth, intelligence, morality, or destiny\.\s*/i,
          " ",
        )
        .trim(),
    },
    {
      id: "strengths",
      title: "8. Key Strengths",
      body: report.strengths.map((s) => `• ${s}`).join("\n"),
    },
    {
      id: "growth",
      title: "9. Growth Opportunities",
      body: report.growth_opportunities.map((s) => `• ${s}`).join("\n"),
    },
    {
      id: "career",
      title: interestsTitle,
      body: [
        report.personality.career_style,
        "",
        report.person.report_type === "child"
          ? "Interest / activity ideas:"
          : "Modern profession ideas to explore:",
        ...report.career_suggestions.professions.map((p) => `• ${p}`),
      ].join("\n"),
    },
    {
      id: "relationships",
      title: relationshipTitle,
      body: report.personality.relationship_style,
    },
    {
      id: "communication",
      title: "12. Communication Style",
      body: report.personality.communication_style,
    },
    {
      id: "age-guidance",
      title: `13. Age-Specific Guidance — ${report.age_guidance.category}`,
      body: report.age_guidance.guidance,
    },
    {
      id: "personal-year",
      title: "14. Personal Year",
      body: [
        `Personal Year ${report.personal_year.number}${
          report.personal_year.nature ? ` · ${report.personal_year.nature}` : ""
        }`,
        report.personal_year.range_label
          ? `• Cycle: ${report.personal_year.range_label}`
          : "",
        `• Theme: ${report.personal_year.theme}`,
        report.personal_year.land
          ? `• How it may land: ${report.personal_year.land}`
          : "",
        report.personal_year.pinnacle
          ? `• Pinnacle: ${report.personal_year.pinnacle}`
          : "",
        report.personal_year.karmic
          ? `• Karmic: ${report.personal_year.karmic}`
          : "",
        `• ${report.personal_year.advice}`,
        "• See timing numbers in the snapshot above. Personal Year is not an Amazing/Good score.",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      id: "projected-year",
      title: "14b. Year outlook (birthday cycle)",
      body: report.projected_year
        ? [
            `Year outlook ${report.projected_year.number} for ${
              report.projected_year.range_label ??
              report.projected_year.calendar_year
            } (${report.projected_year.planet})`,
            `• ${report.projected_year.theme}`,
            `• Practice: ${report.projected_year.advice}`,
            "• See the Year outlook panel above for the step-by-step calculation. Toggle Calendar year on the Years page for 1 Jan–31 Dec.",
          ].join("\n")
        : "Year outlook not available for this report.",
    },
    {
      id: "personal-month",
      title: "15. Personal Month",
      body: [
        `Personal Month ${report.personal_month.number}`,
        `• Theme: ${report.personal_month.theme}`,
        `• ${report.personal_month.advice}`,
      ].join("\n"),
    },
    {
      id: "current-month",
      title: "16. Current Month Guidance",
      body: [
        report.person.report_type === "adult"
          ? `• Career: ${report.monthly_guidance.career}`
          : `• Learning & interests: ${report.monthly_guidance.career}`,
        `• Study: ${report.monthly_guidance.learning}`,
        `• Relationships: ${report.monthly_guidance.relationships}`,
        `• Wellbeing: ${report.monthly_guidance.wellbeing}`,
        `• Money awareness: ${report.monthly_guidance.finances}`,
        "",
        "Focus:",
        ...report.monthly_guidance.focus_areas.map((f) => `• ${f}`),
        "",
        "Ease off:",
        ...report.monthly_guidance.avoid.map((f) => `• ${f}`),
      ].join("\n"),
    },
    {
      id: "recommendations",
      title: "17. Recommended Focus Areas",
      body: report.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n"),
    },
    {
      id: "compatibility",
      title: "18. Compatibility Matrix",
      body: [
        `Pythagorean Life Path ${report.compatibility.pythagorean.raw_number} × partner tones:`,
        ...report.compatibility.pythagorean.matrix.map(
          (row) =>
            `• Partner ${row.partnerLifePath}: Romantic — ${row.romantic}; Business — ${row.business}; Friendship — ${row.friendship}`,
        ),
        "",
        `Vedic Psychic (Moolank) ${report.compatibility.vedic.moolank.raw_number} × partner tones:`,
        ...report.compatibility.vedic.moolank.matrix.map(
          (row) =>
            `• Partner ${row.partnerLifePath}: Romantic — ${row.romantic}; Business — ${row.business}; Friendship — ${row.friendship}`,
        ),
        "",
        `Vedic Destiny (Bhagyank) ${report.compatibility.vedic.bhagyank.raw_number} × partner tones:`,
        ...report.compatibility.vedic.bhagyank.matrix.map(
          (row) =>
            `• Partner ${row.partnerLifePath}: Romantic — ${row.romantic}; Business — ${row.business}; Friendship — ${row.friendship}`,
        ),
        "",
        `Vedic Name (Namank) ${report.compatibility.vedic.namank.raw_number} × partner tones:`,
        ...report.compatibility.vedic.namank.matrix.map(
          (row) =>
            `• Partner ${row.partnerLifePath}: Romantic — ${row.romantic}; Business — ${row.business}; Friendship — ${row.friendship}`,
        ),
        "",
        VEDIC_COMPAT_NOTE,
        "Amazing = especially natural affinity · Favourable = generally supportive · Neutral = mixed / situational · Challenging = may need more patience (not a bad match).",
        "Master numbers (11/22/33) are traced as their single-digit sums in 1–9 partner tables.",
      ].join("\n"),
    },
    {
      id: "closing",
      title: "Closing Reflection",
      body: [
        isMinor
          ? `${n}'s chart themes may blend initiative and reflection as supportive mirrors—not verdicts on character or future.`
          : `${n}, according to numerology traditions your pattern blends initiative and reflection in ways that can support meaningful self-understanding.`,
        "Use this report as a warm companion for journaling and kind conversation.",
        "Everyone remains free to grow beyond any chart. Meet the next season with curiosity, steadiness, and kindness.",
      ].join("\n\n"),
    },
  ];
  return sections;
}

export function generateReport(
  input: PersonInput,
  now = new Date(),
): NumerologyReport {
  const fullName = input.fullName.trim();
  if (!fullName) throw new Error("Full name is required.");
  if (!input.dateOfBirth?.trim()) throw new Error("Date of birth is required.");

  const age = calculateAge(input.dateOfBirth, now);
  const report_type = reportTypeForAge(age);
  const names = dualNameChart({
    natalName: fullName,
    dateOfBirth: input.dateOfBirth,
    history: input.nameHistory,
    preferredName: input.preferredName,
    asOf: now,
  });
  const operatingName = names.force.operatingSpelling;
  const pyth = calculatePythagorean(operatingName, input.dateOfBirth);
  const natalPyth = names.differs
    ? calculatePythagorean(fullName, input.dateOfBirth)
    : pyth;
  const chald = calculateChaldean(operatingName);
  const natalChald = names.differs ? calculateChaldean(fullName) : chald;
  const vedic = calculateVedic(operatingName, input.dateOfBirth);
  const natalVedic = names.differs
    ? calculateVedic(fullName, input.dateOfBirth)
    : vedic;
  const loShu = calculateLoShu(input.dateOfBirth);
  const pyOutlook = currentWesternOutlook(
    input.dateOfBirth,
    operatingName,
    now,
  );
  const py = pyOutlook.number;
  const pm = personalMonth(py, now);
  const name = displayName(input);
  const isChild = report_type === "child";
  const isTeen = report_type === "adolescent";

  const core = assertSafeCopy(
    [
      `At the center of this reading, Life Path ${pyth.lifePath} and Expression ${pyth.expression} may describe how ${name} moves through goals and self-expression.`,
      meaningFor(pyth.lifePath),
      `Soul Urge ${pyth.soulUrge} may point to inner motivations, while Personality ${pyth.personality} may color first impressions. Maturity ${pyth.maturity} could suggest themes that deepen with experience.`,
    ].join(" "),
    "core",
  );

  const communication = assertSafeCopy(
    [
      `Communication style may lean through Personality ${pyth.personality} and Expression ${pyth.expression}.`,
      meaningFor(pyth.personality),
      "In practice, this could suggest balancing clarity with warmth: say the true thing, and leave room for the other person's pace. When emotions rise, a short pause before responding may improve understanding.",
    ].join(" "),
    "communication",
  );

  const relationships = assertSafeCopy(
    isChild
      ? [
          `Family and friendship style may be colored by Soul Urge ${pyth.soulUrge} and Life Path ${pyth.lifePath}.`,
          meaningFor(pyth.soulUrge),
          "According to numerology traditions, closeness may grow through reliability, respectful honesty, and shared attention. This may indicate preferences—not guarantees—and must not be used to judge a child’s character.",
        ].join(" ")
      : [
          `Relationship style may be colored by Soul Urge ${pyth.soulUrge} and Life Path ${pyth.lifePath}.`,
          meaningFor(pyth.soulUrge),
          "According to numerology traditions, closeness may grow through reliability, respectful honesty, and shared rituals of attention. This may indicate preferences—not guarantees—about partnership outcomes.",
        ].join(" "),
    "relationships",
  );

  const professions = modernProfessionsFor(pyth.lifePath, pyth.expression);
  const career = assertSafeCopy(
    isChild
      ? [
          `Interests and learning tendencies may align with Expression ${pyth.expression}, Life Path ${pyth.lifePath}, and Vedic Destiny ${vedic.destiny}.`,
          meaningFor(pyth.expression),
          "Activities that allow curiosity, contribution, and ethical growth may feel engaging.",
        ].join(" ")
      : isTeen
        ? [
            `Interests and learning tendencies may align with Expression ${pyth.expression}, Life Path ${pyth.lifePath}, and Vedic Destiny ${vedic.destiny}.`,
            meaningFor(pyth.expression),
            "Below are modern fields teens sometimes explore for inspiration.",
          ].join(" ")
        : [
            `Career tendencies may align with Expression ${pyth.expression}, Life Path ${pyth.lifePath}, and Vedic Destiny ${vedic.destiny}.`,
            meaningFor(pyth.expression),
            "Roles that allow meaningful contribution, skill growth, and ethical impact may feel more sustaining. Practical progress still depends on preparation, relationships, and consistent effort.",
            "A short list of modern professions linked to these numbers appears below.",
          ].join(" "),
    "career",
  );

  const career_suggestions = {
    professions: assertSafeList(
      isChild
        ? [
            "Building / making projects",
            "Drawing, music, or storytelling",
            "Nature walks and collecting facts",
            "Helping roles at home or class",
            "Puzzles, coding toys, or logic games",
            "Sports and movement games",
            "Caring for plants or pets (with adults)",
            "Group games that need teamwork",
          ]
        : professions,
      "professions",
    ),
    disclaimer: CAREER_DISCLAIMER,
  };

  const mapCompatRows = (core: number) =>
    buildCompatibilityMatrix(core).map((row) => ({
      partnerLifePath: row.partnerLifePath,
      romantic: isChild ? "—" : row.romantic,
      business: isChild ? row.friendship : row.business,
      friendship: row.friendship,
    }));

  const mapVedicRows = (core: number) =>
    buildVedicCompatibilityMatrix(core).map((row) => ({
      partnerLifePath: row.partnerLifePath,
      romantic: isChild ? "—" : row.romantic,
      business: isChild ? row.friendship : row.business,
      friendship: row.friendship,
    }));

  const compatibility = {
    life_path: String(pyth.lifePath),
    matrix: mapCompatRows(pyth.lifePath),
    disclaimer: COMPAT_DISCLAIMER,
    pythagorean: {
      raw_number: String(pyth.lifePath),
      matrix: mapCompatRows(pyth.lifePath),
    },
    vedic: {
      moolank: {
        raw_number: String(vedic.psychic),
        matrix: mapVedicRows(vedic.psychic),
      },
      bhagyank: {
        raw_number: String(vedic.destiny),
        matrix: mapVedicRows(vedic.destiny),
      },
      namank: {
        raw_number: String(vedic.nameNumber),
        matrix: mapVedicRows(vedic.nameNumber),
      },
      // Legacy fields for older clients / partial reads
      raw_number: String(vedic.destiny),
      matrix: mapVedicRows(vedic.destiny),
    },
  };

  const nameChangeNote = names.differs
    ? `Birth-certificate name ${fullName} (${names.force.label === "Birth name" ? "earlier" : "natal"} NN ${natalVedic.nameNumber}, Expression ${natalPyth.expression}) and current legal name ${operatingName} (${names.force.label}) are both kept. Psychic and Destiny do not change with a name. Reflective spelling layers only—not legal, marriage, or identity advice.`
    : null;
  const givenNameNote =
    names.differs && names.force.givenUnchanged
      ? `The given name is unchanged; the later layer is mainly a surname shift. Given-name NN stays ${names.operating.givenVedic}.`
      : names.differs && !names.force.givenUnchanged
        ? `The given name also changed (natal given NN ${names.natal.givenVedic}, current given NN ${names.operating.givenVedic}).`
        : null;

  const chaldeanAnalysis = assertSafeCopy(
    [
      `Chaldean Name Number ${chald.nameNumber} (compound ${chald.compound}) offers a traditional vibration reading of the name in force now (${operatingName}).`,
      names.differs
        ? `Birth-certificate spelling ${fullName} reads as Chaldean ${natalChald.nameNumber} (compound ${natalChald.compound}).`
        : null,
      chaldeanCompoundMeaning(chald.compound),
      meaningFor(chald.nameNumber),
      "In Chaldean practice, compound numbers may add nuance before reduction. Interpretations remain reflective possibilities.",
      ...bookendsAnalysisLines(operatingName),
      names.differs && !names.force.givenUnchanged
        ? bookendsAnalysisLines(fullName).join(" ")
        : null,
      nameChangeNote,
    ]
      .filter(Boolean)
      .join(" "),
    "chaldean",
  );

  const oppositePairs = oppositesForReport(
    vedic.psychic,
    vedic.destiny,
    vedic.nameNumber,
  );
  const oppositeLine =
    oppositePairs.length > 0
      ? `Vedic Square opposites in your triad: ${oppositePairs
          .map((p) => `${p.a}↔${p.b} (${p.planets})`)
          .join("; ")}.`
      : NINE_NOTE;

  const psychicProfile = vedicNumberProfile(vedic.psychic);
  const profileLine = `Unit System affinity for Psychic ${vedic.psychic}: friendly with ${psychicProfile.friendly.join(", ") || "—"}; more demanding with ${psychicProfile.challenging.join(", ") || "—"}. Color/gem study tones: ${psychicProfile.color} / ${psychicProfile.gem}. ${UNIT_AFFINITY_NOTE}`;

  const projected = projectedYearCycleAt(input.dateOfBirth, now);
  const projectedMeta = projectedYearMeta(projected.number);

  const psychicTheme = vedicDigitTheme(vedic.psychic);
  const destinyTheme = vedicDigitTheme(vedic.destiny);

  const vedicAnalysis = assertSafeCopy(
    [
      `In Vedic numerology traditions, Psychic Number ${vedic.psychic} (from birth day) may describe temperament tendencies, while Destiny Number ${vedic.destiny} may describe broader life themes.`,
      `Psychic ${vedic.psychic} reads as ${psychicTheme.keyword} (${psychicTheme.planet}): ${psychicTheme.psychicFocus}`,
      `Destiny ${vedic.destiny} reads as ${destinyTheme.keyword} (${destinyTheme.planet}): ${destinyTheme.destinyFocus}`,
      `Name Number ${vedic.nameNumber} (compound ${vedic.nameCompound}) uses NumoraWisdom’s Chaldean-aligned Vedic map on the name in force now (${operatingName}); Unit System name is ${vedic.unitSystemNameNumber} (compound ${vedic.unitSystemNameCompound})—shown side by side because letter maps differ.`,
      names.differs
        ? `Natal name ${fullName} reads Vedic NN ${natalVedic.nameNumber} (compound ${natalVedic.nameCompound}). The current trio uses the later spelling; the birth spelling remains a root layer.`
        : null,
      givenNameNote,
      vedic.birthDay.note,
      vedic.psychicMeta.psychicNote,
      vedic.destinyMeta.destinyNote,
      vedic.harmony.detail,
      vedic.temperament.summary,
      `Ruling planet association for the Psychic Number: ${vedic.rulingPlanet}; for Destiny: ${vedic.destinyRulingPlanet}.`,
      vedicRoleMeaning(vedic.psychic, "psychic"),
      vedicRoleMeaning(vedic.destiny, "destiny"),
      unitSystemCompatNote(),
      REDUCTION_TIP,
      oppositeLine,
      profileLine,
      `Projected Year ${projected.number} for ${projected.rangeLabel} (${projectedMeta.planet}): ${projectedMeta.theme}`,
      "Use Vedic numbers as a second mirror beside Pythagorean and Chaldean views. Where systems differ, treat the contrast as a prompt for nuance rather than conflict.",
    ]
      .filter(Boolean)
      .join(" "),
    "vedic",
  );

  const pyRuling = {
    life_path: planetLabel(planetForPythagorean(pyth.lifePath)),
    birth_day: planetLabel(planetForPythagorean(pyth.birthDay)),
    expression: planetLabel(planetForPythagorean(pyth.expression)),
  };

  const strengths = assertSafeList(
    strengthsFor(pyth.lifePath, pyth.expression, pyth.soulUrge, vedic.psychic),
    "strengths",
  );
  const growth_opportunities = assertSafeList(
    growthFor(
      pyth.lifePath,
      pyth.personality,
      pyth.expression,
      loShu.missing_numbers[0] ?? pyth.lifePath,
    ),
    "growth",
  );

  const age_guidance = ageGuidance(age, name, pyth.lifePath);
  assertSafeCopy(age_guidance.guidance, "age_guidance");
  const monthly_guidance = monthlyGuidance(py, pm, report_type);
  const recommendations = assertSafeList(
    recommendationsFor(
      report_type,
      pyth,
      py,
      pm,
      loShu.missing_numbers,
    ),
    "recommendations",
  );

  const safety_notices = safetyNoticesFor(report_type);
  const sun = sunSignFromDob(input.dateOfBirth.trim());
  const pyChart = buildPythagoreanChart({
    natalName: fullName,
    dateOfBirth: input.dateOfBirth.trim(),
    coreNumbers: [
      natalPyth.lifePath,
      natalPyth.birthDay,
      natalPyth.expression,
      natalPyth.soulUrge,
      natalPyth.personality,
      natalPyth.maturity,
    ],
    asOf: now,
  });

  const snapshot = {
    life_path: String(pyth.lifePath),
    birth_day: String(pyth.birthDay),
    expression_number: String(pyth.expression),
    soul_urge_number: String(pyth.soulUrge),
    personality_number: String(pyth.personality),
    maturity_number: String(pyth.maturity),
    chaldean_name_number: String(chald.nameNumber),
    compound_number: String(chald.compound),
    vedic_psychic: String(vedic.psychic),
    vedic_destiny: String(vedic.destiny),
    vedic_name: String(vedic.nameNumber),
    vedic_name_compound: String(vedic.nameCompound),
    unit_name: String(vedic.unitSystemNameNumber),
    unit_name_compound: String(vedic.unitSystemNameCompound),
    personal_year: String(py),
    personal_month: String(pm),
    personal_day: String(pyChart.personalDay.number),
    balance_number: String(pyChart.balance.number || ""),
    hidden_passion: pyChart.hiddenPassion.numbers.join("/") || undefined,
    minor_expression_number: String(pyth.expression),
    attitude_number: String(pyChart.attitude.number),
    subconscious_self: String(pyChart.subconsciousSelf.number),
    projected_year: String(projected.number),
    projected_year_calendar: projected.rangeLabel,
    sun_sign: sun?.id,
    sun_sign_label: sun?.name,
    ...(names.differs
      ? {
          operating_name: operatingName,
          natal_name: fullName,
          name_era_label: names.force.label,
          natal_expression_number: String(natalPyth.expression),
          natal_soul_urge_number: String(natalPyth.soulUrge),
          natal_personality_number: String(natalPyth.personality),
          natal_maturity_number: String(natalPyth.maturity),
          natal_vedic_name: String(natalVedic.nameNumber),
          natal_vedic_name_compound: String(natalVedic.nameCompound),
          natal_chaldean_name_number: String(natalChald.nameNumber),
          natal_unit_name: String(natalVedic.unitSystemNameNumber),
          given_vedic_name: String(names.operating.givenVedic),
          natal_given_vedic_name: String(names.natal.givenVedic),
        }
      : {}),
  };

  const growth_areas = synthesizeGrowthAreas({
    snap: snapshot,
    loShu,
    fullName: operatingName,
    growthBank: growth_opportunities,
  });

  const base: Omit<NumerologyReport, "sections"> = {
    person: {
      full_name: fullName,
      preferred_name: input.preferredName?.trim() || "",
      date_of_birth: input.dateOfBirth.trim(),
      age,
      report_type,
      gender: input.gender?.trim() || "",
      purpose: input.purpose?.trim() || "",
      ...(names.differs
        ? {
            operating_name: operatingName,
            name_era_label: names.force.label,
          }
        : {}),
    },
    numerology_snapshot: snapshot,
    pythagorean: {
      life_path: { number: pyth.lifePath, meaning: meaningFor(pyth.lifePath) },
      birth_day: { number: pyth.birthDay, meaning: meaningFor(pyth.birthDay) },
      expression: {
        number: pyth.expression,
        meaning: meaningFor(pyth.expression),
      },
      soul_urge: { number: pyth.soulUrge, meaning: meaningFor(pyth.soulUrge) },
      personality: {
        number: pyth.personality,
        meaning: meaningFor(pyth.personality),
      },
      maturity: { number: pyth.maturity, meaning: meaningFor(pyth.maturity) },
      ruling_planets: pyRuling,
    },
    chaldean: {
      name_number: String(chald.nameNumber),
      compound_number: String(chald.compound),
      reduced_number: String(chald.reduced),
      analysis: chaldeanAnalysis,
    },
    vedic: {
      psychic_number: {
        number: vedic.psychic,
        meaning: vedicRoleMeaning(vedic.psychic, "psychic"),
      },
      destiny_number: {
        number: vedic.destiny,
        meaning: vedicRoleMeaning(vedic.destiny, "destiny"),
      },
      name_number: {
        number: vedic.nameNumber,
        meaning: meaningFor(vedic.nameNumber),
      },
      unit_name_number: {
        number: vedic.unitSystemNameNumber,
        meaning: meaningFor(vedic.unitSystemNameNumber),
      },
      unit_name_compound: String(vedic.unitSystemNameCompound),
      ruling_planet: vedic.rulingPlanet,
      destiny_ruling_planet: vedic.destinyRulingPlanet,
      analysis: vedicAnalysis,
      unitSystem: {
        birth_day_note: vedic.birthDay.note,
        birth_day_exalted: vedic.birthDay.exalted,
        temperament_summary: vedic.temperament.summary,
        doshas: vedic.temperament.doshas,
        harmony_label: vedic.harmony.label,
        harmony_detail: vedic.harmony.detail,
        harmony_tone: vedic.harmony.tone,
        psychic_ease: vedic.psychicMeta.psychicEase,
        destiny_ease: vedic.destinyMeta.destinyEase,
        psychic_note: vedic.psychicMeta.psychicNote,
        destiny_note: vedic.destinyMeta.destinyNote,
        zero_note: vedic.zeroNote,
        compat_note: unitSystemCompatNote(),
      },
    },
    lo_shu: loShu,
    personality: {
      core_personality: core,
      communication_style: communication,
      relationship_style: relationships,
      career_style: career,
    },
    career_suggestions,
    compatibility,
    strengths,
    growth_opportunities,
    growth_areas,
    age_guidance,
    personal_year: {
      number: String(pyOutlook.number),
      theme: pyOutlook.nature.typical,
      advice: pyOutlook.nature.practice,
      nature: pyOutlook.nature.nature,
      land: LAND_LABEL[pyOutlook.land.band],
      range_label: pyOutlook.rangeLabel ?? undefined,
      pinnacle: `Pinnacle ${pyOutlook.pinnacle.id} · ${pyOutlook.pinnacle.number} ${pyOutlook.pinnacleCopy.name}`,
      karmic: pyOutlook.debts.length
        ? pyOutlook.debts.map((d) => d.label).join(", ")
        : undefined,
      resonance: pyOutlook.land.resonanceLine,
      moment_note: pyOutlook.land.momentNote ?? undefined,
    },
    projected_year: {
      number: String(projected.number),
      calendar_year: String(projected.calendarYearUsed),
      range_label: projected.rangeLabel,
      planet: projectedMeta.planet,
      theme: projectedMeta.theme,
      advice: projectedMeta.practice,
      method_note: PROJECTED_YEAR_METHOD_NOTE,
    },
    personal_month: {
      number: String(pm),
      theme: yearMonthMeaning(pm),
      advice:
        "Let the Personal Month refine the year's theme into near-term habits—weekly priorities, kinder communication, and realistic rest.",
    },
    monthly_guidance,
    recommendations,
    disclaimer: DISCLAIMER,
    safety_notices,
    recommendations_disclaimer: RECOMMENDATIONS_DISCLAIMER,
  };

  return { ...base, sections: buildSections(base) };
}

export function estimateWordCount(report: NumerologyReport): number {
  const text = report.sections.map((s) => `${s.title}\n${s.body}`).join("\n");
  return text.trim().split(/\s+/).filter(Boolean).length;
}
