/** Role-aware watch-outs (−) for guide numbers — NumoraWisdom-original wording. */

type Map = Record<string, string[]>;

const CORE: Map = {
  "1": [
    "Getting angry when others are slower",
    "Looking sure while criticism still hurts",
    "Doing it all alone when one helper would finish it",
  ],
  "2": [
    "Saying yes until you feel used",
    "Waiting so long that nothing is said",
    "Taking on other people’s moods with no break",
  ],
  "3": [
    "Starting too many things and finishing few",
    "Joking when the work still needs to be finished",
    "Using humor to skip hard feedback",
  ],
  "4": [
    "Sticking to a plan after it has stopped working",
    "Working so hard you think rest means you failed",
    "Saying no to a small surprise that would help",
  ],
  "5": [
    "Leaving before a skill has time to grow",
    "Saying yes to every new thing",
    "Calling it freedom when you are avoiding a duty",
  ],
  "6": [
    "Trying to fix other people’s lives",
    "Finding it hard to let someone help you",
    "Making home or duty “perfect” at your own cost",
  ],
  "7": [
    "Staying alone so long that people cannot reach you",
    "Thinking until no step is taken",
    "Calling ordinary joy a waste of time",
  ],
  "8": [
    "Caring more about status than a fair result",
    "Letting work become the only name you have",
    "Controlling people instead of finishing the job with them",
  ],
  "9": [
    "Giving until your own needs disappear",
    "Leaving endings half-done",
    "Caring about a big cause with no next step",
  ],
  "11": [
    "Too much noise, too little sleep",
    "Big ideas with no small daily habit",
    "Pulling away when people do not “get” you",
  ],
  "22": [
    "A plan so big it freezes you",
    "Skipping the first small step to chase size",
    "Carrying every brick alone until you burn out",
  ],
  "33": [
    "Helping until you are empty",
    "Telling others to rest while you do not",
    "Dropping your limits when someone needs you",
  ],
};

const LIFE_PATH: Map = {
  "1": [
    "Starting fights you could share with a helper",
    "Waiting to start because you might fail",
    "Calling it leadership when you will not listen",
  ],
  "5": [
    "Wanting freedom and a stable life at the same time — and picking neither",
    "Changing lanes before a skill is solid",
    "Using “new” to skip a hard feeling",
  ],
  "8": [
    "Winning in a way you would not respect later",
    "Measuring yourself only by money or rank",
    "Waiting to rest until your body stops you",
  ],
};

const EXPRESSION: Map = {
  "5": [
    "Being good at many things with no clear offer",
    "Talking people in faster than you can deliver",
    "People not knowing if they can count on you",
  ],
  "3": [
    "Looking talented before the work is finished",
    "Saying yes to every invite to make or talk",
    "Charm covering a missed deadline",
  ],
};

const SOUL_URGE: Map = {
  "5": [
    "Feeling trapped when life is actually fine",
    "Wanting a door open even in a good promise",
    "Too much noise leaving you tired",
  ],
  "2": [
    "Needing a kind word and not asking",
    "Keeping peace by hiding what you want",
  ],
};

const PERSONALITY: Map = {
  "5": [
    "People thinking you will not stay",
    "Others expecting you to always be “fun and free”",
    "Looking free while you still need a home base",
  ],
  "7": [
    "People thinking you are cold or hard to know",
    "Quiet being read as “I do not care”",
  ],
};

const VEDIC_PSYCHIC: Map = {
  "1": [
    "Getting impatient when results are slow",
    "Taking over a room that needed a team",
  ],
  "2": [
    "Taking a note as an attack",
    "Going quiet instead of saying what you need",
  ],
  "3": [
    "Many ideas, few finished pieces",
    "Giving advice nobody asked for",
  ],
  "4": [
    "Staying rigid when a small change would work",
    "Feeling restless with no useful project",
  ],
  "5": [
    "Jumping topics before the last one is done",
    "Starting messages or deals and not closing them",
  ],
  "6": [
    "Caring past the line that keeps you well",
    "Skipping a hard talk to keep the peace",
  ],
  "7": [
    "Calling it wisdom when you are only hiding",
    "Doubt that pushes helpers away",
  ],
  "8": [
    "A heavy mood that makes every day feel like work",
    "Being harsh with yourself for slow progress",
  ],
  "9": [
    "Acting before you think one beat",
    "Too many missions, no finish line",
  ],
};

const VEDIC_DESTINY: Map = {
  "1": [
    "Fighting others for the same lead seat",
    "Wanting to be seen more than being fair",
  ],
  "2": [
    "Waiting for a partner to choose for you",
    "Delaying a decision to keep the peace",
  ],
  "3": [
    "Talking about the path more than walking it",
    "Teaching others while you skip your own practice",
  ],
  "4": [
    "An unusual path with no weekly plan",
    "Fighting all structure instead of making a better one",
  ],
  "5": [
    "Wanting movement when the job needs roots",
    "Meeting many people and deepening no trade",
  ],
  "6": [
    "A help path that erases your own needs",
    "Staying comfortable when a change is needed",
  ],
  "7": [
    "Study that becomes hiding",
    "Calling practical help “shallow”",
  ],
  "8": [
    "Working past rest to look successful",
    "Measuring worth only in money or rank",
  ],
  "9": [
    "Holding the last chapter too long",
    "Starting a new cause before the last one is closed",
  ],
};

const CHALDEAN: Map = {
  "4": [
    "A name that feels restless with no rebuild plan",
    "People reading unusual as “I cannot count on you”",
  ],
  "5": [
    "A quick name with a fuzzy message",
    "Being clever in a first meeting and thin on facts",
  ],
};

const CYCLE: Map = {
  "5": [
    "Booking too much change in a free year or month",
    "Leaving the stable jobs unfinished",
  ],
  "9": [
    "Forcing a new start before an ending is done",
    "Old loops still open in the background",
  ],
};

const BY_TOPIC: Record<string, Map> = {
  "life-path": LIFE_PATH,
  expression: EXPRESSION,
  "soul-urge": SOUL_URGE,
  personality: PERSONALITY,
  "birth-day": {},
  maturity: {},
  "vedic-psychic": VEDIC_PSYCHIC,
  "vedic-destiny": VEDIC_DESTINY,
  "vedic-name": VEDIC_PSYCHIC,
  "chaldean-name": CHALDEAN,
  "personal-year": CYCLE,
  "personal-month": CYCLE,
};

export function watchoutsFor(topic: string, value: string): string[] {
  const specific = BY_TOPIC[topic]?.[value];
  const core = CORE[value] ?? [
    "Using this number so hard that other habits get no room",
    "Skipping the one small practice named on this page",
  ];
  if (!specific?.length) return core.slice(0, 3);
  // Prefer role-specific, pad with core
  const merged = [...specific];
  for (const c of core) {
    if (merged.length >= 3) break;
    if (!merged.includes(c)) merged.push(c);
  }
  return merged.slice(0, 3);
}
