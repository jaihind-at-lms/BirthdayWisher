import { readdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { generateBirthdayCard } from "./birthdayCard.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../templates");
const OUTPUT_DIR = resolve(__dirname, "../../birthday-cards");
const EMPLOYEE_PIC = resolve(__dirname, "../../tests/employee.jpeg");

export const generatePreviewCards = async () => {
  const templates = readdirSync(TEMPLATES_DIR);
  const generated = [];

  for (const t of templates) {
    const card = await generateBirthdayCard("Alice", EMPLOYEE_PIC, t);
    const name = `preview-${t.replace(/\.\w+$/, "")}.png`;
    writeFileSync(resolve(OUTPUT_DIR, name), card);
    generated.push(name);
  }

  return generated;
};
