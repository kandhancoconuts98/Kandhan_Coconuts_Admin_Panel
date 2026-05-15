-- Coconest: Farm Labor Manager
-- Run this in Supabase SQL Editor.

-- A single row per farmId that stores the whole backup JSON (simple + robust).
-- You can normalize later if needed.

create table if not exists public.farm_backups (
  farm_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists farm_backups_updated_at_idx
  on public.farm_backups(updated_at desc);

-- Recommended for quick start (single-tenant / no auth):
-- Disable RLS on this table, or add your own policies later.
alter table public.farm_backups disable row level security; 

