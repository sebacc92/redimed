import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const isDev = process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";
const defaultUrl = isDev ? "file:local.db" : "libsql://empty.turso.io";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || defaultUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
