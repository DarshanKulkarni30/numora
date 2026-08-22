import { watchoutsFor } from "./watchouts";

/** Aspect-specific number blurbs — same digit, different methodology/role. */

type StoredBlurb = {
  theme: string;
  strengths: string[];
  practice: string;
};

export type NumberBlurb = StoredBlurb & {
  watchouts: string[];
};

type Map = Record<string, StoredBlurb>;

/** Lifelong growth arc from the full birth date (Pythagorean). */
export const LIFE_PATH: Map = {
  "1": {
    theme: "A life that grows by starting things and deciding for yourself",
    strengths: [
      "You can begin when others wait",
      "You can say a clear yes or no",
      "You can stand on your own when it matters",
    ],
    practice:
      "Start one thing, then ask one person to help finish it. Watch: doing everything alone.",
  },
  "2": {
    theme: "A life that grows by working with others and waiting for the right time",
    strengths: [
      "You can work with people without pushing",
      "You notice how others feel",
      "You can wait instead of forcing a plan",
    ],
    practice:
      "Say what you need in one plain sentence. Watch: keeping peace by saying nothing.",
  },
  "3": {
    theme: "A life that grows by talking, making, and sharing with people",
    strengths: [
      "You can explain an idea so others get it",
      "You learn well with people, not only alone",
      "You can try a new idea without waiting for it to be perfect",
    ],
    practice:
      "Finish a few things you start each year. Watch: starting many talks and closing none.",
  },
  "4": {
    theme: "A life that grows by plans, routines, and work that lasts",
    strengths: [
      "You can make a plan other people can follow",
      "People can count on you to show up",
      "You finish the boring steps that make a thing last",
    ],
    practice:
      "Write one repeating plan, and leave one day a little loose. Watch: planning so long the week never starts.",
  },
  "5": {
    theme: "A life that grows by change, freedom, and trying new things",
    strengths: [
      "You can change course when a plan is stuck",
      "You learn by trying, not only by sitting still",
      "You can keep one promise while you still explore",
    ],
    practice:
      "Pick one skill to keep for years, and one new thing to try. Watch: changing so often nothing grows.",
  },
  "6": {
    theme: "A life that grows by care, home, and keeping promises",
    strengths: [
      "People can count on you to help",
      "You notice what a home or group needs",
      "You can keep a promise when it is dull",
    ],
    practice:
      "Keep one promise, and keep one hour that is for you. Watch: saying yes until you have no rest.",
  },
  "7": {
    theme: "A life that grows by quiet thinking and study",
    strengths: [
      "You can sit with a hard question",
      "You prefer a true answer over a fast one",
      "Quiet time actually helps you think",
    ],
    practice:
      "Share one clear thought after you study. Watch: going so quiet people think you do not care.",
  },
  "8": {
    theme: "A life that grows by plans, money, and results you can measure",
    strengths: [
      "You can hold a budget, a team, or a long job",
      "You finish work people can see",
      "You can take charge without needing a title first",
    ],
    practice:
      "Finish one real result, then rest. Watch: treating money or status as the whole self.",
  },
  "9": {
    theme: "A life that grows by finishing things and helping a wider group",
    strengths: [
      "You can close a chapter so the next one can start",
      "You care about people beyond your own house",
      "You can give away what you already learned",
    ],
    practice:
      "Close one loop before you open another. Watch: holding an ending that is already done.",
  },
  "11": {
    theme: "A life that grows by noticing patterns and inspiring others — with rest",
    strengths: [
      "You often see a pattern before others name it",
      "Your words can lift a room",
      "You feel more than you always show",
    ],
    practice:
      "Write the idea down, sleep, then share one piece. Watch: thinking until the month is gone.",
  },
  "22": {
    theme: "A life that grows by building large plans in small steps",
    strengths: [
      "You can hold a big plan and a daily step",
      "You build things that last past a mood",
      "You can organize people around a real build",
    ],
    practice:
      "Turn the big plan into this quarter’s three steps. Watch: drawing a plan that never meets a calendar.",
  },
  "33": {
    theme: "A life that grows by teaching and care — without emptying yourself",
    strengths: [
      "You can teach by how you treat people",
      "Others come to you for help",
      "You can care and still set a limit",
    ],
    practice:
      "Help one person, and keep one rest block. Watch: teaching everyone except yourself to rest.",
  },
};

/** Day-of-month specialty flavor within the Life Path. */
export const BIRTH_DAY: Map = {
  "1": {
    theme: "A birth-day gift for starting in your own lane",
    strengths: [
      "You can go first in a skill you care about",
      "You get things moving",
      "You decide without a long committee",
    ],
    practice:
      "Put that start-energy on one skill, not ten. Watch: starting and walking away.",
  },
  "2": {
    theme: "A birth-day gift for tact and support",
    strengths: [
      "You can read a room",
      "You pick a good time to speak",
      "You help two people meet in the middle",
    ],
    practice:
      "Say the quiet work you did, kindly. Watch: doing the glue work with no credit and no rest.",
  },
  "3": {
    theme: "A birth-day gift for words, humor, and making ideas stick",
    strengths: [
      "You can say it in a way people remember",
      "Warm talk comes easily",
      "Humor can open a stuck room",
    ],
    practice:
      "Finish one draft on a set day. Watch: talking more than you ship.",
  },
  "4": {
    theme: "A birth-day gift for method and craft",
    strengths: [
      "You can make a process others can reuse",
      "You fix things with your hands or a list",
      "You turn a vague plan into steps",
    ],
    practice:
      "Write one system down so it outlives your memory. Watch: never starting until the system is perfect.",
  },
  "5": {
    theme: "A birth-day gift for quick learning and change",
    strengths: [
      "You adapt when the plan changes",
      "You try, then pull the useful bits together",
      "You notice what is new before others do",
    ],
    practice:
      "Name three skills you will keep. Watch: sampling forever and owning none.",
  },
  "6": {
    theme: "A birth-day gift for care and follow-through",
    strengths: [
      "You make a place or person feel looked after",
      "You notice what would make a room kinder",
      "You finish the duty you took on",
    ],
    practice:
      "Keep a rest or make-time block. Watch: care with no refill.",
  },
  "7": {
    theme: "A birth-day gift for study and careful questions",
    strengths: [
      "You look under the surface",
      "You ask a precise question",
      "You can do deep work alone",
    ],
    practice:
      "Share one small finding. Watch: research that never leaves the desk.",
  },
  "8": {
    theme: "A birth-day gift for organizing results",
    strengths: [
      "You can run an outcome, not only an idea",
      "You see where effort pays off",
      "You can lead a niche job and own the number",
    ],
    practice:
      "Show one person how you do it. Watch: holding every result yourself.",
  },
  "9": {
    theme: "A birth-day gift for seeing the whole story and closing it",
    strengths: [
      "You see more than one person’s side",
      "You can mentor or make with heart",
      "You finish what others drop",
    ],
    practice:
      "Pick fewer causes. Watch: helping everyone a little and no one fully.",
  },
  "11": {
    theme: "A birth-day gift for a sudden clear insight",
    strengths: [
      "A useful hunch can arrive fast",
      "You can lift a moment with a few words",
      "You notice what is not being said",
    ],
    practice:
      "Write the insight, then test one piece in ordinary life. Watch: sharing every flash untested.",
  },
  "22": {
    theme: "A birth-day gift for large, practical builds",
    strengths: [
      "You can hold a big project",
      "You join parts into one working whole",
      "You design for lasting use",
    ],
    practice:
      "Pick builds that last years, not weekends. Watch: size with no first brick.",
  },
  "33": {
    theme: "A birth-day gift for kind teaching",
    strengths: [
      "You teach by being kind, not only by talking",
      "You can care and still make something",
      "You can warm a room",
    ],
    practice:
      "Ask what help is wanted before you give it. Watch: helping without consent.",
  },
};

/** Full-name talents (Expression / Destiny of the name). */
export const EXPRESSION: Map = {
  "1": {
    theme: "Name talent for starting and leading",
    strengths: [
      "People see you as someone who begins",
      "You can invent a way when there is no map",
      "You act when a choice is needed",
    ],
    practice:
      "Let someone else own one piece of what you start. Watch: launching more than you can hand off.",
  },
  "2": {
    theme: "Name talent for calm teamwork and detail",
    strengths: [
      "You can settle a clash and keep the details",
      "The work shows in the partnership",
      "People meet you as a steady teammate",
    ],
    practice:
      "Show the quiet work in one list or sample. Watch: being useful and invisible.",
  },
  "3": {
    theme: "Name talent for talking, writing, and making",
    strengths: [
      "You can write, speak, or perform so people stay with you",
      "Ideas and charm show in the work",
      "People meet you as imaginative and social",
    ],
    practice:
      "Keep a pile of finished pieces, not only ideas. Watch: charm covering a late delivery.",
  },
  "4": {
    theme: "Name talent for structure and delivery",
    strengths: [
      "You can build a system and keep it",
      "People see that you show up again",
      "You are the person who makes it real",
    ],
    practice:
      "Show one finished case, not only quiet excellence. Watch: never telling anyone what you built.",
  },
  "5": {
    theme: "Name talent for change, talk, and many skills",
    strengths: [
      "You can sell, travel, or switch lanes and still learn",
      "You pick up a new tool fast",
      "People meet you as resourceful",
    ],
    practice:
      "Name one thing you are for hire to do. Watch: many skills, no clear offer.",
  },
  "6": {
    theme: "Name talent for care, design, and reliable help",
    strengths: [
      "You can teach, host, design, or counsel with warmth",
      "People trust you to look after a thing",
      "You show up as kind and responsible",
    ],
    practice:
      "Set a price and an end time for care work. Watch: talent with no limits.",
  },
  "7": {
    theme: "Name talent for study and careful skill",
    strengths: [
      "You can analyse, code, or research with care",
      "Depth is what people hire",
      "You come across as precise",
    ],
    practice:
      "Teach the skill in plain words. Watch: depth nobody else can use.",
  },
  "8": {
    theme: "Name talent for business, money, and organized results",
    strengths: [
      "You can run money, a team, or a plan",
      "Results are how the talent shows",
      "People meet you as capable",
    ],
    practice:
      "Keep the numbers honest. Watch: ambition that skips fairness.",
  },
  "9": {
    theme: "Name talent for arts, help, and mentoring",
    strengths: [
      "You can serve a wider group through art or advocacy",
      "Compassion shows in public work",
      "People meet you as generous",
    ],
    practice:
      "Help where you can see a finish line. Watch: giving everywhere and thinning out.",
  },
  "11": {
    theme: "Name talent for lifting people with an idea",
    strengths: [
      "You can motivate with a clear picture",
      "Presence can change a room",
      "People meet you as intuitive",
    ],
    practice:
      "Rehearse, then rest after you speak. Watch: inspiring with no recovery.",
  },
  "22": {
    theme: "Name talent for building large, real projects",
    strengths: [
      "You can design a project or a team that lasts",
      "The work outlives a single week",
      "People meet you as a practical builder",
    ],
    practice:
      "Hand off daily ops early. Watch: vision buried in tiny tasks.",
  },
  "33": {
    theme: "Name talent for teaching with care",
    strengths: [
      "You can guide without crushing people",
      "Others grow when you teach",
      "People meet you as a mentor",
    ],
    practice:
      "Teach a method they can use without you. Watch: comfort with no skill left behind.",
  },
};

/** Vowels — inner motivation (Soul Urge). */
export const SOUL_URGE: Map = {
  "1": {
    theme: "Inside, you want to decide for yourself and be seen as you",
    strengths: [
      "You want to lead, even if you stay quiet about it",
      "You want work you chose",
      "A new idea of your own lights you up",
    ],
    practice:
      "Put solo time on the calendar. Watch: stealing time instead of asking for it.",
  },
  "2": {
    theme: "Inside, you want peace, closeness, and to belong",
    strengths: [
      "You want calm between people",
      "A real partner matters more than a crowd",
      "You want to feel understood",
    ],
    practice:
      "Ask for the kind word. Watch: hoping they will guess.",
  },
  "3": {
    theme: "Inside, you want joy, making, and to be heard",
    strengths: [
      "Play and making feel like home",
      "You light up when someone listens",
      "You need a place for ideas, not only duty",
    ],
    practice:
      "Make something that is not only for applause. Watch: performing instead of enjoying.",
  },
  "4": {
    theme: "Inside, you want solid ground and a clear plan",
    strengths: [
      "A stable base calms you",
      "A written plan feels like care",
      "Routines make you feel safe",
    ],
    practice:
      "Leave one small unknown on purpose. Watch: safety becoming a cage.",
  },
  "5": {
    theme: "Inside, you want freedom, newness, and movement",
    strengths: [
      "Open options feel like air",
      "Adventure and learning feed you",
      "Stillness too long makes you itch",
    ],
    practice:
      "Ask for travel, study, or flex hours inside a promise. Watch: fleeing instead of asking.",
  },
  "6": {
    theme: "Inside, you want to care and to be needed",
    strengths: [
      "Looking after people or a home feels true",
      "Family or a group role matters",
      "A kind, fair house is the goal",
    ],
    practice:
      "Receive help as well as give it. Watch: being needed replacing mutual care.",
  },
  "7": {
    theme: "Inside, you want truth, quiet, and meaning",
    strengths: [
      "Small talk drains you; depth fills you",
      "You want to understand, not only react",
      "You need alone time to think",
    ],
    practice:
      "Say “I need quiet” instead of disappearing. Watch: study used as hiding.",
  },
  "8": {
    theme: "Inside, you want results, respect, and things you can measure",
    strengths: [
      "A real win matters more than a compliment",
      "You want influence you earned",
      "You want people to see you can do it",
    ],
    practice:
      "Name what “enough” is. Watch: only counting status wins.",
  },
  "9": {
    theme: "Inside, you want to help a wider story and finish it",
    strengths: [
      "Helping beyond your house feels true",
      "Compassion is a motor, not a slogan",
      "You want endings that mean something",
    ],
    practice:
      "Keep one personal dream on the list. Watch: only other people’s needs.",
  },
  "11": {
    theme: "Inside, you want to share a clear insight — after rest",
    strengths: [
      "You want to light something up for others",
      "A true hunch matters to you",
      "You want meaning, not only tasks",
    ],
    practice:
      "Sleep, then share one insight. Watch: dumping every flash on people.",
  },
  "22": {
    theme: "Inside, you want to build something that lasts for many",
    strengths: [
      "A lasting build feels like the point",
      "You want a big idea that still works on Tuesday",
      "Scale matters if it is real",
    ],
    practice:
      "Lay one brick each week. Watch: only watching the future movie.",
  },
  "33": {
    theme: "Inside, you want to help and teach without losing yourself",
    strengths: [
      "Easing someone’s load feels true",
      "Care is how you love",
      "You want a role where help is the job",
    ],
    practice:
      "Be human first. Watch: healing everyone except you.",
  },
};

/** Consonants — social first impression (Personality). */
export const PERSONALITY: Map = {
  "1": {
    theme: "People may first see you as sure and self-directed",
    strengths: [
      "You can look like you already decided",
      "Independence shows on the surface",
      "Others may wait for you to take charge",
    ],
    practice:
      "Ask one question first. Watch: looking so sure that people stay away.",
  },
  "2": {
    theme: "People may first see you as gentle and easy to approach",
    strengths: [
      "You can look calm in a group",
      "People read you as willing to work together",
      "Others may expect you to give way",
    ],
    practice:
      "Say your preference early. Watch: kindness being taken as agreement.",
  },
  "3": {
    theme: "People may first see you as warm, funny, and creative",
    strengths: [
      "Wit or making shows quickly",
      "You can look hopeful even on a hard day",
      "Others may expect you to entertain",
    ],
    practice:
      "You do not have to be “on” at every door. Watch: acting cheerful when you are not.",
  },
  "4": {
    theme: "People may first see you as steady and practical",
    strengths: [
      "You can look reliable",
      "Seriousness shows before play",
      "Others may expect you to hold the plan",
    ],
    practice:
      "Show one light detail. Watch: looking so firm that people stop asking.",
  },
  "5": {
    theme: "People may first see you as restless, curious, and free",
    strengths: [
      "You can look ready to go",
      "Wit and change show fast",
      "Others may expect a spontaneous yes",
    ],
    practice:
      "Say one thing you will actually do. Watch: looking fun and not trustable.",
  },
  "6": {
    theme: "People may first see you as warm, able, and responsible",
    strengths: [
      "You can look like the helper or the host",
      "Care shows in how you dress or speak",
      "Others may expect you to take the duty",
    ],
    practice:
      "Set a kind limit on help. Watch: being recruited every time.",
  },
  "7": {
    theme: "People may first see you as private, thoughtful, or hard to read",
    strengths: [
      "You can look like you are thinking",
      "Privacy shows before small talk",
      "Others may want depth — or think you are cold",
    ],
    practice:
      "Offer one small personal fact. Watch: silence read as “I do not care.”",
  },
  "8": {
    theme: "People may first see you as capable and in charge",
    strengths: [
      "You can look polished and ambitious",
      "Competence shows first",
      "Others may expect you to lead or to have status",
    ],
    practice:
      "Listen first. Watch: looking so strong that allies stay quiet.",
  },
  "9": {
    theme: "People may first see you as kind, wide, or worldly",
    strengths: [
      "You can look wise or artistic",
      "Generosity shows on the surface",
      "Others may expect advice or a cause",
    ],
    practice:
      "You may say no to extra feeling-work. Watch: being the counselor in every room.",
  },
  "11": {
    theme: "People may first see you as intense and inspired",
    strengths: [
      "Presence can feel strong",
      "Sensitivity shows",
      "Others may want a deep answer on the spot",
    ],
    practice:
      "Leave the crowd and rest. Watch: giving insight on demand until you are empty.",
  },
  "22": {
    theme: "People may first see you as the one who can make a big thing happen",
    strengths: [
      "You can look like a builder",
      "People assume you see the whole job",
      "Others may dump a large ask on you",
    ],
    practice:
      "Name the scope before you say yes. Watch: accepting every large ask.",
  },
  "33": {
    theme: "People may first see you as a teacher or a safe person to tell",
    strengths: [
      "You can look like a counselor",
      "Care shows before you speak",
      "Others may unload fast",
    ],
    practice:
      "Ask: advice or company? Watch: stepping into helper mode unasked.",
  },
};

/** Life Path + Expression blend for later-life emphasis. */
export const MATURITY: Map = {
  "1": {
    theme: "Later years: deciding for yourself, with less need for permission",
    strengths: [
      "You know your own yes and no",
      "You start with less fear of looking new",
      "Experience makes the first step cleaner",
    ],
    practice:
      "Help one starter. Watch: competing with the people you mentor.",
  },
  "2": {
    theme: "Later years: partnership with clearer limits",
    strengths: [
      "You can work with people without losing yourself",
      "You wait, and you also say the limit",
      "Patience is earned, not fake",
    ],
    practice:
      "Choose partners who respect your pace. Watch: absorbing their chaos.",
  },
  "3": {
    theme: "Later years: talking and making as a finished craft",
    strengths: [
      "You can finish what younger you only started",
      "Joy needs less performance",
      "Your words can lift without showing off",
    ],
    practice:
      "Share one finished piece from the years of practice. Watch: still starting and never shipping.",
  },
  "4": {
    theme: "Later years: keeping the systems that still work",
    strengths: [
      "Your plans outlast a busy week",
      "Craft is who you are, not only a job",
      "Order can keep people you love safer",
    ],
    practice:
      "Drop the routines that no longer help. Watch: keeping every old rule.",
  },
  "5": {
    theme: "Later years: freedom you choose, not freedom you chase",
    strengths: [
      "You change on purpose",
      "Travel or study can enrich a stable life",
      "You adapt without running away",
    ],
    practice:
      "Book one trip or course inside a home base. Watch: restlessness with no root.",
  },
  "6": {
    theme: "Later years: care at home, with healthier limits",
    strengths: [
      "You help from experience, not only duty",
      "An elder or host role can fit",
      "You can keep peace and still rest",
    ],
    practice:
      "Teach the skill; do not do every task. Watch: still saying yes to all of it.",
  },
  "7": {
    theme: "Later years: quiet knowing you can hand on",
    strengths: [
      "Insight is simpler and more useful",
      "Study has a harvest",
      "Alone time is a choice, not a hide",
    ],
    practice:
      "Write the method down. Watch: leaving only mystery.",
  },
  "8": {
    theme: "Later years: results and fairness, then handing on",
    strengths: [
      "Ambition can look after people, not only rank",
      "Respect comes from how you worked",
      "Money skill can serve others",
    ],
    practice:
      "Plan who takes over, while you still like building. Watch: never letting go.",
  },
  "9": {
    theme: "Later years: closing chapters and mentoring",
    strengths: [
      "You can drop an old role",
      "Helping feels natural",
      "You care without gripping",
    ],
    practice:
      "Close one chapter on purpose. Watch: starting new causes in the leftover mess.",
  },
  "11": {
    theme: "Later years: insight with rest",
    strengths: [
      "Hunches are steadier",
      "Presence can teach",
      "You know when sensitivity needs sleep",
    ],
    practice:
      "Share less, rest more. Watch: inspiring until you crash.",
  },
  "22": {
    theme: "Later years: the large build finally has a calendar",
    strengths: [
      "The vision has tools now",
      "Big ideas meet Tuesday",
      "You can leave a working structure",
    ],
    practice:
      "Write the blueprint so it outlives you. Watch: one more giant project with no team.",
  },
  "33": {
    theme: "Later years: teaching care without disappearing",
    strengths: [
      "Care has a method now",
      "Your presence can settle a room",
      "You can serve and still exist",
    ],
    practice:
      "Let students carry the work. Watch: still doing it all yourself.",
  },
};

/** Chaldean name vibration (different letter map than Pythagorean). */
export const CHALDEAN_NAME: Map = {
  "1": {
    theme: "Chaldean name tone of solar initiative and selfhood",
    strengths: [
      "Name vibration leaning toward leadership",
      "Compound tones often amplify independence",
      "Presentation energy of the pioneer",
    ],
    practice:
      "Watch compound numbers in Chaldean readings—they color how 1 initiative arrives.",
  },
  "2": {
    theme: "Chaldean name tone of lunar receptivity and tact",
    strengths: [
      "Name vibration favoring partnership",
      "Sensitivity encoded in the spelling",
      "Cooperative social frequency",
    ],
    practice:
      "If the compound is intense, pair soft 2 charm with clear yes/no language.",
  },
  "3": {
    theme: "Chaldean name tone of Jupiterian expansion and expression",
    strengths: [
      "Name vibration of sociability and growth",
      "Optimism carried in the letters",
      "Creative speech frequency",
    ],
    practice:
      "Use the expansive name tone for teaching or publishing—not only chatter.",
  },
  "4": {
    theme: "Chaldean name tone of Rahu-linked disruption and rebuilding",
    strengths: [
      "Name vibration that may feel unconventional",
      "Order learned through unusual paths",
      "Structure after upheaval themes",
    ],
    practice:
      "Channel restless 4/Rahu name energy into innovative systems, not chaos.",
  },
  "5": {
    theme: "Chaldean name tone of Mercury—commerce, wit, and motion",
    strengths: [
      "Name vibration of quick mind and exchange",
      "Adaptability in how the name is heard",
      "Persuasive, mobile letter frequency",
    ],
    practice:
      "In Chaldean work, 5 often favors names suited to communication trades—practice clarity over cleverness alone.",
  },
  "6": {
    theme: "Chaldean name tone of Venusian harmony and attraction",
    strengths: [
      "Name vibration of beauty and care",
      "Relational magnetism in the spelling",
      "Responsibility woven with charm",
    ],
    practice:
      "Align public presentation with Venusian grace without over-promising care.",
  },
  "7": {
    theme: "Chaldean name tone of Ketu-linked introspection",
    strengths: [
      "Name vibration of mystery and study",
      "Detachment or spiritual bent in letters",
      "Analytical social frequency",
    ],
    practice:
      "Let the name’s quiet tone support expertise branding, not unexplained absence.",
  },
  "8": {
    theme: "Chaldean name tone of Saturnian duty and material gravity",
    strengths: [
      "Name vibration of ambition under pressure",
      "Authority earned slowly",
      "Serious competence frequency",
    ],
    practice:
      "Pair Saturn name weight with kindness so power does not feel cold.",
  },
  "9": {
    theme: "Chaldean name tone of Martian drive and completion fire",
    strengths: [
      "Name vibration of courage and push",
      "Broad or warrior-like letter energy",
      "Intensity in how the name lands",
    ],
    practice:
      "Direct Martian name heat into finished campaigns, not scattered battles.",
  },
  "11": {
    theme: "Chaldean compound often read as intuitive voltage (reduces toward 2)",
    strengths: [
      "Heightened sensitivity in the name field",
      "Partnership themes under master flash",
      "Inspiration needing calm verification",
    ],
    practice:
      "Treat 11 as a compound spotlight—stabilize with 2’s cooperation habits.",
  },
  "22": {
    theme: "Chaldean compound of master building (reduces toward 4)",
    strengths: [
      "Name field aiming at large structures",
      "Practical vision in the spelling story",
      "Ambition requiring method",
    ],
    practice:
      "Ground 22 compound energy in 4-style routines and ethical scopes.",
  },
  "33": {
    theme: "Chaldean compound of elevated care (reduces toward 6)",
    strengths: [
      "Name field of teaching love",
      "Responsibility amplified",
      "Service frequency in the letters",
    ],
    practice:
      "Balance 33 compound care with 6’s healthy boundaries and rest.",
  },
};

/** Vedic Moolank — birth-day temperament (Psychic Number). */
export const VEDIC_PSYCHIC: Map = {
  "1": {
    theme:
      "Leader · Sun Moolank—day-to-day drive to start, stand out, and take the first move",
    strengths: [
      "Confidence to begin when others hesitate",
      "Clear personal standards",
      "Creative problem-solving under pressure",
    ],
    practice:
      "Lead with clarity, then leave space for others—solar warmth without scorched earth.",
  },
  "2": {
    theme:
      "Harmony · Moon Moolank—sensitivity, peacemaking, and reading the room’s emotional weather",
    strengths: [
      "Emotional intelligence and patience",
      "Ability to soothe conflict",
      "Loyalty once trust is built",
    ],
    practice:
      "Protect soft pacing with firm boundaries—harmony includes your own rest.",
  },
  "3": {
    theme:
      "Creativity · Jupiter Moolank—expressiveness, humor, and the urge to share ideas aloud",
    strengths: [
      "You can talk so people stay with you",
      "Ideas come, and you can share them",
      "Warmth in a room can open a door",
    ],
    practice:
      "Ask before you advise. Finish one idea. Watch: talking with no follow-through.",
  },
  "4": {
    theme:
      "Stability · Rahu Moolank—building order, methods, and dependable lanes (sometimes via unusual routes)",
    strengths: [
      "Patience with process",
      "Reliability under repetition",
      "Skill at turning chaos into systems",
    ],
    practice:
      "Give restlessness one constructive “edge project” so structure has a living lane.",
  },
  "5": {
    theme:
      "Freedom · Mercury Moolank—curiosity, speech, and a need for mental stimulation",
    strengths: [
      "Verbal agility and quick learning",
      "Adaptability in changing rooms",
      "Trade and networking instincts",
    ],
    practice:
      "Pair novelty with one deep skill track—Mercury thrives on craft, not only motion.",
  },
  "6": {
    theme:
      "Care · Venus Moolank—comfort, beauty, and relationship focus as temperament",
    strengths: [
      "Nurturing presence",
      "Aesthetic and relational sensitivity",
      "Desire to make spaces feel whole",
    ],
    practice:
      "Beauty and caretaking work best with fair agreements—and rest for the caregiver.",
  },
  "7": {
    theme:
      "Wisdom · Ketu Moolank—inwardness, analysis, and insight away from shallow loops",
    strengths: [
      "Depth of thought",
      "Comfort with solitude and study",
      "Seeing patterns others skim past",
    ],
    practice:
      "Schedule solitude on purpose; clarity fades when over-stimulated without retreat.",
  },
  "8": {
    theme:
      "Success · Saturn Moolank—discipline, delay, and serious ambition under pressure",
    strengths: [
      "Endurance and duty consciousness",
      "Long-game focus",
      "Authority earned through labor",
    ],
    practice:
      "Honor slow timing with kindness toward your own pace—compound, don’t punish.",
  },
  "9": {
    theme:
      "Humanity · Mars Moolank—courage, compassion, and urgency to act for people or causes",
    strengths: [
      "Brave follow-through",
      "Wide empathy with creative fire",
      "Willingness to stand for others",
    ],
    practice:
      "Aim the heat: one cause, one next step, then rest—impulse cooled into service.",
  },
  "11": {
    theme: "Often reduced in Vedic practice; held here as heightened lunar sensitivity",
    strengths: [
      "Psychic intensity beyond ordinary 2",
      "Strong intuitive day-reactions",
      "Need for grounding rituals",
    ],
    practice:
      "Treat 11 as amplified Moon themes—stabilize with 2’s partnership and rest habits.",
  },
  "22": {
    theme: "Often reduced in Vedic practice; held here as heavy Rahu-scale drive",
    strengths: [
      "Oversized unconventional ambition",
      "Pressure to build strangely and largely",
      "Temperament of restless construction",
    ],
    practice:
      "Reduce overwhelm by mapping big urges onto 4-style daily methods.",
  },
  "33": {
    theme: "Often reduced in Vedic practice; held here as elevated Venusian care",
    strengths: [
      "Temperament of intense nurture",
      "Day-to-day teacher-healer impulse",
      "Emotional labor risk",
    ],
    practice:
      "Apply 6’s boundary wisdom to 33-level caretaking urges.",
  },
};

/** Vedic Bhagyank — full-date destiny / outer path. */
export const VEDIC_DESTINY: Map = {
  "1": {
    theme:
      "Leader · Sun Bhagyank—outer path of pioneering, recognition, and self-directed authority",
    strengths: [
      "Visibility through honest self-rule",
      "Capacity to originate rather than copy",
      "Drive that creates its own momentum",
    ],
    practice:
      "Build reputation with clarity and fairness—lead the work, not every conversation.",
  },
  "2": {
    theme:
      "Harmony · Moon Bhagyank—path themes of partnership, diplomacy, and progress through people",
    strengths: [
      "Alliance-building and timing",
      "Supportive public presence",
      "Growth via right company",
    ],
    practice:
      "Choose environments that respect sensitivity; destiny Harmony thrives on mutual care.",
  },
  "3": {
    theme:
      "Creativity · Jupiter Bhagyank—growth through communication, learning, and optimistic expansion",
    strengths: [
      "Teaching and guidance lanes",
      "Story and counsel as livelihood fuel",
      "Expansive fortune when ideas are shared",
    ],
    practice:
      "Invest in education or mentoring where Creativity destiny naturally compounds.",
  },
  "4": {
    theme:
      "Stability · Rahu Bhagyank—building lasting structure, sometimes in unconventional arenas",
    strengths: [
      "Disruption that settles into systems",
      "Patience for long construction",
      "Reliability as an outer-life signature",
    ],
    practice:
      "Commit to one lane long enough for Stability to root—unusual is fine; unfinished is not.",
  },
  "5": {
    theme:
      "Freedom · Mercury Bhagyank—commerce, mobility, and skilled exchange as path flavor",
    strengths: [
      "Networking and adaptable livelihood",
      "Wit applied to trade or media",
      "Change as a professional asset",
    ],
    practice:
      "Earn Freedom destiny through reliable information and craft—not novelty alone.",
  },
  "6": {
    theme:
      "Care · Venus Bhagyank—arts, comfort industries, and relational success on the outer path",
    strengths: [
      "Beauty and service as livelihood themes",
      "Harmony that attracts opportunity",
      "Bonds cultivated with taste and fairness",
    ],
    practice:
      "Align work with Care strengths while keeping contracts and rest boundaries clear.",
  },
  "7": {
    theme:
      "Wisdom · Ketu Bhagyank—research, specialized mastery, and inward achievement",
    strengths: [
      "Niche expertise over broad fame",
      "Depth that becomes authority",
      "Path through study and quiet excellence",
    ],
    practice:
      "Specialize deeply; let Wisdom destiny polish mastery before chasing spotlight.",
  },
  "8": {
    theme:
      "Success · Saturn Bhagyank—long labor, hard-won status, and delayed but solid gains",
    strengths: [
      "Endurance under responsibility",
      "Authority earned through years",
      "Material and organizational mastery themes",
    ],
    practice:
      "Respect Saturn timing—steady years compound more than shortcuts to Success.",
  },
  "9": {
    theme:
      "Humanity · Mars Bhagyank—completion, generous fire, and service that closes cycles",
    strengths: [
      "Courageous action for causes",
      "Protective drive channeled outward",
      "Capacity to finish what others abandon",
    ],
    practice:
      "Aim Humanity destiny at worthy missions; finish one campaign before lighting the next.",
  },
  "11": {
    theme: "Often reduced in Vedic practice; held as intensified lunar destiny",
    strengths: [
      "Outer path with strong intuitive calling",
      "Public sensitivity",
      "Partnership destiny amplified",
    ],
    practice:
      "Stabilize with Moon/2 practices—allies, rest, and emotional hygiene.",
  },
  "22": {
    theme: "Often reduced in Vedic practice; held as monumental Rahu-scale destiny",
    strengths: [
      "Outer path aiming at large unusual builds",
      "Heavy responsibility themes",
      "Destiny pressure to materialize vision",
    ],
    practice:
      "Use project management discipline so 22-scale destiny does not scatter.",
  },
  "33": {
    theme: "Often reduced in Vedic practice; held as destiny of elevated care",
    strengths: [
      "Outer path of teaching or healing influence",
      "Service destiny with weight",
      "Public nurture roles",
    ],
    practice:
      "Build institutions of care so 33 destiny is shared, not carried alone.",
  },
};

/** Vedic Namank — name number in the Vedic panel. */
export const VEDIC_NAME: Map = {
  "1": {
    theme: "Namank of Sun—name frequency of authority and clarity",
    strengths: [
      "Spelling vibration toward leadership",
      "Name heard as confident",
      "Solar branding in introductions",
    ],
    practice:
      "Use clear, decisive self-introduction language that matches solar Namank.",
  },
  "2": {
    theme: "Namank of Moon—name frequency of softness and receptivity",
    strengths: [
      "Spelling vibration toward approachability",
      "Name heard as gentle or artistic",
      "Lunar branding in relationships",
    ],
    practice:
      "Pair soft Namank with firm signature lines so kindness still reads capable.",
  },
  "3": {
    theme: "Namank of Jupiter—name frequency of wisdom and expansion",
    strengths: [
      "Spelling vibration toward teaching or counsel",
      "Name heard as optimistic",
      "Growth-oriented branding",
    ],
    practice:
      "Let bios and titles reflect learning and generosity—Jupiter Namank themes.",
  },
  "4": {
    theme: "Namank of Rahu—name frequency of novelty and edge",
    strengths: [
      "Spelling vibration that may feel modern or unusual",
      "Name heard as distinctive",
      "Unconventional personal brand",
    ],
    practice:
      "Own the unusual spelling energy with a clear niche story.",
  },
  "5": {
    theme: "Namank of Mercury—name frequency of wit, trade, and messages",
    strengths: [
      "Spelling vibration favoring communication brands",
      "Name heard as clever or mobile",
      "Mercurial networking tone—not the same as Moolank temperament alone",
    ],
    practice:
      "For Namank 5, polish how the written name appears in email and media—Mercury lives in messages.",
  },
  "6": {
    theme: "Namank of Venus—name frequency of charm and harmony",
    strengths: [
      "Spelling vibration of attractiveness and care",
      "Name heard as pleasant or artistic",
      "Relational branding",
    ],
    practice:
      "Align visual identity (typography, colors) with Venus Namank grace.",
  },
  "7": {
    theme: "Namank of Ketu—name frequency of mystery and expertise",
    strengths: [
      "Spelling vibration of depth or rarity",
      "Name heard as private or scholarly",
      "Specialist branding",
    ],
    practice:
      "Let the name signal niche mastery; avoid oversharing in first impressions.",
  },
  "8": {
    theme: "Namank of Saturn—name frequency of gravitas and duty",
    strengths: [
      "Spelling vibration of seriousness",
      "Name heard as authoritative or heavy",
      "Endurance branding",
    ],
    practice:
      "Soften Saturn Namank in customer-facing copy with human warmth.",
  },
  "9": {
    theme: "Namank of Mars—name frequency of drive and bold presence",
    strengths: [
      "Spelling vibration of force and courage",
      "Name heard as strong or intense",
      "Action branding",
    ],
    practice:
      "Direct Martian name energy into clear calls-to-action, not aggression.",
  },
  "11": {
    theme: "Elevated name frequency often read with lunar/2 undertones",
    strengths: [
      "Name field of inspired sensitivity",
      "Brand of intuition",
      "Partnership undertones",
    ],
    practice:
      "Ground inspired branding with consistent, simple messaging.",
  },
  "22": {
    theme: "Elevated name frequency of builder ambition",
    strengths: [
      "Name field aiming at scale",
      "Brand of practical vision",
      "Institutional undertones",
    ],
    practice:
      "Match big-name energy with proof of delivery.",
  },
  "33": {
    theme: "Elevated name frequency of teaching care",
    strengths: [
      "Name field of guidance",
      "Brand of compassionate authority",
      "Service undertones",
    ],
    practice:
      "Promise care you can sustain—Namank 33 attracts help-seekers.",
  },
};

/** Personal Year / Month timing cycles (shared map; lens text differs). */
export const PERSONAL_CYCLE: Map = {
  "1": {
    theme: "A year or month to start one small thing",
    strengths: [
      "Good time to begin",
      "You can try a new role",
      "Waiting less, starting more",
    ],
    practice:
      "Start one real thing. Watch: ten openings and no second day.",
  },
  "2": {
    theme: "A year or month to wait and work with someone",
    strengths: [
      "Good time for teamwork",
      "Feelings are easier to notice",
      "Results may look slow and still be useful",
    ],
    practice:
      "Count prep and people, not only headlines. Watch: forcing a launch.",
  },
  "3": {
    theme: "A year or month to talk, learn, and share",
    strengths: [
      "Good time to make or speak",
      "Study and people mix well",
      "The window is lighter and more social",
    ],
    practice:
      "Finish one small public thing. Watch: talking with nothing to show.",
  },
  "4": {
    theme: "A year or month for routines and practical building",
    strengths: [
      "Good time to fix sleep, money, or tools",
      "Work now, reward later",
      "Fewer promises, stronger ones",
    ],
    practice:
      "Fix one base item. Watch: adding more jobs instead of a system.",
  },
  "5": {
    theme: "A year or month to try one change",
    strengths: [
      "Good time to travel, pivot, or test",
      "Freedom is on the calendar",
      "Stuck plans feel heavier",
    ],
    practice:
      "Choose the change. Watch: scattering into five new lives.",
  },
  "6": {
    theme: "A year or month for home, care, and promises",
    strengths: [
      "Good time for family and duty",
      "Home and looks may ask for attention",
      "More people may ask for help",
    ],
    practice:
      "Say some yeses and keep a rest day. Watch: a full calendar of other people’s needs.",
  },
  "7": {
    theme: "A year or month to think, study, and go quieter",
    strengths: [
      "Good time to learn and review",
      "Less need for a loud social life",
      "Quality beats quantity",
    ],
    practice:
      "Protect quiet work blocks. Watch: forcing a loud productive show.",
  },
  "8": {
    theme: "A year or month for results you can measure",
    strengths: [
      "Good time for work, money, and duty",
      "Results show more",
      "Resource choices matter more",
    ],
    practice:
      "Track the numbers fairly. Watch: pushing with no rest.",
  },
  "9": {
    theme: "A year or month to finish and let go",
    strengths: [
      "Good time to end and clear out",
      "Mentoring or giving back fits",
      "Space before the next start",
    ],
    practice:
      "Close loops first. Watch: forcing a new start in the leftover mess.",
  },
  "11": {
    theme: "A year or month to notice and rest (often feels like a 2 as well)",
    strengths: [
      "Ideas want to be seen",
      "You may feel more",
      "Inspiration needs sleep",
    ],
    practice:
      "Share one idea, then recover. Watch: too much noise, too little rest.",
  },
  "22": {
    theme: "A year or month for a large plan in small steps (often feels like a 4)",
    strengths: [
      "Good time for a real build",
      "Many parts can be joined",
      "Patience with size pays",
    ],
    practice:
      "Use a written plan. Watch: dreaming with no engineering.",
  },
  "33": {
    theme: "A year or month to teach and care (often feels like a 6)",
    strengths: [
      "Good time to guide",
      "Help requests may rise",
      "Service is on the calendar",
    ],
    practice:
      "Teach with a time limit. Watch: a calendar filled only with others.",
  },
};

const TOPIC_MAP = {
  "life-path": LIFE_PATH,
  "birth-day": BIRTH_DAY,
  expression: EXPRESSION,
  "soul-urge": SOUL_URGE,
  personality: PERSONALITY,
  maturity: MATURITY,
  "chaldean-name": CHALDEAN_NAME,
  "vedic-psychic": VEDIC_PSYCHIC,
  "vedic-destiny": VEDIC_DESTINY,
  "vedic-name": VEDIC_NAME,
  "personal-year": PERSONAL_CYCLE,
  "personal-month": PERSONAL_CYCLE,
} as const;

export type NumberGuideTopic = keyof typeof TOPIC_MAP;

export function blurbForTopic(
  topic: string,
  value: string,
): NumberBlurb | null {
  if (!(topic in TOPIC_MAP)) return null;
  const map = TOPIC_MAP[topic as NumberGuideTopic];
  const base = map[value];
  if (!base) return null;
  return {
    theme: base.theme,
    strengths: base.strengths,
    watchouts: watchoutsFor(topic, value),
    practice: base.practice,
  };
}
