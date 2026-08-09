/** Modern profession ideas by Expression / Life Path — reflective suggestions only. */

const BY_NUMBER: Record<number, string[]> = {
  1: [
    "Product manager",
    "Startup founder / indie maker",
    "Entrepreneur",
    "Project lead",
    "Sales director",
    "UX strategy lead",
    "Military / civil services leadership track",
    "Athlete coach",
  ],
  2: [
    "HR business partner",
    "Mediator / ombuds facilitator",
    "Therapist assistant roles (with credentials)",
    "Customer success manager",
    "Diplomat / policy aide",
    "Nurse / care coordinator",
    "Partnerships manager",
    "Editor / collaborator",
  ],
  3: [
    "Content creator / YouTuber",
    "Copywriter",
    "Teacher / trainer",
    "Brand storyteller",
    "Podcaster",
    "Performing artist",
    "Social media strategist",
    "Event host / MC",
  ],
  4: [
    "Software engineer",
    "Operations manager",
    "Accountant / financial controller",
    "Architect / urban planner",
    "Quality assurance lead",
    "Civil engineer",
    "Supply-chain analyst",
    "Project scheduler / PMO",
  ],
  5: [
    "Travel / tourism specialist",
    "Journalist / field reporter",
    "Growth marketer",
    "UX researcher",
    "Flight crew / logistics",
    "Sales enablement",
    "Language teacher",
    "Adventure / outdoor guide",
  ],
  6: [
    "Interior designer",
    "School counselor (credentialed)",
    "Hospitality manager",
    "Community manager",
    "Nutrition / wellness coach (credentialed)",
    "HR culture lead",
    "Florist / aesthetic brand founder",
    "Family law support roles (credentialed)",
  ],
  7: [
    "Data scientist",
    "Researcher / analyst",
    "Cybersecurity specialist",
    "Academic / scholar",
    "Librarian / archivist",
    "Strategy consultant",
    "Technical writer",
    "Meditation / contemplative facilitator (non-clinical)",
  ],
  8: [
    "Finance manager / CFA track",
    "COO / operations executive",
    "Real-estate developer",
    "Management consultant",
    "Banking / fintech product owner",
    "Legal practice manager (credentialed law)",
    "Executive recruiter",
    "Business owner / franchise lead",
  ],
  9: [
    "Nonprofit program director",
    "ESG / sustainability lead",
    "Mentor / coach (non-clinical)",
    "Humanitarian project coordinator",
    "Arts curator",
    "Social entrepreneur",
    "Public health educator (credentialed)",
    "Documentary producer",
  ],
  11: [
    "Inspirational speaker",
    "Brand visionary",
    "Innovation facilitator",
    "Creative director",
    "Spiritual / reflective workshop host (non-clinical)",
    "Counseling psychologist (only with license)",
  ],
  22: [
    "Systems architect",
    "Infrastructure program director",
    "City / civic project builder",
    "Large-scale product ops",
    "Impact investment lead",
    "Enterprise transformation lead",
  ],
  33: [
    "Educator / curriculum designer",
    "Community healing arts facilitator (non-clinical)",
    "Youth program director",
    "Compassionate leadership coach (non-clinical)",
    "Creative arts therapist (only with credentials)",
  ],
};

function uniq(list: string[]): string[] {
  return [...new Set(list)];
}

export function modernProfessionsFor(
  lifePath: number,
  expression: number,
): string[] {
  const primary = BY_NUMBER[expression] ?? BY_NUMBER[lifePath] ?? [];
  const secondary = BY_NUMBER[lifePath] ?? [];
  return uniq([...primary, ...secondary]).slice(0, 12);
}

export const CAREER_DISCLAIMER =
  "Profession ideas are optional, belief-based brainstorming prompts—not job guarantees, aptitude tests, or hiring advice. Credentials and local laws apply for regulated fields.";
