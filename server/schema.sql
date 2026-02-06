-- Sales Dashboard – SQLite schema
-- Run: sqlite3 sales.db < schema.sql (or use server/seed.js which creates tables)

-- Single row: overview KPIs
CREATE TABLE IF NOT EXISTS sales_kpis (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  forecast_arr REAL NOT NULL,
  pipeline_value REAL NOT NULL,
  closed_won INTEGER NOT NULL,
  win_rate REAL NOT NULL,
  forecast_arr_delta REAL,
  pipeline_value_delta REAL,
  closed_won_delta INTEGER,
  win_rate_delta REAL
);

-- Forecast over time (aggregated)
CREATE TABLE IF NOT EXISTS forecast_point (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  forecast REAL NOT NULL,
  target REAL NOT NULL
);

-- Forecast over time by segment (for filter)
CREATE TABLE IF NOT EXISTS forecast_point_by_segment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  segment TEXT NOT NULL,
  forecast REAL NOT NULL,
  target REAL NOT NULL
);

-- Pipeline by stage (bar chart)
CREATE TABLE IF NOT EXISTS pipeline_stage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  value REAL NOT NULL,
  count INTEGER NOT NULL
);

-- Deal distribution (donut) – segment share with color
CREATE TABLE IF NOT EXISTS deal_segment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  value REAL NOT NULL,
  fill TEXT NOT NULL
);

-- ARR by month (stacked bar chart)
CREATE TABLE IF NOT EXISTS arr_by_month_point (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  license REAL NOT NULL,
  minimum REAL NOT NULL,
  volume_driven REAL NOT NULL
);

-- ARR detail: license revenue by client/month
CREATE TABLE IF NOT EXISTS arr_license_detail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  client_name TEXT NOT NULL,
  amount REAL NOT NULL,
  segment TEXT NOT NULL
);

-- ARR detail: minimum revenue by client/month
CREATE TABLE IF NOT EXISTS arr_minimum_detail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  client_name TEXT NOT NULL,
  amount REAL NOT NULL,
  segment TEXT NOT NULL
);

-- ARR detail: volume-driven revenue by client/month
CREATE TABLE IF NOT EXISTS arr_volume_detail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL,
  client_name TEXT NOT NULL,
  transactions INTEGER NOT NULL,
  price_point REAL NOT NULL,
  amount REAL NOT NULL,
  segment TEXT NOT NULL
);

-- Pipeline deals (source for ACV by month and modals)
CREATE TABLE IF NOT EXISTS pipeline_deal (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  acv REAL NOT NULL,
  close_date TEXT NOT NULL,
  stage TEXT,
  segment TEXT NOT NULL
);

-- Client wins per period (line chart)
CREATE TABLE IF NOT EXISTS client_wins_point (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period TEXT NOT NULL,
  wins INTEGER NOT NULL
);

-- Client/accounts table
CREATE TABLE IF NOT EXISTS client_deal (
  id TEXT PRIMARY KEY,
  deal_name TEXT NOT NULL,
  close_date TEXT NOT NULL,
  segment TEXT NOT NULL,
  acv REAL NOT NULL,
  estimated_transactions_per_month INTEGER NOT NULL,
  deal_owner TEXT NOT NULL
);

-- Quarter deals (2026 Q1–Q4)
CREATE TABLE IF NOT EXISTS quarter_deal (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  deal_name TEXT NOT NULL,
  close_date TEXT NOT NULL,
  segment TEXT NOT NULL,
  acv REAL NOT NULL,
  arr_forecast REAL NOT NULL,
  annualized_transaction_forecast INTEGER NOT NULL,
  deal_owner TEXT NOT NULL,
  target_account INTEGER NOT NULL,
  latest_next_steps TEXT NOT NULL,
  confidence_quarter_close INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_forecast_point_month ON forecast_point(month);
CREATE INDEX IF NOT EXISTS idx_forecast_by_segment_month ON forecast_point_by_segment(month);
CREATE INDEX IF NOT EXISTS idx_pipeline_deal_close ON pipeline_deal(close_date);
CREATE INDEX IF NOT EXISTS idx_client_deal_close ON client_deal(close_date);
CREATE INDEX IF NOT EXISTS idx_quarter_deal_close ON quarter_deal(close_date);
CREATE INDEX IF NOT EXISTS idx_arr_license_month ON arr_license_detail(month);
CREATE INDEX IF NOT EXISTS idx_arr_minimum_month ON arr_minimum_detail(month);
CREATE INDEX IF NOT EXISTS idx_arr_volume_month ON arr_volume_detail(month);
