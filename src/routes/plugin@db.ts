import type { RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async (event) => {
  const dbUrl = event.env.get("PRIVATE_TURSO_DATABASE_URL");
  const dbToken = event.env.get("PRIVATE_TURSO_AUTH_TOKEN");

  if (dbUrl) {
    (globalThis as any).PRIVATE_TURSO_DATABASE_URL = dbUrl;
  }
  if (dbToken) {
    (globalThis as any).PRIVATE_TURSO_AUTH_TOKEN = dbToken;
  }

  await event.next();
};
