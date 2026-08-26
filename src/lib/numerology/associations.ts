/** Reflective color / weekday / stone associations by number (belief-based). */

export type AssociationColor = {
  name: string;
  hex: string;
  title: string;
  tags: [string, string, string];
  line: string;
  action: string;
  use: string;
};

export type NumberAssociations = {
  number: number;
  colors: AssociationColor[];
  weekdays: string[];
  stones: string[];
  metals: string[];
};

const BY_DIGIT: Record<number, Omit<NumberAssociations, "number">> = {
  1: {
    colors: [
      {
        name: "Gold",
        hex: "#D4A017",
        title: "Visible presence",
        tags: ["Bold", "Visible", "Warm"],
        line: "Your natural tone is visible presence — you often set the pace rather than wait.",
        action: "Start one small thing where someone else can see it, then stop.",
        use: "Keep a gold-warm light nearby when you need to begin rather than plan.",
      },
      {
        name: "Orange",
        hex: "#E67E22",
        title: "Motion and warmth",
        tags: ["Kinetic", "Social", "Direct"],
        line: "When a plan is stuck, more thinking does not help. Talk to the person the plan is waiting on, or do the next small step yourself.",
        action: "Tell the person this plan is waiting on what you need, or do the next small step yourself (send the file, book the slot, make the call).",
        use: "Use this when a plan is stuck and more thinking will not help.",
      },
      {
        name: "Amber",
        hex: "#F59E0B",
        title: "Quiet confidence",
        tags: ["Bright", "Steady", "Open"],
        line: "Amber is a quieter gold — confidence that does not need to announce itself.",
        action: "Name one intention before you open the day's list.",
        use: "A warm lamp or fabric when you need to speak clearly without pushing.",
      },
    ],
    weekdays: ["Sunday"],
    stones: ["Ruby", "Garnet"],
    metals: ["Gold"],
  },
  2: {
    colors: [
      {
        name: "Cream",
        hex: "#F5F0E6",
        title: "Calm clarity",
        tags: ["Steady", "Clear", "Gentle"],
        line: "You feel better when things are said plainly. Vague situations wear you out.",
        action: "Start the day by writing one clear intention in one sentence.",
        use: "Use this in a hard talk: say what is going on, then stop.",
      },
      {
        name: "Soft green",
        hex: "#A8C5A0",
        title: "Care with boundaries",
        tags: ["Warm", "Caring", "Boundaried"],
        line: "You can be kind and still say what you need. You do not have to go quiet or give up your time so others stay happy.",
        action: "Repair one small thing with someone close — a message, a chore, or a check-in.",
        use: "Use this when home, mentoring, or group care is taking the whole day.",
      },
      {
        name: "Silver",
        hex: "#C0C0C0",
        title: "Listening mirror",
        tags: ["Quiet", "Reflective", "Receptive"],
        line: "Silver is a listening tone — you take in more than you first show.",
        action: "Repeat back one thing you heard before you answer.",
        use: "Use this when you need to listen instead of fix.",
      },
    ],
    weekdays: ["Monday"],
    stones: ["Pearl", "Moonstone"],
    metals: ["Silver"],
  },
  3: {
    colors: [
      {
        name: "Yellow",
        hex: "#E8C547",
        title: "Bright expression",
        tags: ["Playful", "Vocal", "Light"],
        line: "Your tone is expression — ideas want air more than they want polish.",
        action: "Share one unfinished idea out loud.",
        use: "Keep yellow in sight when you are stuck in silence.",
      },
      {
        name: "Rose",
        hex: "#E8A0BF",
        title: "Warm social ease",
        tags: ["Kind", "Social", "Soft"],
        line: "Rose is a social warmth — people often feel welcome around you.",
        action: "Invite one person into a small, kind exchange.",
        use: "Reach for this when a room needs ease, not performance.",
      },
      {
        name: "Sky blue",
        hex: "#7EB8D4",
        title: "Open air",
        tags: ["Open", "Light", "Spacious"],
        line: "Sky blue is breathing room — you think more clearly with a little space.",
        action: "Take a short walk before you reply to the hard message.",
        use: "Look up or step outside when talk gets tight.",
      },
    ],
    weekdays: ["Thursday"],
    stones: ["Yellow sapphire", "Citrine"],
    metals: ["Gold"],
  },
  4: {
    colors: [
      {
        name: "Blue-grey",
        hex: "#6B7C8C",
        title: "Structural calm",
        tags: ["Steady", "Ordered", "Cool"],
        line: "Your baseline is structural calm — you feel better when the frame is visible.",
        action: "Finish one small unfinished task before you start a new one.",
        use: "Keep this colour in the workspace when plans are slipping.",
      },
      {
        name: "Earth brown",
        hex: "#8B6914",
        title: "Grounded craft",
        tags: ["Rooted", "Practical", "Patient"],
        line: "Earth brown is follow-through — you build by staying with the brick in front of you.",
        action: "Do the next physical or practical step, not the next plan.",
        use: "Use this when you are living in lists instead of work.",
      },
    ],
    weekdays: ["Saturday"],
    stones: ["Hessonite", "Cat’s eye"],
    metals: ["Iron"],
  },
  5: {
    colors: [
      {
        name: "Light green",
        hex: "#8FBC8F",
        title: "Adaptive ease",
        tags: ["Fresh", "Mobile", "Curious"],
        line: "Your tone leans toward change without drama — you recover by moving.",
        action: "Change one small routine for today only.",
        use: "Keep this in view when you feel boxed in.",
      },
      {
        name: "Turquoise",
        hex: "#40E0D0",
        title: "Quick connection",
        tags: ["Bright", "Social", "Fluid"],
        line: "Turquoise is movement and talk — you think by exchanging.",
        action: "Have one short honest conversation, then stop.",
        use: "Reach for this when you need a new angle, not a longer meeting.",
      },
      {
        name: "Grey",
        hex: "#9CA3AF",
        title: "Neutral pause",
        tags: ["Neutral", "Clear", "Unforced"],
        line: "Grey is a pause colour — you can step out of other people's pace.",
        action: "Leave one block unscheduled today.",
        use: "Use as a mental off-switch when stimulation stacks up.",
      },
    ],
    weekdays: ["Wednesday"],
    stones: ["Emerald", "Peridot"],
    metals: ["Bronze"],
  },
  6: {
    colors: [
      {
        name: "White",
        hex: "#F8F6F0",
        title: "Be clear",
        tags: ["Clear", "Honest", "Fresh start"],
        line: "You feel better when things are said plainly. Vague situations wear you out.",
        action: "Name one thing you are dodging — a no, a delay, or a fact — even just to yourself.",
        use: "When people or plans are too much, say no or step back.",
      },
      {
        name: "Light blue",
        hex: "#B8D4E8",
        title: "Kind and still a limit",
        tags: ["Kind", "Clear", "Limited"],
        line: "You can be kind and still say what you need. You do not have to go quiet or give up your time so others stay happy.",
        action: "Say one limit in one short sentence to the person who needs to hear it. Example: I can help tomorrow, not tonight.",
        use: "When caring for others is taking all of your time.",
      },
      {
        name: "Pink",
        hex: "#F2C4CE",
        title: "Close-circle warmth",
        tags: ["Warm", "Close", "Soft"],
        line: "Pink is near-circle warmth — you give more when the bond is real.",
        action: "Do one small kindness in the closest circle, not the widest.",
        use: "Reach for this in family or partnership repair.",
      },
    ],
    weekdays: ["Friday"],
    stones: ["Diamond", "White sapphire"],
    metals: ["Silver", "Platinum"],
  },
  7: {
    colors: [
      {
        name: "Sea green",
        hex: "#2E8B57",
        title: "Quiet insight",
        tags: ["Deep", "Calm", "Inward"],
        line: "Your tone goes inward first — you see more after a pause than in the noise.",
        action: "Take twenty quiet minutes before you decide.",
        use: "Sea green when the room is too loud to think.",
      },
      {
        name: "Indigo",
        hex: "#4B0082",
        title: "Study and distance",
        tags: ["Focused", "Distant", "Honest"],
        line: "Indigo is a study colour — you need honest distance to see the pattern.",
        action: "Write the real question in one line before you research.",
        use: "Use this when you are solving by scrolling instead of looking.",
      },
    ],
    weekdays: ["Thursday", "Saturday"],
    stones: ["Cat’s eye", "Amethyst"],
    metals: ["Silver"],
  },
  8: {
    colors: [
      {
        name: "Dark blue",
        hex: "#1E3A5F",
        title: "Long aim",
        tags: ["Serious", "Steady", "Capable"],
        line: "Your baseline is long-range stewardship — you work better with a visible aim.",
        action: "Name the one outcome that would count this week.",
        use: "Keep this colour at the desk when the work is heavy and real.",
      },
      {
        name: "Black",
        hex: "#1A1A1A",
        title: "Clean boundary",
        tags: ["Firm", "Clear", "Contained"],
        line: "Black is a boundary colour — a clean edge can be kinder than a soft no.",
        action: "Decline one request that is not yours.",
        use: "Reach for this when other people's urgency is wearing you down.",
      },
      {
        name: "Purple",
        hex: "#5B4B8A",
        title: "Ranked meaning",
        tags: ["Dignified", "Strategic", "Quiet"],
        line: "Purple is meaning with rank — you want the work to matter, not just move.",
        action: "Cut one task that looks busy but does not serve the aim.",
        use: "Use this when image is crowding the actual job.",
      },
    ],
    weekdays: ["Saturday"],
    stones: ["Blue sapphire", "Amethyst"],
    metals: ["Iron", "Steel"],
  },
  9: {
    colors: [
      {
        name: "Red",
        hex: "#B91C1C",
        title: "Completion heat",
        tags: ["Direct", "Warm", "Final"],
        line: "Your tone can close what others leave open — heat is for finishing, not for lingering.",
        action: "Close one loop you have been carrying.",
        use: "Use red when a chapter needs an ending, not another start.",
      },
      {
        name: "Coral",
        hex: "#E07A5F",
        title: "Courageous warmth",
        tags: ["Brave", "Social", "Kind"],
        line: "Coral is courage with warmth — you can move toward people without hardening.",
        action: "Make the one approach you have been postponing.",
        use: "Reach for this when a repair needs you to go first.",
      },
    ],
    weekdays: ["Tuesday"],
    stones: ["Red coral", "Carnelian"],
    metals: ["Copper"],
  },
};

function reduceKey(n: number): number {
  if (n === 11 || n === 22 || n === 33) {
    return n
      .toString()
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  if (n >= 1 && n <= 9) return n;
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    x = x
      .toString()
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return x || 1;
}

export function associationsForNumber(n: number | string): NumberAssociations {
  const num = Number(n);
  const digit = reduceKey(Number.isFinite(num) ? num : 1);
  const base = BY_DIGIT[digit] ?? BY_DIGIT[1];
  return { number: digit, ...base };
}

/** Every colour in the 1–9 dictionary — used to prove meaning fields exist. */
export function allAssociationColors(): AssociationColor[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap(
    (n) => BY_DIGIT[n]?.colors ?? [],
  );
}
