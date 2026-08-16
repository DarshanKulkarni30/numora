-- NumoraWisdom admin console (run in Supabase SQL editor)
-- Additive / IF NOT EXISTS — safe to re-run.

-- Admin roster (roles beyond hardcoded bootstrap email)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('superadmin', 'operator', 'support', 'billing')),
  active boolean not null default true,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.admin_users (email, role, created_by)
values ('darshan.kulkarni30@gmail.com', 'superadmin', 'seed')
on conflict (email) do update set role = excluded.role, active = true;

-- Block / unblock
create table if not exists public.user_moderation (
  user_id uuid primary key references auth.users (id) on delete cascade,
  blocked_at timestamptz,
  blocked_reason text,
  blocked_by text,
  updated_at timestamptz not null default now()
);

-- Support notes on a user
create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_notes_user_id_idx
  on public.admin_notes (user_id, created_at desc);

-- Append-only admin action log
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  action text not null,
  target_user_id uuid,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

-- Issue / ticket queue
create table if not exists public.admin_issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  title text not null,
  body text not null default '',
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  assignee_email text,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_issues_status_idx
  on public.admin_issues (status, updated_at desc);

-- Product activity events (server-written)
create table if not exists public.app_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  event_type text not null,
  path text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_activity_events_created_idx
  on public.app_activity_events (created_at desc);

create index if not exists app_activity_events_user_idx
  on public.app_activity_events (user_id, created_at desc);

-- RLS: deny client access; service role bypasses RLS
alter table public.admin_users enable row level security;
alter table public.user_moderation enable row level security;
alter table public.admin_notes enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.admin_issues enable row level security;
alter table public.app_activity_events enable row level security;
