alter table drafts drop constraint if exists drafts_user_id_key;
create index if not exists drafts_user_id_idx on drafts(user_id);
