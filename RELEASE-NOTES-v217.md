# My Planner v217 · Native stock charts and redesigned holdings (2026-11-09)

## What changed
- The price popup **no longer embeds TradingView**. TradingView sometimes displayed the unrelated Apple chart or rejected `TSE:1570` inside third-party embeds. App now renders its own SVG from the actual requested TSE symbol's OHLC bars.
- The native chart supports **1D / 5D / 1M / 3M / 1Y**, with line or candlestick view. It only draws returned market prices, not synthetic/demo prices. When history is unavailable it shows an explicit error message instead of unrelated stock data.
- The **holdings row** now has separate lines for the ticker, quantity, price/time, average cost, market value and unrealized P&L. Information no longer competes for one horizontal line on narrow iPhones.
- Existing manual prices and recorded trade/cost data are preserved.
- PWA static asset and cache versions bumped to **v217**.
- Added `finance-chart-v217.css`, changed `finance-v196.js`, `index.html`, `service-worker.js`, and extended `supabase/functions/finance-quotes/index.ts`.

## Important: update the deployed Edge Function
These changes to GitHub **do not automatically deploy the Supabase function**.
1. Open Supabase Dashboard -> Edge Functions -> **finance-quotes** -> Edit code.
2. Replace its code with `supabase/functions/finance-quotes/index.ts` from the latest GitHub main, then Deploy updates.
3. Keep Verify JWT enabled as before.
4. On iPhone, close and reopen My Planner, then select Finance -> Investing -> View quote -> try 1D, 1M, Candles.
5. If chart cannot load, confirm the Edge Function deployed version supports `{symbols:["1570"],period:"1mo"}` and returns `history.bars`. If it only returns `quotes`, the old function is still deployed.

## Data-source limitations
The current source is an **unofficial Yahoo Finance chart endpoint** and has no guaranteed availability or fixed delay. It may not be licensed for redistribution in a multi-user production app. Use an appropriately licensed market-data vendor for a reliable commercial deployment. Prices are reference data only; do not rely on them to trade.
