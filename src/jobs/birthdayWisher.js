import cron from "node-cron";
import logger from "../utils/logger.js";

/**
 * BirthdayWisher
 * --------------
 * Checks employee birthdays for the current day,
 * generates a birthday greeting card,
 * and sends birthday wishes via email.
 */
export const BirthdayWisher = async () => {
  return true;
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