import cron from "node-cron";
import { readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import { getSheetRecords, downloadEmployeeImage } from "../services/index.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { sendBirthdayEmail } from "../emails/index.js";
import { parseDate } from "../utils/helpers.js";
import { config } from "../config/env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = resolve(__dirname, "../../uploads");
const TEMPLATES_DIR = resolve(__dirname, "../templates");

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const findColumn = (record, candidates) =>
  Object.keys(record).find((k) =>
    candidates.includes(k.toLowerCase())
  );

export const BirthdayWisher = async () => {
  const range = `${config.googleSheetEmployeeTab}!A:Z`;
  const employees = await getSheetRecords(range);
  logger.info(`Fetched ${employees.length} employees from sheet`);

  if (!employees.length) return [];

  const dateCol = findColumn(employees[0], [
    "birthday", "dob", "date of birth", "birth date", "birth day",
  ]);
  const emailCol = findColumn(employees[0], ["email"]);
  const idCol = findColumn(employees[0], ["employee id"]);
  const nameCol = findColumn(employees[0], ["employee name", "name"]);

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const matches = employees.filter((emp) => {
    if (!dateCol || !emp[dateCol]) return false;
    const bd = parseDate(emp[dateCol]);
    return bd && bd.getMonth() === todayMonth && bd.getDate() === todayDate;
  });

  logger.info(`Found ${matches.length} birthday(s) today`);

  const templates = readdirSync(TEMPLATES_DIR);
  let templateCycle = shuffle(templates);
  let ti = 0;

  for (const emp of matches) {
    const id = emp[idCol]?.trim() || "unknown";
    const name = emp[nameCol] || "Unknown";
    const email = emp[emailCol] || "";

    if (!email) {
      logger.warn(`No email for "${name}" (${id}), skipping`);
      continue;
    }

    if (ti >= templateCycle.length) {
      templateCycle = shuffle(templates);
      ti = 0;
    }

    const localPhoto = resolve(UPLOADS_DIR, `${id}.png`);
    let photoPath = null;

    if (existsSync(localPhoto)) {
      photoPath = localPhoto;
    } else {
      const imageUrl = emp["Employee Image"] ?? "";
      photoPath = await downloadEmployeeImage(imageUrl, id);
    }

    if (!photoPath) {
      logger.warn(`No photo available for "${name}" (${id}), skipping`);
      continue;
    }

    try {
      const cardBuffer = await generateBirthdayCard(name, photoPath, templateCycle[ti]);
      ti++;
      await sendBirthdayEmail({ name, email, cardBuffer });
      logger.info(`Birthday email sent to ${name} (${id}) at ${email}`);
    } catch (err) {
      logger.error(`Failed to send birthday for ${id} (${name}): ${err.message}`);
    }
  }

  return matches;
};

export const startBirthdayWisherJob = () => {
  logger.info("Starting Birthday Wisher job with schedule: Daily at 06:00 AM");

  cron.schedule(
    "0 6 * * *",
    async () => {
      await BirthdayWisher();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};
