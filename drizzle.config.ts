import type { Config } from "drizzle-kit";
import { readFileSync } from "fs";
import { join } from "path";

// Parse .env.local manually for drizzle-kit CLI usage
function loadEnvLocal() {
  try {
    const content = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([^=]+)=["']?(.+?)["']?\s*$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch {
    // .env.local not found, rely on actual env vars
  }
}
loadEnvLocal();

const url =
  process.env.PRIVATE_TURSO_DATABASE_URL ||
  process.env.TURSO_DATABASE_URL;
const authToken =
  process.env.PRIVATE_TURSO_AUTH_TOKEN ||
  process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "Database URL not found. Set PRIVATE_TURSO_DATABASE_URL in .env.local",
  );
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "turso",
  dbCredentials: { url, authToken },
} satisfies Config;
