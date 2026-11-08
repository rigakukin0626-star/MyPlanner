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

## v176 — Group read receipts, message layout, and smoother rendering

- Backup branch before these changes: `backup-before-group-read-ui-v176` (commit `78d70daac26bb1262a41e555b63833e8f6c00a1e`).
- Development branch: `feat-group-read-ui-v176`.
- Chat UI: 16px content text, timestamps inside text bubbles, more balanced conversation rows and denser chats list.
- Group performance: unchanged message bubbles and existing photo elements are not re-created when new messages append; read labels update in place and are polled at a low rate.
- Group member read totals rely on the PostgreSQL table `chat_group_read_receipts`. **GitHub Pages cannot install this table.** Run `supabase/group-read-receipts-v176.sql` manually from the Supabase SQL Editor, then reopen the group from each participant's device.
- The read feature does not display counts if the table or its RLS privileges are missing. Only a group participant can read the count data, and each member can update only their own timestamp; server trigger assigns the timestamp.
- These GitHub commits leave the existing Supabase database, files, messages, group membership and local user data unchanged.

## v179 — Reply layout and contextual menu repair

- Source main SHA: `fe0fabcc9bde3dddf1ef209c2e542f1243f3be30`.
- Stable rollback branch: `backup-before-reply-context-v179`.
- Working branch: `fix-reply-context-layout-v179`.
- Rebuilt private and group reply message DOM using a dedicated block and quote stack. Old reply grid/flex overrides (v177/v178) were removed and normal-text grid selectors no longer target replies.
- Long-press actions now have fixed, viewport-aware positioning near their message and dismiss on scroll.
- No Supabase, user data, messages, storage or RLS policies were modified by this change.
- Browser-based mobile viewport layout regression passed for alternating received/sent replies; live iOS Safari validation remains necessary.

## v180 — In-memory preloading of recent group messages and private photos

- Baseline main SHA: `c7c1fe94b14f9f4e854ed2d219009a965d399308`.
- Safe rollback branch: `backup-before-media-prefetch-v180`.
- Development branch: `feat-group-media-prefetch-v180`.
- When the group list is visible (and during initial signed-in warmup), the app quietly prefetches recent messages for at most two groups, and authenticated image downloads for a maximum of two recent images in the first group and one in the second.
- Prefetched message rows and decoded image bitmaps stay in bounded, signed-in browser memory; no public Storage bucket, offline persistent image cache or third-party proxy is introduced. Warm images and blob URLs are cleared on sign-out or account switch.
- Entering a warm group uses prefetched messages immediately while refreshing the latest state from Supabase. Cold starts and large images may still require networking; this is best-effort, not guaranteed zero-latency.
- Group list renders as soon as groups are returned, before read counts and previews finish. Recent images are eagerly painted; other historic images stay lazy-loaded to conserve bandwidth.
- Added a quiet photo placeholder, capped large media height, and reduced timestamp whitespace without reintroducing media bubble backgrounds.
- This release requires no SQL migration and does not modify existing messages, members, or Storage objects.

## v181 — Group conversation bottom-follow, correctly fitted photo frames, and UI refinement

- Main snapshot before the fix: `a81483192e1d967664e0f38f03ab29899b2ebb7f`.
- Rollback branch: `backup-before-chat-scroll-ui-v181`.
- Development branch: `fix-group-scroll-polish-v181`.
- When opening a group, the scroll viewport follows the newest message through image loading/decoding, layout resizing, and Safari viewport-height changes. The user can intentionally scroll upward without being automatically yanked back down.
- A small floating jump-to-latest button appears only after the user moves away from the latest messages; tapping it restores bottom-follow.
- Loaded photo frames are sized to the actual decoded image ratio, avoiding the empty horizontal area around portrait photos; images remain private and do not add permanent browser storage.
- Chat header, avatars, rounded bubbles, timestamps, media spacing, and the message composer have a calm, consistent mobile look inspired by mainstream messaging apps. No interface, data, permissions, schema, or message semantics were removed.
- No Supabase migration is required. Live iPhone browser verification is still required for scroll responsiveness under real network conditions.
