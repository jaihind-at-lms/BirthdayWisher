import { db } from "../db/index.js";
import { employees, departments, designations } from "../db/schema.js";
import { eq, or, sql, asc } from "drizzle-orm";

export const EmployeeModel = {
  async findAll() {
    return db
    .select({
      id: employees.id,
      employeeId: employees.employeeId,
      title: employees.title,
      name: employees.name,
      email: employees.email,
      departmentId: employees.department,
      departmentName: departments.name,
      designationId: employees.designation,
      designationName: designations.name,
      dateOfBirth: employees.dateOfBirth,
      photoUrl: employees.photoUrl,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .leftJoin(departments, eq(employees.department, departments.id))
    .leftJoin(designations, eq(employees.designation, designations.id))
    .orderBy(asc(employees.createdAt));
  },

  async findById(id) {
    const [row] = await db.select().from(employees).where(eq(employees.employeeId, id)).limit(1);
    return row ?? null;
  },

  async findByEmail(email) {
    const [row] = await db.select().from(employees).where(eq(employees.email, email)).limit(1);
    return row ?? null;
  },

  async isDuplicate(fields) {
    const { employeeId, email } = fields;
    const clauses = [];
    if (employeeId) clauses.push(eq(employees.employeeId, employeeId));
    if (email) clauses.push(eq(employees.email, email));
    if (!clauses.length) return null;
    const [row] = await db.select().from(employees).where(or(...clauses)).limit(1);
    return row ?? null;
  },

  async create(data) {
    const [row] = await db.insert(employees).values({
      employeeId: data.employeeId,
      title: data.title ?? "",
      name: data.name,
      email: data.email,
      department: data.department ?? "",
      designation: data.designation ?? "",
      dateOfBirth: data.dateOfBirth || null,
      photoUrl: data.photoUrl ?? "",
    }).returning();
    return row;
  },

  async update(employeeId, data) {
    const [row] = await db.update(employees)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(employees.employeeId, employeeId))
      .returning();
    return row ?? null;
  },

  async delete(employeeId) {
    await db.delete(employees).where(eq(employees.employeeId, employeeId));
  },

  async count() {
    const [row] = await db.select({ count: sql`count(*)` }).from(employees);
    return Number(row?.count ?? 0);
  },
};
