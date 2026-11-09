# v212 — Always reveal newest messages on composer focus

- Private chat previously gated keyboard-follow on being <140px from the bottom; opening the keyboard while reading older messages kept old messages next to the keyboard.
- Both private and group chats now jump to the latest message when their input is focused.
- Immediate, two-frame, and 320ms keyboard-settle pins are guarded by current focus and manual-follow state.
- Message list ResizeObserver adjusts after iOS keyboard layout transitions.
- User swipes or wheel interaction disable auto-follow; historical reading is not interrupted.
- In short conversations, first message receives automatic top margin so newest bubbles sit above the composer.
- v210 keyboard geometry, message sending, Supabase data, finance, and alerts remain unchanged.

Rollback branch: backup/pre-v212-latest-on-focus-20261109.
iPhone Safari real-device verification remains necessary.