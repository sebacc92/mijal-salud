// ─────────────────────────────────────────────────────────────────────────────
// Helper de subida/borrado a Vercel Blob (lado servidor).
//
// Reemplaza el patrón anterior de guardar archivos como Base64 inline en Turso.
// Ahora sólo se guarda la URL pública del blob en la base.
//
// Hay dos caminos de subida y conviene tener clara la diferencia:
//
//   1. Directo desde el navegador (src/lib/blob-client.ts) para archivos que el
//      usuario elige tal cual: videos, fotos de galería, PDF. Es el único que
//      sirve para archivos grandes, porque el body de una request en Vercel
//      Edge está limitado a pocos MB y el Base64 infla ~33%.
//   2. `uploadToBlob` desde el servidor, para archivos que el cliente ya
//      comprimió a unos pocos KB (logos de partners, avatar del chatbot) y que
//      viajan cómodos como data URL dentro de un `server$`.
//
// No depende de Qwik en runtime (sólo tipos), para poder importarse tanto desde
// rutas/acciones del sitio como desde el script de migración standalone
// (scripts/migrate-base64-to-blob.ts, ejecutado con Node vía `npm run migrate:blob`).
// ─────────────────────────────────────────────────────────────────────────────

import { put, del } from "@vercel/blob";
import { extFor, isBlobUrl } from "./blob-shared";

export { isBlobUrl };

/** Subconjunto de `EnvGetter` de qwik-city; también lo satisface un `process.env` envuelto a mano. */
export interface EnvLike {
  get(key: string): string | undefined;
}

export function getBlobToken(env: EnvLike): string {
  const token = env.get("BLOB_READ_WRITE_TOKEN");
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN no está configurado en las variables de entorno. No se puede subir a Vercel Blob.",
    );
  }
  return token;
}

function parseDataUrl(input: string): { contentType: string; bytes: Uint8Array } {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(input);
  if (!match || !match[2]) {
    throw new Error("Formato de archivo inválido: se esperaba un data URL en base64 (data:<mime>;base64,<...>).");
  }
  const [, mime, , payload] = match;
  const contentType = mime || "application/octet-stream";
  const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
  return { contentType, bytes };
}

/**
 * Sube un archivo a Vercel Blob y devuelve su URL pública.
 *
 * `file` acepta un data URL base64 o bytes crudos. Pensado para archivos
 * chicos: para lo que sube el usuario sin comprimir, usar el camino directo
 * desde el navegador (`uploadFileToBlob` en src/lib/blob-client.ts).
 */
export async function uploadToBlob(
  env: EnvLike,
  file: string | Uint8Array,
  pathPrefix: string,
  contentTypeHint?: string,
): Promise<string> {
  const token = getBlobToken(env);

  let bytes: Uint8Array;
  let contentType = contentTypeHint || "application/octet-stream";

  if (typeof file === "string") {
    const parsed = parseDataUrl(file);
    bytes = parsed.bytes;
    contentType = contentTypeHint || parsed.contentType;
  } else {
    bytes = file;
  }

  const filename = `${pathPrefix}/${crypto.randomUUID()}.${extFor(contentType)}`;

  const { url } = await put(filename, bytes.buffer as ArrayBuffer, {
    access: "public",
    token,
    contentType,
    addRandomSuffix: false,
  });

  return url;
}

/**
 * Si `value` es un data URL lo sube a Blob y devuelve la URL pública; si ya es
 * una URL (subida directa desde el navegador, o una URL externa pegada a mano
 * en el formulario) la devuelve tal cual.
 */
export async function resolveMediaUrl(
  env: EnvLike,
  value: string,
  pathPrefix: string,
): Promise<string> {
  if (!value.startsWith("data:")) return value;
  return uploadToBlob(env, value, pathPrefix);
}

/**
 * Borra un blob a partir de su URL pública.
 * No lanza si la URL no pertenece a Vercel Blob (evita romper el borrado de la
 * fila en Turso por datos legacy: Base64 no migrado, URLs externas, etc.).
 */
export async function deleteFromBlob(env: EnvLike, url: string | null | undefined): Promise<void> {
  if (!isBlobUrl(url)) return;
  const token = getBlobToken(env);
  await del(url!, { token });
}

/**
 * Borra el blob anterior cuando fue reemplazado por otro distinto, sin dejar
 * que un fallo de borrado tumbe la operación principal (la fila ya se guardó).
 */
export async function deleteReplacedBlob(
  env: EnvLike,
  previousUrl: string | null | undefined,
  nextUrl: string | null | undefined,
  context: string,
): Promise<void> {
  if (!previousUrl || previousUrl === nextUrl) return;
  try {
    await deleteFromBlob(env, previousUrl);
  } catch (error) {
    console.error(`Error borrando blob anterior (${context}):`, error);
  }
}
