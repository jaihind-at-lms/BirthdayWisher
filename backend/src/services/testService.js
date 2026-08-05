import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { generateBirthdayCard } from "./birthdayCard.js";
import { TemplateModel } from "../models/template.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../../birthday-cards");

export const generatePreviewCards = async () => {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const templates = await TemplateModel.findAllActive();
  const generated = [];

  // Create a placeholder employee image for preview
  const placeholderImage = await sharp({
    create: { width: 400, height: 400, channels: 3, background: { r: 180, g: 180, b: 220 } },
  }).png().toBuffer();

  for (const t of templates) {
    const card = await generateBirthdayCard("Alice", placeholderImage, t.file);
    const name = `preview-${t.file.split("/").pop().replace(/\.\w+$/, "")}.png`;
    writeFileSync(resolve(OUTPUT_DIR, name), card);
    generated.push(name);
  }

  return generated;
};
