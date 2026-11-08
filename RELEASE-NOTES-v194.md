# My Planner v194 — iOS keyboard focus and viewport stability

Rollback: backup/pre-v194-ios-keyboard-20261108, commit 91dc8b5f91de5ba13ee7649307642fe891b3ab23.

## Problem
The earlier composer scrolled the message list immediately on focus, and
scrolled it again when the keyboard began reducing visualViewport.height.
The same code also switched a safe-area layout class repeatedly around a
single threshold. On iOS 26 Safari this can feel like a sudden jump.

## Changes
- Remove the eager focus auto-scroll.
- Capture whether the current chat was already near the bottom before focusing.
- Once the keyboard's visual viewport stops changing (~130ms), follow the
  newest message only if the reader was near the bottom and has not swiped.
- Use keyboard-open hysteresis to avoid flapping at the viewport threshold.
- Do not discard the keyboard layout class the moment focus blurs while
  the keyboard is still visibly closing.
- Avoid CSS viewport updates for 1px measurement jitter.
- Stop background body scrolling while a fullscreen conversation is open.
- Keep the textarea at 16px to avoid iOS focus zoom.
- Preserve existing send-button focus behavior, reply feature, message
  persistence, scroll gesture controls, Supabase, images and notifications.

## Validation
JavaScript syntax and static asset links checked. Needs an iPhone real-device
check in Safari and installed PWA. Test focus, keyboard appearance/dismissal,
send and focus again, switching keyboard languages, long messages, group chat,
and manual history scrolling before focusing.
