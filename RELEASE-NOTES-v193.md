# v193 — LINE-like send interaction and chat composer stability

Backup: backup/pre-v193-send-composer-stability-20261108 (1702bc7992afcc6302385b5bdb68254813a25134).

Changes:
- Private text send: show local message immediately, pin the newest bubble, shrink the draft textarea immediately, keep the pending clock compact (HH:MM).
- Group text send: identical one-line composer reset, immediate newest-message pin, consistent own-message avatar styling and compact pending time.
- Group reply send: optimistic bubble renders the quoted reply card instead of its serialized payload.
- Group confirmation reconciliation: temporary local send bubbles no longer destroy the server message prefix; match them by sender/body/time and preserve the existing decoded image DOM when possible.
- Sending from an active textarea: prevent the iOS send button from stealing keyboard focus in pointerdown, allowing rapid consecutive messages without the keyboard sliding down.
- Deliberate scrolling up still turns off followLatest; image/resizing listener and iOS visualViewport remain unchanged.
- The Supabase insert call, database schema, notification code, photo uploads, recalls and tasks were not altered.

Verification: JS syntax parse and asset-cache links; iPhone Safari/PWA runtime needs user testing.
Tests to perform: press Send repeatedly with keyboard up in private/group chat, send a group quote reply, send a multi-line message, confirm that new message stays visible and group image scroll is stable.
