// ─────────────────────────────────────────────────────────────────────────────
// [[page-content-loader]] — Acceso a la base para el contenido editable.
// SÓLO SERVIDOR (importa getDb). No lo importes desde componentes de cliente.
//
// Estrategia de robustez (Tarea 4):
//   - getPageContent SIEMPRE devuelve contenido válido. Si la base no responde,
//     si la fila no existe o si el JSON está corrupto, cae al DEFAULT_CONTENT
//     del código (que es idéntico al contenido original del sitio). Nunca lanza.
//   - Se hace merge superficial sobre el default, así los campos nuevos que se
//     agreguen al modelo aparecen aunque la fila guardada sea vieja.
//
// La tabla se crea de forma perezosa (CREATE TABLE IF NOT EXISTS) porque el
// proyecto no tiene pipeline de migraciones (el schema se sincroniza con
// `drizzle-kit push`). Así el guardado desde el admin funciona sin un deploy
// intermedio ni pasos manuales.
// ─────────────────────────────────────────────────────────────────────────────

import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { getDb, schema } from "~/db";
import { DEFAULT_CONTENT } from "./defaults";
import type { PageContentMap, PageId } from "./types";

let tableReady = false;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Mezcla lo guardado (`saved`) sobre el `base` (default), rellenando de forma
 * recursiva las claves ausentes. Los arrays se toman completos de `saved` si
 * existen (así el admin controla listas), o del default si faltan. Protege
 * contra filas viejas a las que les falten campos nuevos del modelo, evitando
 * que la página se rompa por un valor undefined.
 */
function deepFill<T>(base: T, saved: unknown): T {
  if (!isPlainObject(base)) {
    return (saved === undefined ? base : (saved as T));
  }
  if (!isPlainObject(saved)) return base;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    out[key] = deepFill((base as Record<string, unknown>)[key], saved[key]);
  }
  return out as T;
}

async function ensureTable(db: ReturnType<typeof getDb>): Promise<void> {
  if (tableReady) return;
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS page_content (
      page_id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    )
  `);
  tableReady = true;
}

/**
 * Devuelve el contenido de una página, mezclando lo guardado en la base sobre
 * el contenido por defecto. Nunca lanza: ante cualquier fallo, usa el default.
 */
export async function getPageContent<K extends PageId>(
  pageId: K,
): Promise<PageContentMap[K]> {
  const fallback = DEFAULT_CONTENT[pageId];
  try {
    const db = getDb();
    await ensureTable(db);
    const [row] = await db
      .select({ data: schema.pageContent.data })
      .from(schema.pageContent)
      .where(eq(schema.pageContent.pageId, pageId));

    if (!row?.data) return fallback;

    const parsed = JSON.parse(row.data) as unknown;
    // Merge recursivo: los campos/objetos ausentes en la fila caen al default.
    return deepFill(fallback, parsed);
  } catch (error) {
    console.error(`[page-content] fallback por error leyendo "${pageId}":`, error);
    return fallback;
  }
}

/** Guarda (upsert) el contenido completo de una página. Usado por el admin. */
export async function savePageContent(pageId: PageId, data: unknown): Promise<void> {
  const db = getDb();
  await ensureTable(db);
  const json = JSON.stringify(data);
  await db
    .insert(schema.pageContent)
    .values({ pageId, data: json })
    .onConflictDoUpdate({
      target: schema.pageContent.pageId,
      set: { data: json, updatedAt: sql`(CURRENT_TIMESTAMP)` },
    });
}

/** Restaura una página al contenido por defecto (borra la fila guardada). */
export async function resetPageContent(pageId: PageId): Promise<void> {
  const db = getDb();
  await ensureTable(db);
  await db.delete(schema.pageContent).where(eq(schema.pageContent.pageId, pageId));
}

/** Metadato: fecha de última edición guardada (o null si usa el default). */
export async function getPageUpdatedAt(pageId: PageId): Promise<string | null> {
  try {
    const db = getDb();
    await ensureTable(db);
    const [row] = await db
      .select({ updatedAt: schema.pageContent.updatedAt })
      .from(schema.pageContent)
      .where(eq(schema.pageContent.pageId, pageId));
    return row?.updatedAt ?? null;
  } catch {
    return null;
  }
}
