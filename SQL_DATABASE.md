# Sales Dashboard – SQL database

The dashboard can use an **SQLite** database as the data source instead of mock data or Google Sheets.

## Quick start

1. **Install and seed the database**
   ```bash
   cd server
   npm install
   npm run seed
   ```

2. **Start the API**
   ```bash
   npm start
   ```
   API runs at `http://localhost:3001`.

3. **Point the frontend at the API**
   - Create a `.env` in the **project root** (next to `package.json`):
     ```
     VITE_API_URL=http://localhost:3001
     ```
   - Restart the Vite dev server and open the Sales Dashboard. It will load data from the API.

4. **Run the dashboard**
   From the project root:
   ```bash
   npm run dev
   ```

## Data priority

When multiple sources are configured, the app uses:

1. **SQL API** – if `VITE_API_URL` is set
2. **Google Sheets** – if `googleSheetsConfig` has a spreadsheet ID and sheet GIDs
3. **Mock data** – otherwise

## Server layout

| Path | Purpose |
|------|--------|
| `server/schema.sql` | Table definitions (sales_kpis, forecast_point, pipeline_deal, etc.) |
| `server/db.js` | SQLite access and query helpers |
| `server/api.js` | Express server; `GET /api/sales-data` returns the full dashboard payload |
| `server/seed.js` | Creates tables and inserts sample data |
| `server/sales.db` | SQLite database file (created by seed/API, ignored by git) |

## API

- **GET /api/sales-data** – Full dashboard data (same shape as Google Sheets / mock).
- **GET /api/quarter-deals/:quarter** – Deals for `2026Q1`–`2026Q4`.
- **GET /api/health** – `{ "ok": true, "source": "sql" }`.

## Customising the database

- **DB path:** set `SALES_DB_PATH` when starting the server (default: `server/sales.db`).
- **Port:** set `PORT` (default: `3001`).
- **Schema:** edit `server/schema.sql` and re-run `node server/seed.js` (seed clears and re-inserts; for production you’d use migrations).
- **Data:** replace or extend `server/seed.js`, or insert/update via your own scripts using the same tables.

## Table overview

| Table | Purpose |
|-------|--------|
| `sales_kpis` | Single row: forecast ARR, pipeline value, closed won, win rate (+ deltas) |
| `forecast_point` | Forecast vs target by month (aggregated) |
| `forecast_point_by_segment` | Forecast by month and segment (for segment filter) |
| `pipeline_stage` | Pipeline value and count by stage |
| `deal_segment` | Deal distribution (donut) – segment name, value %, fill color |
| `arr_by_month_point` | ARR by month (license, minimum, volume_driven) |
| `arr_license_detail`, `arr_minimum_detail`, `arr_volume_detail` | Per-client ARR detail by month |
| `pipeline_deal` | Deals with ACV and close date (ACV-by-month is derived) |
| `client_wins_point` | Wins count per period |
| `client_deal` | Accounts table (deal name, close date, segment, ACV, owner, etc.) |
| `quarter_deal` | Quarter view deals (2026 Q1–Q4) with forecast and next steps |

See `DATA_STRUCTURES.md` for the exact TypeScript shapes the dashboard expects.
