-- Later legal / marriage names on a person (birth-certificate full_name stays natal).
-- Safe to re-run.

alter table public.people
  add column if not exists name_history jsonb not null default '[]'::jsonb;
