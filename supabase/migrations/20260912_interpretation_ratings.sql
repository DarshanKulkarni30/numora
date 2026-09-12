-- Panel ratings for interpretation learning (anonymous analysis later).
-- Safe to re-run.

create table if not exists public.interpretation_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  panel_id text not null,
  interpretation_version text not null,
  numbers jsonb not null default '{}'::jsonb,
  rating smallint not null check (rating between 1 and 5),
  feedback_type text not null default 'panel',
  created_at timestamptz not null default now()
);

create index if not exists interpretation_ratings_panel_version_idx
  on public.interpretation_ratings (panel_id, interpretation_version);

create index if not exists interpretation_ratings_user_created_idx
  on public.interpretation_ratings (user_id, created_at desc);

alter table public.interpretation_ratings enable row level security;

drop policy if exists "Users read own interpretation ratings" on public.interpretation_ratings;
create policy "Users read own interpretation ratings"
  on public.interpretation_ratings for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own interpretation ratings" on public.interpretation_ratings;
create policy "Users insert own interpretation ratings"
  on public.interpretation_ratings for insert
  with check (auth.uid() = user_id);

grant select, insert on public.interpretation_ratings to authenticated;
grant all on public.interpretation_ratings to service_role;
