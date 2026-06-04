import { db } from "../db/index.js";
import { employees, designations } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

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

  async findOrCreateByName(name) {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.create(name);
  },

  async remove(id) {
    const [ref] = await db.select({ count: sql`count(*)::int` }).from(employees).where(eq(employees.designation, id));
    if (ref.count > 0) {
      throw Object.assign(new Error("Cannot delete: designation is assigned to one or more employees."), { statusCode: 409 });
    }
    await db.delete(designations).where(eq(designations.id, id));
  },
};
