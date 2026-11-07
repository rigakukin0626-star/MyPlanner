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
