import cron from "node-cron";
import { readdirSync, writeFileSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import { getSheetRecords, downloadEmployeeImage } from "../services/index.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { config } from "../config/env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../templates");

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const BirthdayWisher = async () => {
  const range = `${config.googleSheetEmployeeTab}!A:Z`;
  const employees = await getSheetRecords(range);
  logger.info(`Fetched ${employees.length} employees from sheet`);

  const templates = readdirSync(TEMPLATES_DIR);

  let templateCycle = shuffle(templates);
  let ti = 0;

  for (const emp of employees) {
    const id = emp["Employee ID "] ?? "unknown";
    const name = emp["Employee Name "] ?? "Unknown";
    const image = emp["Employee Image "] ?? "";

    if (ti >= templateCycle.length) {
      templateCycle = shuffle(templates);
      ti = 0;
    }

    const imgPath = await downloadEmployeeImage(image, id);
    const card = await generateBirthdayCard(name, imgPath, templateCycle[ti]);
    ti++;
    writeFileSync(`birthday-cards/${id}.png`, card);
    if (tempPath) unlinkSync(tempPath);
    logger.info(`Birthday card saved for ${id}`);
  }

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