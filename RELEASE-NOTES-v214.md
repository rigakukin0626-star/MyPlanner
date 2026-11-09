# v214 — Holding trades without a linked cash account

Root bug: addTrade() used one combined guard for zero holdings OR no cash accounts and displayed '暂无持仓' for both. A user with four shares of 1570 and no bank account was incorrectly told no holdings existed.

Fix:
- Only an empty holdings list triggers '暂无持仓'.
- Trade dialog has an explicit 'quantity only, no cash movement' option. It can be used without any linked bank/brokerage account; buys and sells update holding units.
- Linking an existing account remains available; actual cash debits/credits still apply only to linked accounts.
- A localized warning explains that unlinked trades do not account for purchase costs or proceeds and may make net worth incomplete.
- Fractional trading fees supported.
- No existing holdings, balances, or transactions were changed by migration.

Quote integration investigation:
- Japanese exchange quotes are available from licensed third-party market data APIs. JPX retail J-Quants OHLC is updated daily, not truly live.
- A real-time feed would require a market data service with Tokyo Stock Exchange ETF coverage and a secure, server-side API key, plus data licensing.
- v214 intentionally does not use unverified scraping or mislabel delayed data as real time.

Rollback: backup/pre-v214-trades-without-cash-account-20261109.
