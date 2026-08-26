type MeaningMap = Record<number, string>;

const CORE: MeaningMap = {
  1: "This number is about starting things and deciding for yourself. You notice it when a room waits for someone to go first. Start one small thing today and put your name on it.",
  2: "This number is about working with one other person and waiting for the right moment. You notice it when you hold back so long that nothing is said. Do one task with one other person this week.",
  3: "This number is about talking and sharing ideas. You notice it when many talks start and none finish. Finish one thing you started saying to someone.",
  4: "This number is about plans and finishing the work. You notice it when you keep planning and the week never starts. Write one repeating plan and keep it this week.",
  5: "This number is about change and trying new things. You notice it when you switch course every day. Change one small thing this week, not everything at once.",
  6: "This number is about care at home and keeping promises. You notice it when you say yes until you have no rest. Keep one promise to someone, then keep one hour for yourself.",
  7: "This number is about quiet thinking before you answer. You notice it when you go so quiet that people think you do not care. Take ten quiet minutes, then answer the person who is waiting.",
  8: "This number is about money, results, and finishing real work. You notice it when you push with no pause. Finish one result you can measure, then rest.",
  9: "This number is about finishing what is already done and helping a wider group. You notice it when you keep an ending open. Close one loop before you start another.",
  11: "This number is 11: notice first, then rest. You notice it when thinking fills the whole month. Write down one thing you keep noticing, then rest. Do not force a big launch.",
  22: "This number is 22: a large plan that needs ordinary steps. You notice it when the plan never meets a calendar. Put one practical step on a real date this week.",
  33: "This number is 33: teach and care without emptying yourself. You notice it when you help everyone except yourself. Help one person properly, then stop.",
};

const YEAR_MONTH: MeaningMap = {
  1: "This period is for starting one thing. Do not wait for a perfect week. Begin one small piece and put your name on it.",
  2: "This period is for working with one other person. Hear them out, then decide together. Do one shared task this week.",
  3: "This period is for talking and showing work. Finish one piece and let someone see it. Do not open three new ones.",
  4: "This period is for admin and routines. Write one repeating plan (a list, a slot, or a weekly step) and keep it this week.",
  5: "This period is for change. Pick one small change you can undo. Do not rewrite the whole plan.",
  6: "This period is for home, care, and promises. Keep one promise to someone, then keep one hour for yourself. Do not say yes to every ask.",
  7: "This period is for study and quiet. Protect one study hour, then tell one person what you found. Do not hide all week.",
  8: "This period is for results you can count. Finish one real result, then rest. Speed is not the aim.",
  9: "This period is for endings. Close one loop that is already done. Do not reopen it this month.",
  11: "This period is for noticing, not launching. Write one idea down and rest. Pair a decision with one other person before you add what you want.",
  22: "This period is for a large plan in small steps. Put one step on the calendar this week.",
  33: "This period is for teaching with a limit. Help one person properly, then stop so you have fuel left.",
};

const CHALDEAN_COMPOUND: Record<number, string> = {
  10: "The long total 10 is a fresh start after working with others. Notice when you wait for permission. Start one thing yourself this week.",
  11: "The long total 11 is a fast idea. Check it with one quiet hour before you act. Write the idea down; do not launch it the same day.",
  12: "The long total 12 is help plus ego. Notice when you need to be the star of the help. Do the task with one other person.",
  13: "The long total 13 is change the slow way. Notice the urge to rip everything up. Change one piece of the plan, not the whole plan.",
  14: "The long total 14 is movement plus a need for a repeating plan. Pick one change and keep it for a week.",
  15: "The long total 15 is charm plus a promise. Say one limit out loud so charm does not become a yes you cannot keep.",
  16: "The long total 16 is rebuild after a shock. When the usual way stalls, take one new step — not a whole new plan.",
  17: "The long total 17 is a long result. Finish one piece you can measure this week, then stop.",
  18: "The long total 18 is money and fairness. Count one real number (a bill, a fee, a pay item) before you decide.",
  19: "The long total 19 is independence after experience. Start one thing yourself. Do not wait for the old team to move first.",
  20: "The long total 20 is a slow decision with someone else. Hear them out, then decide together this week.",
  21: "The long total 21 is talk plus finish. Finish one thing you started saying. Do not open a new talk until that one is done.",
  22: "The long total 22 is a large plan. Put one practical step on a real calendar date.",
  23: "The long total 23 is help from other people. Ask one person for one specific piece of help.",
  24: "The long total 24 is care that shows in action. Keep one promise at home this week.",
  25: "The long total 25 is learning from mixed experience. Write one lesson from the last month and use it once.",
  26: "The long total 26 is influence plus duty. Do the duty first. The influence can wait.",
  27: "The long total 27 is teaching. Explain one thing in plain words to someone who asked.",
  28: "The long total 28 is leadership under load. Finish one result, then rest. Do not add a second goal the same day.",
  29: "The long total 29 is a close partnership that needs a line. Say one limit in one sentence to that person.",
  30: "The long total 30 is talk used to move a real task. Send one clear message that names the next step.",
  31: "The long total 31 is a new idea that needs a method. Write the idea as three steps before you start.",
  32: "The long total 32 is a group result. Do one shared task and let the other person finish their part.",
  33: "The long total 33 is care and teaching. Help one person properly, then stop.",
  34: "The long total 34 is making something useful. Finish one small useful thing this week.",
  35: "The long total 35 is a quick mind. Pick one focus for the week and drop the rest.",
  36: "The long total 36 is family or group care. Keep one promise there, then keep one hour for yourself.",
  37: "37 is a clear idea that wants a first step, not more thinking. You see the move, then you keep analysing. Example: you know the message; you do not send it. Pick one idea. Do one visible step this week (send it, book it, or open the file).",
  38: "The long total 38 is organised ambition. Name one result that counts this week. Cut one busy task that does not serve it.",
  39: "The long total 39 is finishing and teaching. Close one loop, then tell one person how you did it.",
  40: "The long total 40 is structure for the long run. Write one repeating plan and keep it this week.",
  41: "The long total 41 is a new start with a check. Start one small thing, then ask one person to look at it the same day.",
  42: "The long total 42 is a system with other people. Write the system in one page so someone else can run it.",
  43: "43 is the long total of the name. When the usual way stalls, try one new step — not a whole new plan.",
  44: "The total 44 means 4 + 4. Slow work, systems, and finishing heavy jobs. Useful — and tiring if everyone expects you to carry the load. Finish one heavy job, then stop.",
  45: "The long total 45 is many skills. Channel curiosity into one craft this week, not five.",
  46: "The long total 46 is care with a standard. Keep one promise and say the standard out loud.",
  47: "The long total 47 is study applied to real work. Take one finding from study and use it on a real task today.",
  48: "The long total 48 is organising money or stuff for a group. Sort one pile (inbox, bills, files) to done.",
  49: "The long total 49 is a wide view cut down to a plan. Write the next three steps only.",
  50: "The long total 50 is freedom after experience. Change one small thing. Do not throw out what already works.",
  51: "The long total 51 is talking and starting. Start one small thing and tell one person what you started.",
  52: "The long total 52 is timing. Wait one beat, then act the same day. Do not wait all week.",
};

/** One short core trait label for tiles and recommendations. */
export const CORE_TRAIT: Record<number, string> = {
  1: "Starting things",
  2: "Working with others",
  3: "Talking and ideas",
  4: "Plans and routines",
  5: "Change and freedom",
  6: "Care and promises",
  7: "Quiet thinking",
  8: "Results and money",
  9: "Finishing and helping",
  11: "Notice first",
  22: "Large practical plans",
  33: "Teach and care",
};

export function coreTraitFor(n: number | string): string {
  const num = Number(n);
  return CORE_TRAIT[num] ?? `Themes of ${n}`;
}

export function meaningFor(n: number, map: MeaningMap = CORE): string {
  return (
    map[n] ??
    CORE[n] ??
    `This number is about a next small step. Notice where you stall. Pick one next step and do it this week.`
  );
}

export function yearMonthMeaning(n: number): string {
  return meaningFor(n, YEAR_MONTH);
}

export function chaldeanCompoundMeaning(compound: number): string {
  if (CHALDEAN_COMPOUND[compound]) return CHALDEAN_COMPOUND[compound];
  return `The long total ${compound} is extra detail on this spelling. Notice where you stall. Take one next step this week — not a whole new plan.`;
}

export const DISCLAIMER =
  "Numerology is a belief-based reflective practice and should not be treated as scientific, medical, legal, financial, educational, parenting, or psychological advice. It does not diagnose, treat, or predict outcomes.";

export const RECOMMENDATIONS_DISCLAIMER =
  "IMPORTANT — Recommendations disclaimer: The focus ideas below are optional reflective suggestions only. They are not instructions, prescriptions, or guarantees. They must not replace professional advice from qualified educators, clinicians, counselors, legal advisors, or other licensed professionals. NumoraWisdom and its operators accept no liability for decisions made solely from this belief-based content.";

export const CHILD_REPORT_DISCLAIMER =
  "CHILD / MINOR SAFETY NOTICE: This reading is for supportive reflection by a parent or guardian only. It is not a developmental assessment, school evaluation, behavioral diagnosis, or parenting directive. Children develop at different rates; do not use these themes to label, limit, compare, pressure, or discriminate against a child. If you have concerns about a child’s wellbeing, learning, or safety, consult qualified professionals. Nothing here predicts future success, setbacks, health, relationships, or character.";

export const TEEN_REPORT_DISCLAIMER =
  "TEEN / ADOLESCENT SAFETY NOTICE: This reading offers optional reflective themes for teens and parents. It is not counseling, mental-health advice, academic placement guidance, or a prediction of identity, ability, or future outcomes. Do not use it to stereotype, shame, or restrict a young person’s choices. Seek qualified professional support for wellbeing, safety, or educational decisions.";

export const STRENGTH_BANK: Record<number, string[]> = {
  1: [
    "You start when others wait",
    "You know where you are heading",
    "You will try a new way",
  ],
  2: [
    "You hear what others miss",
    "You can wait without rushing the room",
    "You work well with one other person",
  ],
  3: [
    "You explain things so people get them",
    "You lift the mood in a group",
    "You solve problems by talking them through",
  ],
  4: [
    "People can count on you to finish",
    "You keep systems and order",
    "You keep going when the work is dull",
  ],
  5: [
    "You adapt when the plan changes",
    "You learn by trying",
    "You find a way when the first way fails",
  ],
  6: [
    "You keep promises to people close to you",
    "You notice what would make a room kinder",
    "You stay loyal when it costs extra time",
  ],
  7: [
    "You think before you speak",
    "You can work alone without panic",
    "You catch errors others skip",
  ],
  8: [
    "You see money and time as real numbers",
    "You finish goals that can be counted",
    "You can run a group toward a result",
  ],
  9: [
    "You see the wider group, not only yourself",
    "You help someone grow without taking over",
    "You can close a chapter and leave it closed",
  ],
  11: [
    "You notice patterns early",
    "You can put an idea in words that move people",
    "You need rest or the noticing turns to noise",
  ],
  22: [
    "You can hold a large plan",
    "You keep going for years, not days",
    "You can coordinate many moving parts",
  ],
  33: [
    "You can teach in plain words",
    "You care for a group without needing the spotlight",
    "People copy what you do more than what you say",
  ],
};

export const GROWTH_BANK: Record<number, string[]> = {
  1: [
    "Ask one person to look before you decide alone",
    "Rest after you start, so the start gets a second day",
    "Hear the other person out before you give the plan",
  ],
  2: [
    "Say what you need in one sentence",
    "Decide once without asking for more approval",
    "Leave a hard talk if it is using you up",
  ],
  3: [
    "Finish one talk or note before you start three",
    "Pick one interest for the week",
    "Ask one question before you tell your story",
  ],
  4: [
    "Let one part of the plan change without throwing the rest out",
    "Ship work that is good enough this week",
    "Put one hour of rest on the same calendar as the work",
  ],
  5: [
    "Keep one change for a full week before you switch again",
    "Give freedom a repeating plan so it does not scatter",
    "Keep the promise you already made before you add a new one",
  ],
  6: [
    "Keep one promise, then stop. Do not add a second yes",
    "Let someone help you once this week",
    "Their mood is not your job to fix",
  ],
  7: [
    "Tell one trusted person what you think",
    "After the quiet hour, send the answer",
    "Act the same day you finish thinking",
  ],
  8: [
    "Name success as one result, not a title",
    "Hand one task to someone else and do not take it back",
    "Schedule rest after the push",
  ],
  9: [
    "Leave outcomes you cannot control",
    "Keep one hour for yourself inside the helping",
    "Close one loop before you collect a new cause",
  ],
  11: [
    "Check one insight with a fact or a person before you act",
    "Rest on purpose this week, not only when you crash",
    "Turn one insight into one small habit",
  ],
  22: [
    "Break the large plan into this week's three steps",
    "Ask for help on one part of the build",
    "Mark one small finish so the year has a result",
  ],
  33: [
    "Teach one person. Do not give your whole week away",
    "Keep one hour of your own work",
    "Say no to one extra ask this week",
  ],
};

export function pickUnique(items: string[], count: number): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (!out.includes(item)) out.push(item);
    if (out.length >= count) break;
  }
  return out;
}
