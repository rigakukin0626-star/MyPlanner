-- My Planner v216: secure private-chat read receipts
-- Run in Supabase Dashboard > SQL Editor. Does not delete or change messages.
-- Avoids depending on broad UPDATE privileges on chat_messages.
CREATE OR REPLACE FUNCTION public.chat_mark_read(p_peer uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  changed integer := 0;
  viewer uuid := (SELECT auth.uid());
BEGIN
  IF viewer IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;
  IF p_peer IS NULL OR p_peer = viewer THEN
    RETURN 0;
  END IF;
  UPDATE public.chat_messages
  SET read_at = now()
  WHERE recipient_id = viewer
    AND sender_id = p_peer
    AND read_at IS NULL;
  GET DIAGNOSTICS changed = ROW_COUNT;
  RETURN changed;
END;
$$;
REVOKE ALL ON FUNCTION public.chat_mark_read(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.chat_mark_read(uuid) TO authenticated;
-- Verify the function exists:
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'chat_mark_read';