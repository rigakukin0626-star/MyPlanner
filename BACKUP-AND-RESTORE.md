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
