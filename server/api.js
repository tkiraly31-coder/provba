/**
 * Express API for Sales Dashboard – serves data from SQLite.
 * Start: node api.js
 * Default port: 3001. Set PORT env to override.
 */

const express = require('express');
const cors = require('cors');
const { initSchema, getLoadedSalesData, getQuarterDeal } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json());

// Initialize DB and schema on startup
initSchema();

// Single endpoint: full sales data (same shape as LoadedSalesData / Google Sheets)
app.get('/api/sales-data', (req, res) => {
  try {
    const data = getLoadedSalesData();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Optional: quarter deals by quarter (for direct fetch if needed)
app.get('/api/quarter-deals/:quarter', (req, res) => {
  const quarter = req.params.quarter;
  const valid = ['2026Q1', '2026Q2', '2026Q3', '2026Q4'];
  if (!valid.includes(quarter)) {
    return res.status(400).json({ error: 'Invalid quarter' });
  }
  const months = { '2026Q1': [1, 2, 3], '2026Q2': [4, 5, 6], '2026Q3': [7, 8, 9], '2026Q4': [10, 11, 12] };
  try {
    const all = getQuarterDeal();
    const monthSet = new Set(months[quarter].map((m) => m.toString().padStart(2, '0')));
    const filtered = all.filter((d) => {
      const m = d.closeDate.slice(5, 7);
      return monthSet.has(m);
    });
    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, source: 'sql' });
});

app.listen(PORT, () => {
  console.log(`Sales Dashboard API running at http://localhost:${PORT}`);
  console.log('  GET /api/sales-data  – full dashboard data');
  console.log('  GET /api/quarter-deals/:quarter – deals for 2026Q1–Q4');
});
