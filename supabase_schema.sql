-- Lyrics English Supabase DB Setup
-- Supabase SQL Editorで実行してください

create extension if not exists "pgcrypto";

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_name text,
  youtube_url text,
  apple_music_url text,
  genre text,
  difficulty text,
  artist_profile text,
  lyrics_raw text,
  lyric_lines jsonb default '[]'::jsonb,
  created_by text check (created_by in ('kazuki','shun','system')),
  updated_by text check (updated_by in ('kazuki','shun','system')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id text check (user_id in ('kazuki','shun')),
  song_id uuid references public.songs(id) on delete set null,
  word text not null,
  meaning text,
  part_of_speech text,
  example text,
  memo text,
  song_title text,
  artist_name text,
  status text default '復習中',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id text check (user_id in ('kazuki','shun','system')),
  message text not null,
  created_at timestamptz default now()
);

-- デモ用途：2人だけの非公開利用前提で、Anon Keyから読み書き可能にする簡易ポリシー
-- 本番強化時はSupabase Authへ移行してください
alter table public.songs enable row level security;
alter table public.vocabulary enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "allow anon read songs" on public.songs;
drop policy if exists "allow anon write songs" on public.songs;
drop policy if exists "allow anon read vocabulary" on public.vocabulary;
drop policy if exists "allow anon write vocabulary" on public.vocabulary;
drop policy if exists "allow anon read logs" on public.activity_logs;
drop policy if exists "allow anon write logs" on public.activity_logs;

create policy "allow anon read songs" on public.songs for select to anon using (true);
create policy "allow anon write songs" on public.songs for all to anon using (true) with check (true);

create policy "allow anon read vocabulary" on public.vocabulary for select to anon using (true);
create policy "allow anon write vocabulary" on public.vocabulary for all to anon using (true) with check (true);

create policy "allow anon read logs" on public.activity_logs for select to anon using (true);
create policy "allow anon write logs" on public.activity_logs for insert to anon with check (true);

-- Realtime対象に追加
alter publication supabase_realtime add table public.songs;
alter publication supabase_realtime add table public.vocabulary;
alter publication supabase_realtime add table public.activity_logs;
