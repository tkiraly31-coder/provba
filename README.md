# Commercial KPI Dashboard

A comprehensive KPI dashboard for visualizing commercial pipeline data, including pipeline development, pipeline size, and deal activity - all filterable by sales person.

## Features

- **Pipeline Development Chart**: Line chart showing pipeline size trends over time
- **Pipeline Size Chart**: Bar chart displaying average pipeline size by sales person
- **Deal Activity Chart**: Multi-line chart tracking new, closed, and lost deals over time
- **KPI Cards**: Quick overview metrics including average pipeline size, new deals, closed deals, and win rate
- **Sales Person Filter**: Filter all visualizations by individual sales person or view all data

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Chart.js** - Data visualization
- **Vite** - Build tool and dev server

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Data

The dashboard uses mock commercial data generated automatically. The data includes:
- 90 days of historical pipeline data
- 5 sales people
- Pipeline size, new deals, closed deals, and lost deals metrics

To use real data, replace the `generateMockData()` function in `src/data/generateData.ts` with your actual data source.

### Sales dashboard – Excel & Google Sheets

The **Sales** view (Overview, Forecast, Pipeline, Accounts, Quarter tabs) can use data from **Google Sheets**:

1. **Create the Excel template** (includes all sheet names and column headers):
   ```bash
   npm run create-data-excel
   ```
   This creates `Data_Structures_Reference.xlsx` in the project root.

2. **Fill in your data** in the Excel (or in Google Sheets after uploading).

3. **Upload to Google Sheets** and **Publish to web** (File → Share → Publish to web, format CSV).

4. **Configure the app**: set `VITE_GOOGLE_SHEETS_ID` in `.env` and the sheet GIDs in `src/data/googleSheetsConfig.ts`.

See **GOOGLE_SHEETS_SETUP.md** for step-by-step instructions and **DATA_STRUCTURES.md** for field names.

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── PipelineDevelopmentChart.tsx
  │   ├── PipelineSizeChart.tsx
  │   ├── DealActivityChart.tsx
  │   ├── SalesPersonFilter.tsx
  │   └── KPICards.tsx
  ├── data/               # Data generation
  │   └── generateData.ts
  ├── types.ts            # TypeScript type definitions
  ├── App.tsx             # Main application component
  └── main.tsx            # Application entry point
```

## Customization

- **Styling**: Modify inline styles in components or add a CSS framework
- **Charts**: Customize chart options in each chart component
- **Data**: Replace mock data generator with API calls or data imports
- **Metrics**: Add additional KPI cards or charts as needed
