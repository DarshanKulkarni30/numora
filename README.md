# Numerora

Reflective numerology web app: Pythagorean, Chaldean, Vedic, and Lo Shu readings from a full name and date of birth (DD/MM/YYYY).

Belief-based self-reflection only — not scientific, medical, legal, financial, or psychological advice.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Deterministic calculation engines (no LLM)
- Supabase Auth (email magic link) + Postgres for saved reports
- Free tier: on-screen reports with best-effort copy protection (PDF later for paid)

## Setup

```bash
npm install
cp .env.local.example .env.local
```

1. Create a Supabase project.
2. Put URL + anon key in `.env.local`.
3. Run `supabase/schema.sql` in the SQL editor.
4. Auth → enable Email provider / magic link.
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

## Note on copy protection

Selection, copy shortcuts, context menu, and print are discouraged in the report UI. Determined users can still capture content; PDF export is reserved for a future paid plan.
