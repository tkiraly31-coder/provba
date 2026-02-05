/**
 * Google Sheets data source config.
 *
 * 1. Upload Data_Structures_Reference.xlsx to Google Sheets (or create a copy there).
 * 2. File → Share → Publish to web → choose "Entire document" or each sheet, format CSV, then Publish.
 * 3. Get your Spreadsheet ID from the URL: docs.google.com/spreadsheets/d/ SPREADSHEET_ID /edit
 * 4. Get each sheet's GID: click the sheet tab, URL ends with #gid=123456 — that number is the GID.
 * 5. Fill in the IDs below. Leave spreadsheetId empty to use mock data.
 */

export const googleSheetsConfig = {
  /** From the sheet URL: .../d/THIS_PART/edit */
  spreadsheetId: '',

  /** Sheet tab name (in the Excel/Google doc) → GID (number as string). Get GID from URL when you click the tab. */
  sheetGids: {
    SalesKPIs: '',
    ForecastPoint: '',
    ForecastPointBySegment: '',
    PipelineStage: '',
    DealSegment: '',
    ARRByMonthPoint: '',
    ARR_LicenseDetail: '',
    ARR_MinimumDetail: '',
    ARR_VolumeDetail: '',
    PipelineDeal: '',
    ACVByMonth: '',
    ClientWinsPoint: '',
    ClientDeal: '',
    QuarterDeal: '',
  } as Record<string, string>,
};

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    googleSheetsConfig.spreadsheetId &&
      Object.values(googleSheetsConfig.sheetGids).some((gid) => Boolean(gid))
  );
}
