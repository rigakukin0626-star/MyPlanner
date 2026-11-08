# v191 — language switch repair & 20 Liquid Glass UI changes

Backup: backup/pre-v191-language-and-20-polish-20261108 at efd60b35a38713d7a4106305ea8cadf8b28b3548.

- New helper remaps old cached own prefixes (Me:, 我：, 私：) into the currently selected language without network.
- Fresh friend-list caches now store previewMine, preventing incorrect relabeling of received messages.
- On language switch, already visible friend previews and group/private own avatars update immediately even if group message cache is absent.
- Visible read receipts, quoted-reply titles and avatar accessible labels refresh in place.
- Own sender label standardizes to 私 in Japanese.
- 20 targeted CSS refinements: 01 dock translucency; 02 curved rim; 03 selected tab; 04 press response; 05 plus; 06 private/group more; 07 quick menu; 08 menu press; 09 menu icons; 10 long-press menu; 11 chat mode selector; 12 active mode; 13 search; 14 chat card edges; 15 task filter; 16 priority/repeat; 17 calendar arrows; 18 selected day; 19 appearance mode; 20 language selector.
- No changes to message send, image dimensions, group scrolling, Supabase, push or task persistence. Accessibility fallbacks included.
- iOS native optical refraction cannot be reproduced exactly in Safari; visuals are approximations.
