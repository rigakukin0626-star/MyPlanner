# My Planner v216 — finance quotes and read receipts (2026-11-09)

## Source changes
- New TradingView Advanced Chart iframe shell: `market-chart-v216.html`. On some Safari/iOS environments, third-party embeds may still be blocked; the quote sheet preserves a TradingView external link.
- Holdings show reference/manual price, time, remaining quantity, weighted average cost, and estimated *unrealized* gain/loss. New reference prices change the displayed value; recorded cost and manually stored price are **not overwritten**. Calculation excludes fees, taxes, splits and FX differences.
- Optional Supabase Edge Function `finance-quotes` for Japanese securities. Uses an *unofficial* Yahoo Finance endpoint. Data latency is not guaranteed; if unavailable it falls back to manual prices and displays a warning. For production or sharing, switch to an appropriately licensed data provider.
- Private chat unread badges are removed only after server confirmation; the list refetches after closing a chat.
- Service worker and script versions bumped to 216.

## Actions required in Supabase (cannot be performed by GitHub commit)
1. Supabase SQL Editor: run `supabase/finance-documents-v196.sql` once. Existing local finance records are not deleted. RLS restricts each signed-in user to their own document.
2. Supabase SQL Editor: run `supabase/chat-mark-read-v216.sql` once to make private-chat read marking reliable. No messages are deleted.
3. Supabase > Edge Functions > Deploy new function > Via Editor: create **finance-quotes**, copy `supabase/functions/finance-quotes/index.ts`, deploy, keep Verify JWT on for authenticated usage.
4. Open My Planner, sign in, Assets > Investing > Refresh quotes. If the provider fails or the function is not deployed, manual prices remain the valuation fallback.
5. For iOS web app refresh: close and relaunch the PWA after the GitHub Pages deployment/cache update.

## Known limitations
- Chart loading is third-party, cannot be guaranteed inside every iOS web view.
- A market-data API or provider agreement is necessary for a guaranteed 10–15-minute feed. The temporary unofficial endpoint has no SLA.
- No actual Supabase migration or Edge Function deployment occurs merely by adding files in GitHub.
- Verify data in your brokerage account before acting on any quote.
- Test with a second chat account to confirm sender receipts and recipient badges.
