-- My Planner: groundwork for server-side, one-time task reminders.
-- Run in Supabase SQL Editor. This does not send notifications by itself.
-- The scheduled Edge Function will claim and send due reminders in a later step.
create table if not exists public.task_push_deliveries (
  task_id text not null,
  reminder_at timestamptz not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (task_id, reminder_at)
);

create index if not exists task_push_deliveries_user_idx
  on public.task_push_deliveries(user_id);

alter table public.task_push_deliveries enable row level security;

-- Do not expose reminder delivery bookkeeping to the public client.
revoke all on public.task_push_deliveries from anon, authenticated;

-- Clean up records when a task is removed, if tasks.id is stored as text.
-- A scheduled function will handle stale records and retries.
