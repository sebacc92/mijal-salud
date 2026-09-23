// ─────────────────────────────────────────────────────────────────────────────
// Migra archivos guardados como Base64 inline en Turso (galeria.image_url,
// vertical_videos.video_url, vertical_videos.thumbnail_url) a Vercel Blob,
// dejando sólo la URL pública resultante en la fila.
//
// Idempotente: sólo toca filas cuya columna todavía empieza con "data:", así
// que correrlo dos veces es seguro (la segunda vez no encuentra nada que
// migrar).
//
// Uso:
//   npx tsx scripts/migrate-base64-to-blob.ts            (migra de verdad)
//   npx tsx scripts/migrate-base64-to-blob.ts --dry-run   (sólo reporta)
//
// Requiere en el entorno: PRIVATE_TURSO_DATABASE_URL, PRIVATE_TURSO_AUTH_TOKEN
// (si aplica) y BLOB_READ_WRITE_TOKEN. Correr primero contra un .env de
// preview y confirmar visualmente antes de correr contra producción.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type Client } from "@libsql/client";
import { uploadToBlob, type EnvLike } from "../src/lib/blob.ts";

const DRY_RUN = process.argv.includes("--dry-run");

const env: EnvLike = { get: (key) => process.env[key] };

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Falta la variable de entorno ${key}. Abortando.`);
    process.exit(1);
  }
  return value;
}

interface ColumnMigration {
  table: string;
  idColumn: string;
  urlColumn: string;
  pathPrefix: string;
  label: string;
}

async function migrateColumn(
  client: Client,
  { table, idColumn, urlColumn, pathPrefix, label }: ColumnMigration,
): Promise<{ processed: number; failed: string[] }> {
  const res = await client.execute(
    `SELECT ${idColumn} as id, ${urlColumn} as url FROM ${table} WHERE ${urlColumn} LIKE 'data:%'`,
  );

  console.log(`\n${label}: ${res.rows.length} fila(s) en Base64 por migrar.`);

  let processed = 0;
  const failed: string[] = [];

  for (const row of res.rows) {
    const id = row.id as string | number;
    const dataUrl = row.url as string;
    const sizeKb = (dataUrl.length / 1024).toFixed(0);

    try {
      if (DRY_RUN) {
        console.log(`  [dry-run] ${table}#${id}: subiría ~${sizeKb}KB a Blob (${pathPrefix}/...)`);
        processed++;
        continue;
      }

      const url = await uploadToBlob(env, dataUrl, pathPrefix);
      await client.execute({
        sql: `UPDATE ${table} SET ${urlColumn} = ? WHERE ${idColumn} = ?`,
        args: [url, id],
      });
      console.log(`  OK ${table}#${id} (~${sizeKb}KB) -> ${url}`);
      processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  FALLÓ ${table}#${id}: ${message}`);
      failed.push(`${table}#${id}: ${message}`);
    }
  }

  return { processed, failed };
}

async function main() {
  requireEnv("PRIVATE_TURSO_DATABASE_URL");
  requireEnv("BLOB_READ_WRITE_TOKEN");

  const client = createClient({
    url: process.env.PRIVATE_TURSO_DATABASE_URL!,
    authToken: process.env.PRIVATE_TURSO_AUTH_TOKEN,
  });

  const migrations: ColumnMigration[] = [
    { table: "galeria", idColumn: "id", urlColumn: "image_url", pathPrefix: "galeria", label: "Galería (image_url)" },
    {
      table: "vertical_videos",
      idColumn: "id",
      urlColumn: "video_url",
      pathPrefix: "videos-verticales/video",
      label: "Videos verticales (video_url)",
    },
    {
      table: "vertical_videos",
      idColumn: "id",
      urlColumn: "thumbnail_url",
      pathPrefix: "videos-verticales/thumbnail",
      label: "Videos verticales (thumbnail_url)",
    },
  ];

  const results = [];
  for (const migration of migrations) {
    results.push(await migrateColumn(client, migration));
  }

  const totalProcessed = results.reduce((acc, r) => acc + r.processed, 0);
  const allFailed = results.flatMap((r) => r.failed);

  console.log(`\n${DRY_RUN ? "[dry-run] " : ""}Listo. Procesadas: ${totalProcessed}. Fallidas: ${allFailed.length}.`);
  if (allFailed.length > 0) {
    console.log("Filas que fallaron:");
    for (const f of allFailed) console.log(`  - ${f}`);
    process.exit(1);
  }
}

main();
