import { db } from "../db/index.js";
import { templates } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const TemplateModel = {
  async findAll() {
    return db.select().from(templates).orderBy(templates.createdAt);
  },

  async findAllActive() {
    return db.select().from(templates).where(eq(templates.active, true)).orderBy(templates.createdAt);
  },

  async findById(id) {
    const [row] = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
    return row ?? null;
  },

  async findByFile(file) {
    const [row] = await db.select().from(templates).where(eq(templates.file, file)).limit(1);
    return row ?? null;
  },

  async create(data) {
    const [row] = await db.insert(templates).values(data).returning();
    return row;
  },

  async update(id, data) {
    const [row] = await db
      .update(templates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return row ?? null;
  },

  async remove(id) {
    await db.delete(templates).where(eq(templates.id, id));
  },

  async random() {
    const [row] = await db
      .select()
      .from(templates)
      .where(eq(templates.active, true))
      .orderBy(sql`random()`)
      .limit(1);
    return row ?? null;
  },
};
