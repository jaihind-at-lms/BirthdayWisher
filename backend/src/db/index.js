import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config/env.js";
import * as schema from "./schema.js";

const queryClient = postgres(config.supabaseDbUrl, { prepare: false });
const db = drizzle(queryClient, { schema });

export { db, queryClient };
