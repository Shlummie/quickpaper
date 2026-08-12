# QuickPaper

A zero-dependency local paper-trading dashboard served by Node.js. It proxies chart data from Yahoo Finance, keeps the simulated portfolio in browser storage, and supports long and short paper positions without connecting to a broker.

## Features

- Start with a $10,000 simulated cash balance.
- Look up symbols and request recent chart/quote data through the local server.
- Open/add to long positions, sell longs, open short positions, and cover shorts.
- Inspect positions, profit/loss, account equity, and a trade journal.
- Hover the chart for time/price detail.
- Export a JSON backup, restore it later, or reset all local paper state.
- Shut down the local server through its explicit API route.

## Architecture

```text
browser UI -> 127.0.0.1 Node server -> Yahoo Finance chart endpoint
     |
     +-> localStorage portfolio, journal, preferences, backup/restore
```

The server exists to avoid browser cross-origin restrictions and to surface provider errors. It listens only on `127.0.0.1:4173` by default.

## Run

Requirements: Node.js 18+.

```bash
npm start
```

Open `http://127.0.0.1:4173`. On Windows, `Start QuickPaper.bat` starts the same server. Use the application's shutdown control or stop the terminal process when finished.

No npm runtime dependencies are required.

## Data and limitations

Portfolio state is local to the browser profile and origin. Clearing site data erases it unless a backup was exported. Backup files may contain a full simulated trading history.

Quotes may be delayed, adjusted, stale, or unavailable. The simulator does not fully model spreads, commissions, fees, dividends, corporate actions, borrow availability/cost, margin calls, order types, market hours, liquidity, or taxes. Shorts are modeled distinctly but remain simplified.

## Financial disclaimer

For education and software experimentation only. It does not place real orders and is not investment advice. Verify market data independently before any financial decision.

## License

Original source is MIT licensed. Yahoo Finance and any market data remain subject to their provider terms.
