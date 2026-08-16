-- NumoraWisdom terms acceptance (run in Supabase SQL editor)
-- Safe to re-run.

create table if not exists public.user_terms_acceptance (
  user_id uuid primary key references auth.users (id) on delete cascade,
  terms_version text not null,
  accepted_at timestamptz not null default now()
);

alter table public.user_terms_acceptance enable row level security;

drop policy if exists "Users read own terms acceptance" on public.user_terms_acceptance;
create policy "Users read own terms acceptance"
  on public.user_terms_acceptance for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own terms acceptance" on public.user_terms_acceptance;
create policy "Users insert own terms acceptance"
  on public.user_terms_acceptance for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own terms acceptance" on public.user_terms_acceptance;
create policy "Users update own terms acceptance"
  on public.user_terms_acceptance for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
