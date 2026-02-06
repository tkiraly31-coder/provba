/**
 * SQLite database access for Sales Dashboard API.
 * Uses better-sqlite3 (sync API).
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.SALES_DB_PATH || path.join(__dirname, 'sales.db');
let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH, { readonly: false });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initSchema() {
  const fs = require('fs');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  getDb().exec(sql);
}

// --- Sales KPIs (single row)
function getSalesKPIs() {
  const row = getDb().prepare('SELECT * FROM sales_kpis WHERE id = 1').get();
  if (!row) return null;
  return {
    forecastARR: row.forecast_arr,
    pipelineValue: row.pipeline_value,
    closedWon: row.closed_won,
    winRate: row.win_rate,
    forecastARRDelta: row.forecast_arr_delta ?? undefined,
    pipelineValueDelta: row.pipeline_value_delta ?? undefined,
    closedWonDelta: row.closed_won_delta ?? undefined,
    winRateDelta: row.win_rate_delta ?? undefined,
  };
}

// --- Forecast
function getForecastPoint() {
  return getDb()
    .prepare('SELECT month AS month, forecast AS forecast, target AS target FROM forecast_point ORDER BY month')
    .all();
}

function getForecastPointBySegment() {
  return getDb()
    .prepare(
      'SELECT month AS month, segment AS segment, forecast AS forecast, target AS target FROM forecast_point_by_segment ORDER BY month, segment'
    )
    .all();
}

// --- Pipeline stage
function getPipelineStage() {
  return getDb()
    .prepare('SELECT name AS name, value AS value, count AS count FROM pipeline_stage ORDER BY id')
    .all();
}

// --- Deal segment
function getDealSegment() {
  return getDb()
    .prepare('SELECT name AS name, value AS value, fill AS fill FROM deal_segment ORDER BY id')
    .all();
}

// --- ARR by month
function getARRByMonthPoint() {
  return getDb()
    .prepare(
      'SELECT month AS month, license AS license, minimum AS minimum, volume_driven AS volumeDriven FROM arr_by_month_point ORDER BY month'
    )
    .all();
}

function buildDetailsByMonth() {
  const license = getDb()
    .prepare('SELECT month, client_name AS clientName, amount, segment FROM arr_license_detail')
    .all();
  const minimum = getDb()
    .prepare('SELECT month, client_name AS clientName, amount, segment FROM arr_minimum_detail')
    .all();
  const volume = getDb()
    .prepare(
      'SELECT month, client_name AS clientName, transactions, price_point AS pricePoint, amount, segment FROM arr_volume_detail'
    )
    .all();
  const months = new Set([...license.map((r) => r.month), ...minimum.map((r) => r.month), ...volume.map((r) => r.month)]);
  const detailsByMonth = {};
  for (const month of months) {
    detailsByMonth[month] = {
      license: license.filter((r) => r.month === month).map((r) => ({ clientName: r.clientName, amount: r.amount, segment: r.segment })),
      minimum: minimum.filter((r) => r.month === month).map((r) => ({ clientName: r.clientName, amount: r.amount, segment: r.segment })),
      volumeDriven: volume
        .filter((r) => r.month === month)
        .map((r) => ({
          clientName: r.clientName,
          transactions: r.transactions,
          pricePoint: r.pricePoint,
          amount: r.amount,
          segment: r.segment,
        })),
    };
  }
  return detailsByMonth;
}

// --- Pipeline deals
function getPipelineDeal() {
  return getDb()
    .prepare(
      'SELECT id, name, acv, close_date AS closeDate, stage, segment FROM pipeline_deal ORDER BY close_date, acv DESC'
    )
    .all();
}

// ACV by month derived from pipeline_deal
const MONTH_LABELS = {
  '2026-01': 'Jan 2026', '2026-02': 'Feb 2026', '2026-03': 'Mar 2026', '2026-04': 'Apr 2026',
  '2026-05': 'May 2026', '2026-06': 'Jun 2026', '2026-07': 'Jul 2026', '2026-08': 'Aug 2026',
  '2026-09': 'Sep 2026', '2026-10': 'Oct 2026', '2026-11': 'Nov 2026', '2026-12': 'Dec 2026',
};

function getACVByMonth() {
  const rows = getDb()
    .prepare('SELECT close_date AS monthKey, SUM(acv) AS totalACV FROM pipeline_deal GROUP BY close_date ORDER BY monthKey')
    .all();
  return rows.map((r) => ({
    month: MONTH_LABELS[r.monthKey] || r.monthKey,
    monthKey: r.monthKey,
    totalACV: r.totalACV,
  }));
}

// --- Client wins
function getClientWinsPoint() {
  return getDb()
    .prepare('SELECT period AS period, wins AS wins FROM client_wins_point ORDER BY period')
    .all();
}

// --- Client deal (accounts)
function getClientDeal() {
  return getDb()
    .prepare(
      'SELECT id, deal_name AS dealName, close_date AS closeDate, segment, acv, estimated_transactions_per_month AS estimatedTransactionsPerMonth, deal_owner AS dealOwner FROM client_deal ORDER BY close_date'
    )
    .all();
}

// --- Quarter deal
function getQuarterDeal() {
  return getDb()
    .prepare(
      `SELECT id, client_name AS clientName, deal_name AS dealName, close_date AS closeDate, segment, acv,
        arr_forecast AS arrForecast, annualized_transaction_forecast AS annualizedTransactionForecast,
        deal_owner AS dealOwner, target_account AS targetAccount, latest_next_steps AS latestNextSteps,
        confidence_quarter_close AS confidenceQuarterClose
       FROM quarter_deal ORDER BY close_date`
    )
    .all();
}

/**
 * Returns the full LoadedSalesData shape expected by the frontend.
 */
function getLoadedSalesData() {
  const arrByMonthPoint = getARRByMonthPoint();
  return {
    salesKPIs: getSalesKPIs(),
    forecastPoint: getForecastPoint(),
    forecastPointBySegment: getForecastPointBySegment(),
    pipelineStage: getPipelineStage(),
    dealSegment: getDealSegment(),
    arrByMonthPoint,
    detailsByMonth: buildDetailsByMonth(),
    pipelineDeal: getPipelineDeal(),
    acvByMonth: getACVByMonth(),
    clientWinsPoint: getClientWinsPoint(),
    clientDeal: getClientDeal(),
    quarterDeal: getQuarterDeal(),
  };
}

module.exports = {
  getDb,
  initSchema,
  getLoadedSalesData,
  getSalesKPIs,
  getForecastPoint,
  getForecastPointBySegment,
  getPipelineStage,
  getDealSegment,
  getARRByMonthPoint,
  buildDetailsByMonth,
  getPipelineDeal,
  getACVByMonth,
  getClientWinsPoint,
  getClientDeal,
  getQuarterDeal,
};
