# My Planner v188 — Text bubble layout emergency repair + Liquid Glass dock refinement

- Fix v187 breakage: remove grid/max-content/minmax sizing conflict on normal text bubbles; use content-sized flex layout so letters, time and read status stay inside their bubble.
- Ordinary messages expand to text width up to the allowed phone viewport and wrap rather than overflow. Short messages are not forced to a fixed width.
- Quoted replies also use fit-content rather than the old 246px inline width, with min 168px for the quote header and timestamp; width and max-width set in the existing JS presentation helper.
- Do not change image bubbles, message ordering, sending, read receipts, group media, scroll/keyboard handlers, reminders, or cloud sync.
- Floating dock gets a clearer inner rim, corner highlights, subtle refractive-like gradients and less solid fill; popovers and small controls match.
- A PWA can simulate the appearance of iOS Liquid Glass but cannot reproduce native OS compositing/refraction pixel-for-pixel.
- Rollback branch: `backup/pre-v188-bubble-repair-20261108`, commit `c64e6899566497867da0729772da1e2b250252d2`.
- Service worker cache and CSS/script asset versions incremented to v188 for iOS refresh.
