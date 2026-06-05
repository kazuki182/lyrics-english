-- Lyrics English optional columns for music links and cover images
-- Supabase SQL Editorで1回だけ実行してください。
alter table public.songs
  add column if not exists spotify_url text,
  add column if not exists cover_art_url text,
  add column if not exists lyrics_links jsonb;
