# My Planner v187 — clearer LINE-style glass & compact chat bubbles

- Bottom floating dock becomes noticeably more transparent, with lighter blur, border and active-tab capsule.
- Language selector and LINE chat menus use similarly transparent glass.
- Plain text chat bubbles no longer reserve a 156–190px minimum width or a 65–68px minimum height. Timestamps are retained and aligned to the right.
- Quoted replies are reduced from the previous fixed width of 280px to 246px (only one presentational constant in script.js changed), with tighter spacing and quieter quote cards.
- Photo messages, group chat scroll anchoring, message delivery logic, notifications, database, tasks and date pickers remain unchanged.
- iOS Reduce Transparency remains supported.
- Backed up v186 on branch `backup/pre-v187-more-glass-20261108` at `3800253a786dadb5a4bf0cc198518bbf08af4805`.
- Updated stylesheet and script query-string/cache versions for iOS PWA refresh.
