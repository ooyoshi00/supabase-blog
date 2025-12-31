create extension if not exists "pgcrypto";

create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  content jsonb not null,
  image_refs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  draft_id uuid not null references drafts(id) on delete cascade,
  storage_ref text not null,
  position integer not null,
  updated_at timestamptz not null default now()
);

create index if not exists media_assets_draft_id_idx on media_assets(draft_id);
create index if not exists media_assets_user_id_idx on media_assets(user_id);
