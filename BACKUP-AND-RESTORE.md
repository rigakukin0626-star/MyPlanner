# My Planner rollback point — 2026-11-07

## Preserved application-code snapshot

Git branch: `backup-before-ui-redesign-2026-11-07`

This branch was created **before** the Studio UI redesign, photo loading fixes,
and iPhone composer changes. It preserves the GitHub repository at that point.

Restore procedure: replace the current `main` branch with the snapshot from
`backup-before-ui-redesign-2026-11-07`, using a checked, explicit rollback.
Ask for a rollback to this exact branch; don't reset Supabase.

## What it backs up

- GitHub-tracked HTML, CSS, JavaScript, PWA service worker, and repository files.

## What it does not back up

- Supabase PostgreSQL tables (users, chat, group membership).
- Supabase Storage image objects.
- Device-local browser storage (unsynced tasks, remarks, local-only settings).

Those data sources require separate exports and were **not deleted or modified**
by this UI redesign. Do not clear browser site data as a rollback strategy.

## Photo access

`supabase/chat-photo-read-policy.sql` is an optional, restricted SELECT policy
intended to let private chat recipients and existing group members read uploaded
photos. It must be reviewed and run by an authorized project administrator in
Supabase SQL Editor. It was NOT automatically applied.

## New flat-interface redesign backup — 2026-11-07

- Exact original main-branch commit: `85accc451fbd532a5455faccf6a9a7c5a89d4800`
- Immutable rollback reference branch: `backup-before-minimal-ui-2026-11-07`
- New UI development branch: `redesign-minimal-line-2026-11-07`
- The original version uses `style.css` + `reimagined.css`; the new version loads `minimal.css` instead.
- No database schema, message row, Supabase Storage object, or localStorage key was intentionally changed by this UI redesign.
- Git tracks code only. The Supabase database, Storage and device-local data must be backed up separately for complete disaster recovery.
- For a visual rollback, restore the backup branch's code using GitHub history; do not delete Supabase data or clear browser site storage.

## Sky-blue UI and iOS keyboard fix — 2026-11-07

- Pre-fix main commit: `582b22c492f33422899071fa1fcb4b99a279cbe4`
- Stable code rollback branch: `backup-before-chat-ui-fix-2026-11-07`
- Work branch: `fix-chat-keyboard-skyblue-2026-11-07`
- Only UI, chat presentation, in-browser keyboard handling, and PWA versioning were changed; Supabase data and policies were not touched.
- This backup is code only. It does not export device-local data, Supabase SQL tables, or Supabase Storage files.

## LINE-style chat menu and swipe UI — 2026-11-07

- Original code SHA: `5204726dd34b0d556b88fae045e3f3373ab3a23b`
- Backup branch: `backup-before-line-menus-2026-11-07`
- Development branch: `feat-line-swipe-menu-2026-11-07`
- UI-only code changes; chat data, users, group membership, Supabase policies, storage objects, and existing storage keys are not changed.
- Restore original code from the backup branch if desired; this is not a cloud database backup and does not include unsynced local storage.

## Private chat action menu, zoom, and photo retrieval fix — v171

- Previous main commit snapshot: `21a0e686f78b7301855b7d914ec4c1196b4b5da2`
- Backup branch: `backup-before-private-menu-photo-fix-2026-11-07`
- Development branch: `fix-private-actions-photo-zoom-2026-11-07`
- Friend deletion is a server-confirmed deletion of the friendship relationship, not messages or media.
- Before delete-friend and incoming photo access can work when RLS policies are missing, an authorized Supabase admin must run `supabase/chat-access-permissions-v171.sql` in Supabase SQL Editor (once). GitHub publishing alone **does not run SQL migrations**.
- Photo retrieval now attempts signed URLs first and falls back to private authenticated downloads. It never makes the Storage bucket public.
- No existing Supabase data or Storage objects were changed by these GitHub commits.
