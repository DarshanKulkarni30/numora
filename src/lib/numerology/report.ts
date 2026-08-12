import { calculateChaldean } from "./chaldean";
import { personalMonth, personalYear } from "./cycles";
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
import { planetForPythagorean, planetLabel } from "./planets";
import { calculatePythagorean } from "./pythagorean";
import { calculateAge } from "./reduce";
import { bookendsAnalysisLines } from "./nameBookends";
import {
  buildVedicCompatibilityMatrix,
  VEDIC_COMPAT_NOTE,
} from "./vedicCompatibility";
import { assertSafeCopy, assertSafeList } from "./safety";
import type {
  NumerologyReport,
  PersonInput,
  ReportSection,
  ReportType,
} from "./types";
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
  const pyTheme = yearMonthMeaning(py);
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

  const sections: ReportSection[] = [
    {
      id: "executive-summary",
      title: "1. Executive Summary",
      body: [
        isMinor
          ? `${n}'s Numora reading weaves Pythagorean, Chaldean, Vedic, and Lo Shu perspectives from name and birth date for supportive reflection by a parent/guardian or teen—with care.`
          : `${n}, this Numora report weaves Pythagorean, Chaldean, Vedic, and Lo Shu perspectives from your name and birth date.`,
        `Snapshot highlights Life Path ${snap.life_path}, Expression ${snap.expression_number}, Vedic Destiny ${snap.vedic_destiny}, and Personal Year ${snap.personal_year}.`,
        `According to numerology traditions, these patterns may indicate tendencies in motivation, communication, and pacing.`,
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
        `- Personal Year / Month: ${snap.personal_year} / ${snap.personal_month}`,
      ].join("\n"),
    },
    {
      id: "pythagorean",
      title: "3. Pythagorean Analysis",
      body: [
        `Life Path ${py.life_path.number}: ${py.life_path.meaning}`,
        `Birth Day ${py.birth_day.number}: ${py.birth_day.meaning}`,
        `Expression ${py.expression.number}: ${py.expression.meaning}`,
        `Soul Urge ${py.soul_urge.number}: ${py.soul_urge.meaning}`,
        `Personality ${py.personality.number}: ${py.personality.meaning}`,
        `Maturity ${py.maturity.number}: ${py.maturity.meaning}`,
        "Together, these Pythagorean numbers may describe optional reflective themes—not ranked worth or fixed fate.",
      ].join("\n\n"),
    },
    {
      id: "chaldean",
      title: "4. Chaldean Analysis",
      body: report.chaldean.analysis,
    },
    {
      id: "vedic",
      title: "5. Vedic Numerology Analysis",
      body: report.vedic.analysis,
    },
    {
      id: "lo-shu",
      title: "6. Lo Shu Analysis",
      body: report.lo_shu.analysis,
    },
    {
      id: "core-personality",
      title: "7. Core Personality",
      body: report.personality.core_personality,
    },
    {
      id: "strengths",
      title: "8. Key Strengths",
      body: report.strengths.map((s) => `• ${s}`).join("\n"),
    },
    {
      id: "growth",
      title: "9. Growth Opportunities",
      body: [
        ...report.growth_opportunities.map((s) => `• ${s}`),
        "",
        "These are conscious improvement areas—invitations for practice, not judgments, deficits, or fixed limits.",
      ].join("\n"),
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
      title: "14. Personal Year Analysis",
      body: [
        `Personal Year ${report.personal_year.number}: ${report.personal_year.theme}`,
        report.personal_year.advice,
      ].join("\n\n"),
    },
    {
      id: "personal-month",
      title: "15. Personal Month Analysis",
      body: [
        `Personal Month ${report.personal_month.number}: ${report.personal_month.theme}`,
        report.personal_month.advice,
      ].join("\n\n"),
    },
    {
      id: "current-month",
      title: "16. Current Month Guidance",
      body: [
        report.person.report_type === "adult"
          ? `Career: ${report.monthly_guidance.career}`
          : `Learning & interests: ${report.monthly_guidance.career}`,
        `Study: ${report.monthly_guidance.learning}`,
        `Relationships: ${report.monthly_guidance.relationships}`,
        `Communication: lean into clarity and kindness; pause before reacting when emotions run high.`,
        `Personal Growth: ${report.monthly_guidance.wellbeing}`,
        `Money Awareness: ${report.monthly_guidance.finances}`,
        `Emotional Focus: notice what restores calm and schedule gentle recovery time.`,
        "",
        "Recommended focus areas (optional):",
        ...report.monthly_guidance.focus_areas.map((f) => `• ${f}`),
        "",
        "Helpful to de-emphasize:",
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
  const pyth = calculatePythagorean(fullName, input.dateOfBirth);
  const chald = calculateChaldean(fullName);
  const vedic = calculateVedic(fullName, input.dateOfBirth);
  const loShu = calculateLoShu(input.dateOfBirth);
  const py = personalYear(input.dateOfBirth, now);
  const pm = personalMonth(py, now);
  const name = displayName(input);
  const isChild = report_type === "child";
  const isTeen = report_type === "adolescent";

  const core = assertSafeCopy(
    [
      `At the center of this reading, Life Path ${pyth.lifePath} and Expression ${pyth.expression} may describe how ${name} moves through goals and self-expression.`,
      meaningFor(pyth.lifePath),
      `Soul Urge ${pyth.soulUrge} may point to inner motivations, while Personality ${pyth.personality} may color first impressions. Maturity ${pyth.maturity} could suggest themes that deepen with experience.`,
      "These are reflective possibilities—not judgments of worth, intelligence, morality, or destiny.",
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

  const chaldeanAnalysis = assertSafeCopy(
    [
      `Chaldean Name Number ${chald.nameNumber} (compound ${chald.compound}) offers a traditional vibration reading of the full name.`,
      chaldeanCompoundMeaning(chald.compound),
      meaningFor(chald.nameNumber),
      "In Chaldean practice, compound numbers may add nuance before reduction. Interpretations remain reflective possibilities.",
      ...bookendsAnalysisLines(fullName),
    ].join(" "),
    "chaldean",
  );

  const vedicAnalysis = assertSafeCopy(
    [
      `In Vedic numerology traditions, Psychic Number ${vedic.psychic} (from birth day) may describe temperament tendencies, while Destiny Number ${vedic.destiny} may describe broader life themes.`,
      `Name Number ${vedic.nameNumber} (compound ${vedic.nameCompound}) reflects the name spelling used in this reading.`,
    `Ruling planet association for the Psychic Number: ${vedic.rulingPlanet}; for Destiny: ${vedic.destinyRulingPlanet}. According to tradition these may indicate stylistic tendencies.`,
    meaningFor(vedic.psychic),
    meaningFor(vedic.destiny),
    "Use Vedic numbers as a second mirror beside Pythagorean and Chaldean views. Where systems differ, treat the contrast as a prompt for nuance rather than conflict.",
    ].join(" "),
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

  const base: Omit<NumerologyReport, "sections"> = {
    person: {
      full_name: fullName,
      preferred_name: input.preferredName?.trim() || "",
      date_of_birth: input.dateOfBirth.trim(),
      age,
      report_type,
      gender: input.gender?.trim() || "",
      purpose: input.purpose?.trim() || "",
    },
    numerology_snapshot: {
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
      personal_year: String(py),
      personal_month: String(pm),
    },
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
        meaning: meaningFor(vedic.psychic),
      },
      destiny_number: {
        number: vedic.destiny,
        meaning: meaningFor(vedic.destiny),
      },
      name_number: {
        number: vedic.nameNumber,
        meaning: meaningFor(vedic.nameNumber),
      },
      ruling_planet: vedic.rulingPlanet,
      destiny_ruling_planet: vedic.destinyRulingPlanet,
      analysis: vedicAnalysis,
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
    age_guidance,
    personal_year: {
      number: String(py),
      theme: yearMonthMeaning(py),
      advice:
        "Treat the Personal Year as a weather report for pacing: lean into its emphasis, stay flexible, and avoid reading it as a guarantee of specific events.",
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
