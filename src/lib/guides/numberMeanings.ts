/** Aspect-specific number blurbs — same digit, different methodology/role. */

export type NumberBlurb = {
  theme: string;
  traits: string[];
  practice: string;
};

type Map = Record<string, NumberBlurb>;

/** Lifelong growth arc from the full birth date (Pythagorean). */
export const LIFE_PATH: Map = {
  "1": {
    theme: "A life-long invitation to lead from self-trust",
    traits: [
      "Learning through initiating chapters",
      "Growing identity via independence",
      "Courage as a repeating life lesson",
    ],
    practice:
      "Notice when independence becomes isolation—invite allies into goals you start alone.",
  },
  "2": {
    theme: "A life path shaped by partnership and timing",
    traits: [
      "Growth through cooperation",
      "Sensitivity as a lifelong skill",
      "Patience with unfolding plans",
    ],
    practice:
      "Name your needs early in collaborations so harmony does not mean self-erasure.",
  },
  "3": {
    theme: "A life devoted to expressive growth and connection",
    traits: [
      "Storytelling as a life skill",
      "Social learning across decades",
      "Creative risk as a growth engine",
    ],
    practice:
      "Finish a few creative arcs each year so expression becomes craft, not only spark.",
  },
  "4": {
    theme: "A life of building durable foundations",
    traits: [
      "Mastery through steady systems",
      "Reliability as a life signature",
      "Progress measured in structures that last",
    ],
    practice:
      "Schedule deliberate flexibility so order supports life rather than freezing it.",
  },
  "5": {
    theme: "A life path of freedom, change, and experiential wisdom",
    traits: [
      "Growth through variety and movement",
      "Lessons earned by trying paths",
      "Freedom balanced with chosen commitments",
    ],
    practice:
      "Pick one multi-year craft to deepen while keeping room for exploration.",
  },
  "6": {
    theme: "A life oriented to care, duty, and harmony",
    traits: [
      "Service as a recurring theme",
      "Family and community gravity",
      "Beauty and responsibility intertwined",
    ],
    practice:
      "Practice receiving help so caretaking stays sustainable across decades.",
  },
  "7": {
    theme: "A life of inquiry, solitude, and inner knowing",
    traits: [
      "Truth-seeking as a long arc",
      "Depth over noise",
      "Wisdom refined in quiet seasons",
    ],
    practice:
      "Share one insight regularly so solitude feeds connection, not withdrawal.",
  },
  "8": {
    theme: "A life of stewardship, power, and material accountability",
    traits: [
      "Authority learned through responsibility",
      "Resource mastery over time",
      "Ethical ambition as a life exam",
    ],
    practice:
      "Define success metrics that include integrity, rest, and impact—not status alone.",
  },
  "9": {
    theme: "A life of completion, compassion, and wide vision",
    traits: [
      "Cycles of release and renewal",
      "Service beyond the personal circle",
      "Wisdom gathered to be given away",
    ],
    practice:
      "Close chapters cleanly before collecting new causes or projects.",
  },
  "11": {
    theme: "A master life path of inspired illumination",
    traits: [
      "Intuition as a lifelong current",
      "Uplifting others through insight",
      "Sensitivity requiring grounded habits",
    ],
    practice:
      "Pair visionary flashes with sleep, body care, and simple verification.",
  },
  "22": {
    theme: "A master builder life path of practical vision",
    traits: [
      "Large dreams with engineering patience",
      "Systems that outlast moods",
      "Leadership through durable construction",
    ],
    practice:
      "Break decade-scale visions into quarterly builds and celebrate milestones.",
  },
  "33": {
    theme: "A master teacher life path of compassionate guidance",
    traits: [
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
    traits: [
      "Quick personal initiative",
      "Comfort going first in a skill area",
      "Specialty in sparking momentum",
    ],
    practice:
      "Use your start-energy on one craft lane so initiative becomes expertise.",
  },
  "2": {
    theme: "A day-number gift for tact and support",
    traits: [
      "Specialty in reading the room",
      "Helpful timing instincts",
      "Skill at bridging people",
    ],
    practice:
      "Claim credit kindly for quiet work that made collaboration succeed.",
  },
  "3": {
    theme: "A day-number gift for lively communication",
    traits: [
      "Specialty in words, humor, or design",
      "Ease with social warmth",
      "Talent for making ideas memorable",
    ],
    practice:
      "Ship drafts on a schedule so communicative gifts leave finished artifacts.",
  },
  "4": {
    theme: "A day-number gift for method and craft",
    traits: [
      "Specialty in reliable process",
      "Hands-on problem solving",
      "Skill at making plans usable",
    ],
    practice:
      "Document one personal system others can reuse—your gift multiplies.",
  },
  "5": {
    theme: "A day-number gift for versatile skill and quick learning",
    traits: [
      "Specialty in adapting under change",
      "Talent for sampling then synthesizing",
      "Skill at reading emerging trends",
    ],
    practice:
      "Convert variety into a portfolio: name three lanes you will keep practicing.",
  },
  "6": {
    theme: "A day-number gift for caretaking craft",
    traits: [
      "Specialty in support and design for others",
      "Talent for soothing environments",
      "Skill at responsible follow-through",
    ],
    practice:
      "Protect creative or rest time so your care gift stays warm, not depleted.",
  },
  "7": {
    theme: "A day-number gift for analysis and research",
    traits: [
      "Specialty in studying beneath surfaces",
      "Talent for precise questions",
      "Skill at solitary deep work",
    ],
    practice:
      "Publish or teach a small finding so research skills meet the world.",
  },
  "8": {
    theme: "A day-number gift for organizing results",
    traits: [
      "Specialty in managing outcomes",
      "Talent for spotting leverage",
      "Skill at accountable leadership in a niche",
    ],
    practice:
      "Mentor someone in your operational strengths—authority becomes legacy.",
  },
  "9": {
    theme: "A day-number gift for broad empathy and completion",
    traits: [
      "Specialty in seeing the whole story",
      "Talent for mentoring or arts with heart",
      "Skill at finishing what others abandon",
    ],
    practice:
      "Choose causes carefully; depth beats scattering across every need.",
  },
  "11": {
    theme: "A day-number gift for intuitive spark",
    traits: [
      "Specialty flashes of insight",
      "Talent for inspiring a moment",
      "Skill at sensing unspoken needs",
    ],
    practice:
      "Write insights down immediately—then test one in ordinary practice.",
  },
  "22": {
    theme: "A day-number gift for scalable building",
    traits: [
      "Specialty in ambitious practical projects",
      "Talent for coordinating parts into wholes",
      "Skill at durable design",
    ],
    practice:
      "Pick infrastructure-style projects where your day gift compounds for years.",
  },
  "33": {
    theme: "A day-number gift for uplifting care",
    traits: [
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
    traits: [
      "Presenting as a starter and director",
      "Skills in pioneering roles",
      "Capability shown through decisive action",
    ],
    practice:
      "Let others own pieces of what you launch so leadership scales beyond you.",
  },
  "2": {
    theme: "Outward talent for diplomacy and supportive craft",
    traits: [
      "Skills in mediation and detail",
      "Capability shown through partnership",
      "Presenting as a calm collaborator",
    ],
    practice:
      "Make your behind-the-scenes excellence visible in portfolios and reviews.",
  },
  "3": {
    theme: "Outward talent for creative communication",
    traits: [
      "Skills in writing, speaking, or performance",
      "Capability shown through charm and ideas",
      "Presenting as imaginative and social",
    ],
    practice:
      "Build a body of finished work—talent becomes reputation through delivery.",
  },
  "4": {
    theme: "Outward talent for structure and dependable delivery",
    traits: [
      "Skills in systems, ops, and craftsmanship",
      "Capability shown through consistency",
      "Presenting as the person who makes it real",
    ],
    practice:
      "Market your reliability with case studies, not only quiet excellence.",
  },
  "5": {
    theme: "Outward talent for versatility, persuasion, and adaptive skill",
    traits: [
      "Skills across sales, media, travel, or change work",
      "Capability shown through quick learning on stage",
      "Presenting as resourceful and free-moving",
    ],
    practice:
      "Choose a signature specialty inside your versatility so the world knows what to hire you for.",
  },
  "6": {
    theme: "Outward talent for care, design, and responsible service",
    traits: [
      "Skills in counseling, teaching, aesthetics, or hospitality",
      "Capability shown through nurturing excellence",
      "Presenting as trustworthy and warm",
    ],
    practice:
      "Price and pace your care work sustainably—talent includes healthy limits.",
  },
  "7": {
    theme: "Outward talent for expertise, research, and refined skill",
    traits: [
      "Skills in analysis, tech, or specialized study",
      "Capability shown through depth",
      "Presenting as thoughtful and precise",
    ],
    practice:
      "Translate expertise into clear teaching so depth becomes shareable value.",
  },
  "8": {
    theme: "Outward talent for executive skill and resource leadership",
    traits: [
      "Skills in business, finance, or organized power",
      "Capability shown through results",
      "Presenting as ambitious and capable",
    ],
    practice:
      "Pair ambition with transparent ethics—reputation is part of the talent.",
  },
  "9": {
    theme: "Outward talent for humanitarian expression and mentorship",
    traits: [
      "Skills in arts, advocacy, or broad service",
      "Capability shown through compassion in public roles",
      "Presenting as wise and generous",
    ],
    practice:
      "Focus gifts where your impact is measurable; avoid diffuse over-giving.",
  },
  "11": {
    theme: "Outward talent for inspirational influence",
    traits: [
      "Skills in motivating and illuminating ideas",
      "Capability shown through visionary presence",
      "Presenting as intuitive and catalytic",
    ],
    practice:
      "Ground public inspiration with rehearsed craft and recovery rituals.",
  },
  "22": {
    theme: "Outward talent for building at scale",
    traits: [
      "Skills in architecture of projects and teams",
      "Capability shown through lasting institutions",
      "Presenting as a practical visionary",
    ],
    practice:
      "Delegate operations early so vision talent is not buried in minutiae.",
  },
  "33": {
    theme: "Outward talent for compassionate teaching",
    traits: [
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
    traits: [
      "Privately wanting to lead",
      "Craving self-directed purpose",
      "Motivated by originality",
    ],
    practice:
      "Admit when you need solo time—soul urge 1 thrives when independence is planned, not stolen.",
  },
  "2": {
    theme: "Inner desire for harmony, love, and belonging",
    traits: [
      "Privately wanting peace in relationships",
      "Motivated by partnership",
      "Craving emotional attunement",
    ],
    practice:
      "Ask for reassurance directly instead of hoping others will guess.",
  },
  "3": {
    theme: "Inner desire for joy, creativity, and being heard",
    traits: [
      "Privately wanting playful expression",
      "Motivated by applause and delight",
      "Craving outlets for imagination",
    ],
    practice:
      "Schedule creative joy that is not performance for others’ approval alone.",
  },
  "4": {
    theme: "Inner desire for security, order, and earned stability",
    traits: [
      "Privately wanting solid ground",
      "Motivated by clear plans",
      "Craving dependable routines",
    ],
    practice:
      "Allow one intentional unknown each season so security does not become rigidity.",
  },
  "5": {
    theme: "Inner desire for freedom, novelty, and sensory experience",
    traits: [
      "Privately wanting open options",
      "Motivated by adventure and learning",
      "Craving change when life feels static",
    ],
    practice:
      "Negotiate freedom inside commitments—travel, study, or flexible hours—rather than fleeing structure entirely.",
  },
  "6": {
    theme: "Inner desire to nurture and be needed",
    traits: [
      "Privately wanting to care and beautify",
      "Motivated by family or community roles",
      "Craving harmonious homes and bonds",
    ],
    practice:
      "Notice when “being needed” replaces mutual care—receive as much as you give.",
  },
  "7": {
    theme: "Inner desire for truth, privacy, and meaning",
    traits: [
      "Privately wanting depth over small talk",
      "Motivated by understanding",
      "Craving solitude to think",
    ],
    practice:
      "Protect study time without ghosting loved ones—name your need for quiet.",
  },
  "8": {
    theme: "Inner desire for achievement, respect, and material mastery",
    traits: [
      "Privately wanting tangible success",
      "Motivated by influence and resources",
      "Craving recognition for capability",
    ],
    practice:
      "Define enough—celebrate non-status wins so desire for mastery stays healthy.",
  },
  "9": {
    theme: "Inner desire to serve a larger story",
    traits: [
      "Privately wanting to help humanity or arts",
      "Motivated by compassion",
      "Craving meaningful completion",
    ],
    practice:
      "Serve from overflow; keep personal dreams on the list, not only others’ needs.",
  },
  "11": {
    theme: "Inner desire to inspire and channel insight",
    traits: [
      "Privately wanting to illuminate",
      "Motivated by intuitive purpose",
      "Craving spiritual or creative voltage",
    ],
    practice:
      "Ground inspiration in body care before sharing every flash of insight.",
  },
  "22": {
    theme: "Inner desire to build something lasting for many",
    traits: [
      "Privately wanting legacy structures",
      "Motivated by practical idealism",
      "Craving impact at scale",
    ],
    practice:
      "Feed the desire with weekly brick-laying, not only grand future movies.",
  },
  "33": {
    theme: "Inner desire to heal and teach through love",
    traits: [
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
    traits: [
      "Appearing decisive or bold",
      "Social mask of independence",
      "Others may expect you to take charge",
    ],
    practice:
      "Soften openings with curiosity questions so strength does not read as distance.",
  },
  "2": {
    theme: "First impression of gentleness and approachability",
    traits: [
      "Appearing diplomatic or quiet",
      "Social mask of cooperativeness",
      "Others may expect you to yield",
    ],
    practice:
      "State preferences early so kindness is not mistaken for agreement.",
  },
  "3": {
    theme: "First impression of charm and expressive warmth",
    traits: [
      "Appearing witty or creative",
      "Social mask of optimism",
      "Others may expect entertainment",
    ],
    practice:
      "Allow quieter moods in public—you need not perform brightness every entrance.",
  },
  "4": {
    theme: "First impression of steadiness and practicality",
    traits: [
      "Appearing reliable or reserved",
      "Social mask of seriousness",
      "Others may expect structure from you",
    ],
    practice:
      "Show a playful detail occasionally so reliability does not read as rigidity.",
  },
  "5": {
    theme: "First impression of energy, restlessness, and open curiosity",
    traits: [
      "Appearing adventurous or changeable",
      "Social mask of freedom-loving wit",
      "Others may expect spontaneity",
    ],
    practice:
      "Signal follow-through early in new connections so versatility reads as trustable.",
  },
  "6": {
    theme: "First impression of warmth, care, and aesthetic sense",
    traits: [
      "Appearing nurturing or stylish",
      "Social mask of responsibility",
      "Others may expect you to host or help",
    ],
    practice:
      "Set help boundaries kindly so your warmth is not endlessly recruited.",
  },
  "7": {
    theme: "First impression of mystery, intellect, or reserve",
    traits: [
      "Appearing thoughtful or distant",
      "Social mask of privacy",
      "Others may expect depth—or misread aloofness",
    ],
    practice:
      "Offer a small personal detail early to invite connection without oversharing.",
  },
  "8": {
    theme: "First impression of authority and competence",
    traits: [
      "Appearing ambitious or polished",
      "Social mask of power",
      "Others may expect leadership or status cues",
    ],
    practice:
      "Lead with listening so competence does not intimidate allies.",
  },
  "9": {
    theme: "First impression of breadth, kindness, or worldliness",
    traits: [
      "Appearing wise or artistic",
      "Social mask of generosity",
      "Others may expect counsel or idealism",
    ],
    practice:
      "You may decline emotional labor—compassion includes choosing when to engage.",
  },
  "11": {
    theme: "First impression of intensity and inspired presence",
    traits: [
      "Appearing magnetic or sensitive",
      "Social mask of visionary energy",
      "Others may expect insight on demand",
    ],
    practice:
      "Protect nervous energy in crowds; intensity needs recovery after contact.",
  },
  "22": {
    theme: "First impression of capable ambition at scale",
    traits: [
      "Appearing as a builder or organizer",
      "Social mask of big-picture practicality",
      "Others may expect you to “make it happen”",
    ],
    practice:
      "Clarify scope before accepting every large ask that your presence attracts.",
  },
  "33": {
    theme: "First impression of nurturing wisdom",
    traits: [
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
    traits: [
      "Maturity clarifying personal authority",
      "Less need for external permission",
      "Initiative refined by experience",
    ],
    practice:
      "Mentor starters—your mature 1 energy teaches courage without competition.",
  },
  "2": {
    theme: "Later-life emphasis on wise partnership",
    traits: [
      "Maturity softening ego into alliance",
      "Diplomacy with clearer boundaries",
      "Patience that has earned its calm",
    ],
    practice:
      "Choose partnerships that honor your pace; maturity 2 need not absorb chaos.",
  },
  "3": {
    theme: "Later-life emphasis on seasoned creative voice",
    traits: [
      "Expression matured into craft",
      "Joy with less performance anxiety",
      "Communication used to uplift",
    ],
    practice:
      "Publish or teach what younger you practiced—maturity 3 shares the archive.",
  },
  "4": {
    theme: "Later-life emphasis on lasting systems and legacy structure",
    traits: [
      "Foundations that outlive urgency",
      "Craftsmanship as identity",
      "Order serving loved ones’ security",
    ],
    practice:
      "Simplify outdated routines; mature 4 keeps what works and retires the rest.",
  },
  "5": {
    theme: "Later-life emphasis on freedom with wisdom",
    traits: [
      "Change chosen rather than chased",
      "Travel or learning as mature enrichment",
      "Adaptability without restless escape",
    ],
    practice:
      "Design freedom rituals (study trips, sabbaticals) inside stable roots.",
  },
  "6": {
    theme: "Later-life emphasis on responsible love and stewardship of home",
    traits: [
      "Care refined by experience",
      "Family or community elder roles",
      "Harmony with healthier limits",
    ],
    practice:
      "Pass skills on; mature 6 multiplies care by teaching, not only doing.",
  },
  "7": {
    theme: "Later-life emphasis on distilled wisdom and quiet mastery",
    traits: [
      "Insight less noisy, more useful",
      "Spiritual or intellectual harvest",
      "Solitude as chosen richness",
    ],
    practice:
      "Write memoirs of method—mature 7 leaves maps, not only mysteries.",
  },
  "8": {
    theme: "Later-life emphasis on ethical power and resource legacy",
    traits: [
      "Ambition tempered into stewardship",
      "Recognition earned through character",
      "Material mastery serving others",
    ],
    practice:
      "Plan succession and generosity while you still enjoy building.",
  },
  "9": {
    theme: "Later-life emphasis on completion and wide-hearted mentoring",
    traits: [
      "Release of outdated identities",
      "Service as natural maturity",
      "Compassion with less attachment",
    ],
    practice:
      "Ritualize endings—mature 9 thrives when chapters close with gratitude.",
  },
  "11": {
    theme: "Later-life emphasis on grounded inspiration",
    traits: [
      "Intuition steadied by decades",
      "Teaching through presence",
      "Sensitivity managed with wisdom",
    ],
    practice:
      "Offer inspiration in measured doses; protect rest as sacred duty.",
  },
  "22": {
    theme: "Later-life emphasis on institutions and lasting builds",
    traits: [
      "Vision finally resourced",
      "Practical idealism realized",
      "Legacy architecture",
    ],
    practice:
      "Document blueprints so your mature 22 outlives any single project.",
  },
  "33": {
    theme: "Later-life emphasis on masterful compassionate teaching",
    traits: [
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
    traits: [
      "Name vibration leaning toward leadership",
      "Compound tones often amplify independence",
      "Presentation energy of the pioneer",
    ],
    practice:
      "Watch compound numbers in Chaldean readings—they color how 1 initiative arrives.",
  },
  "2": {
    theme: "Chaldean name tone of lunar receptivity and tact",
    traits: [
      "Name vibration favoring partnership",
      "Sensitivity encoded in the spelling",
      "Cooperative social frequency",
    ],
    practice:
      "If the compound is intense, pair soft 2 charm with clear yes/no language.",
  },
  "3": {
    theme: "Chaldean name tone of Jupiterian expansion and expression",
    traits: [
      "Name vibration of sociability and growth",
      "Optimism carried in the letters",
      "Creative speech frequency",
    ],
    practice:
      "Use the expansive name tone for teaching or publishing—not only chatter.",
  },
  "4": {
    theme: "Chaldean name tone of Rahu-linked disruption and rebuilding",
    traits: [
      "Name vibration that may feel unconventional",
      "Order learned through unusual paths",
      "Structure after upheaval themes",
    ],
    practice:
      "Channel restless 4/Rahu name energy into innovative systems, not chaos.",
  },
  "5": {
    theme: "Chaldean name tone of Mercury—commerce, wit, and motion",
    traits: [
      "Name vibration of quick mind and exchange",
      "Adaptability in how the name is heard",
      "Persuasive, mobile letter frequency",
    ],
    practice:
      "In Chaldean work, 5 often favors names suited to communication trades—practice clarity over cleverness alone.",
  },
  "6": {
    theme: "Chaldean name tone of Venusian harmony and attraction",
    traits: [
      "Name vibration of beauty and care",
      "Relational magnetism in the spelling",
      "Responsibility woven with charm",
    ],
    practice:
      "Align public presentation with Venusian grace without over-promising care.",
  },
  "7": {
    theme: "Chaldean name tone of Ketu-linked introspection",
    traits: [
      "Name vibration of mystery and study",
      "Detachment or spiritual bent in letters",
      "Analytical social frequency",
    ],
    practice:
      "Let the name’s quiet tone support expertise branding, not unexplained absence.",
  },
  "8": {
    theme: "Chaldean name tone of Saturnian duty and material gravity",
    traits: [
      "Name vibration of ambition under pressure",
      "Authority earned slowly",
      "Serious competence frequency",
    ],
    practice:
      "Pair Saturn name weight with kindness so power does not feel cold.",
  },
  "9": {
    theme: "Chaldean name tone of Martian drive and completion fire",
    traits: [
      "Name vibration of courage and push",
      "Broad or warrior-like letter energy",
      "Intensity in how the name lands",
    ],
    practice:
      "Direct Martian name heat into finished campaigns, not scattered battles.",
  },
  "11": {
    theme: "Chaldean compound often read as intuitive voltage (reduces toward 2)",
    traits: [
      "Heightened sensitivity in the name field",
      "Partnership themes under master flash",
      "Inspiration needing calm verification",
    ],
    practice:
      "Treat 11 as a compound spotlight—stabilize with 2’s cooperation habits.",
  },
  "22": {
    theme: "Chaldean compound of master building (reduces toward 4)",
    traits: [
      "Name field aiming at large structures",
      "Practical vision in the spelling story",
      "Ambition requiring method",
    ],
    practice:
      "Ground 22 compound energy in 4-style routines and ethical scopes.",
  },
  "33": {
    theme: "Chaldean compound of elevated care (reduces toward 6)",
    traits: [
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
    theme: "Moolank temperament of Sun—self-will and bright initiative",
    traits: [
      "Instinctive need to lead or stand out",
      "Day-to-day pride and drive",
      "Quick personal reactions of a solar type",
    ],
    practice:
      "Channel solar Moolank into morning routines and honest self-leadership—not dominance in every room.",
  },
  "2": {
    theme: "Moolank temperament of Moon—feeling, fluctuation, and care",
    traits: [
      "Instinctive emotional responsiveness",
      "Day-to-day mood sensitivity",
      "Need for reassurance and soft pacing",
    ],
    practice:
      "Track mood cycles; lunar Psychic types benefit from sleep and water-like flexibility.",
  },
  "3": {
    theme: "Moolank temperament of Jupiter—optimism, teaching, and growth",
    traits: [
      "Instinctive expansiveness",
      "Day-to-day advice-giving impulse",
      "Cheer and philosophical bent",
    ],
    practice:
      "Ask before advising—Jupiter Psychic warmth lands best with consent.",
  },
  "4": {
    theme: "Moolank temperament of Rahu—unconventional drive and restlessness",
    traits: [
      "Instinctive urge to break molds",
      "Day-to-day intensity or unusual tastes",
      "Ambition via non-traditional routes",
    ],
    practice:
      "Give Rahu Psychic energy a constructive “edge project” so restlessness has a lane.",
  },
  "5": {
    theme: "Moolank temperament of Mercury (Budh)—quick mind, speech, and trade",
    traits: [
      "Instinctive curiosity and verbal agility",
      "Day-to-day need for mental stimulation",
      "Restless intellect more than lifelong “freedom path” framing",
    ],
    practice:
      "For Psychic 5, prioritize clear communication habits and one deep study track—Mercury thrives on skill, not only novelty.",
  },
  "6": {
    theme: "Moolank temperament of Venus—comfort, beauty, and relationship focus",
    traits: [
      "Instinctive pull toward harmony and pleasure",
      "Day-to-day aesthetic or romantic sensitivity",
      "Caretaking as temperament, not only duty",
    ],
    practice:
      "Venus Psychic types do well with beauty rituals and fair relationship agreements.",
  },
  "7": {
    theme: "Moolank temperament of Ketu—inwardness, detachment, and insight",
    traits: [
      "Instinctive pull toward solitude or mysticism",
      "Day-to-day analytical or spiritual bent",
      "Disinterest in shallow social loops",
    ],
    practice:
      "Schedule solitude; Ketu Psychic clarity fades when over-stimulated without retreat.",
  },
  "8": {
    theme: "Moolank temperament of Saturn—discipline, delay, and seriousness",
    traits: [
      "Instinctive caution and endurance",
      "Day-to-day duty consciousness",
      "Slow-burn ambition under pressure",
    ],
    practice:
      "Saturn Psychic types benefit from patient goals and kindness toward their own pace.",
  },
  "9": {
    theme: "Moolank temperament of Mars—heat, courage, and reactive drive",
    traits: [
      "Instinctive assertion or impatience",
      "Day-to-day competitive or protective energy",
      "Action-first emotional style",
    ],
    practice:
      "Cool Mars Psychic heat with sport, breath, or timed pauses before hard talks.",
  },
  "11": {
    theme: "Often reduced in Vedic practice; held here as heightened lunar sensitivity",
    traits: [
      "Psychic intensity beyond ordinary 2",
      "Strong intuitive day-reactions",
      "Need for grounding rituals",
    ],
    practice:
      "Treat 11 as amplified Moon themes—stabilize with 2’s partnership and rest habits.",
  },
  "22": {
    theme: "Often reduced in Vedic practice; held here as heavy Rahu-scale drive",
    traits: [
      "Oversized unconventional ambition",
      "Pressure to build strangely and largely",
      "Temperament of restless construction",
    ],
    practice:
      "Reduce overwhelm by mapping big urges onto 4-style daily methods.",
  },
  "33": {
    theme: "Often reduced in Vedic practice; held here as elevated Venusian care",
    traits: [
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
    theme: "Bhagyank path of Sun—authority, recognition, and self-made direction",
    traits: [
      "Outer life themes of leadership",
      "Destiny flavor of visibility",
      "Path asking for honest self-rule",
    ],
    practice:
      "Build reputation through consistent solar virtue—clarity, courage, fairness.",
  },
  "2": {
    theme: "Bhagyank path of Moon—alliances, public mood, and supportive roles",
    traits: [
      "Outer life themes of partnership",
      "Destiny flavor of care and diplomacy",
      "Path through people and timing",
    ],
    practice:
      "Choose environments that respect sensitivity; destiny 2 grows via right company.",
  },
  "3": {
    theme: "Bhagyank path of Jupiter—growth, teaching, and expansive fortune themes",
    traits: [
      "Outer life themes of learning and guidance",
      "Destiny flavor of optimism and counsel",
      "Path through wisdom shared",
    ],
    practice:
      "Invest in education or mentoring lanes where Jupiter destiny naturally expands.",
  },
  "4": {
    theme: "Bhagyank path of Rahu—unconventional success and foreign or novel arenas",
    traits: [
      "Outer life themes outside the expected script",
      "Destiny flavor of disruption then establishment",
      "Path through unusual industries or places",
    ],
    practice:
      "Commit to one unconventional lane long enough for Rahu destiny to stabilize.",
  },
  "5": {
    theme: "Bhagyank path of Mercury—commerce, networking, and skilled exchange",
    traits: [
      "Outer life themes of trade, media, or mobility",
      "Destiny flavor of wit applied to livelihood",
      "Path through adaptable professional networks",
    ],
    practice:
      "Destiny 5 favors careers of communication and exchange—build reputation for reliable information, not only novelty.",
  },
  "6": {
    theme: "Bhagyank path of Venus—arts, comfort industries, and relational success",
    traits: [
      "Outer life themes of beauty, care, or luxury service",
      "Destiny flavor of harmony and attraction",
      "Path through cultivated taste and bonds",
    ],
    practice:
      "Align livelihood with Venusian strengths while keeping fair contracts.",
  },
  "7": {
    theme: "Bhagyank path of Ketu—research, spirituality, and specialized mastery",
    traits: [
      "Outer life themes of expertise or detachment from fame",
      "Destiny flavor of inward achievement",
      "Path through niche knowledge",
    ],
    practice:
      "Let destiny 7 specialize deeply; public polish can be secondary to mastery.",
  },
  "8": {
    theme: "Bhagyank path of Saturn—long labor, authority, and hard-won status",
    traits: [
      "Outer life themes of duty and endurance",
      "Destiny flavor of delayed but solid gains",
      "Path through responsibility under pressure",
    ],
    practice:
      "Respect Saturn timing—steady years compound more than shortcuts.",
  },
  "9": {
    theme: "Bhagyank path of Mars—courageous action, competition, and bold service",
    traits: [
      "Outer life themes of drive and protection",
      "Destiny flavor of pioneering struggle then victory",
      "Path through assertive missions",
    ],
    practice:
      "Aim Mars destiny at worthy contests; finish campaigns before starting new wars.",
  },
  "11": {
    theme: "Often reduced in Vedic practice; held as intensified lunar destiny",
    traits: [
      "Outer path with strong intuitive calling",
      "Public sensitivity",
      "Partnership destiny amplified",
    ],
    practice:
      "Stabilize with Moon/2 practices—allies, rest, and emotional hygiene.",
  },
  "22": {
    theme: "Often reduced in Vedic practice; held as monumental Rahu-scale destiny",
    traits: [
      "Outer path aiming at large unusual builds",
      "Heavy responsibility themes",
      "Destiny pressure to materialize vision",
    ],
    practice:
      "Use project management discipline so 22-scale destiny does not scatter.",
  },
  "33": {
    theme: "Often reduced in Vedic practice; held as destiny of elevated care",
    traits: [
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
    traits: [
      "Spelling vibration toward leadership",
      "Name heard as confident",
      "Solar branding in introductions",
    ],
    practice:
      "Use clear, decisive self-introduction language that matches solar Namank.",
  },
  "2": {
    theme: "Namank of Moon—name frequency of softness and receptivity",
    traits: [
      "Spelling vibration toward approachability",
      "Name heard as gentle or artistic",
      "Lunar branding in relationships",
    ],
    practice:
      "Pair soft Namank with firm signature lines so kindness still reads capable.",
  },
  "3": {
    theme: "Namank of Jupiter—name frequency of wisdom and expansion",
    traits: [
      "Spelling vibration toward teaching or counsel",
      "Name heard as optimistic",
      "Growth-oriented branding",
    ],
    practice:
      "Let bios and titles reflect learning and generosity—Jupiter Namank themes.",
  },
  "4": {
    theme: "Namank of Rahu—name frequency of novelty and edge",
    traits: [
      "Spelling vibration that may feel modern or unusual",
      "Name heard as distinctive",
      "Unconventional personal brand",
    ],
    practice:
      "Own the unusual spelling energy with a clear niche story.",
  },
  "5": {
    theme: "Namank of Mercury—name frequency of wit, trade, and messages",
    traits: [
      "Spelling vibration favoring communication brands",
      "Name heard as clever or mobile",
      "Mercurial networking tone—not the same as Moolank temperament alone",
    ],
    practice:
      "For Namank 5, polish how the written name appears in email and media—Mercury lives in messages.",
  },
  "6": {
    theme: "Namank of Venus—name frequency of charm and harmony",
    traits: [
      "Spelling vibration of attractiveness and care",
      "Name heard as pleasant or artistic",
      "Relational branding",
    ],
    practice:
      "Align visual identity (typography, colors) with Venus Namank grace.",
  },
  "7": {
    theme: "Namank of Ketu—name frequency of mystery and expertise",
    traits: [
      "Spelling vibration of depth or rarity",
      "Name heard as private or scholarly",
      "Specialist branding",
    ],
    practice:
      "Let the name signal niche mastery; avoid oversharing in first impressions.",
  },
  "8": {
    theme: "Namank of Saturn—name frequency of gravitas and duty",
    traits: [
      "Spelling vibration of seriousness",
      "Name heard as authoritative or heavy",
      "Endurance branding",
    ],
    practice:
      "Soften Saturn Namank in customer-facing copy with human warmth.",
  },
  "9": {
    theme: "Namank of Mars—name frequency of drive and bold presence",
    traits: [
      "Spelling vibration of force and courage",
      "Name heard as strong or intense",
      "Action branding",
    ],
    practice:
      "Direct Martian name energy into clear calls-to-action, not aggression.",
  },
  "11": {
    theme: "Elevated name frequency often read with lunar/2 undertones",
    traits: [
      "Name field of inspired sensitivity",
      "Brand of intuition",
      "Partnership undertones",
    ],
    practice:
      "Ground inspired branding with consistent, simple messaging.",
  },
  "22": {
    theme: "Elevated name frequency of builder ambition",
    traits: [
      "Name field aiming at scale",
      "Brand of practical vision",
      "Institutional undertones",
    ],
    practice:
      "Match big-name energy with proof of delivery.",
  },
  "33": {
    theme: "Elevated name frequency of teaching care",
    traits: [
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
    traits: [
      "Timing for initiative",
      "Fresh identity experiments",
      "Less waiting, more starting",
    ],
    practice:
      "Launch one meaningful start; do not overload the cycle with ten openings.",
  },
  "2": {
    theme: "A cycle of patience, alliance, and quiet progress",
    traits: [
      "Timing for collaboration",
      "Emotional attunement windows",
      "Slower visible results",
    ],
    practice:
      "Measure progress in relationships and prep work, not only headlines.",
  },
  "3": {
    theme: "A cycle of expression, learning, and social exchange",
    traits: [
      "Timing for creative output",
      "Networking and study",
      "Lighter, more vocal months/years",
    ],
    practice:
      "Publish or perform something small—cycles of 3 love visible expression.",
  },
  "4": {
    theme: "A cycle of foundations, routines, and practical building",
    traits: [
      "Timing for systems and health habits",
      "Work-before-reward pacing",
      "Simplifying commitments",
    ],
    practice:
      "Fix one infrastructure item (budget, sleep, tools) this cycle.",
  },
  "5": {
    theme: "A cycle of change, movement, and experimentation",
    traits: [
      "Timing for travel, pivots, and trials",
      "Freedom themes in the calendar",
      "Less tolerance for stagnation",
    ],
    practice:
      "Choose conscious change—update plans deliberately rather than scattering energy.",
  },
  "6": {
    theme: "A cycle of home, care, and relationship harmony",
    traits: [
      "Timing for family and duty",
      "Aesthetic or domestic focus",
      "Service requests increase",
    ],
    practice:
      "Balance yeses with rest; caretaking cycles need scheduled recovery.",
  },
  "7": {
    theme: "A cycle of reflection, skill refinement, and inner clarity",
    traits: [
      "Timing for study and assessment",
      "Quieter social appetite",
      "Quality over quantity",
    ],
    practice:
      "Protect deep-work blocks; avoid forcing loud productivity in a 7 cycle.",
  },
  "8": {
    theme: "A cycle of recognition, stewardship, and measurable progress",
    traits: [
      "Timing for business and authority themes",
      "Results come into view",
      "Resource decisions matter more",
    ],
    practice:
      "Track numbers ethically; ambition cycles reward organized effort.",
  },
  "9": {
    theme: "A cycle of completion, generosity, and release",
    traits: [
      "Timing for endings and clear-outs",
      "Mentoring or giving back",
      "Space-making before the next 1",
    ],
    practice:
      "Close loops—projects, clutter, outdated roles—before forcing new starts.",
  },
  "11": {
    theme: "A heightened inspirational cycle (often lived with 2 undertones)",
    traits: [
      "Timing for insight and visibility of ideas",
      "Nervous-system sensitivity up",
      "Inspiration needing rest",
    ],
    practice:
      "Share ideas, then recover—11 cycles punish chronic overstimulation.",
  },
  "22": {
    theme: "A practical visionary cycle (often lived with 4 undertones)",
    traits: [
      "Timing for large yet grounded builds",
      "Coordination of many parts",
      "Patience with scale",
    ],
    practice:
      "Use project plans; 22 cycles reward engineering, not only dreaming.",
  },
  "33": {
    theme: "A compassionate teaching cycle (often lived with 6 undertones)",
    traits: [
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
  return map[value] ?? null;
}
