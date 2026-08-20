-- Numora: run in Supabase SQL editor

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

-- Saved people for readings (slot caps are plan-based in app code)
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
  identity_edit_count integer not null default 0,
  identity_confirmed_at timestamptz,
  name_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists people_user_id_sort_idx
  on public.people (user_id, sort_order);

alter table public.people enable row level security;

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

-- Billing-ready entitlements (Stripe fields nullable until checkout ships)
create table if not exists public.user_entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan_id text not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_entitlements enable row level security;

create policy "Users read own entitlements"
  on public.user_entitlements for select
  using (auth.uid() = user_id);

-- Terms acceptance (also stored on auth.users.user_metadata if this table is missing)
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

grant select, insert, update on public.user_terms_acceptance to authenticated;
grant all on public.user_terms_acceptance to service_role;
