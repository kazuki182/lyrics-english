create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text,
  role text default 'user',
  created_at timestamptz default now(),
  last_login_at timestamptz
);

create table if not exists user_stats (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  xp integer default 0,
  level integer default 1,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_studied integer default 0,
  current_round integer default 1,
  test_correct integer default 0,
  test_wrong integer default 0,
  updated_at timestamptz default now()
);

create table if not exists review_items (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  item_id text not null,
  verb_id text not null,
  wrong_count integer default 0,
  correct_count integer default 0,
  next_review_at date,
  last_answered_at timestamptz default now(),
  last_result text,
  unique(username, item_id)
);
