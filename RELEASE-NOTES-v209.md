# My Planner v209 — Tested code audit corrections

Backup: backup/pre-v209-audit-fixes-20261109 (v208).
- Foreign-currency accounts without exchange rates are valid by design. JSON import now accepts these accounts and verifies only rates explicitly supplied.
- Budget tracking keeps each budget's original currency. Legacy budgets (pre-v209) default to JPY; new budgets use the selected recording currency. Expense totals convert only when reliable rates are present; otherwise they display an unavailable value, not NaN.
- Spending-by-category displays the selected recording currency; unavailable conversions show an explanation rather than a broken percentage bar.
- Same-currency transfers preview the amount without requiring an exchange rate.
- CNY negative amounts format as −¥100.00, not ¥-100.00.
- The credit-card due-date warning calculates actual calendar days across month ends rather than 28-day modulo.
- CSV exports blank JPY valuation when no rate is available (instead of NaN).
- Switching back to a group conversation restores the chat-open state.
- No changes to stored account balances, existing transactions, finance database tables, private or group message records, or keyboard positioning.
- Code/functional tests are run separately. Live iOS Safari layout and Supabase cloud interactions still require real-device verification.
