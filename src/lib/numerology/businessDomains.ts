/**
 * Business-domain digit preferences for reflective company / mobile fit.
 * NumoraWisdom-original synthesis—not legal, financial, or “lucky number” advice.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import type { TrioBand } from "./trioMatrix";

export type DomainFit = "favourable" | "neutral" | "careful";

export type BusinessDomain = {
  id: string;
  label: string;
  blurb: string;
  preferredNameDigits: number[];
  carefulNameDigits: number[];
  preferredMobileDigits: number[];
  carefulMobileDigits: number[];
};

export const BUSINESS_DOMAINS: BusinessDomain[] = [
  {
    id: "tech",
    label: "Tech / SaaS",
    blurb: "Build, iterate, and ship ideas—communication and novelty matter.",
    preferredNameDigits: [1, 3, 5, 7],
    carefulNameDigits: [4, 8],
    preferredMobileDigits: [1, 3, 5],
    carefulMobileDigits: [2, 6],
  },
  {
    id: "finance",
    label: "Finance / Banking",
    blurb: "Trust, structure, and long-game accountability.",
    preferredNameDigits: [4, 6, 8],
    carefulNameDigits: [5, 7],
    preferredMobileDigits: [4, 8, 6],
    carefulMobileDigits: [3, 9],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    blurb: "Care, precision, and steady service under pressure.",
    preferredNameDigits: [2, 6, 9],
    carefulNameDigits: [1, 8],
    preferredMobileDigits: [2, 6, 9],
    carefulMobileDigits: [5, 7],
  },
  {
    id: "education",
    label: "Education / Training",
    blurb: "Teaching, growth, and clear explanation.",
    preferredNameDigits: [3, 5, 7, 9],
    carefulNameDigits: [4, 8],
    preferredMobileDigits: [3, 5, 7],
    carefulMobileDigits: [8],
  },
  {
    id: "retail",
    label: "Retail / E-commerce",
    blurb: "Traffic, offers, and everyday buyer rhythm.",
    preferredNameDigits: [3, 5, 6],
    carefulNameDigits: [7],
    preferredMobileDigits: [3, 5, 6, 9],
    carefulMobileDigits: [4, 8],
  },
  {
    id: "food",
    label: "Food / Hospitality",
    blurb: "Warmth, taste, and people-facing energy.",
    preferredNameDigits: [2, 3, 6],
    carefulNameDigits: [8],
    preferredMobileDigits: [2, 3, 6, 9],
    carefulMobileDigits: [7],
  },
  {
    id: "creative",
    label: "Creative / Media",
    blurb: "Story, image, and expressive reach.",
    preferredNameDigits: [3, 5, 6, 9],
    carefulNameDigits: [4],
    preferredMobileDigits: [3, 5, 9],
    carefulMobileDigits: [8],
  },
  {
    id: "legal",
    label: "Legal / Consulting",
    blurb: "Counsel, clarity, and careful positioning.",
    preferredNameDigits: [1, 5, 7, 8],
    carefulNameDigits: [2, 9],
    preferredMobileDigits: [1, 5, 7, 8],
    carefulMobileDigits: [3, 6],
  },
  {
    id: "realestate",
    label: "Real estate",
    blurb: "Assets, place, and durable deals.",
    preferredNameDigits: [4, 6, 8],
    carefulNameDigits: [5],
    preferredMobileDigits: [4, 6, 8, 2],
    carefulMobileDigits: [7, 9],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    blurb: "Process, quality, and physical output.",
    preferredNameDigits: [4, 8, 9],
    carefulNameDigits: [5, 7],
    preferredMobileDigits: [4, 8],
    carefulMobileDigits: [3, 5],
  },
  {
    id: "logistics",
    label: "Logistics / Transport",
    blurb: "Movement, timing, and reliable networks.",
    preferredNameDigits: [1, 5, 8, 9],
    carefulNameDigits: [2, 7],
    preferredMobileDigits: [1, 5, 8, 9],
    carefulMobileDigits: [6],
  },
  {
    id: "wellness",
    label: "Wellness / Beauty",
    blurb: "Care of body and image with a gentle brand tone.",
    preferredNameDigits: [2, 6, 9],
    carefulNameDigits: [8],
    preferredMobileDigits: [2, 6, 9],
    carefulMobileDigits: [4, 8],
  },
  {
    id: "nonprofit",
    label: "Non-profit / Social",
    blurb: "Mission, community, and service-first framing.",
    preferredNameDigits: [2, 6, 9, 7],
    carefulNameDigits: [1, 8],
    preferredMobileDigits: [2, 6, 9],
    carefulMobileDigits: [5],
  },
  {
    id: "general",
    label: "General services",
    blurb: "Broad service work—flexibility over a narrow niche tone.",
    preferredNameDigits: [1, 3, 5, 6],
    carefulNameDigits: [7],
    preferredMobileDigits: [1, 3, 5, 6],
    carefulMobileDigits: [4, 8],
  },
];

export function getBusinessDomain(id: string): BusinessDomain {
  return (
    BUSINESS_DOMAINS.find((d) => d.id === id) ??
    BUSINESS_DOMAINS[BUSINESS_DOMAINS.length - 1]
  );
}

export function domainFit(
  digit: number | string,
  domain: BusinessDomain,
  kind: "name" | "mobile",
): DomainFit {
  const n = reduceToSingleDigit(Number(digit));
  const preferred =
    kind === "name" ? domain.preferredNameDigits : domain.preferredMobileDigits;
  const careful =
    kind === "name" ? domain.carefulNameDigits : domain.carefulMobileDigits;
  if (preferred.includes(n)) return "favourable";
  if (careful.includes(n)) return "careful";
  return "neutral";
}

function digitDistance(a: number, b: number): number {
  const x = reduceToSingleDigit(a);
  const y = reduceToSingleDigit(b);
  const d = Math.abs(x - y);
  return Math.min(d, 9 - d);
}

/**
 * Company name digit vs mobile digit, weighted by domain preferences.
 */
export function companyMobileHarmony(
  companyDigit: number | string,
  mobileDigit: number | string,
  domain: BusinessDomain,
): { band: TrioBand; label: string; summary: string } {
  const c = reduceToSingleDigit(Number(companyDigit));
  const m = reduceToSingleDigit(Number(mobileDigit));
  const nameFit = domainFit(c, domain, "name");
  const mobileFit = domainFit(m, domain, "mobile");
  const dist = digitDistance(c, m);
  const same = c === m;

  let band: TrioBand = "neutral";
  let label = "Steady";

  if (same && nameFit === "favourable" && mobileFit !== "careful") {
    band = "amazing";
    label = "Aligned";
  } else if (
    (same || dist <= 1) &&
    nameFit !== "careful" &&
    mobileFit !== "careful"
  ) {
    band = "favourable";
    label = "Supportive";
  } else if (nameFit === "careful" && mobileFit === "careful") {
    band = "block";
    label = "Heavy";
  } else if (nameFit === "careful" || mobileFit === "careful" || dist >= 3) {
    band = "friction";
    label = "Mixed";
  } else if (nameFit === "favourable" || mobileFit === "favourable") {
    band = "favourable";
    label = "Supportive";
  }

  const summary =
    band === "amazing"
      ? `Company name ${c} and mobile ${m} land on the same preferred tone for ${domain.label}.`
      : band === "favourable"
        ? `Company ${c} and mobile ${m} sit reasonably together for ${domain.label}—use as a branding cue, not a guarantee.`
        : band === "friction"
          ? `Company ${c} and mobile ${m} pull in different directions for ${domain.label}; simplify one layer if both feel noisy.`
          : band === "block"
            ? `Both layers hit careful digits for ${domain.label}. Reflective flag to revisit spelling or number choice—not a ban.`
            : `Company ${c} and mobile ${m} are workable for ${domain.label}; ordinary effort still matters.`;

  return { band, label, summary };
}

/** Digit vs owner's core number: exact = favourable, close = neutral, far = careful. */
export function coreDigitFit(
  candidate: number | string,
  core: number | string,
): DomainFit {
  const a = reduceToSingleDigit(Number(candidate));
  const b = reduceToSingleDigit(Number(core));
  if (a === b) return "favourable";
  if (digitDistance(a, b) <= 1) return "neutral";
  return "careful";
}

export const DOMAIN_FIT_WORD: Record<DomainFit, string> = {
  favourable: "Often easier",
  neutral: "Neutral",
  careful: "Needs care",
};

export const DOMAIN_FIT_STYLE: Record<DomainFit, string> = {
  favourable: "border-emerald-300 bg-emerald-50 text-emerald-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  careful: "border-amber-300 bg-amber-50 text-amber-950",
};
