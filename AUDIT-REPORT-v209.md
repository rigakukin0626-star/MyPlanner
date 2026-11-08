# My Planner — v209 code audit
Date: 2026-11-09. Based on main v208, with fixes on feature/v209-audit-fixes-20261109.

## Confirmed and corrected
1. Foreign-currency accounts without manual FX are exportable but failed JSON import because import validation wrongly required exchange rates. Optional rates are now allowed; malformed supplied rates remain rejected.
2. Expenses without FX propagated NaN into category chart and budgets. Spending totals are now currency-aware and display a clear unavailable state for unknown conversions.
3. Budgets previously treated all expense amounts as JPY and ignored native units. New budgets save the recording currency. Legacy budgets without a currency retain the old JPY interpretation.
4. Same-currency transfer previews incorrectly asked for FX. They now calculate directly.
5. CNY negative values appeared as ¥-100.00. Corrected to −¥100.00.
6. Credit due-date notices used a synthetic 28-day month, causing incorrect alerts around month ends. Replaced with actual calendar dates.
7. JSON CSV exports wrote NaN for unavailable FX conversions. Now the JPY booked-value cell is blank.
8. App navigation checked the private-chat state only, losing the chat-open state when returning to a group chat. Both private and group states are now checked.
9. Reconciliation fields used step=1, which prevented fractional bank/foreign-currency amounts. Updated to step=any.

## Checks performed
- JavaScript syntax: script.js, finance-v196.js, line-ui.js, service-worker.js and two inline scripts: all PASS.
- No duplicate static HTML IDs.
- No referenced local assets missing in index.html or service-worker.js.
- Cache and script version mapping both use v209.
- Finance test cases: 17/17 passing for native CNY assets, spending, card repayment, transfers, budgets, NaN-safe rendering, converted totals and negative signs.
- JSON restore tests: CNY without FX accepted; invalid supplied rate rejected.
- Card reminder calendar tests: next-month due date handled correctly.

## Still open / cannot honestly mark resolved
HIGH — iOS Safari/PWA keyboard and chat viewport alignment. v208 uses a new unified visual viewport but real-device testing remains essential. Historical keyboard styles v194, v195, v206, v207 and v208 coexist; removing redundant rules after validating v208 would reduce regressions. No actual iPhone UI session was available to this audit.
HIGH — Brokerage holdings and trades still require manual JPY FX for many non-JPY valuations, even though cash accounts no longer require manual FX. This needs an accounting migration, not a cosmetic change.
MEDIUM — Multiple different currencies without conversion rates intentionally make consolidated net worth unavailable (—), rather than guessing exchange rates.
MEDIUM — Deleting an account also irreversibly deletes its linked transfers and trade records after confirmation. Export JSON before deletion; future design should offer archival or preservation.
MEDIUM — The net-worth history is recorded as a JPY-valued snapshot, even when another recording currency is selected.
LOW — The page currently loads roughly 24 CSS stylesheets. The layering and multiple !important overrides increase maintenance and iOS layout regression risk.
DEPENDENCY — Finance cloud sync requires the authenticated Supabase finance_documents table and RLS policies, not verified in this audit.

## Data safety
Pre-change backup branch: backup/pre-v209-audit-fixes-20261109. Code changes did not reset or migrate the local user data keys. User iPhone data and production Supabase records were not directly accessed.
