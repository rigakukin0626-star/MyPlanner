-- My Planner v176 — persistent per-member group read receipts
-- Run ONCE in Supabase Dashboard > SQL Editor.
-- No chat messages, photos or existing group memberships are modified.
-- Idempotent for repeat execution.
--
-- Read semantics: a member has read a message when their server-recorded
-- last_read_at is at least the message's created_at.
-- Only current group members can see their group's receipt records.

CREATE TABLE IF NOT EXISTS public.chat_group_read_receipts (
  group_id uuid NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

CREATE INDEX IF NOT EXISTS chat_group_read_receipts_group_idx
  ON public.chat_group_read_receipts (group_id, last_read_at DESC);

ALTER TABLE public.chat_group_read_receipts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.chat_group_read_receipts FROM anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.chat_group_read_receipts TO authenticated;

-- Use database time, not arbitrary user-supplied device timestamps.
CREATE OR REPLACE FUNCTION public.myplanner_set_group_read_time()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.last_read_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS myplanner_group_read_server_time
  ON public.chat_group_read_receipts;

CREATE TRIGGER myplanner_group_read_server_time
BEFORE INSERT OR UPDATE ON public.chat_group_read_receipts
FOR EACH ROW EXECUTE FUNCTION public.myplanner_set_group_read_time();

DO $policies$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public'
      AND tablename='chat_group_read_receipts'
      AND policyname='myplanner_group_receipts_member_select'
  ) THEN
    CREATE POLICY myplanner_group_receipts_member_select
    ON public.chat_group_read_receipts
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.chat_group_members AS m
        WHERE m.group_id = chat_group_read_receipts.group_id
          AND m.user_id = (SELECT auth.uid())
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public'
      AND tablename='chat_group_read_receipts'
      AND policyname='myplanner_group_receipts_self_insert'
  ) THEN
    CREATE POLICY myplanner_group_receipts_self_insert
    ON public.chat_group_read_receipts
    FOR INSERT TO authenticated
    WITH CHECK (
      user_id = (SELECT auth.uid())
      AND EXISTS (
        SELECT 1 FROM public.chat_group_members AS m
        WHERE m.group_id = chat_group_read_receipts.group_id
          AND m.user_id = (SELECT auth.uid())
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public'
      AND tablename='chat_group_read_receipts'
      AND policyname='myplanner_group_receipts_self_update'
  ) THEN
    CREATE POLICY myplanner_group_receipts_self_update
    ON public.chat_group_read_receipts
    FOR UPDATE TO authenticated
    USING (
      user_id = (SELECT auth.uid())
      AND EXISTS (
        SELECT 1 FROM public.chat_group_members AS m
        WHERE m.group_id = chat_group_read_receipts.group_id
          AND m.user_id = (SELECT auth.uid())
      )
    )
    WITH CHECK (
      user_id = (SELECT auth.uid())
      AND EXISTS (
        SELECT 1 FROM public.chat_group_members AS m
        WHERE m.group_id = chat_group_read_receipts.group_id
          AND m.user_id = (SELECT auth.uid())
      )
    );
  END IF;
END
$policies$;

-- Confirm all three RLS rules were installed:
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname='public' AND tablename='chat_group_read_receipts'
ORDER BY policyname;
