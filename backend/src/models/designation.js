import { db } from "../db/index.js";
import { designations } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const DesignationModel = {
  async findAll() {
    return db.select().from(designations).orderBy(designations.name);
  },

  async findByName(name) {
    const [row] = await db.select().from(designations).where(eq(designations.name, name)).limit(1);
    return row ?? null;
  },

  async create(name) {
    const [row] = await db.insert(designations).values({ name }).returning();
    return row;
  },

  async update(id, name) {
    const [row] = await db.update(designations).set({ name }).where(eq(designations.id, id)).returning();
    return row ?? null;
  },

  async remove(id) {
    await db.delete(designations).where(eq(designations.id, id));
  },
};
