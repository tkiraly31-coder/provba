# Loading dashboard data from Google Sheets

You can keep your data in a **Google Spreadsheet** (from the project’s Excel template). The dashboard reads it via Google’s “Publish to web” CSV export — **no API key or sign-in required**.

---

## 1. Get the Excel template and fill it

1. **Create/regenerate the template** (optional; one already exists):
   ```bash
   npm run create-data-excel
   ```
   This writes **`Data_Structures_Reference.xlsx`** in the project root with:
   - An **Instructions** sheet (steps for upload and connection)
   - A **Reference** sheet (data types and field names)
   - One sheet per data type (e.g. `SalesKPIs`, `ForecastPoint`, `PipelineDeal`, …) with **example rows and correct column headers**.

2. Open **Data_Structures_Reference.xlsx** in Excel or a spreadsheet app. Fill in your data on each sheet. **Row 1 must stay as the header row** (column names like `month`, `forecast`, `target`). Do not rename the **sheet tabs** (e.g. keep `SalesKPIs`, not “KPI”).

---

## 2. Put your data in Google Sheets

1. **Upload** `Data_Structures_Reference.xlsx` to Google Drive and open it with **Google Sheets**,  
   **or** in Google Sheets: **File → Import → Upload** and select the .xlsx file.
2. Keep the same **sheet tab names** (e.g. `SalesKPIs`, `ForecastPoint`, `PipelineDeal`, …).
3. Edit and add your data. Column headers in row 1 must match the field names (e.g. `month`, `forecast`, `target`).

---

## 3. Publish the spreadsheet so the app can read it

1. In Google Sheets: **File → Share → Publish to web**.
2. Under **Link**, choose **Entire document** (or pick specific sheets if you prefer).
3. Under **Format**, choose **Comma-separated values (.csv)**.
4. Click **Publish** and confirm.
5. To publish **one sheet at a time** (recommended for correct mapping):
   - In “Publish to web”, open the first dropdown and select one sheet (e.g. `SalesKPIs`).
   - Publish, copy the link, then repeat for each sheet you use.

---

## 4. Get the Spreadsheet ID and sheet GIDs

- **Spreadsheet ID**  
  From the sheet URL:
  ```text
  https://docs.google.com/spreadsheets/d/ SPREADSHEET_ID /edit
  ```
  Copy the long string between `/d/` and `/edit`.

- **Sheet GID** (for each tab)  
  Click the sheet tab (e.g. “ForecastPoint”). The URL will end with something like `#gid=123456789`.  
  The number after `gid=` is that sheet’s GID.

---

## 5. Configure the dashboard

**Option A – Environment variable (recommended for Spreadsheet ID)**  
1. Copy `.env.example` to `.env`.  
2. Set **`VITE_GOOGLE_SHEETS_ID`** to your Spreadsheet ID (the part between `/d/` and `/edit` in the sheet URL).  
3. Open **`src/data/googleSheetsConfig.ts`** and set **`sheetGids`** for each sheet you use: click the sheet tab in Google Sheets, copy the number after `#gid=` from the URL into the matching key (e.g. `SalesKPIs: '123456789'`).

**Option B – Config file only**  
1. Open **`src/data/googleSheetsConfig.ts`**.  
2. Set **`FALLBACK_SPREADSHEET_ID`** (at the top) to your Spreadsheet ID.  
3. Set **`sheetGids`** so each sheet name you use has its GID (string), for example:

```ts
sheetGids: {
  SalesKPIs: '0',
  ForecastPoint: '123456789',
  ForecastPointBySegment: '234567890',
  PipelineStage: '345678901',
  DealSegment: '456789012',
  ARRByMonthPoint: '567890123',
  ARR_LicenseDetail: '678901234',
  ARR_MinimumDetail: '789012345',
  ARR_VolumeDetail: '890123456',
  PipelineDeal: '901234567',
  ACVByMonth: '012345678',
  ClientWinsPoint: '111222333',
  ClientDeal: '222333444',
  QuarterDeal: '333444555',
},
```

You only need to fill in the sheets you use. Leave a sheet’s GID as `''` if you don’t use it; the app will fall back to mock data for that part.

---

## 6. Run the app

- Run the dashboard as usual (`npm run dev`).
- If **`spreadsheetId`** is set and at least one **`sheetGids`** entry is set, the app will load data from Google Sheets on startup.
- If the config is left empty, the app uses built-in mock data.

---

## 7. Troubleshooting

- **“Failed to fetch” / CORS**  
  The sheet must be **Published to web** (step 2). The export URL is public; the app does not sign in to your Google account.

- **Empty or wrong data**  
  - Check that the sheet tab name matches the key in `sheetGids` (e.g. `ForecastPoint`).
  - Check that the GID is the one for that tab (from the URL when the tab is selected).
  - Ensure row 1 is the header row and column names match the expected field names (see **DATA_STRUCTURES.md**).

- **CSV format**  
  The app parses CSV. Avoid unescaped commas inside cells, or wrap values in double quotes.

- **Numbers**  
  Numeric fields are parsed with `parseFloat`; currency symbols and spaces are stripped. Use plain numbers (e.g. `120000`) for amounts.
