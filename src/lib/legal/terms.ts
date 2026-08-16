import { BRAND_NAME } from "@/lib/site";

/** Bump to force re-acceptance. */
export const CURRENT_TERMS_VERSION = "v1";

export const TERMS_TITLE = `${BRAND_NAME} Terms of Use (Draft ${CURRENT_TERMS_VERSION})`;

/**
 * Product-draft terms — not lawyer-certified. Versioned for re-accept flows.
 */
export const TERMS_SECTIONS: { heading: string; body: string }[] = [
  {
    heading: "1. Personal reflective use",
    body: `${BRAND_NAME} provides belief-based numerology tools for personal reflection. Content is not medical, legal, financial, educational, or psychological advice and does not predict events or outcomes.`,
  },
  {
    heading: "2. Proprietary materials — no copying or replication",
    body: `You may not copy, scrape, download in bulk, reverse engineer, republish, resell, or recreate ${BRAND_NAME} proprietary information. This includes specialized visuals, report layouts, letter maps and master tables, Birth×Destiny×Name trio grids, Lo Shu and Vedic chart presentations, suggested-name banks, calculation breakdowns, Learning curriculum structure and copy, and any other distinctive product design or data compilations.`,
  },
  {
    heading: "3. No competitive cloning",
    body: `You may not use the Service to build a competing product, train models on our outputs for redistribution, or systematically extract our methods, tables, or UI patterns for commercial reuse.`,
  },
  {
    heading: "4. Account and access",
    body: `You are responsible for activity under your account. We may suspend access for abuse, scraping, sharing credentials, or violating these Terms.`,
  },
  {
    heading: "5. Intellectual property",
    body: `All rights in the Service, branding, software, and content remain with ${BRAND_NAME} and its operators. Limited personal use of your own reports is allowed; wholesale reproduction is not.`,
  },
  {
    heading: "6. Disclaimer and limitation",
    body: `The Service is provided as-is. To the fullest extent permitted by law, operators accept no liability for decisions made from reflective readings or for any loss arising from use or inability to use the Service.`,
  },
  {
    heading: "7. Changes",
    body: `We may update these Terms. Material updates may require you to accept a new version before continuing to use the app.`,
  },
];
