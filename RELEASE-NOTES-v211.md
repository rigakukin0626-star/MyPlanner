# v211 — Group composer scrolling & photo usability

- Group message list now tracks its own height while iOS keyboard opens; when the reader is following the latest messages, it keeps the most recent bubble visible.
- Tapping the group composer resumes latest-message follow mode. Manually swiping to read history continues to suspend auto-follow.
- Keyboard viewport changes repin only when appropriate; existing private chat logic remains unchanged.
- Composer focus styling is softer; image bubbles stay within the available chat width.
- Existing messages, storage permissions, finance data and network/send behavior are untouched.
- The floating call video and Safari URL/keyboard accessories seen on the iPhone screenshot are outside the web app and cannot be removed by its CSS.
- Static checks passed; actual iPhone behavior still requires on-device verification.