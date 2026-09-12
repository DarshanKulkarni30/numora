import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { YearInterpretation } from "./yearInterpreter";

export type CareerMove = {
  title: string;
  doThis: string;
  watch: string;
};

export type CareerDomain = {
  id: string;
  title: string;
  why: string;
  useThisYear: string;
  watch: string;
};

export type CareerCompass = {
  modeLine: string;
  meaning: string;
  moves: CareerMove[];
  domains: CareerDomain[];
};

export type LifeThemeFit = {
  id: string;
  title: string;
  band: "primary" | "secondary" | "maintain";
  why: string;
  doThis: string;
  watch: string;
};

export type LifeCompass = {
  intro: string;
  themes: LifeThemeFit[];
};

type YearCtx = {
  py: number;
  pyVerb: string;
  cycleN: number | null;
  cycleLetter: string | null;
  cycleVerb: string;
  purpose: string;
  amplified: boolean;
};

function ctxFrom(year: YearInterpretation, purpose: string): YearCtx {
  return {
    py: year.personalYear,
    pyVerb: year.pyMode.verb,
    cycleN: year.cycleNumber,
    cycleLetter: year.cycleLetter,
    cycleVerb: year.cycleMode.verb,
    purpose: purpose || "Self-reflection",
    amplified: year.cycleNumber != null && year.cycleNumber === year.personalYear,
  };
}

function cycleBit(c: YearCtx): string {
  if (c.cycleLetter && c.cycleN != null) {
    return `Name Cycle ${c.cycleLetter}/${c.cycleN} (${c.cycleVerb})`;
  }
  return "your current name vibration";
}

export function buildCareerCompass(opts: {
  bn: number;
  dn: number;
  nameRoot: number;
  year: YearInterpretation;
}): CareerCompass {
  const c = ctxFrom(opts.year, "");
  const bn = reduceToSingleDigit(opts.bn);
  const dn = reduceToSingleDigit(opts.dn);
  const name = reduceToSingleDigit(opts.nameRoot);

  const modeLine = assertSafeCopy(
    `Career mode this year: ${c.pyVerb} + ${c.cycleVerb}.`,
    "blueprint.career.mode",
  );
  const meaning = assertSafeCopy(
    `This is not a list of jobs to switch into. It is how to use the work you already do in a ${c.pyVerb} year, with ${cycleBit(c)} colouring how you show up. Birth ${bn}, Destiny ${dn}, and Name ${name} stay the longer pattern.`,
    "blueprint.career.meaning",
  );

  const moves: CareerMove[] = [
    {
      title: "Make one current piece of work public",
      doThis: assertSafeCopy(
        c.py === 3 || c.py === 5
          ? "Pick one project you are already in. Put a demo, one-pager, or short walkthrough in front of a real person this week."
          : c.py === 7
            ? "Write a one-page explanation of work you already understand, then share it with one colleague — not a new research rabbit hole."
            : c.py === 4 || c.py === 8
              ? "Ship one measurable result from work already in progress. Name the date it will be done."
              : `Take one step this week that matches a ${c.pyVerb} year, using a project that already exists.`,
        "blueprint.career.m1",
      ),
      watch: assertSafeCopy(
        "Do not start a new role, brand, or side-hustle as a way to avoid finishing the current one.",
        "blueprint.career.m1w",
      ),
    },
    {
      title: "Finish before you multiply",
      doThis: assertSafeCopy(
        "Define “done” for that one piece (sent, published, invoiced, or handed over). Do not open a second initiative until that definition is met.",
        "blueprint.career.m2",
      ),
      watch: assertSafeCopy(
        c.amplified
          ? "Talking about the work can feel like progress this year. It is not, until something left the building."
          : "A new interesting problem is not permission to abandon the open one.",
        "blueprint.career.m2w",
      ),
    },
    {
      title: "Use depth where you already have it",
      doThis: assertSafeCopy(
        name === 7 || c.cycleN === 7
          ? "Add one layer of evidence or explanation under the public piece (a short FAQ, a worked example, a limitation note)."
          : "Ask one user, client, or colleague what was unclear, and change one sentence in the public piece.",
        "blueprint.career.m3",
      ),
      watch: assertSafeCopy(
        "Do not disappear into private polish for the whole year. Depth is a support, not a hiding place.",
        "blueprint.career.m3w",
      ),
    },
  ];

  const rankedDomains = [
    {
      id: "tech",
      title: "If you work in technology or AI",
      digits: [3, 4, 7, 1],
      why: `Birth ${bn} / Destiny ${dn} / Name ${name} plus a ${c.pyVerb} year favors explaining complex work in plain language.`,
      useThisYear:
        "Present one technical idea. Build visibility around a product you already have. Treat expertise as something other people can try, not only something you hold.",
      watch: "A full year of private building with no outside test.",
    },
    {
      id: "venture",
      title: "If you build or run a venture",
      digits: [1, 3, 5, 8],
      why: `A ${c.pyVerb} year rewards a visible offer, not a new company every month.`,
      useThisYear:
        "Name the offer in one sentence. Put it in front of five real people. Keep the operating system of the business from stalling while you talk.",
      watch: "Confusing a new pitch with a new business.",
    },
    {
      id: "consult",
      title: "If you advise or teach",
      digits: [3, 6, 7, 9],
      why: `${cycleBit(c)} plus Personal Year ${c.py} supports turning what you know into a session someone else can use.`,
      useThisYear:
        "Run one workshop, clinic, or written brief on a problem you already solve. Record the questions people actually ask.",
      watch: "Adding a new curriculum before the current one has been delivered once.",
    },
    {
      id: "research",
      title: "If you research or analyse",
      digits: [7, 4, 1],
      why: `Name ${name} and a ${c.pyVerb} year can work together: depth, then a public trace of it.`,
      useThisYear:
        "Publish a short finding from work already on your desk. One chart or one paragraph is enough.",
      watch: "Waiting for certainty that will not arrive this year.",
    },
  ].map((d) => {
    const hits = [bn, dn, name, c.py, c.cycleN ?? c.py].filter((n) =>
      d.digits.includes(n),
    ).length;
    return { ...d, hits };
  });

  rankedDomains.sort((a, b) => b.hits - a.hits);

  return {
    modeLine,
    meaning,
    moves,
    domains: rankedDomains.map((d) => ({
      id: d.id,
      title: d.title,
      why: assertSafeCopy(d.why, `blueprint.career.${d.id}.why`),
      useThisYear: assertSafeCopy(d.useThisYear, `blueprint.career.${d.id}.use`),
      watch: assertSafeCopy(d.watch, `blueprint.career.${d.id}.watch`),
    })),
  };
}

type LifeId =
  | "growth"
  | "learning"
  | "relationships"
  | "purpose"
  | "family"
  | "finance"
  | "home";

function lifeCards(c: YearCtx): Record<LifeId, Omit<LifeThemeFit, "band">> {
  const aim = c.purpose;
  return {
    growth: {
      id: "growth",
      title: "Personal growth",
      why: assertSafeCopy(
        `Aim on file: ${aim}. In a ${c.pyVerb} year, growth is not more self-study. It is turning one private idea into something another person can see.`,
        "blueprint.life.growth.why",
      ),
      doThis: assertSafeCopy(
        "Write one page on an idea you have been holding. Share it with one trusted person this week. Then stop adding new frameworks.",
        "blueprint.life.growth.do",
      ),
      watch: assertSafeCopy(
        "Buying another course or starting a new journal system instead of sending the page.",
        "blueprint.life.growth.watch",
      ),
    },
    learning: {
      id: "learning",
      title: "Learning",
      why: assertSafeCopy(
        `Personal Year ${c.py} (${c.pyVerb}) plus ${cycleBit(c)} favors learning you can explain, not a pile of unread tabs.`,
        "blueprint.life.learn.why",
      ),
      doThis: assertSafeCopy(
        "Teach or write one concept you already use. If you cannot explain it in ten minutes, that is the study — not a new topic.",
        "blueprint.life.learn.do",
      ),
      watch: assertSafeCopy(
        "Starting a second subject before the first one has a note, talk, or worked example.",
        "blueprint.life.learn.watch",
      ),
    },
    relationships: {
      id: "relationships",
      title: "Relationships",
      why: assertSafeCopy(
        c.py === 2 || c.py === 6
          ? `A ${c.pyVerb} year puts partnership in the foreground. Visibility is not the same as closeness.`
          : `A ${c.pyVerb} year can fill the calendar with talk. That does not automatically improve the important relationship.`,
        "blueprint.life.rel.why",
      ),
      doThis: assertSafeCopy(
        "One uninterrupted conversation this week with someone who matters. Say one specific appreciation. Name one pending issue instead of postponing it.",
        "blueprint.life.rel.do",
      ),
      watch: assertSafeCopy(
        "Using more social activity, messages, or events to avoid one honest talk.",
        "blueprint.life.rel.watch",
      ),
    },
    purpose: {
      id: "purpose",
      title: "Purpose",
      why: assertSafeCopy(
        `Your stored aim is ${aim}. A ${c.pyVerb} year asks you to pick the aim that is ready to be expressed, and to leave the rest on a Later list.`,
        "blueprint.life.purpose.why",
      ),
      doThis: assertSafeCopy(
        "Write the aim as one sentence you could say aloud. If you cannot, the work this week is that sentence — not a new life plan.",
        "blueprint.life.purpose.do",
      ),
      watch: assertSafeCopy(
        "Redesigning your whole purpose every time a new idea appears.",
        "blueprint.life.purpose.watch",
      ),
    },
    family: {
      id: "family",
      title: "Family",
      why: assertSafeCopy(
        c.py === 6
          ? `A ${c.pyVerb} year often increases family load. The useful move is one owned responsibility, not heroic availability.`
          : `Family will not be the year's headline, but it still needs one reliable act so it does not run on reminders.`,
        "blueprint.life.family.why",
      ),
      doThis: assertSafeCopy(
        "Pick one recurring weekly family task and own it completely (same day, no prompt needed). Tell the other person you have it.",
        "blueprint.life.family.do",
      ),
      watch: assertSafeCopy(
        "Saying yes to every family request while the one repeating task still slips.",
        "blueprint.life.family.watch",
      ),
    },
    finance: {
      id: "finance",
      title: "Finance",
      why: assertSafeCopy(
        c.py === 8
          ? `A ${c.pyVerb} year supports money results. Use existing knowledge and relationships before inventing a new stream.`
          : `Money is not the year's main stage, but a ${c.pyVerb} year still leaks cash when ideas multiply without a price.`,
        "blueprint.life.fin.why",
      ),
      doThis: assertSafeCopy(
        "List income that could come from work you already know how to do. Put a number and a date on one of those, this month.",
        "blueprint.life.fin.do",
      ),
      watch: assertSafeCopy(
        "Spending on tools, courses, or a new offer while an existing invoice or follow-up sits undone.",
        "blueprint.life.fin.watch",
      ),
    },
    home: {
      id: "home",
      title: "Home",
      why: assertSafeCopy(
        `Home is maintenance this year unless Personal Year is 4 or 6. A ${c.pyVerb} year still needs one physical reset so the rest of the visibility has a base.`,
        "blueprint.life.home.why",
      ),
      doThis: assertSafeCopy(
        "Choose one room, drawer, or weekly household loop. Finish it in one sitting. Do not start a renovation.",
        "blueprint.life.home.do",
      ),
      watch: assertSafeCopy(
        "Using home projects as displacement from the one public or relational task above.",
        "blueprint.life.home.watch",
      ),
    },
  };
}

export function buildLifeCompass(opts: {
  purpose: string;
  growthTitles?: string[];
  year: YearInterpretation;
}): LifeCompass {
  const purpose = opts.purpose || "Self-reflection";
  const c = ctxFrom(opts.year, purpose);
  const cards = lifeCards(c);
  const order: LifeId[] = [
    "growth",
    "learning",
    "relationships",
    "purpose",
    "family",
    "finance",
    "home",
  ];

  const score: Record<LifeId, number> = {
    growth: 4,
    learning: 3,
    relationships: 3,
    purpose: 3,
    family: 2,
    finance: 2,
    home: 1,
  };
  if (/self-reflection|curios/i.test(purpose)) {
    score.growth += 5;
    score.learning += 4;
    score.purpose += 3;
  }
  if (/relation/i.test(purpose)) score.relationships += 8;
  if (/career/i.test(purpose)) score.finance += 6;
  if (/family/i.test(purpose)) {
    score.family += 8;
    score.home += 4;
  }
  if (c.py === 3 || c.py === 5) {
    score.growth += 3;
    score.learning += 2;
  }
  if (c.py === 2 || c.py === 6) score.relationships += 4;
  if (c.py === 6) {
    score.family += 4;
    score.home += 3;
  }
  if (c.py === 8) score.finance += 5;
  if (c.py === 4) score.home += 3;
  if (c.py === 7) score.learning += 3;

  const ranked = [...order].sort((a, b) => score[b] - score[a]);
  const themes: LifeThemeFit[] = ranked.map((id, i) => ({
    ...cards[id],
    band: i < 2 ? "primary" : i < 4 ? "secondary" : "maintain",
  }));

  const intro = assertSafeCopy(
    `Primary this year: ${themes[0]!.title} and ${themes[1]!.title}. Each card has one action. Do the Primary actions first.`,
    "blueprint.life.intro",
  );

  return { intro, themes };
}
