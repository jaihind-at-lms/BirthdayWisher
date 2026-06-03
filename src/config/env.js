import dotenv from "dotenv";
dotenv.config();

export const config = {
  ntfyTopic: process.env.NTFY_TOPIC,
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleSheetEmployeeTab: process.env.GOOGLE_SHEET_EMPLOYEE_TAB ?? "Employees",
};
