# My Planner v208 — Single conversation viewport

Backup: backup/pre-v208-single-chat-viewport-20261109 (v207).

Root cause: multiple conflicting keyboard-position rules sized a child conversation and its parent independently. The visualViewport.offsetTop moved the entire chat down, while the parent and child both had independent fixed heights. This left a blank region above the conversation and an oversized distance between composer and keyboard. List-mode tabs could also remain visible above the conversation.

Fix: use one fixed viewport-sized chat panel anchored at 0, with height equal to visualViewport.height + visualViewport.offsetTop. Use a single flex child for header, scrollable messages and composer. Scope fullscreen layout to the actual visible conversation, not solely the transient body.chat-open state. Hide friends/groups tabs and app dock while a conversation is visible. No changes to group/member, messages, database, PWA data, or finance logic.

Verification: JavaScript parse, CSS balanced braces, linked versioned assets. No iOS Safari device session available in the tool environment; actual keyboard behavior must be checked on the user's device.
