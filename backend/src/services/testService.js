import { writeFileSync, readFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { generateBirthdayCard } from "./birthdayCard.js";
import { TemplateModel } from "../models/template.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../../birthday-cards");
const EMPLOYEE_PIC = resolve(__dirname, "../../tests/employee.jpeg");

export const generatePreviewCards = async () => {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const templates = await TemplateModel.findAllActive();
  const generated = [];

  const employeeImage = readFileSync(EMPLOYEE_PIC);

  for (const t of templates) {
    const card = await generateBirthdayCard("Alice", employeeImage, t.file);
    const name = `preview-${t.file.split("/").pop().replace(/\.\w+$/, "")}.png`;
    writeFileSync(resolve(OUTPUT_DIR, name), card);
    generated.push(name);
  }

  return generated;
};
