import { db } from "../db/index.js";
import { departments } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const DepartmentModel = {
  async findAll() {
    return db.select().from(departments).orderBy(departments.name);
  },

  async findByName(name) {
    const [row] = await db.select().from(departments).where(eq(departments.name, name)).limit(1);
    return row ?? null;
  },

  async create(name) {
    const [row] = await db.insert(departments).values({ name }).returning();
    return row;
  },

  async update(id, name) {
    const [row] = await db.update(departments).set({ name }).where(eq(departments.id, id)).returning();
    return row ?? null;
  },

  async remove(id) {
    await db.delete(departments).where(eq(departments.id, id));
  },
};
