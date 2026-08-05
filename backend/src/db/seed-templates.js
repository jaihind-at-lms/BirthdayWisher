import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { db, queryClient } from "./index.js";
import { templates } from "./schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = resolve(__dirname, "../config/template-config.json");

async function seedTemplates() {
  console.log("Reading template-config.json...");
  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));

  if (!config.templates?.length) {
    console.log("No templates found in config.");
    process.exit(0);
  }

  console.log(`Found ${config.templates.length} templates. Inserting into DB...`);

  for (const t of config.templates) {
    const record = {
      name: t.file.replace(".png", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      file: t.file,
      imageUrl: `/api/templates/image/${t.file}`,
      photo: t.photo || {},
      greeting: t.greeting || {},
      nameConfig: t.name || {},
      quote: t.quote || {},
      overlay: t.overlay || {},
      active: true,
    };

    const [inserted] = await db.insert(templates).values(record).returning();
    console.log(`  ✓ Inserted: ${inserted.name} (id: ${inserted.id})`);
  }

  console.log("\nDone! All templates seeded.");
  await queryClient.end();
  process.exit(0);
}

seedTemplates().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
