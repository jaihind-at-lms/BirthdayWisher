import cron from "node-cron";
import { readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { sendBirthdayEmail } from "../emails/index.js";
import { EmployeeModel } from "../models/employee.js";
import { config } from "../config/env.js";
import { downloadFromDrive } from "../services/msGraph.js";

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
  const matches = await EmployeeModel.findTodayBirthdays();
  logger.info(`Found ${matches.length} birthday(s) today`);

  const templates = readdirSync(TEMPLATES_DIR);
  let templateCycle = shuffle(templates);
  let ti = 0;

  for (const emp of matches) {
    const id = emp.employeeId;
    const name = emp.name;
    const email = emp.email;

    if (!email) {
      logger.warn(`No email for "${name}" (${id}), skipping`);
      continue;
    }

    if (ti >= templateCycle.length) {
      templateCycle = shuffle(templates);
      ti = 0;
    }

    let photoBuffer;
    try {
      photoBuffer = await downloadFromDrive(`${id}.png`, config.msEmployeeImagesFolder);
    } catch (err) {
      logger.warn(`No photo available for "${name}" (${id}), skipping: ${err.message}`);
      continue;
    }

    try {
      const cardBuffer = await generateBirthdayCard(name, photoBuffer, templateCycle[ti]);
      ti++;
      await sendBirthdayEmail({ name, email, cardBuffer, employeeId: id });
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
