# My Planner v186 – Native date picker appearance and clearer Liquid Glass

## Improvements
- Single rounded border for plan-date and reminder-date controls (previous two-layer frame removed).
- Native date and datetime picker remains the actual interactive input with unchanged IDs and handlers; display overlay remains text-only.
- Bottom tab bar and active tab use lower-opacity glass and a smaller blur radius, so underlying lists remain recognizable instead of looking opaque white.
- Language selector and LINE-style chat popover use softer translucent glass.
- Mobile "today" date occupies its own grid row, avoiding an orphaned weekday in Chinese/Japanese.
- Respect iOS Reduce Transparency accessibility settings.

## Safety and restore
- CSS-only; no changes to task storage, date logic, chat logic, reminders, Supabase or push service-worker event handlers.
- Restore branch: `backup/pre-v186-glass-tune-20261108` at `f4089d4dc4d8b772ab5ba03e91f253115604b403`.
- Cache version bumped to `my-planner-v186`; v186 CSS file precached.
