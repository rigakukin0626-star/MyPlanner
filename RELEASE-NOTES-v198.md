# v198 — Multi-currency assets (2026-11-08)

Pre-change rollback branch: `backup/pre-v198-multi-currency-20261108`.

Implemented:
- On the Assets header, choose JPY, CNY, USD, EUR, TWD, HKD, KRW, GBP, SGD or AUD.
- Summary, spending, investments, budgets and charts convert to selected currency.
- Accounts keep their own original currency, with a second converted value when different.
- New accounts may hold non-JPY native balances; existing accounts default to JPY.
- Add/edit FX rates in Assets > More/设置 > Manual FX rates. Rates are never claimed to be live.
- Cross-currency transfer books the origin amount and the destination amount separately.
- Expenses/income store JPY valuation at entry time for stable historical reports.
- Investment holdings support more currency codes. Trades preserve the cash account's FX snapshot.
- Legacy v197 accounts, trades and transactions remain readable without converting their stored figures.
- JSON backups retain preferences and native balances; CSV provides original amount, currency and JPY booking value.
- User's locale selector and dark/light mode remain unchanged.

Accounting validation checks:
- Credit card spending and repayment
- CNY bank and USD bank funding
- Cross-currency transfers and buy trades
- FX revaluation vs historical booked transaction value

Important limitations:
- The FX settings are MANUAL, with no real-time rates or automatic bank account aggregation.
- Existing Supabase cloud synchronization remains conditional on user having applied finance_documents schema/RLS. No database changes were made.
- Do not store bank credentials or card numbers in the app.
- Use JSON export backups while remote sync is unavailable.
