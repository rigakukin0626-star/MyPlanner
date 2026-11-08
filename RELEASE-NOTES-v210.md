# v210 chat keyboard geometry stabilization

- Removed loading previous keyboard CSS v195, v206, v207, v208. They still exist in Git history for rollback but are no longer part of page styles.
- Chat now uses a single fixed full-screen conversation viewport; height and top both come from visualViewport to avoid y-offset double-counting on iOS Safari.
- #pageChat.active disables ancestor page animations/transform to avoid forming an unexpected fixed-position containing block.
- Private and group chat use the same header/messages/composer flex layout; list tabs and bottom navigation are hidden only inside an opened conversation.
- The page background is scroll-locked while viewing a conversation. Message list remains independently scrollable.
- Auto-growing textarea always applies an explicit capped height, preventing inconsistent layout after sending multi-character messages.
- No change to message insertion, Supabase chat records, existing finance logic or data.
- Syntax and structural checks can run here; actual iOS Safari keyboard motion must be tested on-device.