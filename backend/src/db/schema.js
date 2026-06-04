import { pgTable, serial, text, date, timestamp } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  title: text("title").default(""),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").default(""),
  designation: text("designation").default(""),
  dateOfBirth: date("date_of_birth"),
  photoUrl: text("photo_url").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const designations = pgTable("designations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
