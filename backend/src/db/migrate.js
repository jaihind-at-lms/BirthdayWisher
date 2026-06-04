import { sql } from "drizzle-orm";
import { db, queryClient } from "./index.js";
import logger from "../utils/logger.js";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    employee_id TEXT NOT NULL UNIQUE,
    title TEXT DEFAULT '',
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department INTEGER REFERENCES departments(id),
    designation INTEGER REFERENCES designations(id),
    date_of_birth DATE,
    photo_url TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS designations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS wishes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  )`
];

export async function runMigrations() {
  logger.info("Running database migrations...");
  for (const stmt of TABLES) {
    await db.execute(sql.raw(stmt));
  }
  logger.info("Migrations complete.");
}

export async function closeDb() {
  await queryClient.end();
}
