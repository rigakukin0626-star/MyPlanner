-- My Planner / Photo loading access fix
-- Run manually in Supabase Dashboard > SQL Editor.
-- Does NOT make the Storage bucket public and does NOT change/delete messages.
-- Photos are stored as: sender-user-id / recipient-user-id-or-group-id / photo-uuid.ext
-- Existing policies remain unchanged; only add the narrowly-scoped SELECT policy.
DO $policy_setup$
BEGIN
 IF NOT EXISTS (
  SELECT 1 FROM pg_policies
  WHERE schemaname='storage'
    AND tablename='objects'
    AND policyname='myplanner_chat_photo_member_read'
 ) THEN
  CREATE POLICY myplanner_chat_photo_member_read
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
   bucket_id='chat-photos'
   AND (storage.foldername(name))[1] ~* '^[0-9a-f-]{36}$'
   AND (storage.foldername(name))[2] ~* '^[0-9a-f-]{36}$'
   AND (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
    OR (storage.foldername(name))[2] = (SELECT auth.uid())::text
    OR EXISTS (
     SELECT 1
     FROM public.chat_group_members AS member
     WHERE member.group_id::text = (storage.foldername(name))[2]
       AND member.user_id = (SELECT auth.uid())
    )
   )
  );
 END IF;
END
$policy_setup$;
