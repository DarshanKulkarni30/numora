---
name: public-figure-research
description: >-
  Expands Numora’s public-figure gold set from Wikidata events and date-number
  engines. Use when adding celebrities, matching Personal Years to awards or
  marriages, or editing the admin research dashboard.
---

# Public-figure research (Numora)

Follow the personal skill `public-figure-research` on this machine.

- Seeds: `src/data/research/public-figure-seeds.json`
- Pipeline: `npx tsx scripts/research-public-figures.ts`
- Gold output: `src/data/research/public-figures.gold.json`
- Admin UI: `/admin/research` (superadmin)

Wikidata only. Date numbers only. No invented events. Not a public prediction feature.

Cap ~24 dated events per person. Click a name on `/admin/research` for that person’s Personal Year strip and Pinnacle chapters.
