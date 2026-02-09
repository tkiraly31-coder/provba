/**
 * Google Sheets data source config.
 *
 * You can set the Spreadsheet ID via environment variable:
 *   VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
 * (in .env). Otherwise set spreadsheetId below.
 *
 * Full steps: see GOOGLE_SHEETS_SETUP.md and the "Instructions" sheet in Data_Structures_Reference.xlsx.
 */

/** Spreadsheet ID: from env VITE_GOOGLE_SHEETS_ID or set fallback below */
const FALLBACK_SPREADSHEET_ID = '';

function getSpreadsheetId(): string {
  const env = typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SHEETS_ID;
  const fromEnv = env && typeof env === 'string' ? env.trim() : '';
  return fromEnv || FALLBACK_SPREADSHEET_ID;
}

export const googleSheetsConfig = {
  /** From the sheet URL: .../d/THIS_PART/edit. Or set VITE_GOOGLE_SHEETS_ID in .env */
  get spreadsheetId(): string {
    return getSpreadsheetId();
  },

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
