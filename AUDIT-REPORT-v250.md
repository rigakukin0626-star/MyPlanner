# MY SUITE — code audit / v250 (2026-11-10)

## Scope
Static review of the GitHub Pages PWA: `index.html`, `script.js`, `finance-v196.js`, `line-ui.js`, `service-worker.js`, manifest, Supabase SQL policies, and the two Edge Function source files. No production database contents, authenticated live Supabase session, or iPhone runtime instrumentation were available.

## Verified and fixed (v248–v249)
1. **Cross-account task cache:** `myPlannerTasks`, tombstones and `myPlannerCloudInitialized` used one unscoped storage key. User-ID-scoped keys and non-destructive one-time legacy migration now prevent new accounts from inheriting another user's cached tasks.
2. **Async task synchronization:** Cloud writes, reads and pending deletes now verify their captured owner before applying stale results.
3. **Sign-out chat cleanup:** The previous signed-in identity is tracked independently of a potentially cleared `currentUser`, ensuring chat state cleanup runs on sign-out.
4. **Finance JSON download:** Anchor is attached to the document before clicking and blob URL remains valid longer for iOS.
5. **CSV injection:** CSV text values beginning with spreadsheet formula prefixes are escaped.
6. **Invalid cloud finance payload:** A malformed account payload cannot replace the locally saved finance document via the normal fetch path.
7. **Push icon:** Notification icon now references the MY SUITE image.
8. **Older v247 fixes retained:** Key-order-insensitive JSONB comparison, stale finance read protection, optimistic revisions, and explicit empty-upload safeguards.

## Source hardening (v250 — requires Supabase deployment)
9. **Quote Edge Function authentication:** Adds an explicit Supabase Auth user-token check. This Git commit alone does **not** redeploy the Edge Function. Confirm the `finance-quotes` function uses `verify_jwt=true` and redeploy the updated source before considering the server fix active.

## Checks run
- JavaScript parsing: `script.js`, `finance-v196.js` and `service-worker.js` passed.
- Simulated task storage: legacy migration, user A → guest, user A → user B, and returning to A passed.
- Finance JSONB equality: object key reordering is ignored; real amount and array-order differences are still detected.
- Cached PWA assets and HTML references: checked against repository filenames in v247, with no missing paths.
- GitHub Pages builds: v248 and v249 completed successfully.

## Outstanding risks / not verified
- **Production security:** Live RLS and Edge Function `verify_jwt` settings were not inspectable. Source SQL is not proof the policies are installed.
- **Reminder scheduler:** A three-minute due window may miss reminders when scheduling is delayed. A worker crash after the delivery claim may leave an unsent claim unrecoverable. Requires backend-specific integration tests before altering production reminders.
- **Quote service:** Unofficial upstream data can be delayed/blocked. Server-side rate limiting is still recommended.
- **Client-side financial data:** Local browser storage is not an encrypted vault; preserve cloud sync and JSON backups, and avoid treating this as a regulated banking service.
- **External dependencies:** CDN script is on a floating major version without SRI; pin and test updates separately.
- **Test coverage:** No authenticated multi-device E2E, real push delivery, Supabase permissions test suite, or full iPhone visual/keyboard audit was performed.

**Recovery:** The GitHub branch `backup/before-v248-code-audit-20261110` contains the v247 state; `backup/before-v249-auth-cleanup-20261110` and `backup/before-v250-finance-quote-auth-20261110` preserve the subsequent states. Do not destroy local or cloud data during any rollback.
