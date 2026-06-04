import { db } from "../db/index.js";
import { employees, departments } from "../db/schema.js";
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

  async findById(id) {
    const [row] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return row ?? null;
  },

  async update(id, name) {
    const [row] = await db.update(departments).set({ name }).where(eq(departments.id, id)).returning();
    return row ?? null;
  },

  async findOrCreateByName(name) {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.create(name);
  },

  async remove(id) {
    const [ref] = await db.select({ count: sql`count(*)::int` }).from(employees).where(eq(employees.department, id));
    if (ref.count > 0) {
      throw Object.assign(new Error("Cannot delete: department is assigned to one or more employees."), { statusCode: 409 });
    }
    await db.delete(departments).where(eq(departments.id, id));
  },
};
