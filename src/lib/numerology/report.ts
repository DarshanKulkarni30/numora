import { calculateChaldean } from "./chaldean";
import { personalMonth, personalYear } from "./cycles";
import { calculateLoShu } from "./loShu";
import {
  DISCLAIMER,
  GROWTH_BANK,
  STRENGTH_BANK,
  chaldeanCompoundMeaning,
  meaningFor,
  pickUnique,
  yearMonthMeaning,
} from "./meanings";
import { calculatePythagorean } from "./pythagorean";
import { calculateAge } from "./reduce";
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

function ageGuidance(age: number, name: string, lifePath: number): {
  category: string;
  guidance: string;
} {
  if (age < 14) {
    return {
      category: "Parent Guidance",
      guidance: [
        `For ${name}, according to numerology traditions, Life Path ${lifePath} may offer supportive clues about learning style and emotional needs—not fixed labels.`,
        "Learning style: this pattern may suggest responding well to encouragement, clear routines, and creative exploration matched to attention span.",
        "Confidence building: celebrate small completions and effort, not only outcomes. Short wins can strengthen a sense of capability.",
        "Emotional needs: warmth, predictable care, and space to name feelings may help this period of development.",
        "Parenting approach: firm kindness—boundaries with explanation—may align well with growing self-trust.",
        "Communication advice: ask open questions, reflect feelings, and avoid comparing progress to peers.",
        "Children continue developing emotionally, socially and intellectually. These insights should be used as supportive guidance rather than fixed labels.",
      ].join("\n\n"),
    };
  }
  if (age <= 19) {
    return {
      category: "Guidance For Teens And Parents",
      guidance: [
        `For ${name} (age ${age}), numerology traditions may describe tendencies around identity and motivation linked with Life Path ${lifePath}.`,
        "Identity formation: this period may emphasize trying roles, values, and friendships. Curiosity can be a strength when paired with reflection.",
        "Self-confidence: progress may come from skills practiced consistently more than from sudden breakthroughs.",
        "Friendships: social belonging may matter deeply; supportive peers and clear personal boundaries can coexist.",
        "Academic motivation: purpose-linked goals and varied study methods may help more than pressure alone.",
        "Emotional regulation: naming stress and using short resets (walks, journaling, music) may support steadier choices.",
        "Healthy communication: respectful honesty between teens and parents may reduce misunderstandings during growth spurts of independence.",
        "These interpretations describe potential tendencies and should not limit personal growth or future choices.",
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

function monthlyGuidance(py: number, pm: number) {
  return {
    career: `According to numerology traditions, Personal Month ${pm} within a Personal Year ${py} may emphasize thoughtful career pacing—progress through clear priorities rather than forced urgency. This could suggest reviewing commitments and choosing one high-value focus.`,
    relationships: `This period may emphasize presence and honest communication. Small consistent gestures may matter more than grand statements. Outcomes remain open; the invitation is reflective connection.`,
    finances: `Money awareness this month may benefit from tracking, simplifying, and avoiding impulsive upgrades. Numerology may highlight stewardship themes—not windfalls or losses as certainties.`,
    learning: `Study and skill-building may flow when broken into short sessions. Curiosity paired with a simple weekly review could support retention.`,
    wellbeing: `Emotional focus may include rest, nervous-system care, and reducing overstimulation. Supportive routines may help more than dramatic overhauls.`,
    focus_areas: [
      "One priority project",
      "Clearer communication in key relationships",
      "A sustainable daily rhythm",
      "Skill practice in short blocks",
      "Gentle money tracking",
    ],
    avoid: [
      "Treating cycle numbers as guarantees",
      "Overcommitting out of FOMO",
      "Neglecting rest during ambitious pushes",
      "Harsh self-judgment when plans adjust",
    ],
  };
}

function buildSections(report: Omit<NumerologyReport, "sections">): ReportSection[] {
  const n = displayName({
    fullName: report.person.full_name,
    preferredName: report.person.preferred_name,
    dateOfBirth: report.person.date_of_birth,
  });
  const snap = report.numerology_snapshot;
  const py = report.pythagorean;
  const sections: ReportSection[] = [
    {
      id: "executive-summary",
      title: "1. Executive Summary",
      body: [
        `${n}, this Numerora report weaves Pythagorean, Chaldean, Vedic, and Lo Shu perspectives from your name and birth date.`,
        `Your snapshot highlights Life Path ${snap.life_path}, Expression ${snap.expression_number}, Vedic Destiny ${snap.vedic_destiny}, and Personal Year ${snap.personal_year}.`,
        `According to numerology traditions, these patterns may indicate tendencies in motivation, communication, and pacing. They are mirrors for reflection—not forecasts of fixed destiny.`,
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
        "Together, these Pythagorean numbers may describe the journey (Life Path), outer talents (Expression), inner longing (Soul Urge), first impressions (Personality), and longer-arc integration (Maturity).",
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
        "These are conscious improvement areas—invitations for practice, not judgments or fixed limits.",
      ].join("\n"),
    },
    {
      id: "career",
      title: "10. Career Tendencies",
      body: report.personality.career_style,
    },
    {
      id: "relationships",
      title: "11. Relationship Style",
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
        `Career: ${report.monthly_guidance.career}`,
        `Study: ${report.monthly_guidance.learning}`,
        `Relationships: ${report.monthly_guidance.relationships}`,
        `Communication: lean into clarity and kindness; pause before reacting when emotions run high.`,
        `Personal Growth: ${report.monthly_guidance.wellbeing}`,
        `Money Awareness: ${report.monthly_guidance.finances}`,
        `Emotional Focus: notice what restores you and schedule it like an appointment.`,
        "",
        "Recommended focus areas:",
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
      id: "closing",
      title: "Closing Reflection",
      body: [
        `${n}, according to numerology traditions your pattern blends initiative and reflection in ways that can support meaningful self-understanding.`,
        "Use this report as a warm companion for journaling, conversations, and gentle course-correction—not as a verdict.",
        "You remain free to grow beyond any chart. May the next season meet you with curiosity, steadiness, and kindness toward yourself.",
        DISCLAIMER,
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

  const core = [
    `At the center of this reading, Life Path ${pyth.lifePath} and Expression ${pyth.expression} may describe how ${name} moves through goals and self-expression.`,
    meaningFor(pyth.lifePath),
    `Soul Urge ${pyth.soulUrge} may point to inner motivations, while Personality ${pyth.personality} may color first impressions. Maturity ${pyth.maturity} could suggest themes that deepen with experience.`,
  ].join(" ");

  const communication = [
    `Communication style may lean through Personality ${pyth.personality} and Expression ${pyth.expression}.`,
    meaningFor(pyth.personality),
    "In practice, this could suggest balancing clarity with warmth: say the true thing, and leave room for the other person's pace. When emotions rise, a short pause before responding may improve understanding.",
  ].join(" ");

  const relationships = [
    `Relationship style may be colored by Soul Urge ${pyth.soulUrge} and Life Path ${pyth.lifePath}.`,
    meaningFor(pyth.soulUrge),
    "According to numerology traditions, closeness may grow through reliability, respectful honesty, and shared rituals of attention. This may indicate preferences—not guarantees—about partnership outcomes.",
  ].join(" ");

  const career = [
    `Career tendencies may align with Expression ${pyth.expression}, Life Path ${pyth.lifePath}, and Vedic Destiny ${vedic.destiny}.`,
    meaningFor(pyth.expression),
    "Roles that allow meaningful contribution, skill growth, and ethical impact may feel more sustaining. Practical success still depends on preparation, relationships, and consistent effort—not chart numbers alone.",
  ].join(" ");

  const chaldeanAnalysis = [
    `Chaldean Name Number ${chald.nameNumber} (compound ${chald.compound}) offers a traditional vibration reading of the full name.`,
    chaldeanCompoundMeaning(chald.compound),
    meaningFor(chald.nameNumber),
    "In Chaldean practice, compound numbers may add nuance before reduction. Interpretations remain reflective possibilities.",
  ].join(" ");

  const vedicAnalysis = [
    `In Vedic numerology traditions, Psychic Number ${vedic.psychic} (from birth day) may describe temperament tendencies, while Destiny Number ${vedic.destiny} may describe broader life themes.`,
    `Name Number ${vedic.nameNumber} (compound ${vedic.nameCompound}) reflects the name spelling used in this reading.`,
    `Ruling planet association for the Psychic Number: ${vedic.rulingPlanet}. According to tradition this may indicate stylistic tendencies—not scientific causation.`,
    meaningFor(vedic.psychic),
    meaningFor(vedic.destiny),
    "Use Vedic numbers as a second mirror beside Pythagorean and Chaldean views. Where systems differ, treat the contrast as a prompt for nuance rather than conflict.",
  ].join(" ");

  const strengths = strengthsFor(
    pyth.lifePath,
    pyth.expression,
    pyth.soulUrge,
    vedic.psychic,
  );
  const growth_opportunities = growthFor(
    pyth.lifePath,
    pyth.personality,
    pyth.expression,
    loShu.missing_numbers[0] ?? pyth.lifePath,
  );

  const age_guidance = ageGuidance(age, name, pyth.lifePath);
  const monthly_guidance = monthlyGuidance(py, pm);

  const recommendations = [
    `Journal weekly on how Life Path ${pyth.lifePath} shows up in real choices.`,
    `Practice one communication habit aligned with Personality ${pyth.personality}.`,
    `Choose a skill path that expresses Expression ${pyth.expression} for the next 90 days.`,
    `In Personal Year ${py}, favor pacing suggested by that cycle's theme.`,
    `For Personal Month ${pm}, keep goals small enough to finish.`,
    loShu.missing_numbers.length
      ? `Gently cultivate qualities linked with missing Lo Shu numbers (${loShu.missing_numbers.slice(0, 3).join(", ")}) through habits, not pressure.`
      : "Keep balancing mental, emotional, and practical planes with varied weekly activities.",
    "Revisit this report after major life changes; update name spelling if you legally change your name.",
  ];

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
      analysis: vedicAnalysis,
    },
    lo_shu: loShu,
    personality: {
      core_personality: core,
      communication_style: communication,
      relationship_style: relationships,
      career_style: career,
    },
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
  };

  return { ...base, sections: buildSections(base) };
}

export function estimateWordCount(report: NumerologyReport): number {
  const text = report.sections.map((s) => `${s.title}\n${s.body}`).join("\n");
  return text.trim().split(/\s+/).filter(Boolean).length;
}
