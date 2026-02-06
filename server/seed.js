/**
 * Creates schema and seeds the SQLite database with sample data
 * so the Sales Dashboard works out of the box.
 * Run: node seed.js
 */

const { getDb, initSchema } = require('./db');

initSchema();

const db = getDb();

// Helper
function num(x) {
  return typeof x === 'number' ? x : 0;
}

// --- Sales KPIs (single row)
db.prepare(
  `INSERT OR REPLACE INTO sales_kpis (id, forecast_arr, pipeline_value, closed_won, win_rate, forecast_arr_delta, pipeline_value_delta, closed_won_delta, win_rate_delta)
   VALUES (1, 2840000, 1920000, 12, 34, 4.2, -2.1, 1, 2.5)`
).run();

// --- Forecast point (aggregated)
db.prepare('DELETE FROM forecast_point').run();
db.prepare('DELETE FROM forecast_point_by_segment').run();
const forecastMonths = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const forecastIns = db.prepare('INSERT INTO forecast_point (month, forecast, target) VALUES (?, ?, ?)');
forecastMonths.forEach((month, i) => {
  const forecast = 2100000 + (i + 1) * 100000 + Math.floor(Math.random() * 50000);
  const target = 2400000 + (i + 1) * 20000;
  forecastIns.run(month, forecast, target);
});

// --- Forecast by segment
const segments = ['Bank & Bank Tech', 'Fintechs', 'Gateways', 'Large Merchants', 'HVHM'];
const shareOfTotal = [0.28, 0.24, 0.18, 0.18, 0.12];
const forecastBySeg = db.prepare(
  'INSERT INTO forecast_point_by_segment (month, segment, forecast, target) VALUES (?, ?, ?, ?)'
);
forecastMonths.forEach((month, mi) => {
  const baseF = 2100000 + (mi + 1) * 100000;
  const baseT = 2400000 + (mi + 1) * 20000;
  segments.forEach((segment, si) => {
    const forecast = Math.round(baseF * shareOfTotal[si] * (0.95 + Math.random() * 0.1));
    const target = Math.round(baseT * shareOfTotal[si]);
    forecastBySeg.run(month, segment, forecast, target);
  });
});

// --- Pipeline stage
db.prepare('DELETE FROM pipeline_stage').run();
const stages = [
  ['Qualification', 420000, 18],
  ['Discovery', 380000, 12],
  ['Proposal', 520000, 8],
  ['Negotiation', 350000, 5],
  ['Closed Won', 250000, 4],
];
const stageIns = db.prepare('INSERT INTO pipeline_stage (name, value, count) VALUES (?, ?, ?)');
stages.forEach(([name, value, count]) => stageIns.run(name, value, count));

// --- Deal segment
const colors = ['#1e1b4b', '#3730a3', '#0ea5e9', '#38bdf8', '#7dd3fc'];
db.prepare('DELETE FROM deal_segment').run();
const dealSegIns = db.prepare('INSERT INTO deal_segment (name, value, fill) VALUES (?, ?, ?)');
segments.forEach((name, i) => dealSegIns.run(name, [28, 24, 18, 18, 12][i], colors[i % colors.length]));

// --- ARR by month
const arrMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
db.prepare('DELETE FROM arr_by_month_point').run();
const arrByMonthIns = db.prepare(
  'INSERT INTO arr_by_month_point (month, license, minimum, volume_driven) VALUES (?, ?, ?, ?)'
);
arrMonths.forEach((month, i) => {
  const license = 80000 + Math.floor(Math.random() * 140000);
  const minimum = 40000 + Math.floor(Math.random() * 80000);
  const volumeDriven = 20000 + Math.floor(Math.random() * 80000);
  arrByMonthIns.run(month, license, minimum, volumeDriven);
});

// --- ARR detail (sample for first 3 months)
db.prepare('DELETE FROM arr_license_detail').run();
db.prepare('DELETE FROM arr_minimum_detail').run();
db.prepare('DELETE FROM arr_volume_detail').run();
const sampleClients = ['Acme Corp', 'Beta Inc', 'Gamma Ltd', 'Delta Solutions', 'Epsilon Group'];
['Jan', 'Feb', 'Mar'].forEach((month) => {
  const licIns = db.prepare('INSERT INTO arr_license_detail (month, client_name, amount, segment) VALUES (?, ?, ?, ?)');
  [[sampleClients[0], 90000], [sampleClients[1], 90000]].forEach(([client, amount]) =>
    licIns.run(month, client, amount, segments[0])
  );
  const minIns = db.prepare('INSERT INTO arr_minimum_detail (month, client_name, amount, segment) VALUES (?, ?, ?, ?)');
  [[sampleClients[2], 40000], [sampleClients[3], 40000]].forEach(([client, amount]) =>
    minIns.run(month, client, amount, segments[2])
  );
  const volIns = db.prepare(
    'INSERT INTO arr_volume_detail (month, client_name, transactions, price_point, amount, segment) VALUES (?, ?, ?, ?, ?, ?)'
  );
  volIns.run(month, sampleClients[4], 1200, 25, 30000, segments[4]);
});

// --- Pipeline deals
const dealNames = [
  'Acme Corp – Platform', 'Beta Inc – Enterprise', 'Gamma Ltd – Standard', 'Delta Solutions – Premium',
  'Epsilon Group – Platform', 'Zeta Industries – Enterprise', 'Eta Partners – Standard', 'Theta Systems – Premium',
];
db.prepare('DELETE FROM pipeline_deal').run();
const pipelineIns = db.prepare(
  'INSERT INTO pipeline_deal (id, name, acv, close_date, stage, segment) VALUES (?, ?, ?, ?, ?, ?)'
);
let dealId = 1;
['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'].forEach((closeDate) => {
  const n = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) {
    const name = dealNames[(dealId + i) % dealNames.length];
    pipelineIns.run(
      `deal-${dealId++}`,
      name,
      40000 + Math.floor(Math.random() * 240000),
      closeDate,
      ['Proposal', 'Negotiation', 'Closed Won'][Math.floor(Math.random() * 3)],
      segments[Math.floor(Math.random() * segments.length)]
    );
  }
});

// --- Client wins
db.prepare('DELETE FROM client_wins_point').run();
const winsIns = db.prepare('INSERT INTO client_wins_point (period, wins) VALUES (?, ?)');
[
  'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
  'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026',
].forEach((period) => winsIns.run(period, 1 + Math.floor(Math.random() * 7)));

// --- Client deal (accounts)
db.prepare('DELETE FROM client_deal').run();
const clientDealIns = db.prepare(
  'INSERT INTO client_deal (id, deal_name, close_date, segment, acv, estimated_transactions_per_month, deal_owner) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
const owners = ['Alex Morgan', 'Jordan Smith', 'Sam Taylor', 'Casey Lee', 'Riley Brown'];
for (let i = 1; i <= 20; i++) {
  const month = (i % 12) || 12;
  const year = i <= 12 ? 2025 : 2026;
  const closeDate = `${year}-${String(month).padStart(2, '0')}-${String(15).padStart(2, '0')}`;
  clientDealIns.run(
    `client-deal-${i}`,
    `${sampleClients[i % sampleClients.length]} – ${['Platform', 'Enterprise', 'Standard'][i % 3]}`,
    closeDate,
    segments[i % segments.length],
    30000 + Math.floor(Math.random() * 320000),
    500 + Math.floor(Math.random() * 50000),
    owners[i % owners.length]
  );
}

// --- Quarter deals
const nextSteps = [
  'Follow-up call scheduled for next week.',
  'Demo completed. Sending pricing proposal.',
  'Contract sent for signature.',
  'Discovery call done. Preparing ROI deck.',
];
db.prepare('DELETE FROM quarter_deal').run();
const quarterIns = db.prepare(
  `INSERT INTO quarter_deal (id, client_name, deal_name, close_date, segment, acv, arr_forecast, annualized_transaction_forecast, deal_owner, target_account, latest_next_steps, confidence_quarter_close)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);
const quarterMonths = { '2026Q1': [1, 2, 3], '2026Q2': [4, 5, 6], '2026Q3': [7, 8, 9], '2026Q4': [10, 11, 12] };
['2026Q1', '2026Q2', '2026Q3', '2026Q4'].forEach((q) => {
  const months = quarterMonths[q];
  months.forEach((m, i) => {
    const closeDate = `2026-${String(m).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`;
    const acv = 40000 + Math.floor(Math.random() * 280000);
    quarterIns.run(
      `quarter-${q}-${m}-${i + 1}`,
      sampleClients[i % sampleClients.length],
      `${sampleClients[i % sampleClients.length]} – Platform`,
      closeDate,
      segments[i % segments.length],
      acv,
      Math.round(acv * 0.9),
      50000 + Math.floor(Math.random() * 400000),
      owners[i % owners.length],
      1,
      nextSteps[i % nextSteps.length],
      60 + Math.floor(Math.random() * 35)
    );
  });
});

console.log('Database seeded successfully. Run "node api.js" to start the API.');
