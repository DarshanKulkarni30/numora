-- Incremental: people table only (safe if reports already exists)

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  is_self boolean not null default false,
  relationship text not null default 'Self',
  full_name text not null default '',
  preferred_name text not null default '',
  date_of_birth text not null default '',
  gender text not null default '',
  purpose text not null default '',
  sort_order integer not null default 0,
  name_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists people_user_id_sort_idx
  on public.people (user_id, sort_order);

alter table public.people enable row level security;

drop policy if exists "Users read own people" on public.people;
drop policy if exists "Users insert own people" on public.people;
drop policy if exists "Users update own people" on public.people;
drop policy if exists "Users delete own people" on public.people;

create policy "Users read own people"
  on public.people for select
  using (auth.uid() = user_id);

create policy "Users insert own people"
  on public.people for insert
  with check (auth.uid() = user_id);

create policy "Users update own people"
  on public.people for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own people"
  on public.people for delete
  using (auth.uid() = user_id);
