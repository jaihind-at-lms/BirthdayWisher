import cron from "node-cron";
import logger from "../utils/logger.js";
import { generateBirthdayCard } from "../services/birthdayCard.js";
import { sendBirthdayEmail } from "../emails/index.js";
import { EmployeeModel } from "../models/employee.js";
import { TemplateModel } from "../models/template.js";
import { downloadBlob } from "../services/azureBlob.js";

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

  // Get active templates from DB
  const allTemplates = await TemplateModel.findAllActive();
  if (!allTemplates.length) {
    logger.warn("No active templates in DB. Skipping birthday wishes.");
    return matches;
  }

  let templateCycle = shuffle(allTemplates);
  let ti = 0;

  for (const emp of matches) {
    const id = emp.employeeId;
    const name = emp.name;
    const email = emp.email;
    const photoUrl = emp.photoUrl;

    if (!email) {
      logger.warn(`No email for "${name}" (${id}), skipping`);
      continue;
    }

    if (ti >= templateCycle.length) {
      templateCycle = shuffle(allTemplates);
      ti = 0;
    }

    let photoBuffer;
    try {
      photoBuffer = await downloadBlob(photoUrl);
    } catch (err) {
      logger.warn(`No photo available for "${name}" (${id}), skipping: ${err.message}`);
      continue;
    }

    try {
      const template = templateCycle[ti];
      ti++;

      const cardBuffer = await generateBirthdayCard(name, photoBuffer, template.file);
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
