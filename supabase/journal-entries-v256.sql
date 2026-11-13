-- SOVEREIGN 日记 v256
-- 在 Supabase Dashboard -> SQL Editor 中执行一次。
-- 日记仅归当前登录用户所有；访客数据保存在本设备。
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  title text not null default '' check (char_length(title) <= 120),
  body text not null default '' check (char_length(body) <= 30000),
  mood text not null default 'normal' check (mood in ('calm','happy','normal','tired','sad')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists journal_entries_owner_date on public.journal_entries(user_id,entry_date desc);
alter table public.journal_entries enable row level security;
revoke all on public.journal_entries from anon;
grant select, insert, update on public.journal_entries to authenticated;
drop policy if exists "journal_select_own" on public.journal_entries;
drop policy if exists "journal_insert_own" on public.journal_entries;
drop policy if exists "journal_update_own" on public.journal_entries;
create policy "journal_select_own" on public.journal_entries
  for select to authenticated using (user_id = (select auth.uid()));
create policy "journal_insert_own" on public.journal_entries
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "journal_update_own" on public.journal_entries
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
-- 使用 deleted_at 软删除并跨设备同步删除状态，因此不授予客户端 DELETE 权限。
