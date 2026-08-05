/**
 * Migration script: Upload existing local template images to Azure Blob Storage
 * and update the DB records with the new blob paths/URLs.
 *
 * Run: node src/db/migrate-templates-to-azure.js
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { db, queryClient } from "./index.js";
import { templates } from "./schema.js";
import { uploadToBlob, getBlobUrl } from "../services/azureBlob.js";
import { config } from "../config/env.js";
import { eq } from "drizzle-orm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../templates");
const TEMPLATES_FOLDER = config.azureTemplatesFolder;

async function migrateTemplatesToAzure() {
  console.log(`Templates folder on Azure: "${TEMPLATES_FOLDER}"`);
  console.log(`Local templates dir: ${TEMPLATES_DIR}\n`);

  // Get all templates from DB
  const allTemplates = await db.select().from(templates);

  if (!allTemplates.length) {
    console.log("No templates found in DB. Nothing to migrate.");
    await queryClient.end();
    process.exit(0);
  }

  console.log(`Found ${allTemplates.length} templates in DB. Migrating...\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const t of allTemplates) {
    const localFileName = t.file;

    // Skip if already migrated (file path contains the folder prefix)
    if (localFileName.startsWith(TEMPLATES_FOLDER + "/")) {
      console.log(`  ⏭  Skipping "${t.name}" — already migrated (${localFileName})`);
      skipped++;
      continue;
    }

    const localPath = resolve(TEMPLATES_DIR, localFileName);

    if (!existsSync(localPath)) {
      console.log(`  ✗  "${t.name}" — local file not found: ${localPath}`);
      failed++;
      continue;
    }

    try {
      // Read local file and upload to Azure
      const buffer = readFileSync(localPath);
      const blobName = await uploadToBlob(buffer, localFileName, TEMPLATES_FOLDER);
      const imageUrl = getBlobUrl(blobName);

      // Update DB record
      await db
        .update(templates)
        .set({ file: blobName, imageUrl, updatedAt: new Date() })
        .where(eq(templates.id, t.id));

      console.log(`  ✓  "${t.name}" → ${blobName}`);
      success++;
    } catch (err) {
      console.log(`  ✗  "${t.name}" — upload failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nMigration complete: ${success} uploaded, ${skipped} skipped, ${failed} failed.`);
  await queryClient.end();
  process.exit(failed > 0 ? 1 : 0);
}

migrateTemplatesToAzure().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
