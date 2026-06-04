import { sql } from "drizzle-orm";
import { db } from "./index.js";
import { wishes, departments, designations } from "./schema.js";
import logger from "../utils/logger.js";

const DEFAULT_WISHES = [
  "Another year, another adventure — go make it legendary!",
  "Age is just a number, but your vibe is timeless.",
  "You don't get older, you level up. Happy Birthday!",
  "Cheers to the amazing person you are and the journey ahead.",
  "May your day be filled with cake, laughter, and good vibes.",
  "The world is brighter because you're in it. Happy Birthday!",
  "Celebrate today like the superstar you are!",
  "Here's to you — may your year be as awesome as you are.",
  "Another chapter, another win. Keep shining!",
  "Happy Birthday — you're the main character, act like it!",
  "Sending you good wishes, good vibes, and good cake.",
  "You're not getting older, you're becoming a classic.",
  "It's your day — eat cake, be happy, and let others sing.",
  "Born to stand out. Happy Birthday, legend!",
  "May your day be as wonderful as the joy you bring to others.",
];

const DEFAULT_DEPARTMENTS = [
  "Java", ".Net", "PHP", "Node Js", "React Js", "Vue Js", "Angular Js",
  "Android", "ios", "Flutter", "Salesforce", "Architect",
  "HTML/CSS", "UI/UX", "BA", "Pre-Sales", "Accounts", "HR",
  "IT Support", "Admin", "Office Staff", "Manual QA", "Automation QA",
];

const DEFAULT_DESIGNATIONS = [
  "Trainee Software Engineer", "Software Engineer", "Senior Software Engineer",
  "Module Lead Engineer", "Architect Engineering", "Project Manager",
  "Vice President Technology", "Director Engineering",
  "Senior UI Designer", "Head UI UX Designer", "Principal UI/IX Designer",
  "Module Lead Designer", "Account Manager", "Office Attendant",
  "NetOps Engineer", "Assistant Manager Admin", "Module Lead BA",
  "Senior Manager HR", "Senior HR Executive",
  "Trainee QA Engineer", "QA Engineer", "Senior QA Engineer",
  "Project Lead QA", "Principal QA Engineer", "Module Lead QA",
  "Architect QA", "Assistant Vice President QA",
  "Project Lead Engineer", "Senior Manager Accounts",
  "Manager Business Development", "Senior Project Manager",
  "Senior Accounts Executive", "UI Designer", "Principal Software Engineer",
];

async function seedTable(model, rows, col, label) {
  const existing = await db.select({ count: sql`count(*)` }).from(model);
  const count = Number(existing[0]?.count ?? 0);
  if (count > 0) {
    logger.info(`Skipping ${label} seed — ${count} already exist.`);
    return;
  }
  logger.info(`Seeding ${label}...`);
  await db.insert(model).values(rows.map((v) => ({ [col]: v })));
  logger.info(`Seeded ${rows.length} ${label}.`);
}

export async function seedDefaultData() {
  await seedTable(wishes, DEFAULT_WISHES, "text", "wishes");
  await seedTable(departments, DEFAULT_DEPARTMENTS, "name", "departments");
  await seedTable(designations, DEFAULT_DESIGNATIONS, "name", "designations");
}
