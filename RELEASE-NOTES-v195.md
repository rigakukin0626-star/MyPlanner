# v195 — iOS keyboard jumps conversation to top, input appears at y≈120

## Symptom
On iPhone Safari, tapping the chat composer moves the entire input bar
up near the status bar, leaving a large blank area between the composer
and the software keyboard. This persists even after removing duplicate
message autoscroll in v194.

## Mechanism
The visualViewport API reports its intended bounds, but WebKit on iOS 26
can independently pan the actual rendered fixed conversation layer.
Simply assigning position:fixed; top:visualViewport.offsetTop and height:
visualViewport.height can therefore leave the real panel visually displaced.

## Fix
- Retain a single fixed chat conversation panel sized to the visual viewport.
- After each viewport resize/scroll/focus, measure getBoundingClientRect()
  of the *active* conversation and compare its bottom to
  visualViewport.offsetTop + visualViewport.height.
- Apply the observed difference as a bounded CSS top correction.
- Repeat after the keyboard has settled; avoid layout thrashing, scrollTo()
  hacks, and duplicate message-list scrolling.
- Do not change composer position to an independent fixed layer.
- Handle scroll and rotation events, safely reset on leaving chat.
- Preserve private/group messages, photos, Supabase, notifications, page
  scroll gestures, sent-message feedback and task data.

## Verification
JavaScript syntax and stylesheet/cache paths validated. iOS real-device
test required, because desktop emulation does not reproduce WebKit's
keyboard panning bug. Test private and group chat keyboard open/close,
long typing, language switch, and repeated sends.

Rollback branch: backup/pre-v195-ios-keyboard-anchor-20261108
Base commit: 8ec16005f285f9d6ce2a21402d2eb28ead41ce45.
