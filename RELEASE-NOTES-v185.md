# v185 — True Liquid Glass task UI (2026-11-08)

Backup branch: `backup/pre-v185-liquid-glass-20261108` (commit `c1c68ece70315af6615f8b4f15afc9a5a86f2100`).

- Redesign **Tasks** overview, form card, reminder/priority fields and task filter capsules.
- Redesign **Long-term** form card, make priority selection full-width, and give countdown items separate grouped rows.
- Replace opaque full-width bottom tab bar with a floating, translucent, background-blurred dock, including safe-area positioning.
- Refine language switcher and chat quick popover transparency without changing any chat logic.
- Add native reduced-transparency / reduced-motion fallbacks.
- Preserve task input IDs, filters, form handlers, push notifications, Supabase and chat logic (no JavaScript behavior changes).
- Bust PWA caches using `my-planner-v185`; precache `liquid-glass-v185.css?v=185`.

## Restore

Restore by reverting the v185 commit in GitHub, or compare with `backup/pre-v185-liquid-glass-20261108`. Existing user data is not changed by this CSS-only update.
