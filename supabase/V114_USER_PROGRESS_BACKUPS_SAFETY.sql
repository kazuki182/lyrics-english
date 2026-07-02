-- Ver.114 user progress backup safety base
-- Purpose: keep restore source for nickname/displayName/avatarUrl/XP/level/streak/premiumStatus/unlockedCount/settings.
-- Run only after confirming existing backup table and rollback plan.

create table if not exists public.user_progress_backups (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  username text,
  backup_reason text default 'manual_or_safe_sync',
  progress_snapshot jsonb not null default '{}'::jsonb,
  nickname text,
  display_name text,
  avatar_url text,
  xp integer,
  level integer,
  streak integer,
  premium_status text,
  unlocked_count integer,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_progress_backups_user_created_idx
  on public.user_progress_backups (user_id, created_at desc);

alter table public.user_progress_backups enable row level security;

-- Policies should be adapted to the existing auth design before production.
-- Do not remove or overwrite existing user_progress data until backups are confirmed.
