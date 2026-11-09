# My Planner v222 — linked investment and net worth updates (2026-11-09)

## Behavior
- The **investment curve** uses the value of all held securities (quantity × current available reference price, converted to JPY using the user's configured manual FX settings).
- The **net worth curve** uses account and cash balances + investment market value − liabilities. Finance transactions, income, transfers, expenses, share trades, and liability changes update the model immediately after being saved.
- While the **Finance** screen is open in Overview or Investing and the user is signed in, the app checks for new reference quotes about **every three minutes** (60-second timer, three-minute request throttle). On opening/resuming, the existing refresh mechanism also runs.
- Successful quote requests update both history series for the current Asia/Tokyo day and refresh UI. Previous dates are unchanged.
- The latest quote timestamp is displayed beside the investment quote status.
- App closed or offline: no scheduled web requests or fabricated prices. Quote data comes from an **unofficial Yahoo Finance endpoint** via the existing Supabase `finance-quotes` function, so it can be delayed, rate-limited or unavailable. It is **not exchange-grade tick-by-tick streaming**.
- No new Supabase migration or Edge Function deployment required. No changes to the recorded holding cost or manually recorded trade price.
- Existing chart ranges 7/30/90/365 days and local/cloud finance-document storage remain intact.

## Calculation test (JPY)
Starting cash ¥30,000, stock 4 × ¥54,250, credit liability ¥20,000:
Investment ¥217,000; net worth ¥227,000.
At stock price ¥55,000: investment ¥220,000; net worth ¥230,000.
Bank expense ¥5,000: investment remains ¥220,000; net worth ¥225,000.
Credit card expense ¥2,000: investment remains ¥220,000; net worth ¥223,000.
Only one row per date in each history.
