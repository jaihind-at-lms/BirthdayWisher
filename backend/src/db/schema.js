import { pgTable, serial, text, date, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull().unique(),
  title: text("title").default(""),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: integer("department"),
  designation: integer("designation"),
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

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  file: text("file").notNull(),
  imageUrl: text("image_url").notNull(),
  photo: jsonb("photo").default({}),
  greeting: jsonb("greeting").default({}),
  nameConfig: jsonb("name_config").default({}),
  quote: jsonb("quote").default({}),
  overlay: jsonb("overlay").default({}),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
