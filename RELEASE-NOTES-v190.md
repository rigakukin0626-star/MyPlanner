# v190 — Unified Liquid Glass controls

- User reference: make floating chat plus menu, private/group overflow menus, bottom tabs and option controls more like iOS's translucent address bar.
- Scoped lightweight CSS to chat plus/overflow buttons, popovers, menu items, chat filters, task filters, calendar navigation, settings controls, selects and dock.
- Transparent lens fill, edge highlight, restrained blur, and a softer inner contour. No real system-compositor optical refraction can be accessed by PWA.
- Avoided heavy WebGL and full-screen filters to preserve scrolling and battery life.
- Deliberately do not restyle message bubbles, images, native date/time inputs, full-screen pages or primary send/add buttons.
- Accessibility: reduce motion and reduce transparency.
- No JS or database changes. Rollback branch: backup/pre-v190-liquid-controls-20261108 at cb1151503032b095421aa420a1ddccf93ecfd114.
