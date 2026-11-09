# My Planner — Quiet Glass Pro v227 (2026-11-09)

A visual-only design update for the existing My Planner PWA.

## Light appearance
- Balanced off-white canvas, clean near-white cards, precise soft borders.
- Main text dark navy; secondary text adjusted for legibility.
- Reduced overly bright blue crystal fills, double rim lines and excessive glow.
- Soft, understated blue used primarily for active states and primary actions.

## Dark appearance
- Blue/charcoal canvas rather than pure black.
- Clear layering between app canvas, cards, fields, and floating controls.
- Milder blue, high-contrast text, calmer positive and negative colors.
- Dark-specific finance, calendar, task, settings and message-list treatments.

## Shared controls
- Unified card, field, secondary button, selected segment, and floating dock treatment.
- Chat list and chat action controls updated to match.
- Existing iPhone Safari keyboard/scroll geometry untouched.
- Finance hero, holdings, budget progress, trend colors and dialogs aligned.
- Accessibility: preserves focus cues, reduced motion/transparency preferences, avoids lowering text contrast excessively.

## Assets/changes
- `quiet-glass-pro-v227.css`: new global palette and components (visual-only).
- `index.html`: stylesheet at end of cascade; initial theme-color synchronized.
- `script.js`: synchronized dynamically selected light/dark theme-color (one-line code change).
- `service-worker.js`: final v227 cache revision to refresh installed iPhone PWA styles.

## Known limits and testing
- Source and syntax checked. Browser-rendered UI across every iOS viewport has not been verified on a physical iPhone.
- Local finance, Supabase, group chat, notifications, stock pricing and scheduled task functionality were intentionally not modified.
- To revert, restore from branch `backup-before-quiet-glass-pro-v227-20261109`.
