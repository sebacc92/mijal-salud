import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Singleton para el cliente de Turso
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const url =
      import.meta.env.PRIVATE_TURSO_DATABASE_URL ||
      (process as any).env?.PRIVATE_TURSO_DATABASE_URL;
    const authToken =
      import.meta.env.PRIVATE_TURSO_AUTH_TOKEN ||
      (process as any).env?.PRIVATE_TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error(
        "PRIVATE_TURSO_DATABASE_URL is not set in environment variables",
      );
    }

    const client = createClient({ url, authToken });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export { schema };
