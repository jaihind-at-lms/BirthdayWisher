import { db } from "../db/index.js";
import { wishes } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const WishModel = {
  async findAll() {
    return db.select().from(wishes).orderBy(wishes.createdAt);
  },

  async findById(id) {
    const [row] = await db.select().from(wishes).where(eq(wishes.id, id)).limit(1);
    return row ?? null;
  },

  async create(text) {
    const [row] = await db.insert(wishes).values({ text }).returning();
    return row;
  },

  async update(id, text) {
    const [row] = await db.update(wishes).set({ text }).where(eq(wishes.id, id)).returning();
    return row ?? null;
  },

  async remove(id) {
    await db.delete(wishes).where(eq(wishes.id, id));
  },

  async random() {
    const [row] = await db.select().from(wishes).orderBy(sql`random()`).limit(1);
    return row?.text ?? "";
  },
};
