import { google } from "googleapis";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = resolve(__dirname, "../../settings.json");

let sheetsClient = null;

const getSheetsClient = () => {
  if (sheetsClient) return sheetsClient;

  const credentials = JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
};

export const getSheetRecords = async (range = "Sheet1!A:Z") => {
  const sheetId = config.googleSheetId;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set in .env");
  }

  try {
    const sheets = getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const record = {};
      headers.forEach((header, i) => {
        record[header] = row[i] ?? null;
      });
      return record;
    });
  } catch (error) {
    logger.error("Failed to read Google Sheet:", error.message);
    throw error;
  }
};
