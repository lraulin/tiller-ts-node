import { google } from "googleapis";
import process from "process";
import { ensureDefined } from "../common/util";
import authorize from "./auth";

const TILLER_SHEET_ID = process.env.TILLER_SPREADSHEET_ID;

const getSheet = (sheetName: string) => async () => {
  const spreadsheetId = ensureDefined(TILLER_SHEET_ID);
  const auth = await authorize();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
  return rows;
};

const getTransactionSheet = getSheet("Transactions");
const getDirectExpressSheet = getSheet("DirectExpress");

export default { getTransactionSheet, getDirectExpressSheet };