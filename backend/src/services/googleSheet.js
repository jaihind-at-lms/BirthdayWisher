import { google } from "googleapis";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "../config/env.js";
import logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = resolve(__dirname, "../../settings.json");
const TEMP_DIR = resolve(__dirname, "../temp");

let authClient = null;

const getAuth = () => {
  if (authClient) return authClient;

  const credentials = JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });
  authClient = auth;
  return authClient;
};

export const getSheetRecords = async (range = "Sheet1!A:Z") => {
  const sheetId = config.googleSheetId;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set in .env");
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
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

export const downloadEmployeeImage = async (imageUrl, employeeId) => {
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });

  const dest = resolve(TEMP_DIR, `${employeeId}.png`);

  if (typeof imageUrl === "string" && imageUrl.startsWith("http")) {
    const id = imageUrl.match(/[-\w]{25,}/)?.[0];
    if (!id) {
      logger.warn("Could not extract file ID from URL, using default image");
      return null;
    }

    try {
      const auth = getAuth();
      const drive = google.drive({ version: "v3", auth });
      const res = await drive.files.get(
        { fileId: id, alt: "media" },
        { responseType: "arraybuffer" }
      );
      const buf = Buffer.from(res.data);
      writeFileSync(dest, buf);
      return dest;
    } catch (error) {
      logger.warn(`Failed to download image for ${employeeId}: ${error.message}. Share the file with the service account email.`);
      return null;
    }
  }

  if (existsSync(imageUrl)) {
    writeFileSync(dest, readFileSync(imageUrl));
    return dest;
  }

  return null;
};
