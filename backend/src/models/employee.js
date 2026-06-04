import { db } from "../db/index.js";
import { employees, departments, designations } from "../db/schema.js";
import { eq, or, sql, asc, and } from "drizzle-orm";

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

  async getAggregateStats() {
    const [row] = await db
      .select({
        total: sql`COUNT(*)::int`,
        monthCount: sql`COUNT(*) FILTER (WHERE date_of_birth IS NOT NULL AND EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE))::int`,
        todayCount: sql`COUNT(*) FILTER (WHERE date_of_birth IS NOT NULL AND EXTRACT(MONTH FROM date_of_birth) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(DAY FROM date_of_birth) = EXTRACT(DAY FROM CURRENT_DATE))::int`,
        withImage: sql`COUNT(*) FILTER (WHERE photo_url IS NOT NULL AND photo_url != '')::int`,
      })
      .from(employees);
    return row ?? { total: 0, monthCount: 0, todayCount: 0, withImage: 0 };
  },

  async findTodayBirthdays() {
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
      })
      .from(employees)
      .leftJoin(departments, eq(employees.department, departments.id))
      .leftJoin(designations, eq(employees.designation, designations.id))
      .where(
        and(
          sql`${employees.dateOfBirth} IS NOT NULL`,
          sql`EXTRACT(MONTH FROM ${employees.dateOfBirth}) = EXTRACT(MONTH FROM CURRENT_DATE)`,
          sql`EXTRACT(DAY FROM ${employees.dateOfBirth}) = EXTRACT(DAY FROM CURRENT_DATE)`,
        ),
      );
  },

  async findUpcomingBirthdays(days) {
    const rows = await db.execute(sql`
      WITH upcoming AS (
        SELECT
          e.id,
          e.employee_id AS "employeeId",
          e.title,
          e.name,
          e.email,
          e.department AS "departmentId",
          d.name AS "departmentName",
          e.designation AS "designationId",
          des.name AS "designationName",
          e.date_of_birth AS "dateOfBirth",
          e.photo_url AS "photoUrl",
          CASE
            WHEN TO_CHAR(e.date_of_birth, 'MM-DD') >= TO_CHAR(CURRENT_DATE, 'MM-DD')
            THEN (DATE_TRUNC('year', CURRENT_DATE) + (EXTRACT(DOY FROM e.date_of_birth) - 1) * INTERVAL '1 day')::date
            ELSE (DATE_TRUNC('year', CURRENT_DATE + INTERVAL '1 year') + (EXTRACT(DOY FROM e.date_of_birth) - 1) * INTERVAL '1 day')::date
          END AS "_nextBirthday"
        FROM ${employees} e
        LEFT JOIN ${departments} d ON e.department = d.id
        LEFT JOIN ${designations} des ON e.designation = des.id
        WHERE e.date_of_birth IS NOT NULL
      )
      SELECT * FROM upcoming
      WHERE "_nextBirthday" BETWEEN CURRENT_DATE AND CURRENT_DATE + (${days} || ' days')::interval
      ORDER BY "_nextBirthday"
    `);
    return rows;
  },

  async findById(id) {
    const [row] = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
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

  async update(id, data) {
    const [row] = await db.update(employees)
      .set({ ...data, updatedAt: sql`NOW()` })
      .where(eq(employees.id, id))
      .returning();
    return row ?? null;
  },

  async delete(id) {
    await db.delete(employees).where(eq(employees.id, id));
  },

  async count() {
    const [row] = await db.select({ count: sql`count(*)` }).from(employees);
    return Number(row?.count ?? 0);
  },
};
