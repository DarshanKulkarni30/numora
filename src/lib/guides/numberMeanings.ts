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
    theme: "A life-long invitation to lead from self-trust",
    strengths: [
      "Learning through initiating chapters",
      "Growing identity via independence",
      "Courage as a repeating life lesson",
    ],
    practice:
      "Notice when independence becomes isolation—invite allies into goals you start alone.",
  },
  "2": {
    theme: "A life path shaped by partnership and timing",
    strengths: [
      "Growth through cooperation",
      "Sensitivity as a lifelong skill",
      "Patience with unfolding plans",
    ],
    practice:
      "Name your needs early in collaborations so harmony does not mean self-erasure.",
  },
  "3": {
    theme: "A life devoted to expressive growth and connection",
    strengths: [
      "Storytelling as a life skill",
      "Social learning across decades",
      "Creative risk as a growth engine",
    ],
    practice:
      "Finish a few creative arcs each year so expression becomes craft, not only spark.",
  },
  "4": {
    theme: "A life of building durable foundations",
    strengths: [
      "Mastery through steady systems",
      "Reliability as a life signature",
      "Progress measured in structures that last",
    ],
    practice:
      "Schedule deliberate flexibility so order supports life rather than freezing it.",
  },
  "5": {
    theme: "A life path of freedom, change, and experiential wisdom",
    strengths: [
      "Growth through variety and movement",
      "Lessons earned by trying paths",
      "Freedom balanced with chosen commitments",
    ],
    practice:
      "Pick one multi-year craft to deepen while keeping room for exploration.",
  },
  "6": {
    theme: "A life oriented to care, duty, and harmony",
    strengths: [
      "Service as a recurring theme",
      "Family and community gravity",
      "Beauty and responsibility intertwined",
    ],
    practice:
      "Practice receiving help so caretaking stays sustainable across decades.",
  },
  "7": {
    theme: "A life of inquiry, solitude, and inner knowing",
    strengths: [
      "Truth-seeking as a long arc",
      "Depth over noise",
      "Wisdom refined in quiet seasons",
    ],
    practice:
      "Share one insight regularly so solitude feeds connection, not withdrawal.",
  },
  "8": {
    theme: "A life of stewardship, power, and material accountability",
    strengths: [
      "Authority learned through responsibility",
      "Resource mastery over time",
      "Ethical ambition as a life exam",
    ],
    practice:
      "Define success metrics that include integrity, rest, and impact—not status alone.",
  },
  "9": {
    theme: "A life of completion, compassion, and wide vision",
    strengths: [
      "Cycles of release and renewal",
      "Service beyond the personal circle",
      "Wisdom gathered to be given away",
    ],
    practice:
      "Close chapters cleanly before collecting new causes or projects.",
  },
  "11": {
    theme: "A master life path of inspired illumination",
    strengths: [
      "Intuition as a lifelong current",
      "Uplifting others through insight",
      "Sensitivity requiring grounded habits",
    ],
    practice:
      "Pair visionary flashes with sleep, body care, and simple verification.",
  },
  "22": {
    theme: "A master builder life path of practical vision",
    strengths: [
      "Large dreams with engineering patience",
      "Systems that outlast moods",
      "Leadership through durable construction",
    ],
    practice:
      "Break decade-scale visions into quarterly builds and celebrate milestones.",
  },
  "33": {
    theme: "A master teacher life path of compassionate guidance",
    strengths: [
      "Care elevated into teaching",
      "Influence through example",
      "Service with emotional maturity",
    ],
    practice:
      "Teach boundaries as part of care—model the balance you hope others learn.",
  },
};

/** Day-of-month specialty flavor within the Life Path. */
export const BIRTH_DAY: Map = {
  "1": {
    theme: "A day-number gift for decisive starts",
    strengths: [
      "Quick personal initiative",
      "Comfort going first in a skill area",
      "Specialty in sparking momentum",
    ],
    practice:
      "Use your start-energy on one craft lane so initiative becomes expertise.",
  },
  "2": {
    theme: "A day-number gift for tact and support",
    strengths: [
      "Specialty in reading the room",
      "Helpful timing instincts",
      "Skill at bridging people",
    ],
    practice:
      "Claim credit kindly for quiet work that made collaboration succeed.",
  },
  "3": {
    theme: "A day-number gift for lively communication",
    strengths: [
      "Specialty in words, humor, or design",
      "Ease with social warmth",
      "Talent for making ideas memorable",
    ],
    practice:
      "Ship drafts on a schedule so communicative gifts leave finished artifacts.",
  },
  "4": {
    theme: "A day-number gift for method and craft",
    strengths: [
      "Specialty in reliable process",
      "Hands-on problem solving",
      "Skill at making plans usable",
    ],
    practice:
      "Document one personal system others can reuse—your gift multiplies.",
  },
  "5": {
    theme: "A day-number gift for versatile skill and quick learning",
    strengths: [
      "Specialty in adapting under change",
      "Talent for sampling then synthesizing",
      "Skill at reading emerging trends",
    ],
    practice:
      "Convert variety into a portfolio: name three lanes you will keep practicing.",
  },
  "6": {
    theme: "A day-number gift for caretaking craft",
    strengths: [
      "Specialty in support and design for others",
      "Talent for soothing environments",
      "Skill at responsible follow-through",
    ],
    practice:
      "Protect creative or rest time so your care gift stays warm, not depleted.",
  },
  "7": {
    theme: "A day-number gift for analysis and research",
    strengths: [
      "Specialty in studying beneath surfaces",
      "Talent for precise questions",
      "Skill at solitary deep work",
    ],
    practice:
      "Publish or teach a small finding so research skills meet the world.",
  },
  "8": {
    theme: "A day-number gift for organizing results",
    strengths: [
      "Specialty in managing outcomes",
      "Talent for spotting leverage",
      "Skill at accountable leadership in a niche",
    ],
    practice:
      "Mentor someone in your operational strengths—authority becomes legacy.",
  },
  "9": {
    theme: "A day-number gift for broad empathy and completion",
    strengths: [
      "Specialty in seeing the whole story",
      "Talent for mentoring or arts with heart",
      "Skill at finishing what others abandon",
    ],
    practice:
      "Choose causes carefully; depth beats scattering across every need.",
  },
  "11": {
    theme: "A day-number gift for intuitive spark",
    strengths: [
      "Specialty flashes of insight",
      "Talent for inspiring a moment",
      "Skill at sensing unspoken needs",
    ],
    practice:
      "Write insights down immediately—then test one in ordinary practice.",
  },
  "22": {
    theme: "A day-number gift for scalable building",
    strengths: [
      "Specialty in ambitious practical projects",
      "Talent for coordinating parts into wholes",
      "Skill at durable design",
    ],
    practice:
      "Pick infrastructure-style projects where your day gift compounds for years.",
  },
  "33": {
    theme: "A day-number gift for uplifting care",
    strengths: [
      "Specialty in teaching through kindness",
      "Talent for creative nurture",
      "Skill at elevating a room’s tone",
    ],
    practice:
      "Offer guidance with consent—ask what help is wanted before giving it.",
  },
};

/** Full-name talents (Expression / Destiny of the name). */
export const EXPRESSION: Map = {
  "1": {
    theme: "Outward talent for original leadership and invention",
    strengths: [
      "Presenting as a starter and director",
      "Skills in pioneering roles",
      "Capability shown through decisive action",
    ],
    practice:
      "Let others own pieces of what you launch so leadership scales beyond you.",
  },
  "2": {
    theme: "Outward talent for diplomacy and supportive craft",
    strengths: [
      "Skills in mediation and detail",
      "Capability shown through partnership",
      "Presenting as a calm collaborator",
    ],
    practice:
      "Make your behind-the-scenes excellence visible in portfolios and reviews.",
  },
  "3": {
    theme: "Outward talent for creative communication",
    strengths: [
      "Skills in writing, speaking, or performance",
      "Capability shown through charm and ideas",
      "Presenting as imaginative and social",
    ],
    practice:
      "Build a body of finished work—talent becomes reputation through delivery.",
  },
  "4": {
    theme: "Outward talent for structure and dependable delivery",
    strengths: [
      "Skills in systems, ops, and craftsmanship",
      "Capability shown through consistency",
      "Presenting as the person who makes it real",
    ],
    practice:
      "Market your reliability with case studies, not only quiet excellence.",
  },
  "5": {
    theme: "Outward talent for versatility, persuasion, and adaptive skill",
    strengths: [
      "Skills across sales, media, travel, or change work",
      "Capability shown through quick learning on stage",
      "Presenting as resourceful and free-moving",
    ],
    practice:
      "Choose a signature specialty inside your versatility so the world knows what to hire you for.",
  },
  "6": {
    theme: "Outward talent for care, design, and responsible service",
    strengths: [
      "Skills in counseling, teaching, aesthetics, or hospitality",
      "Capability shown through nurturing excellence",
      "Presenting as trustworthy and warm",
    ],
    practice:
      "Price and pace your care work sustainably—talent includes healthy limits.",
  },
  "7": {
    theme: "Outward talent for expertise, research, and refined skill",
    strengths: [
      "Skills in analysis, tech, or specialized study",
      "Capability shown through depth",
      "Presenting as thoughtful and precise",
    ],
    practice:
      "Translate expertise into clear teaching so depth becomes shareable value.",
  },
  "8": {
    theme: "Outward talent for executive skill and resource leadership",
    strengths: [
      "Skills in business, finance, or organized power",
      "Capability shown through results",
      "Presenting as ambitious and capable",
    ],
    practice:
      "Pair ambition with transparent ethics—reputation is part of the talent.",
  },
  "9": {
    theme: "Outward talent for humanitarian expression and mentorship",
    strengths: [
      "Skills in arts, advocacy, or broad service",
      "Capability shown through compassion in public roles",
      "Presenting as wise and generous",
    ],
    practice:
      "Focus gifts where your impact is measurable; avoid diffuse over-giving.",
  },
  "11": {
    theme: "Outward talent for inspirational influence",
    strengths: [
      "Skills in motivating and illuminating ideas",
      "Capability shown through visionary presence",
      "Presenting as intuitive and catalytic",
    ],
    practice:
      "Ground public inspiration with rehearsed craft and recovery rituals.",
  },
  "22": {
    theme: "Outward talent for building at scale",
    strengths: [
      "Skills in architecture of projects and teams",
      "Capability shown through lasting institutions",
      "Presenting as a practical visionary",
    ],
    practice:
      "Delegate operations early so vision talent is not buried in minutiae.",
  },
  "33": {
    theme: "Outward talent for compassionate teaching",
    strengths: [
      "Skills in guidance, healing arts, or creative nurture",
      "Capability shown through elevating others",
      "Presenting as a caring mentor",
    ],
    practice:
      "Teach methods, not only comfort—empower students to stand without you.",
  },
};

/** Vowels — inner motivation (Soul Urge). */
export const SOUL_URGE: Map = {
  "1": {
    theme: "Inner desire for autonomy and recognition of self",
    strengths: [
      "Privately wanting to lead",
      "Craving self-directed purpose",
      "Motivated by originality",
    ],
    practice:
      "Admit when you need solo time—soul urge 1 thrives when independence is planned, not stolen.",
  },
  "2": {
    theme: "Inner desire for harmony, love, and belonging",
    strengths: [
      "Privately wanting peace in relationships",
      "Motivated by partnership",
      "Craving emotional attunement",
    ],
    practice:
      "Ask for reassurance directly instead of hoping others will guess.",
  },
  "3": {
    theme: "Inner desire for joy, creativity, and being heard",
    strengths: [
      "Privately wanting playful expression",
      "Motivated by applause and delight",
      "Craving outlets for imagination",
    ],
    practice:
      "Schedule creative joy that is not performance for others’ approval alone.",
  },
  "4": {
    theme: "Inner desire for security, order, and earned stability",
    strengths: [
      "Privately wanting solid ground",
      "Motivated by clear plans",
      "Craving dependable routines",
    ],
    practice:
      "Allow one intentional unknown each season so security does not become rigidity.",
  },
  "5": {
    theme: "Inner desire for freedom, novelty, and sensory experience",
    strengths: [
      "Privately wanting open options",
      "Motivated by adventure and learning",
      "Craving change when life feels static",
    ],
    practice:
      "Negotiate freedom inside commitments—travel, study, or flexible hours—rather than fleeing structure entirely.",
  },
  "6": {
    theme: "Inner desire to nurture and be needed",
    strengths: [
      "Privately wanting to care and beautify",
      "Motivated by family or community roles",
      "Craving harmonious homes and bonds",
    ],
    practice:
      "Notice when “being needed” replaces mutual care—receive as much as you give.",
  },
  "7": {
    theme: "Inner desire for truth, privacy, and meaning",
    strengths: [
      "Privately wanting depth over small talk",
      "Motivated by understanding",
      "Craving solitude to think",
    ],
    practice:
      "Protect study time without ghosting loved ones—name your need for quiet.",
  },
  "8": {
    theme: "Inner desire for achievement, respect, and material mastery",
    strengths: [
      "Privately wanting tangible success",
      "Motivated by influence and resources",
      "Craving recognition for capability",
    ],
    practice:
      "Define enough—celebrate non-status wins so desire for mastery stays healthy.",
  },
  "9": {
    theme: "Inner desire to serve a larger story",
    strengths: [
      "Privately wanting to help humanity or arts",
      "Motivated by compassion",
      "Craving meaningful completion",
    ],
    practice:
      "Serve from overflow; keep personal dreams on the list, not only others’ needs.",
  },
  "11": {
    theme: "Inner desire to inspire and channel insight",
    strengths: [
      "Privately wanting to illuminate",
      "Motivated by intuitive purpose",
      "Craving spiritual or creative voltage",
    ],
    practice:
      "Ground inspiration in body care before sharing every flash of insight.",
  },
  "22": {
    theme: "Inner desire to build something lasting for many",
    strengths: [
      "Privately wanting legacy structures",
      "Motivated by practical idealism",
      "Craving impact at scale",
    ],
    practice:
      "Feed the desire with weekly brick-laying, not only grand future movies.",
  },
  "33": {
    theme: "Inner desire to heal and teach through love",
    strengths: [
      "Privately wanting to uplift suffering",
      "Motivated by compassionate service",
      "Craving sacred caretaking roles",
    ],
    practice:
      "Remember: your urge to heal others includes allowing yourself to be human.",
  },
};

/** Consonants — social first impression (Personality). */
export const PERSONALITY: Map = {
  "1": {
    theme: "First impression of confidence and self-direction",
    strengths: [
      "Appearing decisive or bold",
      "Social mask of independence",
      "Others may expect you to take charge",
    ],
    practice:
      "Soften openings with curiosity questions so strength does not read as distance.",
  },
  "2": {
    theme: "First impression of gentleness and approachability",
    strengths: [
      "Appearing diplomatic or quiet",
      "Social mask of cooperativeness",
      "Others may expect you to yield",
    ],
    practice:
      "State preferences early so kindness is not mistaken for agreement.",
  },
  "3": {
    theme: "First impression of charm and expressive warmth",
    strengths: [
      "Appearing witty or creative",
      "Social mask of optimism",
      "Others may expect entertainment",
    ],
    practice:
      "Allow quieter moods in public—you need not perform brightness every entrance.",
  },
  "4": {
    theme: "First impression of steadiness and practicality",
    strengths: [
      "Appearing reliable or reserved",
      "Social mask of seriousness",
      "Others may expect structure from you",
    ],
    practice:
      "Show a playful detail occasionally so reliability does not read as rigidity.",
  },
  "5": {
    theme: "First impression of energy, restlessness, and open curiosity",
    strengths: [
      "Appearing adventurous or changeable",
      "Social mask of freedom-loving wit",
      "Others may expect spontaneity",
    ],
    practice:
      "Signal follow-through early in new connections so versatility reads as trustable.",
  },
  "6": {
    theme: "First impression of warmth, care, and aesthetic sense",
    strengths: [
      "Appearing nurturing or stylish",
      "Social mask of responsibility",
      "Others may expect you to host or help",
    ],
    practice:
      "Set help boundaries kindly so your warmth is not endlessly recruited.",
  },
  "7": {
    theme: "First impression of mystery, intellect, or reserve",
    strengths: [
      "Appearing thoughtful or distant",
      "Social mask of privacy",
      "Others may expect depth—or misread aloofness",
    ],
    practice:
      "Offer a small personal detail early to invite connection without oversharing.",
  },
  "8": {
    theme: "First impression of authority and competence",
    strengths: [
      "Appearing ambitious or polished",
      "Social mask of power",
      "Others may expect leadership or status cues",
    ],
    practice:
      "Lead with listening so competence does not intimidate allies.",
  },
  "9": {
    theme: "First impression of breadth, kindness, or worldliness",
    strengths: [
      "Appearing wise or artistic",
      "Social mask of generosity",
      "Others may expect counsel or idealism",
    ],
    practice:
      "You may decline emotional labor—compassion includes choosing when to engage.",
  },
  "11": {
    theme: "First impression of intensity and inspired presence",
    strengths: [
      "Appearing magnetic or sensitive",
      "Social mask of visionary energy",
      "Others may expect insight on demand",
    ],
    practice:
      "Protect nervous energy in crowds; intensity needs recovery after contact.",
  },
  "22": {
    theme: "First impression of capable ambition at scale",
    strengths: [
      "Appearing as a builder or organizer",
      "Social mask of big-picture practicality",
      "Others may expect you to “make it happen”",
    ],
    practice:
      "Clarify scope before accepting every large ask that your presence attracts.",
  },
  "33": {
    theme: "First impression of nurturing wisdom",
    strengths: [
      "Appearing as a natural counselor or teacher",
      "Social mask of elevated care",
      "Others may unload problems quickly",
    ],
    practice:
      "Ask “Do you want advice or company?” before stepping into helper mode.",
  },
};

/** Life Path + Expression blend for later-life emphasis. */
export const MATURITY: Map = {
  "1": {
    theme: "Later-life emphasis on self-authored leadership",
    strengths: [
      "Maturity clarifying personal authority",
      "Less need for external permission",
      "Initiative refined by experience",
    ],
    practice:
      "Mentor starters—your mature 1 energy teaches courage without competition.",
  },
  "2": {
    theme: "Later-life emphasis on wise partnership",
    strengths: [
      "Maturity softening ego into alliance",
      "Diplomacy with clearer boundaries",
      "Patience that has earned its calm",
    ],
    practice:
      "Choose partnerships that honor your pace; maturity 2 need not absorb chaos.",
  },
  "3": {
    theme: "Later-life emphasis on seasoned creative voice",
    strengths: [
      "Expression matured into craft",
      "Joy with less performance anxiety",
      "Communication used to uplift",
    ],
    practice:
      "Publish or teach what younger you practiced—maturity 3 shares the archive.",
  },
  "4": {
    theme: "Later-life emphasis on lasting systems and legacy structure",
    strengths: [
      "Foundations that outlive urgency",
      "Craftsmanship as identity",
      "Order serving loved ones’ security",
    ],
    practice:
      "Simplify outdated routines; mature 4 keeps what works and retires the rest.",
  },
  "5": {
    theme: "Later-life emphasis on freedom with wisdom",
    strengths: [
      "Change chosen rather than chased",
      "Travel or learning as mature enrichment",
      "Adaptability without restless escape",
    ],
    practice:
      "Design freedom rituals (study trips, sabbaticals) inside stable roots.",
  },
  "6": {
    theme: "Later-life emphasis on responsible love and stewardship of home",
    strengths: [
      "Care refined by experience",
      "Family or community elder roles",
      "Harmony with healthier limits",
    ],
    practice:
      "Pass skills on; mature 6 multiplies care by teaching, not only doing.",
  },
  "7": {
    theme: "Later-life emphasis on distilled wisdom and quiet mastery",
    strengths: [
      "Insight less noisy, more useful",
      "Spiritual or intellectual harvest",
      "Solitude as chosen richness",
    ],
    practice:
      "Write memoirs of method—mature 7 leaves maps, not only mysteries.",
  },
  "8": {
    theme: "Later-life emphasis on ethical power and resource legacy",
    strengths: [
      "Ambition tempered into stewardship",
      "Recognition earned through character",
      "Material mastery serving others",
    ],
    practice:
      "Plan succession and generosity while you still enjoy building.",
  },
  "9": {
    theme: "Later-life emphasis on completion and wide-hearted mentoring",
    strengths: [
      "Release of outdated identities",
      "Service as natural maturity",
      "Compassion with less attachment",
    ],
    practice:
      "Ritualize endings—mature 9 thrives when chapters close with gratitude.",
  },
  "11": {
    theme: "Later-life emphasis on grounded inspiration",
    strengths: [
      "Intuition steadied by decades",
      "Teaching through presence",
      "Sensitivity managed with wisdom",
    ],
    practice:
      "Offer inspiration in measured doses; protect rest as sacred duty.",
  },
  "22": {
    theme: "Later-life emphasis on institutions and lasting builds",
    strengths: [
      "Vision finally resourced",
      "Practical idealism realized",
      "Legacy architecture",
    ],
    practice:
      "Document blueprints so your mature 22 outlives any single project.",
  },
  "33": {
    theme: "Later-life emphasis on masterful compassionate teaching",
    strengths: [
      "Care become curriculum",
      "Healing presence refined",
      "Service without self-erasure",
    ],
    practice:
      "Let students carry the work—mature 33 multiplies by releasing control.",
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
      "Lively communication",
      "Idea generation and storytelling",
      "Social ease that opens doors",
    ],
    practice:
      "Ask before advising—creative warmth lands best with consent and follow-through.",
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
    theme: "A cycle of beginnings and self-directed planting",
    strengths: [
      "Timing for initiative",
      "Fresh identity experiments",
      "Less waiting, more starting",
    ],
    practice:
      "Launch one meaningful start; do not overload the cycle with ten openings.",
  },
  "2": {
    theme: "A cycle of patience, alliance, and quiet progress",
    strengths: [
      "Timing for collaboration",
      "Emotional attunement windows",
      "Slower visible results",
    ],
    practice:
      "Measure progress in relationships and prep work, not only headlines.",
  },
  "3": {
    theme: "A cycle of expression, learning, and social exchange",
    strengths: [
      "Timing for creative output",
      "Networking and study",
      "Lighter, more vocal months/years",
    ],
    practice:
      "Publish or perform something small—cycles of 3 love visible expression.",
  },
  "4": {
    theme: "A cycle of foundations, routines, and practical building",
    strengths: [
      "Timing for systems and health habits",
      "Work-before-reward pacing",
      "Simplifying commitments",
    ],
    practice:
      "Fix one infrastructure item (budget, sleep, tools) this cycle.",
  },
  "5": {
    theme: "A cycle of change, movement, and experimentation",
    strengths: [
      "Timing for travel, pivots, and trials",
      "Freedom themes in the calendar",
      "Less tolerance for stagnation",
    ],
    practice:
      "Choose conscious change—update plans deliberately rather than scattering energy.",
  },
  "6": {
    theme: "A cycle of home, care, and relationship harmony",
    strengths: [
      "Timing for family and duty",
      "Aesthetic or domestic focus",
      "Service requests increase",
    ],
    practice:
      "Balance yeses with rest; caretaking cycles need scheduled recovery.",
  },
  "7": {
    theme: "A cycle of reflection, skill refinement, and inner clarity",
    strengths: [
      "Timing for study and assessment",
      "Quieter social appetite",
      "Quality over quantity",
    ],
    practice:
      "Protect deep-work blocks; avoid forcing loud productivity in a 7 cycle.",
  },
  "8": {
    theme: "A cycle of recognition, stewardship, and measurable progress",
    strengths: [
      "Timing for business and authority themes",
      "Results come into view",
      "Resource decisions matter more",
    ],
    practice:
      "Track numbers ethically; ambition cycles reward organized effort.",
  },
  "9": {
    theme: "A cycle of completion, generosity, and release",
    strengths: [
      "Timing for endings and clear-outs",
      "Mentoring or giving back",
      "Space-making before the next 1",
    ],
    practice:
      "Close loops—projects, clutter, outdated roles—before forcing new starts.",
  },
  "11": {
    theme: "A heightened inspirational cycle (often lived with 2 undertones)",
    strengths: [
      "Timing for insight and visibility of ideas",
      "Nervous-system sensitivity up",
      "Inspiration needing rest",
    ],
    practice:
      "Share ideas, then recover—11 cycles punish chronic overstimulation.",
  },
  "22": {
    theme: "A practical visionary cycle (often lived with 4 undertones)",
    strengths: [
      "Timing for large yet grounded builds",
      "Coordination of many parts",
      "Patience with scale",
    ],
    practice:
      "Use project plans; 22 cycles reward engineering, not only dreaming.",
  },
  "33": {
    theme: "A compassionate teaching cycle (often lived with 6 undertones)",
    strengths: [
      "Timing for guidance and care roles",
      "Emotional labor themes",
      "Service opportunities",
    ],
    practice:
      "Teach with boundaries; 33 cycles can overfill the calendar with others’ needs.",
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
