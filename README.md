# NumoraWisdom

Reflective numerology web app: Pythagorean, Chaldean, Vedic, and Lo Shu readings from a full name and date of birth (DD/MM/YYYY).

Belief-based self-reflection only — not scientific, medical, legal, financial, or psychological advice.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Traditional numerology calculation engines
- Supabase Auth (email magic link / Google) + Postgres for saved reports and profiles
- Entitlements layer prepared for Free / Week Pass / prepaid packs (Stripe not wired yet)

## Plans (product)

| Plan | Profiles | Highlights |
|------|----------|------------|
| Free | 1 (Self) | Report, name/family/trivia, mobile; view-only |
| Week Pass ($20) | 4 | Full tools for 7 days |
| Packs ($15 / $27 / $50 / $90) | 6 | 3 / 6 / 12 / 24 months |
| Admin | 12 | Internal testing email |

Set `ENTITLEMENTS_ENFORCE=true` to apply Free limits. Default `false` = open beta for testers.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

1. Create a Supabase project.
2. Put URL + anon key in `.env.local`.
3. Run `supabase/schema.sql` (and `supabase/migrations/20260816_entitlements.sql` if upgrading an existing DB).
4. Auth → enable Email / Google.
5. Add redirect URL: `http://localhost:3000/auth/callback` (and production URL later).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Purpose              |
|----------------|----------------------|
| `npm run dev`  | Local development    |
| `npm run build`| Production build     |
| `npm run start`| Serve production     |

## Copy protection / PDF

Free reports discourage selection, copy shortcuts, context menu, and print. Paid / open-beta entitlements can **Export PDF** (multi-page summary download via jsPDF). Soft launch with `ENTITLEMENTS_ENFORCE=false` includes PDF for testers.

Until product launch, report text is selectable/copyable (`NEXT_PUBLIC_ALLOW_REPORT_COPY` defaults on). Set `NEXT_PUBLIC_ALLOW_REPORT_COPY=false` at launch to restore Free-plan copy protection.
