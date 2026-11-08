# v197 — English UI density and overlap fixes
Backup: backup/pre-v197-english-layout-20261108, base commit 66917d7ce06a3948f7af99f43155b48ada16e751.
- Bottom nav "Long-term Plans" renamed to "Goals" in English (Chinese/Japanese unchanged).
- Assets sub-tabs: Summary / Records / Investing / Budget / More.
- English finance buttons: + Holding / New trade / New entry.
- Shortened price/FX note.
- Five-column fixed grid for finance sub-tabs (prevents "InvestmentsBudgets" collision).
- Six-tab bottom dock: per-tab truncation and compact icons/labels, English only.
- Financial card headings, badges, description text and numbers adjusted on small screens.
- No changes to finance data storage keys, accounts, transactions, Supabase logic, chat or keyboard.
- Tests: JS parse and asset paths; iPhone UI rendering still needs real-device verification.
