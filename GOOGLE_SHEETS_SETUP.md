# Loading dashboard data from Google Sheets

You can keep your data in a **Google Spreadsheet** (e.g. after uploading `Data_Structures_Reference.xlsx` and filling it in). The dashboard will read it via Google’s “Publish to web” CSV export — no API key required.

**Important:** I (the AI) cannot open or read your Google Sheet directly. The **app** can, once you publish it and add the IDs to the config.

---

## 1. Put your data in Google Sheets

1. Upload **Data_Structures_Reference.xlsx** to Google Drive and open it in Google Sheets,  
   **or** create a new spreadsheet and copy the sheet names and column headers from that file.
2. Use the same **sheet tab names** as in the Excel (e.g. `SalesKPIs`, `ForecastPoint`, `PipelineDeal`, …).
3. Fill in your data. Column headers in row 1 must match the field names (e.g. `month`, `forecast`, `target`).

---

## 2. Publish the spreadsheet so the app can read it

1. In Google Sheets: **File → Share → Publish to web**.
2. Under **Link**, choose **Entire document** (or pick specific sheets if you prefer).
3. Under **Format**, choose **Comma-separated values (.csv)**.
4. Click **Publish** and confirm.
5. To publish **one sheet at a time** (recommended for correct mapping):
   - In “Publish to web”, open the first dropdown and select one sheet (e.g. `SalesKPIs`).
   - Publish, copy the link, then repeat for each sheet you use.

---

## 3. Get the Spreadsheet ID and sheet GIDs

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

## 4. Configure the dashboard

1. Open **`src/data/googleSheetsConfig.ts`**.
2. Set **`spreadsheetId`** to your Spreadsheet ID (string).
3. Set **`sheetGids`** so each sheet name you use has its GID (string), for example:

```ts
export const googleSheetsConfig = {
  spreadsheetId: '1ABC...xyz',  // your ID

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
};
```

You only need to fill in the sheets you use. Leave a sheet’s GID as `''` if you don’t use it; the app will fall back to mock data for that part.

---

## 5. Run the app

- Run the dashboard as usual (`npm run dev`).
- If **`spreadsheetId`** is set and at least one **`sheetGids`** entry is set, the app will load data from Google Sheets on startup.
- If the config is left empty, the app uses built-in mock data.

---

## 6. Troubleshooting

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
