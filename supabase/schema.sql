-- Numerora: run in Supabase SQL editor

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  preferred_name text default '',
  date_of_birth text not null,
  age integer not null,
  report_type text not null,
  snapshot jsonb not null,
  report jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_id_created_at_idx
  on public.reports (user_id, created_at desc);

alter table public.reports enable row level security;

create policy "Users read own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Users insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users delete own reports"
  on public.reports for delete
  using (auth.uid() = user_id);
