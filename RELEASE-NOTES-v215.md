# v215 — In-app Tokyo market charts

The Investment page's Japanese ticker quote action opens a My Planner sheet
with a TradingView Symbol Overview chart and quote. A 1570 holding resolves to
TSE:1570. TradingView's public embeds display exchange-delayed equity quotes,
not exchange-licensed true real-time tick-by-tick prices.

An isolated iframe hosts the third-party embed so it cannot access the host
app's local asset/chat storage. The iframe has sandbox allow-scripts and
allow-popups but not allow-same-origin. If the external widget is blocked,
a TradingView source link is available from the in-app sheet.

Manual holding prices, cost basis, transactions, balances, and cloud sync are
unchanged. Provider data does not automatically overwrite asset valuations.

New static document market-chart-v215.html is precached. The service worker
routes its navigations separately so they cannot overwrite the index.html
offline app shell. Widget data requires network access.

Backup: backup/pre-v215-in-app-market-charts-20261109.
Browser/iPhone display needs on-device verification.
