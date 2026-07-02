-- =========================================================
-- Verb Master V109 Security Fix
-- Purpose:
-- - Stop direct public access to cloud_accounts and user_progress_backups.
-- - Hide password_hash from browser-side table reads.
-- - Use SECURITY DEFINER RPC functions for cloud login/register/progress backup.
--
-- IMPORTANT:
-- 1. Run this SQL in Supabase SQL Editor before using Ver.109.
-- 2. After running it, users may need to log in again once so the app can store
--    the secure cloud credential for backup/restore RPC calls.
-- =========================================================

-- 1. Enable RLS on sensitive tables.
alter table if exists public.cloud_accounts enable row level security;
alter table if exists public.user_progress_backups enable row level security;

-- 2. Drop old dangerous/duplicated permissive policies.
drop policy if exists "public read cloud_accounts" on public.cloud_accounts;
drop policy if exists "public insert cloud_accounts" on public.cloud_accounts;
drop policy if exists "public update cloud_accounts" on public.cloud_accounts;
drop policy if exists "public read progress backups" on public.user_progress_backups;
drop policy if exists "public upsert progress backups" on public.user_progress_backups;

-- Defensive cleanup for possible alternate policy names.
drop policy if exists "cloud_accounts_select_all" on public.cloud_accounts;
drop policy if exists "cloud_accounts_insert_all" on public.cloud_accounts;
drop policy if exists "cloud_accounts_update_all" on public.cloud_accounts;
drop policy if exists "user_progress_backups_select_all" on public.user_progress_backups;
drop policy if exists "user_progress_backups_upsert_all" on public.user_progress_backups;

-- No direct public policies are created here.
-- The app should use the RPC functions below.

-- 3. RPC: register cloud account without exposing cloud_accounts rows.
create or replace function public.vm_register_cloud_account(
  p_username text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_password_hash text := coalesce(p_password_hash, '');
begin
  if v_username = '' then
    return jsonb_build_object('ok', false, 'message', 'ユーザー名を入力してください。');
  end if;

  if length(v_password_hash) < 32 then
    return jsonb_build_object('ok', false, 'message', 'パスワード情報が不正です。');
  end if;

  if exists (select 1 from public.cloud_accounts where username = v_username) then
    return jsonb_build_object('ok', false, 'message', 'このユーザー名はすでに使われています。');
  end if;

  insert into public.cloud_accounts (
    username,
    password_hash,
    role,
    created_at,
    last_login_at,
    updated_at
  ) values (
    v_username,
    v_password_hash,
    'user',
    now(),
    now(),
    now()
  );

  return jsonb_build_object('ok', true, 'username', v_username, 'role', 'user', 'message', 'クラウドアカウントを作成しました。');
end;
$$;

-- 4. RPC: login cloud account without selecting password_hash in the browser.
create or replace function public.vm_login_cloud_account(
  p_username text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_role text;
begin
  select role into v_role
  from public.cloud_accounts
  where username = v_username
    and password_hash = coalesce(p_password_hash, '')
  limit 1;

  if v_role is null then
    return jsonb_build_object('ok', false, 'message', 'ユーザー名またはパスワードが違います。');
  end if;

  update public.cloud_accounts
  set last_login_at = now(), updated_at = now()
  where username = v_username;

  return jsonb_build_object('ok', true, 'username', v_username, 'role', v_role, 'message', 'クラウドログインしました。');
end;
$$;

-- 5. RPC: save full progress backup only when username/password hash matches.
create or replace function public.vm_upsert_progress_backup(
  p_username text,
  p_password_hash text,
  p_progress_json jsonb,
  p_settings_json jsonb,
  p_app_version text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_ok boolean;
begin
  select exists (
    select 1
    from public.cloud_accounts
    where username = v_username
      and password_hash = coalesce(p_password_hash, '')
  ) into v_ok;

  if not v_ok then
    return jsonb_build_object('ok', false, 'message', 'クラウド保存には再ログインが必要です。');
  end if;

  insert into public.user_progress_backups (
    username,
    progress_json,
    settings_json,
    app_version,
    updated_at
  ) values (
    v_username,
    coalesce(p_progress_json, '{}'::jsonb),
    coalesce(p_settings_json, '{}'::jsonb),
    coalesce(p_app_version, 'v109'),
    now()
  )
  on conflict (username) do update set
    progress_json = excluded.progress_json,
    settings_json = excluded.settings_json,
    app_version = excluded.app_version,
    updated_at = now();

  return jsonb_build_object('ok', true, 'message', 'クラウドバックアップを保存しました。');
end;
$$;

-- 6. RPC: fetch progress backup only when username/password hash matches.
create or replace function public.vm_fetch_progress_backup(
  p_username text,
  p_password_hash text
)
returns table (
  progress_json jsonb,
  settings_json jsonb,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := btrim(coalesce(p_username, ''));
  v_ok boolean;
begin
  select exists (
    select 1
    from public.cloud_accounts
    where username = v_username
      and password_hash = coalesce(p_password_hash, '')
  ) into v_ok;

  if not v_ok then
    return;
  end if;

  return query
  select b.progress_json, b.settings_json, b.updated_at
  from public.user_progress_backups b
  where b.username = v_username
  limit 1;
end;
$$;

-- 7. Allow browser anon/authenticated roles to execute only these controlled RPCs.
grant execute on function public.vm_register_cloud_account(text, text) to anon, authenticated;
grant execute on function public.vm_login_cloud_account(text, text) to anon, authenticated;
grant execute on function public.vm_upsert_progress_backup(text, text, jsonb, jsonb, text) to anon, authenticated;
grant execute on function public.vm_fetch_progress_backup(text, text) to anon, authenticated;

-- 8. Useful indexes.
create unique index if not exists idx_cloud_accounts_username_unique on public.cloud_accounts(username);
create unique index if not exists idx_user_progress_backups_username_unique on public.user_progress_backups(username);

-- 9. Verification helpers.
-- Run separately after this migration if needed:
-- select schemaname, tablename, policyname, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('cloud_accounts', 'user_progress_backups')
-- order by tablename, policyname;
