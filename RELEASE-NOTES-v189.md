# v189: Align floating dock with iOS Safari address pill (2026-11-08)

Current user reference compared the task navigation selection with Safari's bottom address field.

- Reduce the selected tab's white fill and blur, avoiding an opaque frosted block.
- Use a similar translucent treatment for the whole floating dock.
- Add a thin double-beveled rim, edge glints and subtle curved highlights focused at the edges.
- Preserve clear labels/icons and the existing selected-tab behavior.
- Light and dark mode styles + iOS Reduce Transparency fallback.
- No JavaScript changed; no task/chat/notification/scroll logic changed.
- Restore branch: `backup/pre-v189-ios-addressbar-glass-20261108` at `280d39d423497a605f5f238c80272f66b8e7d713`.
- Cache version bumped to `my-planner-v189`.

Note: CSS/WebKit can approximate Apple's lens style but not duplicate native system-level dynamic optical refraction exactly.
