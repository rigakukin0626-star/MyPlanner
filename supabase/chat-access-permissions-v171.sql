-- My Planner v171: Photos visible only to chat participants; friends can remove each other.
-- Apply this file once from the Supabase Dashboard > SQL Editor.
-- This does NOT make the chat-photos bucket public or delete any stored data.
-- Requirements: storage.objects and public.chat_friends exist.
-- Paths: sender_uuid/recipient_uuid/photo_uuid.ext or sender_uuid/group_uuid/photo_uuid.ext.
--
-- 1. Private chat recipient and current group participants can read private photos.
DO $photo_policy$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'myplanner_chat_photo_member_read'
  ) THEN
    CREATE POLICY myplanner_chat_photo_member_read
    ON storage.objects
    FOR SELECT TO authenticated
    USING (
      bucket_id = 'chat-photos'
      AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      AND (storage.foldername(name))[2] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
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
$photo_policy$;

-- 2. Permit a chat participant to delete only their own friendship row.
-- Messages, profiles and media objects are intentionally not deleted.
DO $friend_policy$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'chat_friends'
      AND policyname = 'myplanner_chat_friends_member_delete'
  ) THEN
    CREATE POLICY myplanner_chat_friends_member_delete
    ON public.chat_friends
    FOR DELETE TO authenticated
    USING (
      user_a::text = (SELECT auth.uid())::text
      OR user_b::text = (SELECT auth.uid())::text
    );
  END IF;
END
$friend_policy$;

-- Verify the policies exist (this does NOT reveal the user table's records):
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE (schemaname = 'storage' AND tablename = 'objects'
       AND policyname = 'myplanner_chat_photo_member_read')
   OR (schemaname = 'public' AND tablename = 'chat_friends'
       AND policyname = 'myplanner_chat_friends_member_delete')
ORDER BY schemaname, tablename, policyname;
