# My Planner v221 — Daily history charts (2026-11-09)

## New charts
- **Overview (总览)**: daily **net worth** history (cash and non-credit account balances + holdings market value − credit liabilities).
- **Investing (投资)**: daily **investment market value** (holding share quantities × reference quote or saved manual price, converted to JPY using saved FX rates).
- Each chart supports 7 / 30 / 90 / 365-day windows, with actual recorded dates only. Missing-day connections are dashed, not fabricated values. An initial day shows a point rather than an invented trend.
- History stored in JPY in existing `doc.snapshots` (net worth) plus optional `doc.investmentSnapshots` (market value), retaining 366 samples each. New history is bundled in the existing `mpfinance-v196` JSON backups and `finance_documents.payload` synchronization, without a new database schema.
- The daily record uses the **Asia/Tokyo calendar date**. Repeated updates on the same day replace the current day's entry, not duplicate it.
- Recording runs when the app opens, on return to foreground, when reference quotes refresh, when finance is edited, and at a day rollover if the app is active.
- A temporary loss of reference quotes does not overwrite a higher-coverage same-day quote valuation unless the user explicitly saves a finance change.
- Existing legacy daily net-worth samples remain. Investment history begins once holdings are present; history is **not** backfilled with fabricated asset values.

## Limitations
- GitHub Pages / client-side PWAs cannot reliably write data while fully closed. A true unattended daily close requires a separately deployed, authorized scheduled backend job. No backend schedule has been deployed.
- Missing quotes use saved manual prices. Reference quotes can be delayed, unavailable, or stale. Price histories should not be used as a trading data feed.
- FX rates are manually configured; changing them changes how previously recorded JPY values are *displayed* in other currencies.
- Historical net worth includes deposits and withdrawals, so its change is not pure investment performance.

## Modified files
- `finance-v196.js` (new chart UI and capture logic)
- `finance-history-v221.css` (new lightweight chart design)
- `index.html`, `service-worker.js` (version bump to 221)

## Test cases
- Four shares at ¥54,250 plus ¥30,000 cash and ¥20,000 liabilities → investment market value ¥217,000; net worth ¥227,000.
- Running capture twice with unchanged data produces only one snapshot on the same date.
- A range containing only one date renders a point without a false trend.
- Verify signed-in finance_documents synchronization and Safari updates in a real user session.
