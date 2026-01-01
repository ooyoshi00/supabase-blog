create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  excerpt text not null,
  content jsonb not null,
  image_refs jsonb not null default '[]'::jsonb,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts add column if not exists user_id uuid;
alter table posts add column if not exists title text;
alter table posts add column if not exists excerpt text;
alter table posts add column if not exists content jsonb;
alter table posts add column if not exists image_refs jsonb;
alter table posts add column if not exists published_at timestamptz;
alter table posts add column if not exists updated_at timestamptz;

alter table posts alter column image_refs set default '[]'::jsonb;
alter table posts alter column published_at set default now();
alter table posts alter column updated_at set default now();

create index if not exists posts_user_id_idx on posts(user_id);
create index if not exists posts_published_at_idx on posts(published_at desc);
