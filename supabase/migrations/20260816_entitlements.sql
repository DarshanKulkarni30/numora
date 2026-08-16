-- NumoraWisdom entitlements prep (run in Supabase SQL editor)
-- Safe to re-run: uses IF NOT EXISTS / additive alters.

-- Billing-ready plan row per user (Stripe fields nullable until checkout ships)
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

drop policy if exists "Users read own entitlements" on public.user_entitlements;
create policy "Users read own entitlements"
  on public.user_entitlements for select
  using (auth.uid() = user_id);

-- Identity edit budget on people
alter table public.people
  add column if not exists identity_edit_count integer not null default 0;

alter table public.people
  add column if not exists identity_confirmed_at timestamptz;
