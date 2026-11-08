# My Planner v192 — Group tab overlapping the quick menu

User screenshot: when the + quick actions menu is open, the blue “群聊” mode selector is incorrectly drawn on top of the translucent menu.

Root cause: selected tab's backdrop-filter creates a stacking context. The chat header popup is inside a preceding sibling container with no explicit ancestor z-index, so sibling content can paint above it.

Changes:
- Put the chat-app-header stacking context above the chat mode switch and search.
- Keep the quick menu at a higher local z-index while preserving pointer interaction.
- Preserve Liquid Glass visual rules and close/open behavior.
- Change only stylesheet and service-worker cache references (no message, auth, database, or task logic changed).
- Backup: `backup/pre-v192-menu-stacking-fix-20261108` at commit `f84a1e8a0370f95c29bfcbdbaef059dba4dfef29`.

Check on iPhone: tap + on friends tab and on groups tab; all three menu rows must appear completely above the tabs, remain legible, and be clickable. Close by tapping outside. Test private/group top menus separately.
