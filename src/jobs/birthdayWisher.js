import cron from "node-cron";
import logger from "../utils/logger.js";
import { getSheetRecords } from "../services/index.js";
import { config } from "../config/env.js";

export const BirthdayWisher = async () => {
  const range = `${config.googleSheetEmployeeTab}!A:Z`;
  const employees = await getSheetRecords(range);
  logger.info(`Fetched ${employees.length} employees from sheet`);
  return employees;
};

// Runs BirthdayWisher() every day at 06:00 AM
export const startBirthdayWisherJob = () => {
  logger.info(
    "Starting Birthday Wisher job with schedule: Daily at 06:00 AM"
  );

  cron.schedule(
    "0 6 * * *", // Every day at 06:00 AM
    async () => {
      await BirthdayWisher();
    },
    {
      timezone: "Asia/Kolkata", // India Standard Time
    }
  );
};