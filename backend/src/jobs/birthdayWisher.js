import cron from "node-cron";
import { readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import logger from "../utils/logger.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { sendBirthdayEmail } from "../emails/index.js";
import { EmployeeModel } from "../models/employee.js";
import { parseDate } from "../utils/helpers.js";

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

export const BirthdayWisher = async () => {
  const employees = await EmployeeModel.findAll();
  logger.info(`Fetched ${employees.length} employees from database`);

  if (!employees.length) return [];

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const matches = employees.filter((emp) => {
    if (!emp.dateOfBirth) return false;
    const bd = parseDate(emp.dateOfBirth);
    return bd && bd.getMonth() === todayMonth && bd.getDate() === todayDate;
  });

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

    const localPhoto = resolve(UPLOADS_DIR, `${id}.png`);
    let photoPath = null;

    if (existsSync(localPhoto)) {
      photoPath = localPhoto;
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
