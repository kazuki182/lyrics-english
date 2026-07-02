-- =========================================================
-- Verb Master V111 Backup Safety Check
-- Purpose:
-- - Non-destructive checks before/after security or save-restore changes.
-- - Do not delete or overwrite user data.
-- =========================================================

-- 1. Check key table row counts.
select 'cloud_accounts' as table_name, count(*) as rows from public.cloud_accounts
union all
select 'user_progress_backups', count(*) from public.user_progress_backups
union all
select 'profiles', count(*) from public.profiles
union all
select 'user_stats', count(*) from public.user_stats;

-- 2. Check latest backup rows without exposing password hashes.
select
  username,
  progress_json ->> 'xp' as xp,
  progress_json ->> 'level' as level,
  progress_json ->> 'currentStreak' as current_streak,
  settings_json ->> 'displayName' as display_name,
  settings_json ->> 'nickname' as nickname,
  coalesce(settings_json ->> 'avatarUrl', settings_json ->> 'avatarDataUrl') as avatar_url,
  app_version,
  updated_at
from public.user_progress_backups
order by updated_at desc
limit 20;

-- 3. Check remaining public RLS advisory-related policies.
select
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('cloud_accounts', 'user_progress_backups', 'profiles', 'user_stats')
order by tablename, policyname;
